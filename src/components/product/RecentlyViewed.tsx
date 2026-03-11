"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useState } from "react";
import { Clock, X, ShoppingBag, Flame } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { logger } from "@/lib/logger";

type ViewedProduct = {
    id: string;
    name: string;
    slug?: string | null;
    price: number;
    salePrice?: number | null;
    originalPrice?: number | null;
    image?: string | null;
    category?: string;
    inventory?: number;
    badgeText?: string | null;
    isHot?: boolean;
    onSale?: boolean;
    isOnSale?: boolean;
};

export default function RecentlyViewed() {
    const [products, setProducts] = useState<ViewedProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const viewed = localStorage.getItem("recentlyViewed");
            if (!viewed) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const ids = [...new Set(JSON.parse(viewed) as string[])].slice(0, 8);
                if (ids.length === 0) {
                    if (isMounted) setLoading(false);
                    return;
                }

                const fetchedProducts = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            const res = await fetch(`/api/products/${id}`, { 
                                cache: "no-store" // Tránh cache và log không cần thiết
                            });
                            if (!res.ok || res.status === 404) return null;
                            const data = await res.json();
                            return data?.id ? data : null; // Đảm bảo có id mới return
                        } catch {
                            return null;
                        }
                    })
                );

                if (!isMounted) return;

                const validProducts = (fetchedProducts.filter(Boolean) as ViewedProduct[]);
                const seenIds = new Set<string>();
                setProducts(validProducts.filter((p) => {
                    if (seenIds.has(p.id)) return false;
                    seenIds.add(p.id);
                    return true;
                }));
                setLoading(false);
            } catch (err) {
                if (isMounted) {
                    logger.warn("Failed to parse recentlyViewed", { context: "recently-viewed", error: err as Error });
                    setLoading(false);
                }
            }
        };

        const frame = requestAnimationFrame(() => load());
        return () => {
            isMounted = false;
            cancelAnimationFrame(frame);
        };
    }, []);

    if (loading || products.length === 0) return null;

    const formatPrice = (val: number) => `$${Math.round(val).toLocaleString("en-US")}`;

    return (
        <section className="py-5 border-t border-slate-100">
            <div className="w-full mx-auto px-6 sm:px-10 lg:px-[8%]">
                {/* Compact header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5 text-violet-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">Đã xem gần đây</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {products.length}
                        </span>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem("recentlyViewed"); setProducts([]); }}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                    >
                        <X className="w-3 h-3" />
                        Xóa lịch sử
                    </button>
                </div>

                {/* Horizontal scroll strip */}
                <div
                    className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product, idx) => {
                        const isOnSale = product.onSale || product.isOnSale;
                        const currentPrice = isOnSale && product.salePrice != null ? product.salePrice : product.price;
                        const basePrice = product.originalPrice && product.originalPrice > currentPrice
                            ? product.originalPrice
                            : product.price;
                        const hasDiscount = basePrice > currentPrice;
                        const discountPct = hasDiscount
                            ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
                            : 0;
                        const url = `/products/${product.slug || product.id}`;

                        return (
                            <Link
                                key={product.id}
                                href={url}
                                className="flex-none w-[130px] sm:w-[148px] group animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
                            >
                                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        {(product.badgeText || hasDiscount) && (
                                            <div className="absolute top-1.5 left-1.5 z-10">
                                                {product.badgeText ? (
                                                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                                                        {product.badgeText}
                                                    </span>
                                                ) : (
                                                    <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                                                        <Flame className="w-2 h-2" />
                                                        -{discountPct}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {product.image ? (
                                            <ImageWithFallback
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="148px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-7 h-7 text-slate-200" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-2">
                                        {product.category && (
                                            <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5 truncate">
                                                {product.category}
                                            </p>
                                        )}
                                        <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mb-1.5 min-h-[2.5em]">
                                            {product.name}
                                        </p>
                                        {hasDiscount ? (
                                            <div>
                                                <p className="text-[9px] text-slate-400 line-through leading-none mb-0.5">
                                                    {formatPrice(basePrice)}
                                                </p>
                                                <p className="text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent leading-tight">
                                                    {formatPrice(currentPrice)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs font-black text-slate-900 leading-tight">
                                                {formatPrice(currentPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
