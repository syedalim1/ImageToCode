import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    // +Constants.CODE_OPTIMIZER_PROMPT;
    const prompt = code + "\n\n" + "response in English only";
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek-chat",
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("No completion content found in API response");
    }

    let codeContent = completion.choices[0].message.content;

    // Remove markdown code blocks if present
    codeContent = codeContent
      .replace(/```(javascript|typescript|jsx|tsx)?/g, "")
      .trim();

    return new Response(codeContent, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate code",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
