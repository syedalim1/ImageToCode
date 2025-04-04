import Constants from "@/data/Constants";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import mime from "mime-types";
import fs from "fs";
import path from "path";

// Centralized configuration
const CONFIG = {
  API: {
    KEY: process.env.GEMINI_API_KEY,
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
    MODEL: "gemini-2.5-pro-exp-03-25",
    TEMPERATURE: 1,
    TOP_P: 0.95,
    TOP_K: 64,
    MAX_OUTPUT_TOKENS: 65536,
    RESPONSE_MIME_TYPE: "text/plain",
  },
};

/**
 * Helper to upload a file to Gemini API
 */
async function uploadToGemini(fileManager: GoogleAIFileManager, file: File | string) {
  try {
    // For File objects from FormData
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create temp directory if it doesn't exist
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Write to temp file
      const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
      fs.writeFileSync(tempFilePath, buffer);
      
      // Upload to Gemini
      const mimeType = file.type || mime.lookup(file.name) || "image/png";
      const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType,
        displayName: file.name,
      });
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      
      return uploadResult.file;
    }
    
    // For file paths (string) from JSON request
    if (typeof file === 'string' && fs.existsSync(file)) {
      const mimeType = mime.lookup(file) || "image/png";
      const uploadResult = await fileManager.uploadFile(file, {
        mimeType,
        displayName: path.basename(file),
      });
      return uploadResult.file;
    }
    
    throw new Error("Invalid file format provided");
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    let userEmail = "";
    let code = "";
    let imageFile = null;
    
    // Determine request content type and parse accordingly
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle form data request
      const formData = await req.formData();
      userEmail = formData.get("userEmail") as string;
      code = formData.get("code") as string;
      imageFile = formData.get("image") as File | null;
    } else {
      // Handle JSON request
      const jsonData = await req.json();
      userEmail = jsonData.userEmail;
      code = jsonData.code;
      // If JSON includes a base64 image, it can be processed here
    }

    // Validate required inputs
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }
    
    if (!code) {
      return NextResponse.json({ error: "Code to improve is required" }, { status: 400 });
    }

    // Verify API configuration
    if (!CONFIG.API.KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(CONFIG.API.KEY);
    const fileManager = new GoogleAIFileManager(CONFIG.API.KEY);
    
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
          currentCredits,
        },
        { status: 403 }
      );
    }

    // Configure the model
    const model = genAI.getGenerativeModel({
      model: CONFIG.GENERATION.MODEL,
    });

    const generationConfig = {
      temperature: CONFIG.GENERATION.TEMPERATURE,
      topP: CONFIG.GENERATION.TOP_P,
      topK: CONFIG.GENERATION.TOP_K,
      maxOutputTokens: CONFIG.GENERATION.MAX_OUTPUT_TOKENS,
      responseMimeType: CONFIG.GENERATION.RESPONSE_MIME_TYPE,
    };

    // Process the image if provided
    let files = [];
    if (imageFile) {
      const uploadedFile = await uploadToGemini(fileManager, imageFile);
      files.push(uploadedFile);
    }

    // Setup chat session with appropriate prompt
    const improvePrompt = code + "\n\n" + "Fix All The Bug Run Proper Code";
    
    let chatSession;
    let parts = [];
    
    // Prepare message parts
    if (files.length > 0) {
      // Add file part
      parts.push({
        fileData: {
          mimeType: files[0].mimeType,
          fileUri: files[0].uri,
        }
      });
    }
    
    // Add text part
    parts.push({ text: improvePrompt });
    
    // Start chat session
    chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: parts,
        }
      ],
    });

    try {
      // Send message to Gemini API
      const result = await chatSession.sendMessage("Please improve the code I provided");
      
      // Process response
      const responseText = result.response.text();
      
      // Strip markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```javascript|```typescript|```jsx|```tsx|```/g, "")
        .trim();

      // Update user credits after successful generation
      await db
        .update(usersTable)
        .set({ credits: currentCredits - CONFIG.CREDITS.GENERATION_COST })
        .where(eq(usersTable.email, userEmail));

      // Return improved code
      return NextResponse.json({ 
        improvedCode: cleanedResponse,
        creditsRemaining: currentCredits - CONFIG.CREDITS.GENERATION_COST
      });
    } catch (apiError) {
      console.error("Gemini API Request Error:", apiError);
      return NextResponse.json(
        { 
          error: "Failed to generate content", 
          details: String(apiError),
          requestId: Date.now().toString()
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
        requestId: Date.now().toString()
      },
      { status: 500 }
    );
  }
}
