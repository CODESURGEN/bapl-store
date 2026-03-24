"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image_url,
      variant: product.variants[0].size,
      price: product.variants[0].price,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block max-w-[320px] mx-auto w-full">
      <div className="bg-gradient-to-b from-gray-50 to-soft rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/8">
        <div className="relative aspect-[4/5] bg-stone/30 flex items-center justify-center overflow-hidden p-4">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 p-3"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-brand text-white text-[10px] font-medium rounded-full z-10">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">
            {product.category}
          </p>
          <h3 className="font-heading font-bold text-brand text-sm sm:text-base leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-lg font-bold text-brand">
                ₹{product.price}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.compare_at_price}
                </span>
              )}
              <span className="text-[10px] text-gray-400">/ kg</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-brand text-white rounded-full hover:bg-brand-light transition-colors group/btn"
            >
              <ShoppingCart size={16} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
