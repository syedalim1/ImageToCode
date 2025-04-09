import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      description,
      imageUrl,
      uid,
      email,
      code,
      options,
      createdAt,
      language,
      mode,
      theme,
    } = body;

    if (!uid || !imageUrl || !email) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: { uid, imageUrl, email },
        },
        { status: 400 }
      );
    }

    console.log("🔹 Incoming Request Data:", body);
    let result;

    // Ensure code is properly formatted as a JSON object with content property
    const formattedCode =
      typeof code === "string" ? { content: code } : code || { content: "" };

    result = await db
      .insert(imagetocodeTable)
      .values({
        uid: uid,
        description: description || "",
        imageUrl: imageUrl,
        code: formattedCode,
        email: email,
        createdAt: createdAt || new Date(),
        options: options || {},
        mode: mode || "",
        theme: theme || "",
        language: language || "",
      })
      .returning();

    console.log("✅ Database Insert Result:", result);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "No data found or operation failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const body = await req.json();
    const { code, imageUrl, description, createdAt, email } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid parameter" },
        { status: 400 }
      );
    }

    // Ensure code is properly formatted as a JSON object with content property
    const formattedCode =
      typeof code === "string" ? { content: code } : code || { content: "" };

    const updateData: any = {
      code: formattedCode,
    };

    // Only include fields that are provided
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (description) updateData.description = description;
    if (createdAt) updateData.createdAt = createdAt;
    if (email) updateData.email = email;

    const result = await db
      .update(imagetocodeTable)
      .set(updateData)
      .where(eq(imagetocodeTable.uid, uid))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "No data found or operation failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid parameter" },
        { status: 400 }
      );
    }

    console.log("🔹 Fetching Data for UID:", uid);

    const result = await db
      .select()
      .from(imagetocodeTable)
      .where(eq(imagetocodeTable.uid, uid));

    if (!result || result.length === 0) {
      console.log("⚠️ No data found for UID:", uid);
      return NextResponse.json(
        { error: "No data found for the given UID" },
        { status: 404 }
      );
    }

    console.log("✅ Database Query Result:", result[0]);

    // Ensure the response has a consistent format for the code field
    const record = result[0];

    // If code is null or undefined, provide a default empty object
    if (!record.code) {
      record.code = { content: "" };
    }

    return NextResponse.json(record);
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
