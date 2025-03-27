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
    // if (language === "react-tailwind") {
    // } else if (language === "nextjs-tailwind") {
    // } else if (language === "html-css") {
    // }
    const enhancedDescription =
      Constants.IMAGE_TO_NEXTJS_PROMPT +
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

`const axios = require('axios');
let data = JSON.stringify({
  "messages": [
    {
      "content": "You are a helpful assistant",
      "role": "system"
    },
    {
      "content": "Hi",
      "role": "user"
    }
  ],
  "model": "deepseek-chat",
  "frequency_penalty": 0,
  "max_tokens": 2048,
  "presence_penalty": 0,
  "response_format": {
    "type": "text"
  },
  "stop": null,
  "stream": false,
  "stream_options": null,
  "temperature": 1,
  "top_p": 1,
  "tools": null,
  "tool_choice": "none",
  "logprobs": false,
  "top_logprobs": null
});

let config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://api.deepseek.com/chat/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json', 
    'Authorization': 'Bearer <TOKEN>'
  },
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});`;
