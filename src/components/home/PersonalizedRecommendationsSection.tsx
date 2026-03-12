"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/product-skeleton";
import { useLanguage } from "@/lib/i18n/context";

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string | null;
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
  const { t } = useLanguage();
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);

        if (session?.user?.id) {
          // Personalized for logged-in users — limit 6
          const res = await fetch("/api/recommendations/personalized", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id, limit: 6 }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.products?.length > 0) {
              setProducts(data.products.slice(0, 6));
              setTitle(t("home.suggestionsForYou"));
              setSubtitle(t("home.basedOnHistory"));
              return;
            }
          }
        }

        // Fallback: trending products — limit 6
        const res = await fetch("/api/recommendations/products?type=trending&limit=6");
        if (res.ok) {
          const data = await res.json();
          setProducts((data.products ?? []).slice(0, 6));
          setTitle(t("home.featuredProducts"));
          setSubtitle(t("home.mostLovedWeek"));
        }
      } catch {
        // Silently fall through — section simply won't render
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id, t]);

  if (!isLoading && products.length === 0) return null;

  const isPersonalized = !!session?.user;
  const displayTitle = title || t("home.suggestionsForYou");
  const displaySubtitle = subtitle;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{displayTitle}</h2>
          {displaySubtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{displaySubtitle}</p>
          )}
        </div>
        <Link
          href="/products"
          className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
        >
          {t("common.viewAll")}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid — exactly 6 products, fixed 3-col × 2-row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 6).map((p, i) => (
              <ProductCard
                key={p.id || p.slug || `rec-${i}`}
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
