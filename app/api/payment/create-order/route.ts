import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { v4 as uuid } from 'uuid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    
    const options = {
      amount: amount, // amount in smallest currency unit
      currency: "INR",

      receipt: `receipt_${uuid()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
