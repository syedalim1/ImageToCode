import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { submissions } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { uid, description, email } = await req.json();

    // Basic validation
    if (!uid || !description) {
      return NextResponse.json(
        { message: "Missing uid or description" },
        { status: 400 }
      );
    }

    // Insert the submission into the database
    await db.insert(submissions).values({
      uid: uid,
      description: description,
      email: email,
    });

    return NextResponse.json({ message: "Submission created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { message: "Error creating submission" },
      { status: 500 }
    );
  }
}
