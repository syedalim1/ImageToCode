import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.SITE_NAME || "My Local App";

export async function POST(req: NextRequest) {
  try {
    const { description, imageUrl, model, options } = await req.json();
    const modelname = "google/gemini-2.0-pro-exp-02-05:free";
    //future main ai this "anthropic/claude-3.5-sonnet
    const des = Constants.PROMPT + description + "\n\n" + options;
    // Validate required fields
    if (!description || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: description or imageUrl" },
        { status: 400 }
      );
    }

    // Verify API key exists
    if (!API_KEY) {
      console.error("OPENROUTER_API_KEY is missing from environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const payload = {
      model: modelname,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: des,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      OPENROUTER_API_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
