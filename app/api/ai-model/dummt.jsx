import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

const API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ||
  "https://openrouter.ai/api/v1/chat/completions";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.SITE_NAME || "My Local App";

// Additional instructions to prevent common syntax errors

export async function POST(req: NextRequest) {
  try {
    const { description, imageUrl, mode, model, options, userEmail, language } =
      await req.json();

    // Validate required fields
    if (!description || !imageUrl || !userEmail) {
      return NextResponse.json(
        {
          error: "Missing required fields: description, imageUrl, or userEmail",
        },
        { status: 400 }
      );
    }

    // Select the best model for the task

    let modelname;
    if (mode === "normal") {
      modelname = "google/gemini-2.0-pro-exp-02-05:free";
    } else if (mode === "export") {
      modelname = "google/gemini-2.0-pro-exp-02-05:free";
    }
    // best
    // google/gemini-2.0-flash-001

    const des =
      Constants.PROMPTFORNEXTJS +
      Constants.ERROR_PREVENTION_PROMPTFORNEXTJS +
      description +
      "\n\n" +
      (options || "");

    // Check if user has enough credits
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentCredits = user[0]?.credits ?? 0;

    if (currentCredits < 10) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. You need at least 10 credits to generate a page.",
        },
        { status: 403 }
      );
    }

    // Deduct 10 credits for generating a page
    await db
      .update(usersTable)
      .set({
        credits: currentCredits - 10,
      })
      .where(eq(usersTable.email, userEmail));

    // Verify API key exists
    if (!API_KEY) {
      console.error("OPENROUTER_API_KEY is missing from environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Log the selected model for debugging
    console.log(`Using model: ${modelname} for generation`);

    const payload = {
      model: modelname,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: des,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      stream: false, // We'll handle streaming manually
    };

    // Create a new ReadableStream to stream the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "HTTP-Referer": SITE_URL,
              "X-Title": SITE_NAME,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            controller.error(`API Error: ${errorText}`);
            return;
          }

          const data = await response.json();
          console.log("====================================");
          console.log(data, "   data");
          console.log("====================================");
          // Extract the code content from the API response
          if (
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
          ) {
            let codeContent = data.choices[0].message.content;

            // Remove markdown code blocks if present
            codeContent = codeContent
              .replace(/```javascript|```typescript|```jsx|```tsx|```/g, "")
              .trim();

            // Stream the code content
            controller.enqueue(new TextEncoder().encode(codeContent));
          } else {
            // If we can't extract the content, return an error message
            controller.enqueue(
              new TextEncoder().encode(
                "Error: Unable to extract code from API response"
              )
            );
          }

          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.error(
            error instanceof Error ? error : new Error(String(error))
          );
        }
      },
    });

    // Return the stream as the response
    return new Response(stream);
  } catch (error) {
    console.error("Server error:", error);
    // Safely handle the unknown error type
    const serverError = error as Error;
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: serverError.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
