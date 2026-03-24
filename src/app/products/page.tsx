"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Shop Our Range
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-brand">
            All Rice Varieties
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            4 premium varieties milled with precision — from everyday meals to special occasions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-brand text-white"
                  : "bg-soft text-gray-600 hover:bg-stone"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No products in this category.</p>
        )}
      </div>
    </div>
  );
}
