"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<"details" | "confirm" | "success">("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.user_metadata?.phone || prev.phone,
      }));
    }
  }, [user]);

  const shipping = 0;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === "details") {
      setStep("confirm");
      return;
    }

    setProcessing(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.productId,
        product_name: item.name,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          items: orderItems,
          subtotal: totalPrice,
          shipping,
          total,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      const dbOrderId = orderData.order_id;
      setOrderId(dbOrderId);

      const razorpayRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, order_id: dbOrderId }),
      });

      const razorpayData = await razorpayRes.json();
      if (!razorpayRes.ok) throw new Error(razorpayData.error || "Payment init failed");

      const options = {
        key: razorpayData.key_id,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Bandaru Agrotech",
        description: "Premium Rice Order",
        order_id: razorpayData.razorpay_order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#1a3622" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: dbOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);

            clearCart();
            setStep("success");
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
          setProcessing(false);
        },
        modal: {
          ondismiss: async () => {
            await fetch("/api/orders/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_id: dbOrderId }),
            });
            setProcessing(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="pt-32 pb-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-brand mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 bg-brand text-white rounded-full font-medium hover:bg-brand-light transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-brand mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-2">
          Thank you, {form.name}! Your payment was successful.
        </p>
        {orderId && (
          <p className="text-gray-500 text-sm mb-2">
            Order ID: <span className="font-mono text-brand">{orderId.slice(0, 8)}...</span>
          </p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          We&apos;ll send a confirmation to {form.email} shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex px-8 py-3 bg-brand text-white rounded-full font-medium hover:bg-brand-light transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="inline-flex px-8 py-3 border-2 border-brand text-brand rounded-full font-medium hover:bg-brand/5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-brand mb-10">
            Checkout
          </h1>

          <div className="flex items-center gap-4 mb-10">
            {[
              { key: "details", icon: MapPin, label: "Details" },
              { key: "confirm", icon: CreditCard, label: "Confirm & Pay" },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.key || (step === "confirm" && i === 0)
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === s.key ? "text-brand" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
                {i === 0 && <div className="w-12 h-px bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              {step === "details" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      type="email"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      placeholder="House/Flat no, Street, Area"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                      >
                        <option>Telangana</option>
                        <option>Andhra Pradesh</option>
                        <option>Karnataka</option>
                        <option>Tamil Nadu</option>
                        <option>Maharashtra</option>
                        <option>Kerala</option>
                        <option>Gujarat</option>
                        <option>Delhi</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        placeholder="508207"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand text-white rounded-full font-medium text-lg hover:bg-brand-light transition-colors"
                  >
                    Continue to Payment
                  </button>
                </>
              )}

              {step === "confirm" && (
                <div className="space-y-6">
                  <div className="bg-soft rounded-2xl p-6">
                    <h3 className="font-[family-name:var(--font-jakarta)] font-bold text-brand mb-4">
                      Delivery Details
                    </h3>
                    <p className="text-gray-700">{form.name}</p>
                    <p className="text-gray-500 text-sm">{form.phone}</p>
                    <p className="text-gray-500 text-sm">{form.email}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {form.address}, {form.city}, {form.state} — {form.pincode}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="text-gold text-sm font-medium mt-3 hover:underline"
                    >
                      Edit Details
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gold text-white rounded-full font-medium text-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay & Place Order — ₹${total}`
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              )}
            </form>

            <div className="bg-soft rounded-2xl p-6 h-fit sticky top-28">
              <h3 className="font-[family-name:var(--font-jakarta)] font-bold text-brand mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} ({item.variant}) x{item.quantity}
                    </span>
                    <span className="font-medium text-brand">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-brand">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : "text-brand"}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Free shipping on orders above ₹500</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span className="text-brand">Total</span>
                  <span className="text-brand">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
