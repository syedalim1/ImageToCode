import AIPrompt from "@/data/AIPrompt";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { description, imageUrl, options, userEmail, mode, language } =
    await request.json();

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const finalprompt =
    AIPrompt.CODE_GEN_PROMPT_FORHTML_CSS + (description || "") + (options || "");
  const response = await fetch(imageUrl);
  const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');


  let finalResponse = null;
  try {
    // Make the API call directly without the nested function
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro-preview-03-25",
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64ImageData,
          },
        },
        {
          text: finalprompt,
        },
      ],
    });

    // Access the response correctly according to the GoogleGenAI API
    if (response && response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        finalResponse = candidate.content.parts[0].text || "";
        finalResponse = finalResponse
          ?.replace("```json", "")
          .replace("```", "")
          .replace("```js", "")
          .replace("```ts", "")
          .replace("```python", "")
          .replace("```html", "")
          .replace("```css", "")
          .replace("```javascript", "")
          .replace("```typescript", "")
          .replace("```typescriptreact", "")
          .replace("```jsonc", "")
          .replace("```jsx", "")
          .replace("```tsx", "");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate response" });
  } finally {
  }

  return NextResponse.json({ content: finalResponse });
}
