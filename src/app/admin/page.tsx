"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, XCircle, Clock, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Order, OrderItem } from "@/types/database";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-brand/10 text-brand",
  cancelled: "bg-red-100 text-red-700",
};

const nextStatusMap: Record<string, string> = {
  confirmed: "shipped",
  shipped: "delivered",
};

export default function AdminDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      router.push("/");
      return;
    }

    if (user && role === "admin") {
      fetchOrders();
    }
  }, [user, role, authLoading, router]);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    if (res.ok) {
      setOrders(data.orders || []);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, order_status: newStatus }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus as Order["order_status"] } : o))
      );
    }
    setUpdatingId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.payment_status === "pending").length;
  const confirmedCount = orders.filter((o) => o.order_status === "confirmed" && o.payment_status === "paid").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.order_status === "delivered").length;

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => {
        if (filter === "paid") return o.payment_status === "paid";
        if (filter === "pending") return o.payment_status === "pending";
        if (filter === "failed") return o.payment_status === "failed" || o.order_status === "cancelled";
        return o.order_status === filter;
      });

  return (
    <div className="pt-28 pb-20 min-h-screen bg-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-brand mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mb-8">Manage orders and track deliveries</p>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
                <Package size={20} className="text-brand" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand">{orders.length}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <IndianRupee size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
            <p className="text-xs text-gray-500">Revenue (Paid)</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Truck size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{confirmedCount + shippedCount}</p>
            <p className="text-xs text-gray-500">In Transit</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
                <CheckCircle size={20} className="text-brand" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand">{deliveredCount}</p>
            <p className="text-xs text-gray-500">Delivered</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "paid", "pending", "confirmed", "shipped", "delivered", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === f ? "bg-brand text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <XCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders matching this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedId === order.id;
              const items = order.items as OrderItem[];
              const canAdvance = order.payment_status === "paid" && nextStatusMap[order.order_status];

              return (
                <div key={order.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</span>
                        <span className="font-medium text-sm text-brand">{order.customer_name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.payment_status]}`}>
                          {order.payment_status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.order_status]}`}>
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
                        <span>{items.length} item{items.length > 1 ? "s" : ""}</span>
                        <span className="font-bold text-brand">₹{order.total}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t">
                      <div className="pt-4 grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Items</p>
                          <div className="space-y-2">
                            {items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.product_name} ({item.variant}) x{item.quantity}
                                </span>
                                <span className="font-medium text-brand">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Shipping</span>
                              <span>{Number(order.shipping) === 0 ? "Free" : `₹${order.shipping}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-brand pt-1">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                          <div className="text-sm space-y-1">
                            <p className="font-medium text-gray-700">{order.customer_name}</p>
                            <p className="text-gray-500">{order.customer_email}</p>
                            <p className="text-gray-500">{order.customer_phone}</p>
                          </div>

                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 mt-4">Shipping Address</p>
                          <p className="text-sm text-gray-500">
                            {order.shipping_address}, {order.city}, {order.state} — {order.pincode}
                          </p>

                          {canAdvance && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Update Status</p>
                              <button
                                onClick={() => updateStatus(order.id, nextStatusMap[order.order_status])}
                                disabled={updatingId === order.id}
                                className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-medium hover:bg-brand-light transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                {updatingId === order.id ? (
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : order.order_status === "confirmed" ? (
                                  <Truck size={16} />
                                ) : (
                                  <CheckCircle size={16} />
                                )}
                                Mark as {nextStatusMap[order.order_status]}
                              </button>
                            </div>
                          )}
                        </div>
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
