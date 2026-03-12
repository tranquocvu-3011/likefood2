"use client";

/**
 * ProductCardImage — Image section with fallback, skeleton, hover zoom, badge overlay
 * Sub-component of ProductCard
 */

import Image from "next/image";
import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, Flame, Sparkles, Zap, Ticket, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WishlistButton from "./WishlistButton";
import FlashSaleCountdown from "./FlashSaleCountdown";
import { useLanguage } from "@/lib/i18n/context";

interface ProductCardImageProps {
    productId: string;
    name: string;
    image?: string | null;
    inventory: number;
    // Badges
    isNewProduct: boolean;
    isHot?: boolean;
    isCurrentlyFlashSale: boolean;
    hasDiscount: boolean;
    discountPercent: number;
    badgeText?: string | null;
    hasVoucher?: boolean;
    hasFreeship?: boolean;
    saleEndAt?: Date | string | null;
    // Sale progress
    soldCount: number;
    soldPercentage: number;
    // Interactions
    productUrl: string;
    onQuickView: (e: React.MouseEvent) => void;
    onNavigate: () => void;
    lastAddedId: string | null;
}

function ProductCardImageComponent({
    productId,
    name,
    image,
    inventory,
    isNewProduct,
    isHot,
    isCurrentlyFlashSale,
    hasDiscount,
    discountPercent,
    badgeText,
    hasVoucher,
    hasFreeship,
    saleEndAt,
    soldCount,
    soldPercentage,
    productUrl,
    onQuickView,
    onNavigate,
    lastAddedId,
}: ProductCardImageProps) {
    const { t } = useLanguage();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const formatCompactNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
        return `${num}`;
    };

    return (
        <div
            className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-0 relative aspect-[4/3] overflow-hidden">
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-20">
                    <WishlistButton productId={productId} />
                </div>

                {/* Badges Container */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    {/* New Badge */}
                    {isNewProduct && !hasDiscount && (
                        <Badge variant="new" className="px-2 py-0.5 text-[9px]">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t("shop.new")}
                        </Badge>
                    )}

                    {/* Custom Badge */}
                    {badgeText && (
                        <Badge variant="sale" className="px-2 py-0.5 text-[9px] bg-gradient-to-r from-rose-500 to-pink-500">
                            {badgeText}
                        </Badge>
                    )}

                    {/* Flash Sale Badge */}
                    {isCurrentlyFlashSale && saleEndAt && (
                        <div className="bg-red-600 px-2 py-1 rounded-lg flex flex-col gap-0.5 shadow-md">
                            <span className="text-[9px] font-black text-white uppercase flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" />
                                FLASH
                            </span>
                            <FlashSaleCountdown endDate={saleEndAt} compact={true} />
                        </div>
                    )}

                    {/* Discount Badge */}
                    {!isCurrentlyFlashSale && hasDiscount && (
                        <Badge variant="sale" className="px-2 py-0.5 text-[9px]">
                            -{discountPercent}%
                        </Badge>
                    )}

                    {/* Hot Badge */}
                    {isHot && !hasDiscount && !badgeText && !isNewProduct && (
                        <Badge variant="sale" className="px-2 py-0.5 text-[9px] bg-gradient-to-r from-orange-500 to-red-500">
                            <Zap className="w-2.5 h-2.5 fill-white" />
                            {t("shop.hot")}
                        </Badge>
                    )}

                    {/* Voucher & Freeship */}
                    {(hasVoucher || hasFreeship) && (
                        <div className="flex flex-col gap-1">
                            {hasVoucher && (
                                <Badge variant="sale" className="px-2 py-0.5 text-[9px] bg-amber-500">
                                    <Ticket className="w-2.5 h-2.5" />
                                    {t("shop.voucher")}
                                </Badge>
                            )}
                            {hasFreeship && (
                                <Badge variant="info" className="px-2 py-0.5 text-[9px] bg-sky-500">
                                    <Truck className="w-2.5 h-2.5" />
                                    {t("shop.freeship")}
                                </Badge>
                            )}
                        </div>
                    )}
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

                    {/* Hover Gradient Overlay */}
                    <AnimatePresence>
                        {isHovered && (
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
                        animate={{ scale: isHovered ? 1.1 : 1 }}
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

                    {/* Shine Effect on Hover */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                        )}
                    </AnimatePresence>

                    {/* Quick Actions Overlay */}
                    <AnimatePresence>
                        {isHovered && inventory > 0 && (
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

                {/* Sold Progress Bar */}
                {(hasDiscount || isHot) && soldCount > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-4">
                        <div className="flex items-center justify-between text-white text-[10px] font-bold mb-1.5">
                            <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {t("shop.soldCount")} {formatCompactNumber(soldCount)}
                            </span>
                            <span className="opacity-80">{t("shop.leftCount")} {inventory}</span>
                        </div>
                        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${soldPercentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                            />
                        </div>
                    </div>
                )}

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
