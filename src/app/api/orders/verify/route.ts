import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { getRazorpayKeySecret } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    const secret = getRazorpayKeySecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const supabase = createServiceRoleClient();

    if (expectedSignature !== razorpay_signature) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" } as never)
        .eq("id", order_id);

      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { error } = await supabase
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payment_status: "paid",
        order_status: "confirmed",
      } as never)
      .eq("id", order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
