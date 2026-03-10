/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/product-skeleton";

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  inventory?: number;
  score: number;
  reason: string;
}

export default function PersonalizedRecommendationsSection() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("Gợi ý cho bạn");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);

        if (session?.user?.id) {
          // Personalized for logged-in users
          const res = await fetch("/api/recommendations/personalized", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id, limit: 8 }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.products?.length > 0) {
              setProducts(data.products);
              setTitle("Gợi ý cho bạn");
              setSubtitle("Dựa trên lịch sử mua sắm của bạn");
              return;
            }
          }
        }

        // Fallback: trending products
        const res = await fetch("/api/recommendations/products?type=trending&limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
          setTitle("Sản phẩm nổi bật");
          setSubtitle("Được yêu thích nhất trong tuần");
        }
      } catch {
        // Silently fall through — section simply won't render
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id]);

  if (!isLoading && products.length === 0) return null;

  const isPersonalized = !!session?.user;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[6%] py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isPersonalized ? (
              <Sparkles className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-orange-500" />
            )}
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {isPersonalized ? "AI Gợi ý" : "Xu hướng"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  originalPrice: p.originalPrice ?? null,
                  category: p.category,
                  image: p.image || null,
                  inventory: p.stock ?? p.inventory ?? 99,
                  ratingAvg: p.rating,
                  ratingCount: p.reviewCount,
                  isOnSale: p.originalPrice != null && p.originalPrice > p.price,
                  salePrice: p.originalPrice != null && p.originalPrice > p.price ? p.price : null,
                }}
              />
            ))}
      </div>
    </section>
  );
}
