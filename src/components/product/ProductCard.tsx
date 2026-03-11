/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
* LIKEFOOD - Vietnamese Specialty Marketplace
* Copyright (c) 2026 LIKEFOOD Team
* Licensed under the MIT License
* https://github.com/tranquocvu-3011/likefood
*/

"use client";

import { ShoppingBag, Star, Eye, Flame, Ticket, Truck, Zap, Check, Clock, ArrowRight, Sparkles, Package, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuickViewModal from "./QuickViewModal";
import QuickAddButton from "./QuickAddButton";
import WishlistButton from "./WishlistButton";
import { useRouter } from "next/navigation";
import FlashSaleCountdown from "./FlashSaleCountdown";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/lib/i18n/context";

interface ProductCardProps {
    product: {
        id: string;
        slug?: string | null;
        name: string;
        price: number;
        category: string;
        weight?: string | null;
        rating?: number;
        ratingAvg?: number;
        ratingCount?: number;
        image?: string | null;
        description?: string | null;
        inventory: number;
        soldCount?: number;
        originalPrice?: number | null;
        isNew?: boolean;
        isHot?: boolean;
        onSale?: boolean;
        isOnSale?: boolean;
        salePrice?: number | null;
        badgeText?: string | null;
        hasVoucher?: boolean;
        hasFreeship?: boolean;
        isFlashSale?: boolean;
        saleStartAt?: Date | string | null;
        saleEndAt?: Date | string | null;
    }
    viewMode?: "grid" | "list";
}

function ProductCardComponent({ product, viewMode = "grid" }: ProductCardProps) {
    const {
        id,
        name,
        price,
        category,
        weight,
        image,
        inventory,
        isHot,
        salePrice,
        badgeText,
        soldCount = 0,
        hasVoucher,
        hasFreeship,
        originalPrice,
    } = product;

    const ratingValue = product.ratingAvg ?? product.rating ?? 0;
    const ratingCount = product.ratingCount ?? 0;
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const { lastAddedId } = useCart();
    const router = useRouter();
    const { language } = useLanguage();
    const isOnSale = product.onSale || product.isOnSale;
    const effectiveSalePrice = salePrice ?? null;

    const now = new Date();
    const isCurrentlyFlashSale = product.isFlashSale || (
        isOnSale &&
        product.saleStartAt &&
        product.saleEndAt &&
        new Date(product.saleStartAt) <= now &&
        new Date(product.saleEndAt) >= now
    );

    const currentPrice = isOnSale && effectiveSalePrice != null ? effectiveSalePrice : price;
    const basePriceForDiscount = originalPrice && originalPrice > currentPrice ? originalPrice : price;
    const hasDiscount = basePriceForDiscount > currentPrice;
    const discountPercent = hasDiscount ? Math.round(((basePriceForDiscount - currentPrice) / basePriceForDiscount) * 100) : 0;

    const formatCompactNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
        return `${num}`;
    };

    const formatPriceDisplay = (value: number | null | undefined) => {
        if (value == null) return "$0";
        const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
        return `$${rounded.toLocaleString("en-US", {
            minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    const productUrl = `/products/${product.slug || product.id}`;

    const handleMouseEnter = useCallback(() => {
        router.prefetch(productUrl);
    }, [productUrl, router]);

    const handleCardClick = () => {
        router.push(productUrl);
    };

    const soldPercentage = soldCount > 0 && inventory > 0 ? Math.min((soldCount / (soldCount + inventory)) * 100, 100) : 0;
    const isLowStock = inventory > 0 && inventory <= 10;
    const isNewProduct = product.isNew || (() => {
        const createdAt = (product as { createdAt?: string | Date }).createdAt;
        if (!createdAt) return false;
        const createdDate = new Date(createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdDate > sevenDaysAgo;
    })();

    // List view - horizontal card layout
    if (viewMode === "list") {
        return (
            <div
                data-product-id={id}
                onClick={handleCardClick}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); } }}
                tabIndex={0}
                role="article"
                aria-label={name}
                onMouseEnter={() => { handleMouseEnter(); setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
                className={`group flex gap-0 bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-100 transition-all duration-300 ${isHovered ? "shadow-[0_8px_32px_rgba(0,0,0,0.10)] -translate-y-0.5" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)]"} ${inventory <= 0 ? "opacity-80 grayscale-[0.2]" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
            >
                {/* Image */}
                <div className="relative shrink-0 w-36 sm:w-44 h-36 sm:h-44 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
                    {!imageLoaded && !imgError && <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />}
                    {image && !imgError ? (
                        <Image src={image} alt={name} fill
                            className={`object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : "scale-100"}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => { setImgError(true); setImageLoaded(true); }}
                            sizes="(max-width: 640px) 144px, 176px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white p-4">
                            <Image src="/loadtrang.png" alt="Fallback" fill className="object-cover opacity-50" sizes="100px" />
                        </div>
                    )}
                    {/* Badges in list view */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isCurrentlyFlashSale && <div className="bg-red-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-white" /><span className="text-[9px] font-black text-white">FLASH</span></div>}
                        {!isCurrentlyFlashSale && hasDiscount && <div className="bg-red-500 px-2 py-0.5 rounded-full"><span className="text-[9px] font-black text-white">-{discountPercent}%</span></div>}
                        {isNewProduct && !hasDiscount && <div className="bg-violet-500 px-2 py-0.5 rounded-full"><span className="text-[9px] font-black text-white">{language === "vi" ? "Mới" : "New"}</span></div>}
                    </div>
                    {inventory <= 0 && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="text-xs font-black text-slate-700 bg-white/90 px-3 py-1 rounded-full">{language === "vi" ? "Hết hàng" : "Out of Stock"}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                    <div className="space-y-1.5">
                        <Link href={`/products?category=${encodeURIComponent(category)}`} onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 uppercase tracking-[0.12em] px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors">
                            {category}
                        </Link>
                        <h3 className="font-bold text-sm sm:text-base leading-snug text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2">{name}</h3>
                        {weight && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{weight}</p>}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(ratingValue) ? "fill-amber-400 text-amber-400" : i < ratingValue ? "fill-amber-200 text-amber-300" : "fill-slate-100 text-slate-200"}`} />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">{ratingValue.toFixed(1)}</span>
                            {ratingCount > 0 && <span className="text-[10px] text-slate-400">({formatCompactNumber(ratingCount)})</span>}
                            <span className="text-[10px] text-slate-400 ml-1">{language === "vi" ? `${formatCompactNumber(soldCount)} đã bán` : `${formatCompactNumber(soldCount)} sold`}</span>
                        </div>
                        {isLowStock && (
                            <div className="flex items-center gap-1.5">
                                <div className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-orange-400 opacity-75" /><span className="relative rounded-full h-1.5 w-1.5 bg-orange-500" /></div>
                                <span className="text-[10px] font-bold text-orange-600">{language === "vi" ? `Chỉ còn ${inventory}` : `Only ${inventory} left`}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-2">
                        <div>
                            {hasDiscount ? (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 line-through">{formatPriceDisplay(basePriceForDiscount)}</span>
                                    <span className="text-lg font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{formatPriceDisplay(currentPrice)}</span>
                                </div>
                            ) : (
                                <span className="text-lg font-black text-slate-900">{formatPriceDisplay(currentPrice)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={handleQuickView}
                                aria-label={language === "vi" ? "Xem nhanh sản phẩm" : "Quick view product"}
                                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <WishlistButton productId={id} />
                            <QuickAddButton product={{ id, slug: product.slug || undefined, name, price: currentPrice, image: product.image, inventory }} />
                        </div>
                    </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
                </div>
            </div>
        );
    }

    return (
        <div
            data-product-id={id}
            onClick={handleCardClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); } }}
            tabIndex={0}
            role="article"
            aria-label={name}
            onMouseEnter={() => {
                handleMouseEnter();
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            className="h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-3xl"
        >
            <Card className="group bg-transparent shadow-none p-0 h-full cursor-pointer">
                <div
                    className={`relative overflow-hidden rounded-3xl bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-500 flex flex-col h-full 
                        ${isHovered ? 'shadow-[0_24px_60px_rgba(0,0,0,0.12)]' : ''}
                        ${inventory <= 0 ? "grayscale-[0.3] opacity-90" : ""}`}
                >
                    {/* Premium Card Header with Gradient Background */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-100/50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>

                        <CardContent className="p-0 relative aspect-[4/5] overflow-hidden">
                            {/* Wishlist Button - Enhanced */}
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                                <WishlistButton productId={id} />
                            </div>

                            {/* Badges Container */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-2">
                                {/* New Badge */}
                                {isNewProduct && !hasDiscount && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-purple-500/25"
                                    >
                                        <Sparkles className="w-3 h-3 text-white" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{language === "vi" ? "Mới" : "New"}</span>
                                    </motion.div>
                                )}

                                {/* Custom Badge */}
                                {badgeText && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-lg shadow-rose-500/25"
                                    >
                                        {badgeText}
                                    </motion.div>
                                )}

                                {/* Flash Sale Badge */}
                                {isCurrentlyFlashSale && product.saleEndAt && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-3 py-2 rounded-xl flex flex-col gap-1 shadow-xl shadow-red-500/30 border border-red-400/30"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                                                <Flame className="w-3 h-3" />
                                                FLASH SALE
                                            </span>
                                        </div>
                                        <FlashSaleCountdown endDate={product.saleEndAt} compact={true} />
                                    </motion.div>
                                )}

                                {/* Discount Badge */}
                                {!isCurrentlyFlashSale && hasDiscount && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-red-500/25 border border-red-400/20"
                                    >
                                        <span className="text-[11px] font-black text-white">-{discountPercent}%</span>
                                    </motion.div>
                                )}

                                {/* Hot Badge */}
                                {isHot && !hasDiscount && !badgeText && !isNewProduct && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/25"
                                    >
                                        <Zap className="w-3 h-3 text-white fill-white" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Hot</span>
                                    </motion.div>
                                )}

                                {/* Voucher & Freeship */}
                                <div className="flex flex-col gap-1.5">
                                    {hasVoucher && (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
                                        >
                                            <Ticket className="w-3 h-3 text-white" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Voucher</span>
                                        </motion.div>
                                    )}
                                    {hasFreeship && (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="bg-gradient-to-r from-sky-500 to-cyan-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-sky-500/25"
                                        >
                                            <Truck className="w-3 h-3 text-white" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Freeship</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Out of Stock Overlay */}
                            {inventory <= 0 && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-full">
                                        <span className="text-sm font-black text-white uppercase tracking-wider">{language === "vi" ? "Hết hàng" : "Out of Stock"}</span>
                                    </div>
                                </div>
                            )}

                            {/* Image Container with Effects */}
                            <div className="relative w-full h-full">
                                {/* Skeleton Loading */}
                                {!imageLoaded && !imgError && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
                                )}

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
                                    className={`w-full h-full transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
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
                                        <div className="w-full h-full flex items-center justify-center bg-white p-8">
                                            <Image src="/loadtrang.png" alt="Fallback" fill className="object-cover opacity-50 p-4" sizes="200px" />
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute bottom-4 left-4 right-4 z-20 flex gap-2"
                                        >
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={handleQuickView}
                                                aria-label={language === "vi" ? "Xem nhanh sản phẩm" : "Quick view product"}
                                                className="flex-1 h-11 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border-0 font-bold text-xs uppercase tracking-wider"
                                            >
                                                <Eye className="w-4 h-4 mr-1.5" />
                                                {language === "vi" ? "Xem nhanh" : "Quick View"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-emerald-600 shadow-lg shadow-slate-900/20 font-bold text-xs uppercase tracking-wider"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(productUrl);
                                                }}
                                            >
                                                <ArrowRight className="w-4 h-4 mr-1.5" />
                                                {language === "vi" ? "Chi tiết" : "Details"}
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sold Progress Bar (only show when on sale or hot) */}
                            {(hasDiscount || isHot) && soldCount > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-4">
                                    <div className="flex items-center justify-between text-white text-[10px] font-bold mb-1.5">
                                        <span className="flex items-center gap-1">
                                            <Package className="w-3 h-3" />
                                            {language === "vi" ? `Đã bán ${formatCompactNumber(soldCount)}` : `Sold ${formatCompactNumber(soldCount)}`}
                                        </span>
                                        <span className="opacity-80">{language === "vi" ? `Còn lại ${inventory}` : `${inventory} left`}</span>
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
                                {id === lastAddedId && image && (
                                    <motion.div
                                        initial={{
                                            opacity: 1,
                                            scale: 1,
                                            x: 0,
                                            y: 0,
                                            position: "absolute",
                                            zIndex: 100
                                        }}
                                        animate={{
                                            opacity: 0,
                                            scale: 0.2,
                                            x: 300,
                                            y: -400,
                                            rotate: 30
                                        }}
                                        transition={{ duration: 0.7, ease: "circIn" }}
                                        className="pointer-events-none w-full h-full"
                                    >
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="object-cover rounded-full shadow-2xl border-4 border-white"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </div>

                    {/* Card Footer - Enhanced */}
                    <CardFooter className="flex flex-col items-start p-4 sm:p-5 gap-3 bg-white">
                        {/* Category */}
                        <Link
                            href={`/products?category=${encodeURIComponent(category)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 uppercase tracking-[0.15em] px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
                        >
                            {category}
                            <ChevronRight className="w-3 h-3" />
                        </Link>

                        {/* Product Name & Weight */}
                        <div className="w-full text-left">
                            <h3 className="font-bold text-base sm:text-lg leading-tight text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 min-h-[2.8rem] sm:min-h-[3.2rem]">
                                {name}
                            </h3>
                            {weight && (
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{weight}</p>
                            )}
                        </div>

                        {/* Rating & Sold */}
                        <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${i < Math.floor(ratingValue)
                                                ? 'fill-amber-400 text-amber-400'
                                                : i < ratingValue
                                                    ? 'fill-amber-200 text-amber-300'
                                                    : 'fill-slate-100 text-slate-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-600">
                                    <span className="font-black text-slate-800">{ratingValue.toFixed(1)}</span>
                                    {ratingCount > 0 && <span className="ml-1 text-slate-400">({formatCompactNumber(ratingCount)})</span>}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                <ShoppingBag className="w-3 h-3" />
                                {language === "vi" ? `${formatCompactNumber(soldCount)} đã bán` : `${formatCompactNumber(soldCount)} sold`}
                            </div>
                        </div>

                        {/* Low Stock Warning */}
                        {isLowStock && inventory > 0 && (
                            <div className="w-full flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                                </div>
                                <span className="text-[11px] font-bold text-orange-600">
                                    {language === "vi" ? `Chỉ còn ${inventory} sản phẩm - Nhanh tay!` : `Only ${inventory} left - Hurry!`}
                                </span>
                            </div>
                        )}

                        {/* Price Section - Enhanced */}
                        <div className="mt-2 flex items-end justify-between w-full gap-3">
                            <div className="flex flex-col items-start gap-1">
                                {hasDiscount ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium text-slate-400 line-through">
                                                {formatPriceDisplay(basePriceForDiscount || 0)}
                                            </p>
                                            <span className="text-[10px] font-black bg-gradient-to-r from-red-500 to-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                                                -{discountPercent}%
                                            </span>
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent tracking-tight leading-none">
                                            {formatPriceDisplay(currentPrice)}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {language === "vi" ? "Giá bán" : "Price"}
                                        </span>
                                        <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 bg-clip-text text-transparent tracking-tight leading-none">
                                            {formatPriceDisplay(currentPrice)}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Quick Add Button */}
                            <QuickAddButton
                                product={{
                                    id,
                                    slug: product.slug || undefined,
                                    name: product.name,
                                    price: currentPrice,
                                    image: product.image,
                                    inventory: product.inventory
                                }}
                            />
                        </div>

                        {/* Feature Icons */}
                        <div className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span className="hidden sm:inline">{language === "vi" ? "Hàng chính hãng" : "Authentic"}</span>
                                    <span className="sm:hidden">{language === "vi" ? "Chính hãng" : "Authentic"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                <Clock className="w-3 h-3" />
                                <span className="hidden sm:inline">{language === "vi" ? "Giao nhanh 3-5 ngày" : "Fast delivery 3-5 days"}</span>
                                <span className="sm:hidden">{language === "vi" ? "Giao nhanh" : "Fast delivery"}</span>
                            </div>
                        </div>
                    </CardFooter>
                </div>
            </Card>

            <div onClick={(e) => e.stopPropagation()}>
                <QuickViewModal
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);
