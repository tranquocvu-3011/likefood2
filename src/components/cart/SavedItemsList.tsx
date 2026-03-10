/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/context";

export interface SavedItem {
    id: string;
    name: string;
    slug?: string;
    price: number;
    quantity?: number;
    image?: string;
    inventory?: number;
    productId: string;
}

interface SavedItemsListProps {
    items: SavedItem[];
    onMoveToCart: (item: SavedItem) => void;
    onRemove: (id: string) => void;
}

export function SavedItemsList({ items, onMoveToCart, onRemove }: SavedItemsListProps) {
    const { t, language } = useLanguage();

    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">{language === "vi" ? "Chưa có sản phẩm nào được lưu" : "No saved items yet"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex gap-4 md:gap-8 p-4 md:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
                >
                    <Link
                        href={`/products/${item.slug || item.id}`}
                        className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100 relative"
                    >
                        {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                        ) : (
                            <ShoppingBag className="w-10 h-10 text-primary/10" />
                        )}
                    </Link>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <Link href={`/products/${item.slug || item.id}`} prefetch={true}>
                                <h3 className="font-black text-lg md:text-xl hover:text-primary transition-colors">{item.name}</h3>
                            </Link>
                            <p className="text-slate-900 font-black text-lg mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                onClick={() => onMoveToCart({ ...item, productId: item.productId || item.id })}
                                className="flex-1 h-12 rounded-full bg-primary text-white font-bold"
                            >
                                {t("shop.addToCart")}
                            </Button>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
