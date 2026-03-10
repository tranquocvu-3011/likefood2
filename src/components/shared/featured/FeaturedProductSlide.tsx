/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeaturedProductFrame from "./FeaturedProductFrame";
import type { FeaturedProduct } from "./types";

interface FeaturedProductSlideProps {
    product: FeaturedProduct;
    direction: number;
    onAddToCart: (product: FeaturedProduct) => void;
}

export default function FeaturedProductSlide({ product, direction, onAddToCart }: FeaturedProductSlideProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateY: direction > 0 ? 15 : -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotateY: direction > 0 ? -15 : 15 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 0.8
            }}
            className="w-full h-full flex flex-col items-center justify-between relative"
            style={{
                paddingTop: 'clamp(0.6rem,1.2vw,1.2rem)',
                paddingBottom: '0',
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Large Product Image with Frame */}
            <motion.div
                className="relative w-full aspect-square flex items-center justify-center"
                style={{
                    maxWidth: 'clamp(280px, 50vw, 450px)',
                    willChange: 'transform'
                }}
            >
                <FeaturedProductFrame isCenter={true}>
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-full h-full flex items-center justify-center z-10"
                        style={{ willChange: 'transform' }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                            }}
                            className="relative w-full h-full overflow-hidden shadow-xl"
                            style={{
                                borderRadius: '1.5rem',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 20px rgba(16, 185, 129, 0.05)'
                            }}
                        >
                            <Image
                                src={product.image || "/placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ willChange: 'transform' }}
                            />
                        </motion.div>
                    </motion.div>
                </FeaturedProductFrame>
            </motion.div>

            {/* Text Details */}
            <div className="w-full text-center flex-1 flex flex-col justify-center" style={{ gap: 'clamp(0.4rem,0.8vw,0.7rem)', maxWidth: 'clamp(280px, 90vw, 400px)', marginTop: 'clamp(1.5rem, 3vw, 3rem)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.25,
                        type: "spring",
                        stiffness: 150,
                        damping: 20
                    }}
                    className="space-y-4"
                >
                    <h3 className="font-black uppercase tracking-tighter text-slate-900 leading-[0.85] relative inline-block"
                        style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.75rem)', marginBottom: 'clamp(0.3rem,0.6vw,0.6rem)' }}>
                        <span className="relative z-10 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {product.name}
                        </span>
                    </h3>
                    <div>
                        <Link
                            href={`/products?category=${encodeURIComponent(product.category || "")}`}
                            className="text-slate-400 font-black uppercase tracking-[0.3em] hover:text-primary transition-all duration-300 inline-block relative group"
                            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.35rem)' }}
                        >
                            {product.colorLabel || product.category || "Premium Quality"}
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-row items-center justify-center gap-4"
                >
                    {product.basePrice && product.basePrice > product.price && (
                        <p className="text-slate-400 font-bold tracking-tighter line-through relative"
                            style={{ fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}>
                            ${product.basePrice.toFixed(2)}
                        </p>
                    )}
                    <p className="text-slate-900 font-black tracking-tighter relative"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.7rem)' }}>
                        ${product.price.toFixed(2)}
                    </p>
                </motion.div>
            </div>

            {/* Buttons */}
            <div className="w-full relative" style={{ marginTop: 'clamp(0.6rem, 1.2vw, 1.2rem)' }}>
                <div className="relative z-10 w-full mx-auto flex flex-nowrap items-center justify-center" style={{ gap: 'clamp(0.5rem, 1vw, 1rem)', paddingBottom: 'clamp(0.2rem, 0.4vw, 0.4rem)', maxWidth: 'clamp(280px, 90vw, 400px)' }}>
                    <Link href={`/products/${product.slug}`}>
                        <Button
                            variant="outline"
                            className="rounded-full border-2 border-purple-500 text-purple-600 font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 bg-white relative z-20 overflow-hidden group"
                            style={{ paddingLeft: 'clamp(1.5rem, 3vw, 4rem)', paddingRight: 'clamp(1.5rem, 3vw, 4rem)', height: 'clamp(2.5rem, 4vw, 3.8rem)', fontSize: 'clamp(0.6rem, 0.8vw, 0.9rem)' }}
                        >
                            Xem chi tiết
                        </Button>
                    </Link>
                    <Button
                        onClick={() => onAddToCart(product)}
                        className="rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30"
                        style={{ paddingLeft: 'clamp(1.5rem, 3vw, 4rem)', paddingRight: 'clamp(1.5rem, 3vw, 4rem)', height: 'clamp(2.5rem, 4vw, 3.8rem)', fontSize: 'clamp(0.6rem, 0.8vw, 0.9rem)' }}
                    >
                        Thêm vào giỏ
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
