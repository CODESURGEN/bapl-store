import type { Product } from "@/types/database";

export const products: Product[] = [
  {
    id: "1",
    name: "Sona Masoori Rice",
    slug: "sona-masoori",
    description:
      "Our premium Sona Masoori rice is a lightweight, aromatic short-grain variety that is the pride of Telangana. Carefully milled using state-of-the-art machinery, each grain is polished to perfection. Ideal for daily cooking — from fluffy steamed rice to biryanis and pulao. Low in starch and easy to digest, making it the healthiest choice for your family.",
    short_description: "Light, aromatic short-grain rice — perfect for daily cooking.",
    price: 1,
    compare_at_price: 65,
    category: "Premium",
    image_url: "/images/products/rice1.png",
    badge: "Popular",
    in_stock: true,
    variants: [
      { size: "1 Kg", price: 1, compare_at_price: 65 },
      { size: "5 Kg", price: 260, compare_at_price: 310 },
      { size: "10 Kg", price: 500, compare_at_price: 600 },
      { size: "25 Kg", price: 1200, compare_at_price: 1450 },
    ],
    features: [
      "Low glycemic index",
      "Lightweight & aromatic",
      "Ideal for daily meals",
      "Easy to digest",
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "BPT Samba Mahsuri Rice",
    slug: "bpt-samba-mahsuri",
    description:
      "BPT Samba Mahsuri — also known as BPT 5204 — is a fine-grain rice renowned for its soft texture and fluffy finish when cooked. Aged to perfection in our facilities, this variety absorbs flavours beautifully, making it the top choice for biryanis, fried rice, and festive meals. Trusted by chefs and households across South India.",
    short_description: "Aged, fine-grain rice with a fluffy finish — biryani favourite.",
    price: 62,
    compare_at_price: 72,
    category: "Premium",
    image_url: "/images/products/rice2.png",
    badge: "Premium",
    in_stock: true,
    variants: [
      { size: "1 Kg", price: 62, compare_at_price: 72 },
      { size: "5 Kg", price: 295, compare_at_price: 345 },
      { size: "10 Kg", price: 570, compare_at_price: 670 },
      { size: "25 Kg", price: 1380, compare_at_price: 1620 },
    ],
    features: [
      "Aged for superior taste",
      "Soft & fluffy texture",
      "Perfect for biryani",
      "Premium quality grain",
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "HMT Rice",
    slug: "hmt-rice",
    description:
      "HMT Rice is a classic, time-tested variety loved for its non-sticky, slender grains. Each grain cooks separately, making it perfect for sambar rice, curd rice, and everyday meals. Sourced from the finest paddies in the Telangana region and milled with precision to retain natural nutrition and flavour.",
    short_description: "Classic non-sticky, slender grains for everyday meals.",
    price: 48,
    compare_at_price: 58,
    category: "Classic",
    image_url: "/images/products/rice3.png",
    badge: "Classic",
    in_stock: true,
    variants: [
      { size: "1 Kg", price: 48, compare_at_price: 58 },
      { size: "5 Kg", price: 225, compare_at_price: 275 },
      { size: "10 Kg", price: 430, compare_at_price: 530 },
      { size: "25 Kg", price: 1050, compare_at_price: 1300 },
    ],
    features: [
      "Non-sticky grains",
      "Cooks separately",
      "Great for daily use",
      "Naturally nutritious",
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Kolam Rice",
    slug: "kolam-rice",
    description:
      "Kolam Rice is a fine, smooth-textured variety with a subtle aroma that enhances any meal. Its medium grain size and easy-cook nature make it a staple in homes and restaurants alike. Milled with care to preserve the natural shine and nutritional value.",
    short_description: "Fine, smooth-textured rice with a subtle aroma.",
    price: 52,
    compare_at_price: 60,
    category: "Aromatic",
    image_url: "/images/products/rice4.png",
    badge: "Aromatic",
    in_stock: true,
    variants: [
      { size: "1 Kg", price: 52, compare_at_price: 60 },
      { size: "5 Kg", price: 245, compare_at_price: 285 },
      { size: "10 Kg", price: 470, compare_at_price: 550 },
      { size: "25 Kg", price: 1150, compare_at_price: 1350 },
    ],
    features: [
      "Subtle natural aroma",
      "Smooth texture",
      "Versatile cooking",
      "Medium grain",
    ],
    created_at: new Date().toISOString(),
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export const categories = [...new Set(products.map((p) => p.category))];
