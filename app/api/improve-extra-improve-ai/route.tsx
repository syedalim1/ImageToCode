import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import Constants from "@/data/Constants";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";

// Centralized configuration
const CONFIG = {
  DEEPSEEK: {
    BASE_URL: "https://api.deepseek.com",
    API_KEY: process.env.DEEPSEEK_API_KEY,
    MODEL: "deepseek-chat",
  },
  GENERATION: {
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    STREAM: false,
  },
  RESPONSE: {
    CONTENT_TYPE: "text/plain",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { code, userEmail } = await request.json();
    
    // Validate input
    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }
    
    // Verify user and check credits
    if (userEmail) {
      const user = await db.select().from(usersTable).where(eq(usersTable.email, userEmail)).execute();
      
      if (!user || user.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      const currentUser = user[0];
      
      // Check if credits exists and is sufficient
      const userCredits = currentUser.credits ?? 0;
      if (userCredits < Constants.CREDIT_COSTS.NORMAL_MODE) {
        return NextResponse.json(
          { error: "Insufficient credits", requiredCredits: Constants.CREDIT_COSTS.NORMAL_MODE },
          { status: 402 }
        );
      }
      
      // Deduct credits
      await db
        .update(usersTable)
        .set({
          credits: userCredits - Constants.CREDIT_COSTS.NORMAL_MODE,
        })
        .where(eq(usersTable.id, currentUser.id))
        .execute();
    }

    // Set up OpenAI with DeepSeek configuration
    const systemPrompt = Constants.CODE_OPTIMIZER_PROMPT + "\n\n" + "response in English only";
    
    // Initialize OpenAI client with DeepSeek configuration
    const openai = new OpenAI({
      baseURL: CONFIG.DEEPSEEK.BASE_URL,
      apiKey: CONFIG.DEEPSEEK.API_KEY || "",
    });

    try {
      // Create completion according to DeepSeek API documentation
      const completion = await openai.chat.completions.create({
        model: CONFIG.DEEPSEEK.MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: code }
        ],
        stream: CONFIG.GENERATION.STREAM,
        // max_tokens: CONFIG.GENERATION.MAX_TOKENS,
        temperature: CONFIG.GENERATION.TEMPERATURE,
      }) as ChatCompletion; // Type assertion to ensure we get a ChatCompletion

      if (!completion.choices || !completion.choices[0]?.message?.content) {
        throw new Error("No completion content found in API response");
      }

      let codeContent = completion.choices[0].message.content;

      // Process output - remove markdown code blocks if present
      codeContent = codeContent
        .replace(/^```[\w]*\n/gm, "") // Remove opening code block markers
        .replace(/```$/gm, "")        // Remove closing code block markers
        .trim();

      return new Response(codeContent, {
        headers: { "Content-Type": CONFIG.RESPONSE.CONTENT_TYPE },
      });
    } catch (apiError) {
      console.error("API Request Error:", apiError);
      return NextResponse.json(
        { error: "Failed to generate content", details: String(apiError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
