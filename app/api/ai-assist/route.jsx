import { NextRequest } from "next/server";
import OpenAI from "openai";
export async function POST(request) {
  // Please install OpenAI SDK first: `npm install openai`

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);

  const result = completion.choices[0].message.content;
  //   const { error } = await request.json();

  //   if (error) {
  //     return new Response(JSON.stringify({ error: "Error" }), { status: 500 });
  //   }

  return NextRequest.json({ message: result });
}
