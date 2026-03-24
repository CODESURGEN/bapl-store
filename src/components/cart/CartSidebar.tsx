"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-heading text-lg font-bold text-brand flex items-center gap-2">
              <ShoppingBag size={20} />
              Your Cart ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="mt-4 font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Add some premium rice to get started</p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2 bg-brand text-white rounded-full text-sm font-medium hover:bg-brand-light transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex gap-4 p-4 bg-soft rounded-xl"
                  >
                    <div className="w-16 h-16 bg-stone rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      🌾
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm text-brand truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:border-brand transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:border-brand transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-bold text-brand">
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId, item.variant)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-heading text-xl font-bold text-brand">₹{totalPrice}</span>
              </div>
              <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-3 bg-brand text-white text-center rounded-full font-medium hover:bg-brand-light transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full py-3 text-brand text-center text-sm font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
