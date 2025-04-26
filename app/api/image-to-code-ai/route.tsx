import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import AIPrompt from "@/data/AIPrompt"; // Assuming AIPrompt contains the prompt strings
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Centralized configuration (Assuming this is defined correctly elsewhere or above)
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
    COST_BY_MODE: {
      basic: 10,
      professional: 30,
      ultra: 50,
    },
    DEFAULT_COST: 10,
    MINIMUM_BALANCE: 10,
  },
  GENERATION: {
    MAX_TOKENS: 15000,
    TIMEOUT_MS: 120000, // 2 minutes
  },
  AI_MODEL: {
    basic: "google/gemini-2.0-flash-001",
    professional: "google/gemini-2.5-flash-preview:thinking",
    ultra: "google/gemini-2.5-pro-preview-03-25",
  },
};

// Helper function to log detailed API response information
const logResponseDetails = async (response: Response, label: string) => {
  try {
    const clonedResponse = response.clone();
    const text = await clonedResponse.text(); // console.log(`${label} Status: ${clonedResponse.status}`); // console.log(`${label} Body Snippet:`, text.substring(0, 500) + (text.length > 500 ? '...' : ''));
    return text;
  } catch (e) {
    console.error(`Error logging ${label}:`, e);
    return null;
  }
};

// Helper function to extract and parse JSON safely
const extractAndParseJson = (content: string | null): any | null => {
  if (!content) return null;

  // 1. Try extracting JSON from ```json ... ``` markdown block
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = content.match(jsonBlockRegex);

  let jsonString: string | null = null;

  if (match && match[1]) {
    jsonString = match[1].trim();
    // console.log("Found JSON block, attempting parse...");
  } else {
    // 2. If no block found, assume the entire content *might* be JSON
    // console.log("No JSON block found, attempting to parse entire content...");
    // Basic check: Does it look like JSON? (Starts with { or [)
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith("{") && trimmedContent.endsWith("}")) {
      jsonString = trimmedContent;
    } else if (trimmedContent.startsWith("[") && trimmedContent.endsWith("]")) {
      jsonString = trimmedContent;
    }
  }

  if (!jsonString) {
    // console.log("Content does not appear to be JSON or enclosed in JSON block.");
    return null; // Neither a block nor does the whole string look like JSON
  }

  try {
    // Attempt to parse the extracted/assumed JSON string
    const parsedJson = JSON.parse(jsonString);
    // console.log("Successfully parsed JSON.");
    return parsedJson;
  } catch (error) {
    const parseError = error as Error;
    console.error(
      "JSON parsing failed:",
      parseError.message,
      "Attempted JSON string snippet:",
      jsonString.substring(0, 200) + "..."
    );
 
    return null; // Parsing failed
  }
};

