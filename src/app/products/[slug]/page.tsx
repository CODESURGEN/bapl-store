"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, ArrowLeft, Check, Truck, Shield, Star } from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/product/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold text-brand">Product not found</h1>
        <Link href="/products" className="text-gold hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image_url,
      variant: variant.size,
      price: variant.price,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-b from-gray-50 to-soft rounded-3xl flex items-center justify-center aspect-square relative overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-6 left-6 px-4 py-1.5 bg-brand text-white text-sm font-medium rounded-full z-10">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-2">
              {product.category}
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-brand mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-gold text-gold" />
              ))}
              <span className="text-sm text-gray-400 ml-2">(4.8 / 5)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, i) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedVariant(i)}
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedVariant === i
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="block font-bold">{v.size}</span>
                    <span className="block text-xs mt-0.5">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-[family-name:var(--font-jakarta)] text-3xl font-bold text-brand">
                ₹{variant.price}
              </span>
              {variant.compare_at_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{variant.compare_at_price}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(
                      ((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-auto px-10 py-4 rounded-full font-medium text-lg transition-all flex items-center justify-center gap-3 ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-brand text-white hover:bg-brand-light"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={22} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={22} />
                  Add to Cart
                </>
              )}
            </button>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-gold flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-6 pt-8 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck size={18} className="text-brand" />
                Free delivery on 10 Kg+
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield size={18} className="text-brand" />
                FSSAI Certified
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-brand mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
