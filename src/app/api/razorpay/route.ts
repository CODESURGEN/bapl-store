import { NextResponse } from "next/server";
import { getRazorpayInstance, getRazorpayKeyId } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const { amount, order_id } = await request.json();
    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: order_id,
      notes: {
        order_id,
      },
    });

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      key_id: getRazorpayKeyId(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