export async function POST(req: Request) {
  try {
    // --- Input Parsing and Validation ---
    const { description, imageUrl, options, userEmail, mode, language } =
      await req.json();

    if (!userEmail) {
      return NextResponse.json(
        {
          error: "User email is required",
          details: "Please provide a valid user email.",
        },
        { status: 400 }
      );
    }
    if (!description && !imageUrl) {
      return NextResponse.json(
        {
          error: "Input required",
          details: "Please provide either a description or an image URL.",
        },
        { status: 400 }
      );
    }
    if (
      !language ||
      (language !== "react-tailwind" && language !== "html-css")
    ) {
      return NextResponse.json(
        {
          error: "Invalid language",
          details: "Please specify 'react-tailwind' or 'html-css'.",
        },
        { status: 400 }
      );
    } // --- User Data and Credit Check ---

    const userData = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!userData || userData.length === 0) {
      return NextResponse.json(
        {
          error: "User not found",
          details: "No user account found with the provided email.",
        },
        { status: 404 }
      );
    }

    const user = userData[0];
    const currentCredits = user.credits ?? 0;
    const validMode =
      mode && ["basic", "professional", "ultra"].includes(mode)
        ? (mode as "basic" | "professional" | "ultra")
        : "basic"; // Default to basic if invalid/missing
    const creditCost =
      CONFIG.CREDITS.COST_BY_MODE[validMode] || CONFIG.CREDITS.DEFAULT_COST;
    const newCreditBalance = currentCredits - creditCost;

    if (newCreditBalance < CONFIG.CREDITS.MINIMUM_BALANCE) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          details: `This operation requires ${creditCost} credits. You have ${currentCredits}. Minimum balance required after use is ${CONFIG.CREDITS.MINIMUM_BALANCE}.`,
          currentCredits,
          requiredCredits: creditCost,
        },
        { status: 402 } // 402 Payment Required
      );
    } // --- Prepare AI Request ---

    await db
      .update(usersTable)
      .set({ credits: newCreditBalance })
      .where(eq(usersTable.email, userEmail)); // console.log(`Updated credits for ${userEmail}: ${currentCredits} → ${newCreditBalance} (-${creditCost})`);
    const modelName = CONFIG.AI_MODEL[validMode];

    if (!CONFIG.API.KEY) {
      console.error(
        "CRITICAL: OpenRouter API key is missing in environment variables."
      );
      return NextResponse.json(
        { error: "Server configuration error", details: "API key is missing." },
        { status: 500 }
      );
    }

    // Construct the prompt, ensuring the AI knows the desired JSON output format
    let basePrompt = "";
    if (language === "react-tailwind") {
      basePrompt = AIPrompt.CODE_GEN_PROMPT_REACT_TAILWIND; // Make sure this prompt specifies the JSON output format
    } else {
      // html-css
      basePrompt = AIPrompt.CODE_GEN_PROMPT_FORHTML_CSS; // Make sure this prompt specifies the JSON output format
    }

    // Add explicit instruction for JSON format *if not already* in the base prompt
    const jsonFormatInstruction = `
    Generate code based on the description and/or image.
    You MUST output the result ONLY as a single JSON object adhering strictly to the following format, without any markdown fences like \`\`\`json or \`\`\`:
    {
      "projectTitle": "A concise title for the project/component",
      "explanation": "A brief explanation of the code and how it works",
      "files": {
        "/index.html": { // Or /App.js, etc. Use appropriate filenames.
          "code": "The full code for this file as a single string..."
        },
        "/style.css": { // Optional, include if CSS is separate
          "code": "The full CSS code..."
        }
        // Add more files as needed
      }
    }
    Ensure the 'code' values are valid, escaped strings containing the complete file content.
    Description: ${description || "Generate based on image."}
    Options/Requirements: ${options || "None"}
    `;

    // Use the base prompt IF it already contains the strict JSON instruction, otherwise use the explicit one.
    // For safety, let's assume the base prompts might not be strict enough and add the explicit instruction.
    // You can refine this based on your actual AIPrompt content.
    const enhancedDescription = basePrompt + "\n\n" + jsonFormatInstruction; // Combine if base prompt provides context

    // Build message payload
    const messages = [];
    // Define the types for the content payload
    type TextContent = { type: "text"; text: string };
    type ImageContent = { type: "image_url"; image_url: { url: string } };
    type ContentItem = TextContent | ImageContent;
    
    const contentPayload: ContentItem[] = [{ type: "text", text: enhancedDescription }];
    if (imageUrl) {
      contentPayload.push({ type: "image_url", image_url: { url: imageUrl } });
    }
    messages.push({ role: "user", content: contentPayload });

    const payload = {
      model: modelName,
      messages: messages,
      stream: false, // Ensure stream is false for a single JSON response
      max_tokens: CONFIG.GENERATION.MAX_TOKENS,
      temperature: 0.5, // Lower temperature might help with stricter formatting
   
    }; // --- API Call with Timeout ---

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort("API request timed out"),
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

      const responseText = await logResponseDetails(
        apiResponse,
        "API Response"
      );

      if (!apiResponse.ok) {
        console.error(
          `API Request Failed: Status ${apiResponse.status}`,
          responseText
        );
        // Attempt to rollback credits on API failure? Depends on policy.
        // await db.update(usersTable).set({ credits: currentCredits }).where(eq(usersTable.email, userEmail)); // Example rollback
        return NextResponse.json(
          {
            error: "AI API request failed",
            details: `API returned status ${
              apiResponse.status
            }. ${responseText?.substring(0, 200)}`,
          },
          { status: apiResponse.status } // Forward the status code if possible
        );
      } // --- Process Response: Extract Content ---

      let rawApiData;
      try {
        rawApiData = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        const parseError = error as Error;
        console.error(
          "Failed to parse raw API JSON response:",
          parseError.message,
          responseText
        );
        return NextResponse.json(
          {
            error: "Invalid API response",
            details: "The AI service returned non-JSON data.",
          },
          { status: 500 }
        );
      }

      if (!rawApiData) {
        return NextResponse.json(
          {
            error: "Empty API response",
            details: "The AI service returned an empty response.",
          },
          { status: 500 }
        );
      }

      // Extract the actual message content (handle various structures)
      let potentialContent: string | null = null;
      if (rawApiData.choices && rawApiData.choices[0]) {
        const choice = rawApiData.choices[0];
        if (choice.message && choice.message.content)
          potentialContent = choice.message.content;
        else if (choice.content) potentialContent = choice.content;
        else if (choice.text) potentialContent = choice.text;
        else if (choice.delta && choice.delta.content)
          potentialContent =
            choice.delta.content; // Should not happen with stream=false
        else if (typeof choice === "string") potentialContent = choice;
      } else if (rawApiData.content) potentialContent = rawApiData.content;
      else if (rawApiData.text) potentialContent = rawApiData.text;
      else if (rawApiData.generated_text)
        potentialContent = rawApiData.generated_text;
      else if (rawApiData.completion) potentialContent = rawApiData.completion;
      else if (typeof rawApiData === "string") potentialContent = rawApiData;

      // --- Process Response: Parse and Validate JSON ---
      if (!potentialContent) {
        console.error(
          "Could not extract content from API response structure:",
          JSON.stringify(rawApiData).substring(0, 500)
        );
        return NextResponse.json(
          {
            error: "No content found in AI response",
            details:
              "Could not extract text content from the AI's response structure.",
          },
          { status: 500 }
        );
      }

      // Use the helper function to get the clean JSON object
      const finalJsonObject = extractAndParseJson(potentialContent);

      if (finalJsonObject) {
        // Basic validation of the structure (optional but recommended)
        if (
          typeof finalJsonObject.projectTitle === "string" &&
          typeof finalJsonObject.explanation === "string" &&
          typeof finalJsonObject.files === "object" &&
          finalJsonObject.files !== null
        ) {
          // Structure seems okay, return it
          return NextResponse.json({ content:finalJsonObject});
        } else {
          console.error(
            "Parsed JSON does not match expected structure:",
            JSON.stringify(finalJsonObject).substring(0, 500)
          );
          return NextResponse.json(
            {
              error: "Invalid JSON structure",
              details:
                "The AI returned JSON, but it doesn't match the required format (projectTitle, explanation, files).",
            },
            { status: 500 }
          );
        }
      } else {
        // JSON extraction or parsing failed
        console.error(
          "Failed to extract or parse valid JSON from AI content.",
          "Content Snippet:",
          potentialContent.substring(0, 500)
        );
        return NextResponse.json(
          {
            error: "AI response not in expected JSON format",
            details:
              "The AI did not return valid JSON in the required structure. Check AI model/prompt.",
            rawContentSnippet: potentialContent.substring(0, 1000), // Provide snippet for debugging
          },
          { status: 500 }
        );
      }
    } catch (apiError: any) {
      // Catch network errors, timeouts, etc.
      clearTimeout(timeoutId); // Clear timeout if fetch threw error
      console.error("API Request/Processing Error:", apiError);
      // Rollback credits if API call failed fundamentally?
      // await db.update(usersTable).set({ credits: currentCredits }).where(eq(usersTable.email, userEmail));
      return NextResponse.json(
        {
          error: "Failed to generate content",
          details:
            apiError.message === "API request timed out"
              ? "The request to the AI timed out."
              : String(apiError?.message || apiError),
          modelUsed: modelName,
        },
        { status: apiError.name === "AbortError" ? 408 : 500 } // 408 Request Timeout
      );
    }
  } catch (error) {
    // Catch errors in request parsing, DB connection, etc.
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
