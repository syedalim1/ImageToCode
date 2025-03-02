import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  const { userEmail, userName, phoneNumber, country } = await req.json();

  const result = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      credits: usersTable.credits,
      phoneNumber: usersTable.phoneNumber,
      country: usersTable.country,
    })
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (result?.length == 0) {
    const insertResult: any = await db
      .insert(usersTable)
      .values({
        name: userName,
        email: userEmail,
        credits: 0,
        phoneNumber,
        country,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        credits: usersTable.credits,
        phoneNumber: usersTable.phoneNumber,
        country: usersTable.country,
      });

    return NextResponse.json(insertResult[0]);
  }
  return NextResponse.json(result[0]);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userEmail = searchParams.get("email");
  if (!userEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const result: any = await db
      .select({
        credits: usersTable.credits,
        phoneNumber: usersTable.phoneNumber,
        country: usersTable.country
      })
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (result?.rows?.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
