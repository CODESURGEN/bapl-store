import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "failed",
        order_status: "cancelled",
      } as never)
      .eq("id", order_id)
      .eq("payment_status", "pending");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
