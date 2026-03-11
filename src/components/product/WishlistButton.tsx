"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";

interface WishlistButtonProps {
    productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const inWishlist = isInWishlist(productId);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
    };

    return (
        <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Heart
                className={`w-5 h-5 transition-colors ${inWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600 hover:text-red-500"
                    }`}
            />
        </motion.button>
    );
}
