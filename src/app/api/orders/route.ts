import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { OrderItem } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderData: {
      user_id: string | null;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: string;
      city: string;
      state: string;
      pincode: string;
      items: OrderItem[];
      subtotal: number;
      shipping: number;
      total: number;
      payment_status: "pending";
      order_status: "placed";
      razorpay_order_id: null;
      razorpay_payment_id: null;
    } = {
      user_id: user?.id ?? null,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      shipping_address: body.shipping_address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      total: body.total,
      payment_status: "pending",
      order_status: "placed",
      razorpay_order_id: null,
      razorpay_payment_id: null,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(orderData as never)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ order_id: (data as { id: string }).id });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
