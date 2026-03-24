"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variant: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variant: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "TOGGLE" }
  | { type: "CLOSE" }
  | { type: "LOAD"; payload: CartItem[] };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId && i.variant === action.payload.variant
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.productId === action.payload.productId && i.variant === action.payload.variant
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.variant === action.payload.variant)
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.productId === action.payload.productId && i.variant === action.payload.variant)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId && i.variant === action.payload.variant
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "LOAD":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const saved = localStorage.getItem("bapl-cart");
    if (saved) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bapl-cart", JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (productId, variant) =>
          dispatch({ type: "REMOVE_ITEM", payload: { productId, variant } }),
        updateQuantity: (productId, variant, quantity) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variant, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        toggleCart: () => dispatch({ type: "TOGGLE" }),
        closeCart: () => dispatch({ type: "CLOSE" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
