import AIPrompt from "@/data/AIPrompt";
import { NextResponse } from "next/server";

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
    MAX_TOKENS: 15000,
    TIMEOUT_MS: 120000, // Increased timeout to 120 seconds (2 minutes)
  },
};

// Helper function to log detailed API response information
const logResponseDetails = async (response: Response, label: string) => {
  try {
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    console.log(`${label} - Status: ${response.status}`);
    console.log(`${label} - Headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`${label} - Body:`, text.substring(0, 500) + (text.length > 500 ? '...' : ''));
    return text;
  } catch (e) {
    console.error(`Error logging ${label}:`, e);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    // Parse and validate input
    const {
      description,
      imageUrl,
      options,
      userEmail,
      mode,
      language,
    } = await req.json();



    // Verify API configuration
    if (!CONFIG.API.KEY) {
      throw new Error("OpenRouter API key is missing");
    }

    const enhancedDescription =
      AIPrompt.CODE_GEN_PROMPT +
      description +
      "\n\n" +
      (options || "");

    // Using Gemini model for image + text processing
    // Try a different model if the current one is having issues
    const modelName = "google/gemini-2.0-flash-001";

    // Format payload according to OpenRouter's expected format
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
      stream: false, // Disable streaming for simplicity
      max_tokens: CONFIG.GENERATION.MAX_TOKENS,
      temperature: 0.7, // Add temperature for more controlled outputs
      // Removed response_format as it might not be supported by all models
    };

    // Enhanced API request with comprehensive error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.GENERATION.TIMEOUT_MS
    );

    console.log("Sending request to OpenRouter API...");
    console.log("Payload:", JSON.stringify(payload, null, 2));

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

      // Log response details before processing
      const responseText = await logResponseDetails(apiResponse, "API Response");

      if (!apiResponse.ok) {
        console.error(`API Request Failed with status: ${apiResponse.status}`);
        throw new Error(`API Request Failed: Status ${apiResponse.status} - ${responseText || 'No response text'}`);
      }

      // Parse the response text as JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log("Parsed API response:", JSON.stringify(data, null, 2).substring(0, 500) + '...');
      } catch (error) {
        const parseError = error as Error;
        console.error("Failed to parse API response as JSON:", parseError);
        throw new Error(`Failed to parse API response: ${parseError.message}`);
      }

      // Log the full response structure for debugging
      console.log("Full response structure:", JSON.stringify(data, null, 2).substring(0, 1000) + '...');

      // Handle different possible response structures from OpenRouter
      let codeContent = null;

      // Check for the standard OpenRouter/OpenAI format
      if (data && data.choices && data.choices[0]) {
        console.log("Found choices array in response");
        if (data.choices[0].message && data.choices[0].message.content) {
          // Standard OpenAI format
          codeContent = data.choices[0].message.content;
          console.log("Extracted content from choices[0].message.content");
        } else if (data.choices[0].content) {
          // Some models might directly have content on the choice
          codeContent = data.choices[0].content;
          console.log("Extracted content from choices[0].content");
        } else if (data.choices[0].text) {
          // Some older models might use 'text' instead of 'content'
          codeContent = data.choices[0].text;
          console.log("Extracted content from choices[0].text");
        } else if (typeof data.choices[0] === 'string') {
          // Some models might return the content directly in the choice
          codeContent = data.choices[0];
          console.log("Extracted content directly from choices[0] as string");
        } else if (data.choices[0].delta && data.choices[0].delta.content) {
          // Handle streaming format even if stream is disabled
          codeContent = data.choices[0].delta.content;
          console.log("Extracted content from choices[0].delta.content");
        }
      } else if (data && data.content) {
        // Simple content field at the top level
        codeContent = data.content;
        console.log("Extracted content from top-level content field");
      } else if (data && data.text) {
        // Some models might use 'text' at top level
        codeContent = data.text;
        console.log("Extracted content from top-level text field");
      } else if (data && data.generated_text) {
        // Gemini sometimes uses generated_text
        codeContent = data.generated_text;
        console.log("Extracted content from generated_text field");
      } else if (data && data.completion) {
        // Some models use completion
        codeContent = data.completion;
        console.log("Extracted content from completion field");
      } else if (data && typeof data === 'string') {
        // Direct string response
        codeContent = data;
        console.log("Using entire response as a string");
      } else if (data) {
        // Last resort: try to find any string property that might contain content
        console.log("Attempting to find content in any string property");
        for (const key in data) {
          if (typeof data[key] === 'string' && data[key].length > 100) {
            codeContent = data[key];
            console.log(`Found potential content in field: ${key}`);
            break;
          }
        }
      }

      // Log the extracted content
      console.log("Extracted code content:", codeContent ? codeContent.substring(0, 200) + '...' : 'NULL');

      if (!codeContent) {
        console.error("No valid content found in response structure:", JSON.stringify(data, null, 2).substring(0, 500));

        // Return the raw response for debugging
        return NextResponse.json(
          {
            error: "No valid content in API response",
            details: "Response format did not match any expected pattern",
            rawResponse: JSON.stringify(data).substring(0, 2000) // Include raw response for debugging
          },
          { status: 500 }
        );
      }

      // Extract JSON from markdown code blocks if present
      const jsonMatch = codeContent.match(/```(?:json)?([\n|\r\n|\r])([\s\S]*?)```/);

      if (jsonMatch && jsonMatch[2]) {
        // If we found JSON in a code block, use that
        try {
          const extractedJson = jsonMatch[2].trim();
          console.log("Extracted JSON from code block:", extractedJson.substring(0, 200) + '...');

          // Sanitize the JSON string before parsing
          const sanitizedJson = extractedJson
            .replace(/(\r\n|\n|\r)/gm, '') // Remove line breaks
            .replace(/,\s*}/g, '}')        // Remove trailing commas
            .replace(/,\s*]/g, ']');       // Remove trailing commas in arrays

          try {
            const parsedJson = JSON.parse(sanitizedJson);
            console.log("Successfully parsed JSON");
            return NextResponse.json(parsedJson);
          } catch (error) {
            const parseError = error as Error;
            console.error("JSON parsing error after sanitization:", parseError.message, sanitizedJson.substring(0, 200));

            // Try alternative JSON extraction approaches
            try {
              // First try: Look for a JSON object anywhere in the content
              const alternativeMatch = codeContent.match(/\{[\s\S]*?\}(?=\s|$)/);
              if (alternativeMatch) {
                const alternativeJson = JSON.parse(alternativeMatch[0]);
                console.log("Parsed using alternative JSON extraction - object");
                return NextResponse.json(alternativeJson);
              }

              // Second try: Extract content from any code block (not just JSON blocks)
              const anyCodeBlock = codeContent.match(/```[^`]*?\n([\s\S]*?)```/);
              if (anyCodeBlock && anyCodeBlock[1]) {
                const processedBlock = anyCodeBlock[1]
                  .replace(/\n/g, ' ')
                  .replace(/,\s*[\}\]]/g, (match: string) => match.replace(',', ''));

                if (processedBlock.trim().startsWith('{') && processedBlock.trim().endsWith('}')) {
                  console.log("Found object-like code block, attempting to parse");
                  const blockJson = JSON.parse(processedBlock);
                  return NextResponse.json(blockJson);
                }
              }
            } catch (altError) {
              console.error("Alternative JSON parsing approaches failed");
            }

            // If all JSON parsing fails, return the raw content
            return NextResponse.json({ content: codeContent });
          }
        } catch (extractError) {
          console.error("Error extracting JSON:", extractError);
          return NextResponse.json({ content: codeContent });
        }
      } else {
        // If no code block, return the raw content
        console.log("No JSON code block found, returning raw content");
        return NextResponse.json({ content: codeContent });
      }
    } catch (apiError) {
      console.error("API Request Error:", apiError);
      return NextResponse.json(
        {
          error: "Failed to generate content",
          details: String(apiError),
          timestamp: new Date().toISOString(),
          modelUsed: modelName
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Processing Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}