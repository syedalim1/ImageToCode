import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

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
    MAX_TOKENS: 4000,
    TIMEOUT_MS: 45000,
  },
};

// Model selection helper
function selectModelForGeneration(mode: string): string {
  const modelMap = {
    normal: "google/gemini-2.0-pro-exp-02-05:free",
    export: "google/gemini-2.0-pro-exp-02-05:free",
    // Add more modes and models as needed
  };
  return modelMap[mode as keyof typeof modelMap] || modelMap.normal;
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const { description, imageUrl, mode, model, options, userEmail, language } =
      await req.json();

    // Verify API configuration
    if (!CONFIG.API.KEY) {
      throw new Error("OpenRouter API key is missing");
    }

    // Prepare enhanced description
    const enhancedDescription =
      Constants.PROMPTFORNEXTJS +
      Constants.ERROR_PREVENTION_PROMPTFORNEXTJS +
      description +
      "\n\n" +
      (options || "");

    // Fetch user and validate credits
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentCredits = user.credits ?? 0;
    if (currentCredits < CONFIG.CREDITS.MINIMUM_BALANCE) {
      return NextResponse.json(
        {
          error: `Insufficient credits. Minimum ${CONFIG.CREDITS.MINIMUM_BALANCE} credits required.`,
        },
        { status: 403 }
      );
    }

    const modelName = selectModelForGeneration(mode);
    const payload = {
      model: modelName,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: enhancedDescription },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      stream: false,
      max_tokens: CONFIG.GENERATION.MAX_TOKENS,
      timeout: CONFIG.GENERATION.TIMEOUT_MS / 1000,
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

      // if (!apiResponse.ok) {
      //   const errorText = await apiResponse.text();
      //   throw new Error(`API Request Failed: ${errorText}`);
      // }

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
