/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useCompare } from "@/contexts/CompareContext";
import { Product } from "@/types/product";
import { ArrowLeftRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

interface CompareButtonProps {
    product: Product;
    variant?: "default" | "compact";
}

export function CompareButton({ product, variant = "default" }: CompareButtonProps) {
    const { addToCompare, removeFromCompare, isInCompare, compareItems, maxItems } = useCompare();
    const { language } = useLanguage();

    const inCompare = isInCompare(product.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inCompare) {
            removeFromCompare(product.id);
            toast.success(language === "vi" ? "Đã xóa khỏi so sánh" : "Removed from compare");
        } else {
            if (compareItems.length >= maxItems) {
                toast.error(
                    language === "vi"
                        ? `Chỉ có thể so sánh tối đa ${maxItems} sản phẩm`
                        : `Can compare up to ${maxItems} products`
                );
                return;
            }
            addToCompare(product as import("@/contexts/CompareContext").Product);
            toast.success(language === "vi" ? "Đã thêm vào so sánh" : "Added to compare");
        }
    };

    if (variant === "compact") {
        return (
            <button
                onClick={handleClick}
                className={`p-2 rounded-lg transition-colors ${
                    inCompare
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-primary hover:text-white"
                }`}
                title={inCompare ? (language === "vi" ? "Xóa khỏi so sánh" : "Remove from compare") : (language === "vi" ? "So sánh" : "Compare")}
            >
                <ArrowLeftRight className="w-4 h-4" />
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                inCompare
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-primary hover:text-white"
            }`}
        >
            <ArrowLeftRight className="w-4 h-4" />
            {inCompare
                ? language === "vi"
                    ? "Đã thêm so sánh"
                    : "Added to compare"
                : language === "vi"
                ? "So sánh"
                : "Compare"}
        </button>
    );
}
