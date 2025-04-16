



// import AIPrompt from "@/data/AIPrompt";
// import { NextResponse } from "next/server";

// // Centralized configuration
// const CONFIG = {
//   API: {
//     KEY: process.env.OPENROUTER_API_KEY,
//     URL:
//       process.env.OPENROUTER_API_URL ||
//       "https://openrouter.ai/api/v1/chat/completions",
//   },
//   SITE: {
//     URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
//     NAME: process.env.SITE_NAME || "My Local App",
//   },
//   CREDITS: {
//     GENERATION_COST: 10,
//     MINIMUM_BALANCE: 10,
//   },
//   GENERATION: {
//     MAX_TOKENS: 10000,
//     TIMEOUT_MS: 4000,
//   },
// };

// export async function POST(req: Request) {
//   try {
//     const { description, imageUrl, options, userEmail } = await req.json();

//     if (!CONFIG.API.KEY) {
//       throw new Error("OpenRouter API key is missing");
//     }

//     const enhancedDescription =
//       AIPrompt.CODE_GEN_PROMPT + description + "\n\n" + (options || "");

//     const modelName = "google/gemini-2.5-pro-exp-03-25:free";
//     const payload = {
//       model: modelName,
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "text", text: enhancedDescription },
//             { type: "image_url", image_url: { url: imageUrl } },
//           ],
//         },
//       ],
//       stream: true,
//       max_tokens: CONFIG.GENERATION.MAX_TOKENS,
//       timeout: CONFIG.GENERATION.TIMEOUT_MS / 14000,
//     };

//     const controller = new AbortController();
//     const timeoutId = setTimeout(
//       () => controller.abort(),
//       CONFIG.GENERATION.TIMEOUT_MS
//     );

//     try {
//       const apiResponse = await fetch(CONFIG.API.URL, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${CONFIG.API.KEY}`,
//           "HTTP-Referer": CONFIG.SITE.URL,
//           "X-Title": CONFIG.SITE.NAME,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!apiResponse.ok) {
//         const errorText = await apiResponse.text();
//         throw new Error(`API Request Failed: ${errorText}`);
//       }

//       // Set up streaming response
//       const encoder = new TextEncoder();
//       const decoder = new TextDecoder();
//       const stream = new ReadableStream({
//         async start(controller) {
//           const reader = apiResponse.body?.getReader();
//           if (!reader) throw new Error("Response body is not readable");

//           let buffer = "";
//           try {
//             while (true) {
//               const { done, value } = await reader.read();
//               if (done) break;

//               buffer += decoder.decode(value, { stream: true });

//               while (true) {
//                 const lineEnd = buffer.indexOf("\n");
//                 if (lineEnd === -1) break;

//                 const line = buffer.slice(0, lineEnd).trim();
//                 buffer = buffer.slice(lineEnd + 1);

//                 if (line.startsWith("data: ")) {
//                   const data = line.slice(6);
//                   if (data === "[DONE]") break;

//                   try {
//                     const parsed = JSON.parse(data);
//                     const content = parsed.choices[0].delta.content;
//                     if (content) {
//                       controller.enqueue(encoder.encode(content));
//                     }
//                   } catch (e) {
//                     // Ignore invalid JSON
//                   }
//                 }
//               }
//             }
//           } catch (error) {
//             controller.error(error);
//           } finally {
//             controller.close();
//             reader.cancel();
//           }
//         },
//       });

//       return new Response(stream);
//     } catch (apiError) {
//       console.error("API Request Error:", apiError);
//       return NextResponse.json(
//         { error: "Failed to generate content", details: String(apiError) },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Server Processing Error:", error);
//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
