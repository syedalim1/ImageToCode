import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/configs/db";
import { transactionsTable, usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      packageId,
      credits,
      userEmail,
    } = await req.json();

    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("generatedSignature:", generatedSignature);
    console.log("razorpay_signature:", razorpay_signature);

    if (generatedSignature === razorpay_signature) {
      // Payment verification successful

      const email = userEmail || req.headers.get("x-user-email");

      if (!email) {
        return NextResponse.json(
          { error: "User email is required" },
          { status: 400 }
        );
      }

      // Find the user
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (user.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userId = user[0].id;

      // Fetch the order details from Razorpay to get the correct amount
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const amount = Number(order.amount);

      // Create transaction record
      await db.insert(transactionsTable).values({
        userId: userId,
        credits: credits,
        amount: amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      });

      // Update user credits
      await db
        .update(usersTable)
        .set({
          credits: user[0].credits + credits,
        })
        .where(eq(usersTable.email, email));

      return NextResponse.json({ success: true });
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
