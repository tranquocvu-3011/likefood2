"use client";

/**
 * ProductCardImage — Image section with fallback, skeleton, hover zoom, badge overlay
 * Sub-component of ProductCard
 * 
 * Mobile: Hover overlay is HIDDEN (touch devices don't have real hover)
 * Desktop: Full hover effects (gradient, shine, quick actions)
 */

import Image from "next/image";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishlistButton from "./WishlistButton";
import { useLanguage } from "@/lib/i18n/context";

interface ProductCardImageProps {
    productId: string;
    name: string;
    image?: string | null;
    inventory: number;
    // Interactions
    onQuickView: (e: React.MouseEvent) => void;
    onNavigate: () => void;
    lastAddedId: string | null;
}

/**
 * Detect if the device supports hover (has a mouse/trackpad).
 * Returns false on phones/tablets → disables hover overlays.
 */
function useCanHover() {
    const [canHover, setCanHover] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
        setCanHover(mql.matches);
        const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);
    return canHover;
}

function ProductCardImageComponent({
    productId,
    name,
    image,
    inventory,
    onQuickView,
    onNavigate,
    lastAddedId,
}: ProductCardImageProps) {
    const { t } = useLanguage();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const canHover = useCanHover();

    // Only enable hover state on devices with a mouse
    const showHoverEffects = canHover && isHovered;

    return (
        <div
            className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/20"
            onMouseEnter={() => canHover && setIsHovered(true)}
            onMouseLeave={() => canHover && setIsHovered(false)}
        >
            <div className="p-0 relative aspect-[4/3] overflow-hidden">
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-20">
                    <WishlistButton productId={productId} />
                </div>

                {/* Out of Stock Overlay */}
                {inventory <= 0 && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-full">
                            <span className="text-sm font-black text-white uppercase tracking-wider">
                                {t("shop.outOfStock")}
                            </span>
                        </div>
                    </div>
                )}

                {/* Image Container */}
                <div className="relative w-full h-full">
                    {/* Skeleton */}
                    {!imageLoaded && !imgError && (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                        </div>
                    )}

                    {/* Hover Gradient Overlay — desktop only */}
                    <AnimatePresence>
                        {showHoverEffects && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent z-10 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="relative w-full h-full"
                        animate={{ scale: showHoverEffects ? 1.1 : 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {image && !imgError ? (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => { setImgError(true); setImageLoaded(true); }}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 gap-3">
                                <Package className="w-14 h-14 text-slate-300" />
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No image</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Shine Effect on Hover — desktop only */}
                    <AnimatePresence>
                        {showHoverEffects && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                        )}
                    </AnimatePresence>

                    {/* Quick Actions Overlay — desktop only */}
                    <AnimatePresence>
                        {showHoverEffects && inventory > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.22 }}
                                className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex gap-1.5"
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onQuickView}
                                    aria-label={t("shop.quickViewAria")}
                                    className="flex-1 h-8 rounded-xl bg-white/95 backdrop-blur-sm shadow-md hover:bg-white border-0 font-semibold text-[10px] uppercase tracking-wide"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {t("shop.quickView")}
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 shadow-md font-semibold text-[10px] uppercase tracking-wide"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNavigate();
                                    }}
                                >
                                    <ArrowRight className="w-3 h-3 mr-1" />
                                    {t("shop.details")}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Fly to Cart Animation */}
                <AnimatePresence>
                    {productId === lastAddedId && image && (
                        <motion.div
                            initial={{ opacity: 1, scale: 1, x: 0, y: 0, position: "absolute", zIndex: 100 }}
                            animate={{ opacity: 0, scale: 0.2, x: 300, y: -400, rotate: 30 }}
                            transition={{ duration: 0.7, ease: "circIn" }}
                            className="pointer-events-none w-full h-full"
                        >
                            <Image src={image} alt={name} fill className="object-cover rounded-full shadow-2xl border-4 border-white" sizes="200px" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default memo(ProductCardImageComponent);

