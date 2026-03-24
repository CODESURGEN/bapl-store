"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import type { Order, OrderItem } from "@/types/database";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-brand/10 text-brand",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      const supabase = createClient();
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders((data as Order[]) || []);
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-soft">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-brand mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-brand mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">
              Once you place an order, it will appear here.
            </p>
            <Link
              href="/products"
              className="inline-flex px-6 py-3 bg-brand text-white rounded-full font-medium hover:bg-brand-light transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const items = order.items as OrderItem[];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="font-mono text-sm text-gray-400">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[order.payment_status] || ""
                          }`}
                        >
                          {order.payment_status}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[order.order_status] || ""
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>
                          {items.length} item{items.length > 1 ? "s" : ""}
                        </span>
                        <span className="font-bold text-brand">₹{order.total}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t">
                      <div className="pt-4 space-y-3">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.product_name} ({item.variant}) x{item.quantity}
                            </span>
                            <span className="font-medium text-brand">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>₹{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shipping</span>
                          <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-brand pt-1">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                        <p className="font-medium text-gray-700 mb-1">Shipping to:</p>
                        <p>{order.customer_name}</p>
                        <p>
                          {order.shipping_address}, {order.city}, {order.state} — {order.pincode}
                        </p>
                        <p>{order.customer_phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
