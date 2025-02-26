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
const ERROR_PREVENTION_PROMPT = `
IMPORTANT: Your generated code must be free of syntax errors. Pay special attention to:
1. All string literals must be properly terminated with matching quotes
2. All JSX elements must be properly closed
3. All curly braces, parentheses, and brackets must be properly balanced
4. All className attributes must have properly formatted values
5. All React components must have proper import and export statements
6. Ensure all variable names are properly defined before use
7. Double-check all template literals for proper syntax
`;

// Function to select the best model based on the task complexity
// const selectBestModel = (description: string, requestedModel: string) => {
//   // Default to the requested model if specified and valid
//   if (
//     requestedModel &&
//     Constants.AiModel.some((m) => m.modelname === requestedModel)
//   ) {
//     return requestedModel;
//   }

//   // For complex UI with many interactive elements, prefer more capable models
//   const isComplex =
//     description.toLowerCase().includes("dashboard") ||
//     description.toLowerCase().includes("interactive") ||
//     description.toLowerCase().includes("form") ||
//     description.toLowerCase().includes("animation");

//   if (isComplex) {
//     return "anthropic/claude-3.5-sonnet"; // Use Claude for complex UIs
//   }

//   // Default to Gemini for standard tasks
//   return "google/gemini-2.0-pro-exp-02-05:free";
// };

export async function POST(req: NextRequest) {
  try {
    const { description, imageUrl, model, options, userEmail } =
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
    const modelname = "google/gemini-2.0-pro-exp-02-05:free";

    // Combine the main prompt with error prevention instructions and user description
    const des =
      Constants.PROMPT +
      ERROR_PREVENTION_PROMPT +
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

    // Deduct 10 credits for generating a page
    await db
      .update(usersTable)
      .set({
        credits: currentCredits - 10,
      })
      .where(eq(usersTable.email, userEmail));

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
      // temperature: 0.7, // Balanced between creativity and consistency
      // max_tokens: 4000, // Ensure we get complete code
      // frequency_penalty: 0.2, // Slightly reduce repetition
      // presence_penalty: 0.1, // Slightly encourage new content
    };

    // // Add retry logic for more reliable results
    let attempts = 0;
    const maxAttempts = 3;
    let response;
    let errorMessage = "";

    while (attempts < maxAttempts) {
      try {
        response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // If successful, break out of the retry loop

        const data = await response.json();

        return NextResponse.json(data);
      } catch (error) {
        attempts++;
        // Safely handle the unknown error type
        const fetchError = error as Error;
        console.error(`Fetch error on attempt ${attempts}:`, fetchError);
        errorMessage = fetchError.message || "Network error";

        // If we've reached max attempts, break out
        if (attempts >= maxAttempts) {
          break;
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * Math.pow(2, attempts - 1))
        );
      }
    }
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
