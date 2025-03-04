import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userEmail = searchParams.get("email");

  if (!userEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const conversions = await db
      .select()
      .from(imagetocodeTable)
      .where(eq(imagetocodeTable.email, userEmail))
      .orderBy(desc(imagetocodeTable.createdAt))
      .limit(5);

    return NextResponse.json({ conversions });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
