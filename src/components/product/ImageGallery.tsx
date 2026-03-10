/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
    id: string;
    imageUrl: string;
    altText?: string | null;
    order: number;
    isPrimary: boolean;
}

interface ImageGalleryProps {
    images: ProductImage[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [direction, setDirection] = useState(0);

    // Touch/Swipe support
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const sortedImages = [...images].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.order - b.order;
    });

    const currentImage = sortedImages[selectedIndex];

    const handlePrevious = useCallback(() => {
        setDirection(-1);
        setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
    }, [sortedImages.length]);

    const handleNext = useCallback(() => {
        setDirection(1);
        setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
    }, [sortedImages.length]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") setIsLightboxOpen(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) handleNext();
            else handlePrevious();
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
    };

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <div
                className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-white border border-slate-100/80 shadow-lg relative group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait" custom={direction}>
                    {currentImage && (
                        <motion.div
                            key={selectedIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentImage.imageUrl}
                                alt={currentImage.altText || productName}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                priority
                                sizes="(max-width: 768px) 100vw, 420px"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center z-10">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg transform group-hover:scale-100 scale-90">
                        <ZoomIn className="w-5 h-5 text-slate-700" />
                    </div>
                </div>

                {/* Navigation Arrows - luôn hiển thị để dễ chuyển ảnh */}
                {sortedImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all z-20 border border-slate-100"
                            aria-label="Ảnh trước"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all z-20 border border-slate-100"
                            aria-label="Ảnh tiếp"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-700" />
                        </button>
                    </>
                )}

                {/* Image counter pill */}
                {sortedImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-bold z-20">
                        {selectedIndex + 1} / {sortedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip - lớn hơn, dễ nhìn và bấm */}
            {sortedImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                    {sortedImages.map((img, idx) => (
                        <button
                            key={img.id}
                            onClick={() => { setDirection(idx > selectedIndex ? 1 : -1); setSelectedIndex(idx); }}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 flex-shrink-0 ${idx === selectedIndex
                                    ? "border-emerald-500 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/30"
                                    : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                                }`}
                            aria-label={`Xem ảnh ${idx + 1}`}
                        >
                            <Image
                                src={img.imageUrl}
                                alt={img.altText || `${productName} ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsLightboxOpen(false)}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Close */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
                            className="absolute top-6 right-6 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all z-10"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        {/* Navigation */}
                        {sortedImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all z-10"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all z-10"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}

                        {/* Lightbox Image with slide animation */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={selectedIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-5xl aspect-square"
                            >
                                {currentImage && (
                                    <Image
                                        src={currentImage.imageUrl}
                                        alt={currentImage.altText || productName}
                                        fill
                                        className="object-contain"
                                        quality={100}
                                        sizes="100vw"
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Counter + Thumbnail strip */}
                        {sortedImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                {sortedImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setDirection(idx > selectedIndex ? 1 : -1); setSelectedIndex(idx); }}
                                        className={`transition-all duration-200 rounded-full ${idx === selectedIndex
                                                ? "w-8 h-2 bg-white"
                                                : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
