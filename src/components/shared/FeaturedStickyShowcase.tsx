"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Sub-components
import FeaturedHeader from "./featured/FeaturedHeader";
import FeaturedProductSlide from "./featured/FeaturedProductSlide";
import FeaturedProductPreview from "./featured/FeaturedProductPreview";
import type { FeaturedProduct } from "./featured/types";

interface FeaturedStickyShowcaseProps {
    products: FeaturedProduct[];
}

export default function FeaturedStickyShowcase({ products: initialProducts }: FeaturedStickyShowcaseProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { addItem } = useCart();
    const [direction, setDirection] = useState(0);
    const [, setCursorDirection] = useState<'left' | 'right' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAddToCart = (product: FeaturedProduct) => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image || undefined,
        });
        toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextStep = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % initialProducts.length);
    }, [initialProducts.length]);

    const prevStep = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + initialProducts.length) % initialProducts.length);
    }, [initialProducts.length]);

    // Track mouse position ONLY in specific section
    useEffect(() => {
        if (isMobile) return;

        const section = containerRef.current?.closest('section');
        if (!section) return;

        const leftArrowSVG = `data:image/svg+xml;charset=utf8,${encodeURIComponent('<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M22 24L32 14M22 24L32 34" stroke="rgba(0,0,0,0.15)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="translate(0, 2)"/><path d="M22 24L32 14M22 24L32 34" stroke="#0f172a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>')}`;
        const rightArrowSVG = `data:image/svg+xml;charset=utf8,${encodeURIComponent('<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M26 24L16 14M26 24L16 34" stroke="rgba(0,0,0,0.15)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="translate(0, 2)"/><path d="M26 24L16 14M26 24L16 34" stroke="#0f172a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>')}`;

        const isMouseInSection = (e: MouseEvent): boolean => {
            const rect = section.getBoundingClientRect();
            return (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMouseInSection(e)) {
                document.body.style.cursor = 'default';
                setCursorDirection(null);
                return;
            }

            const middlePoint = window.innerWidth / 2;
            if (e.clientX < middlePoint) {
                setCursorDirection('left');
                document.body.style.cursor = `url("${leftArrowSVG}") 24 24, auto`;
            } else {
                setCursorDirection('right');
                document.body.style.cursor = `url("${rightArrowSVG}") 24 24, auto`;
            }
        };

        const handleMouseLeave = () => {
            document.body.style.cursor = 'default';
            setCursorDirection(null);
        };

        const handleClick = (e: MouseEvent) => {
            if (!isMouseInSection(e)) return;
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' ||
                target.closest('button') || target.closest('a') ||
                target.closest('[role="button"]')) {
                return;
            }

            const middlePoint = window.innerWidth / 2;
            if (e.clientX < middlePoint) {
                prevStep();
            } else {
                nextStep();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.addEventListener('mousemove', handleMouseMove);
                    section.addEventListener('mouseleave', handleMouseLeave);
                    section.addEventListener('click', handleClick);
                } else {
                    section.removeEventListener('mousemove', handleMouseMove);
                    section.removeEventListener('mouseleave', handleMouseLeave);
                    section.removeEventListener('click', handleClick);
                    document.body.style.cursor = 'default';
                    setCursorDirection(null);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(section);

        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
            section.removeEventListener('mouseleave', handleMouseLeave);
            section.removeEventListener('click', handleClick);
            document.body.style.cursor = 'default';
            observer.disconnect();
        };
    }, [isMobile, prevStep, nextStep]);

    if (initialProducts.length === 0) return null;

    const prevIndex = (currentIndex - 1 + initialProducts.length) % initialProducts.length;
    const nextIndex = (currentIndex + 1) % initialProducts.length;

    return (
        <section
            ref={containerRef}
            className="relative bg-gradient-to-br from-[#f4f1ea] via-[#f9f7f4] to-[#f4f1ea] w-screen lg:min-h-screen flex flex-col overflow-hidden"
        >
            {/* Animated Background Pattern - Optimized */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div
                    className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:48px_48px]"
                    style={{ backgroundPosition: '0 0' }}
                />
            </div>

            {/* Gradient Orbs - Optimized Perf */}
            <motion.div
                className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none z-0"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: 'transform, opacity' }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none z-0"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ willChange: 'transform, opacity' }}
            />

            <div className="relative z-10 w-full mx-auto flex flex-col h-full" style={{
                paddingTop: 'clamp(1rem, 2vw, 2rem)',
                paddingBottom: 'clamp(1rem, 2vw, 2rem)',
                paddingLeft: 'clamp(0.5rem, 1.5vw, 1.5rem)',
                paddingRight: 'clamp(0.5rem, 1.5vw, 1.5rem)',
                maxWidth: '100%'
            }}>
                <FeaturedHeader />

                <div className="relative flex flex-1 items-center" style={{ minHeight: 'clamp(300px,45vh,480px)' }}>
                    {/* Previews */}
                    <FeaturedProductPreview
                        side="left"
                        image={initialProducts[prevIndex].image || null}
                        onClick={prevStep}
                    />

                    <FeaturedProductPreview
                        side="right"
                        image={initialProducts[nextIndex].image || null}
                        onClick={nextStep}
                    />

                    {/* Active Content */}
                    <div className="w-full h-full flex relative px-0">
                        <div className="w-full lg:max-w-[60%] mx-auto">
                            <AnimatePresence mode="wait" custom={direction}>
                                <FeaturedProductSlide
                                    key={currentIndex}
                                    product={initialProducts[currentIndex]}
                                    direction={direction}
                                    onAddToCart={handleAddToCart}
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
