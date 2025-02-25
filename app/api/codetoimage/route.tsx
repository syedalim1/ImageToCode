import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, imageUrl, model, uid, email, code, options } = body;

    if (!uid || !imageUrl || !model || !email) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: { uid, imageUrl, model, email },
        },
        { status: 400 }
      );
    }

    console.log("🔹 Incoming Request Data:", body);
    let result;

    result = await db
      .insert(imagetocodeTable)
      .values({
        uid: uid,
        description: description,
        imageUrl: imageUrl,
        model: model,
        code: code ,
        createdAt: email,
        options: options
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
    const { code, imageUrl, description, createdAt } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid parameter" },
        { status: 400 }
      );
    }

    const result = await db
      .update(imagetocodeTable)
      .set({
        code: code,
        imageUrl: imageUrl,
        description: description,
        createdAt: createdAt,
      })
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

    return NextResponse.json(result[0]);
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
