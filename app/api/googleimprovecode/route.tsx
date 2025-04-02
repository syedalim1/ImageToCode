import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Centralized configuration
const CONFIG = {
  API: {
    KEY: process.env.OPENROUTER_API_KEY,
    URL:
      process.env.OPENROUTER_API_URL ||
      "https://openrouter.ai/api/v1/chat/completions",
  },
  SITE: {
    URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NAME: process.env.SITE_NAME || "My Local App",
  },
  CREDITS: {
    GENERATION_COST: 10,
    MINIMUM_BALANCE: 10,
  },
  GENERATION: {
    MAX_TOKENS: 100000,
    TIMEOUT_MS: 4000,
  },
};

// Model selection helper

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const {

      userEmail,

      code,
    } = await req.json();

    // Verify API configuration
    if (!CONFIG.API.KEY) {
      throw new Error("OpenRouter API key is missing");
    }

    const codeimprove = code + "\n\n" + "Fix All The Bug Run Proper Code";
    // Fetch user and validate credits
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    let modelName;
    let payload;
    const currentCredits = user.credits ?? 0;
    if (currentCredits < CONFIG.CREDITS.MINIMUM_BALANCE) {
      return NextResponse.json(
        {
          error: `Insufficient credits. Minimum ${CONFIG.CREDITS.MINIMUM_BALANCE} credits required.`,
        },
        { status: 403 }
      );
    }

    modelName = "google/gemini-2.5-pro-exp-03-25:free";
    payload = {
      model: modelName,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: codeimprove },
          ],
        },
      ],
      stream: false,
      max_tokens: CONFIG.GENERATION.MAX_TOKENS,
      timeout: CONFIG.GENERATION.TIMEOUT_MS / 14000,
    };


    // Enhanced API request with comprehensive error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.GENERATION.TIMEOUT_MS
    );

    try {
      const apiResponse = await fetch(CONFIG.API.URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CONFIG.API.KEY}`,
          "HTTP-Referer": CONFIG.SITE.URL,
          "X-Title": CONFIG.SITE.NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`API Request Failed: ${errorText}`);
      }

      const data = await apiResponse.json();

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

        return new Response(codeContent);
      }
    } catch (apiError) {
      console.error("API Request Error:", apiError);
      return NextResponse.json(
        { error: "Failed to generate content", details: String(apiError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Processing Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
