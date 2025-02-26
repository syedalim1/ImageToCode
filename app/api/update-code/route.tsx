import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  try {
    // Parse the request body
    const { uid, code, email } = await req.json();

    // Basic validation
    if (!uid || !code) {
      return NextResponse.json(
        { message: "Missing uid or code" },
        { status: 400 }
      );
    }

    console.log("🔹 Update Code Request:", { uid, codeLength: code?.length, email });

    // Ensure code is properly formatted as a JSON object with content property
    const formattedCode = typeof code === 'string' 
      ? { content: code } 
      : (code || { content: '' });

    // Update the code in the database
    const result = await db
      .update(imagetocodeTable)
      .set({
        code: formattedCode, // Update the code field with properly formatted object
        ...(email ? { email: email } : {}) // Only update email if provided
      })
      .where(eq(imagetocodeTable.uid, uid)) // Filter by uid
      .returning(); // Return the updated record

    // Check if the record was found and updated
    if (result.length === 0) {
      console.error("❌ Record not found for UID:", uid);
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    console.log("✅ Code updated successfully for UID:", uid);
    
    // Return success response
    return NextResponse.json(
      { message: "Code updated successfully", data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating code:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
