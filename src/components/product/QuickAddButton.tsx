"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartActions } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface QuickAddButtonProps {
    product: {
        id: string;
        slug?: string;
        name: string;
        price: number;
        image?: string | null;
        inventory: number;
    };
}

export default function QuickAddButton({ product }: QuickAddButtonProps) {
    const { addItem } = useCartActions();
    const [isAdded, setIsAdded] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.inventory <= 0) return;

        addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || undefined,
        });

        setIsAdded(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.button
            onClick={handleQuickAdd}
            disabled={product.inventory <= 0}
            aria-label={isAdded ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex items-center justify-center p-2 rounded-xl
                transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group/add
                w-9 h-9
                ${product.inventory <= 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : isAdded
                        ? "bg-emerald-500 text-white shadow-emerald-500/25"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white"
                }
            `}
        >
            <AnimatePresence mode="wait">
                {isAdded ? (
                    <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        className="flex items-center justify-center"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="add"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center justify-center"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 group-hover/add:scale-110 transition-transform duration-300" />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
