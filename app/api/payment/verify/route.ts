import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment verification successful
      // Add 10 credits for ₹10 payment (1 page = 10 credits)
      const updateRes = await fetch("/api/user/update-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": req.headers.get("x-user-email") || "",
        },
        body: JSON.stringify({ 
          credits: 10,
          userEmail: req.headers.get("x-user-email") || "",
        }),
      });

      if (updateRes.ok) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
