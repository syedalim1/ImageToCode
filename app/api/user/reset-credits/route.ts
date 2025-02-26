import { NextRequest, NextResponse } from "next/server";
import { eq, lt } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    // Find all users with less than 100 credits
    const usersWithLowCredits = await db
      .select()
      .from(usersTable)
      .where(lt(usersTable.credits, 100));
    
    if (usersWithLowCredits.length === 0) {
      return NextResponse.json({
        message: "No users found with less than 100 credits",
        updatedCount: 0
      });
    }

    // Update all users with less than 100 credits to have exactly 100 credits
    const updatePromises = usersWithLowCredits.map(user => 
      db.update(usersTable)
        .set({ credits: 100 })
        .where(eq(usersTable.email, user.email))
    );
    
    await Promise.all(updatePromises);

    return NextResponse.json({
      message: "Successfully reset credits for users with less than 100 credits",
      updatedCount: usersWithLowCredits.length,
      updatedUsers: usersWithLowCredits.map(user => user.email)
    });
  } catch (error) {
    console.error("Error resetting credits:", error);
    return NextResponse.json(
      { error: "Failed to reset credits" },
      { status: 500 }
    );
  }
}
