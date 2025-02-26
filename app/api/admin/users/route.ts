import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { NextResponse } from "next/server";

// Add dynamic export to prevent prerendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await db.select().from(usersTable);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
