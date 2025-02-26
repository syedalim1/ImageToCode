import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { credits, userEmail } = await req.json();
    
    // Validate required fields
    if (credits === undefined) {
      return NextResponse.json(
        { error: "Missing required field: credits" },
        { status: 400 }
      );
    }

    // Get user email from the request or from authentication
    const email = userEmail || req.headers.get("x-user-email");
    
    if (!email) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    
    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update the user's credits
    const result = await db
      .update(usersTable)
      .set({
        credits: user[0].credits + credits,
      })
      .where(eq(usersTable.email, email))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    );
  }
}
