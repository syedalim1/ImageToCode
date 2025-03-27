import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


export async function POST(request: NextRequest) {
  try{

      const { code, language } = await request.json();

      const des = code + "\n\n" +Constants.CODE_OPTIMIZER_PROMPT;
      const openai = new OpenAI({
          baseURL: 'https://api.deepseek.com',
          apiKey: process.env.DEEPSEEK_API_KEY
      });

      async function main() {
          const completion = await openai.chat.completions.create({
              messages: [{ role: "system", content: des }],
              model: "deepseek-reasoner",
             
              
          });

          console.log(completion.choices[0].message.content);
      }

      main();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate code", details: String(error) },
      { status: 500 }
    );
  }
}