"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import FeaturedProductFrame from "./FeaturedProductFrame";

interface FeaturedProductPreviewProps {
    image: string | null;
    onClick: () => void;
    side: 'left' | 'right';
}

export default function FeaturedProductPreview({ image, onClick, side }: FeaturedProductPreviewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-0"
            style={{
                width: 'clamp(250px, 35vw, 380px)',
                left: side === 'left' ? '5%' : 'auto',
                right: side === 'right' ? '5%' : 'auto'
            }}
        >
            <div className="w-full cursor-pointer opacity-100" onClick={onClick}>
                <FeaturedProductFrame>
                    {/* Product Image */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 1.5, -1.5, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: [0.4, 0, 0.6, 1]
                        }}
                        className="relative w-full h-full flex items-center justify-center z-10"
                        style={{ willChange: 'transform' }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="relative w-full h-full overflow-hidden shadow-2xl"
                            style={{
                                borderRadius: '1.5rem',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(16, 185, 129, 0.1)'
                            }}
                        >
                            <ImageWithFallback
                                src={image}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </FeaturedProductFrame>
            </div>
        </motion.div>
    );
}
