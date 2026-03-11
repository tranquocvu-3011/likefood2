"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, Grid2X2, List, ChevronDown, Flame, ShoppingCart, Heart, TrendingUp, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/lib/i18n/context";

interface FlashProduct {
    id: string;
    slug: string;
    name: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image: string | null;
    category: string;
    inventory: number;
    soldCount: number;
    badgeText: string | null;
    saleEndAt: string | null;
    isHot: boolean;
}

// sortOptions moved inside component for i18n

export default function FlashSalePage() {
    const { t, language } = useLanguage();
    const { addItem } = useCart();

    const sortOptions = [
        { value: "popular", label: t("shop.sortPopular") },
        { value: "discount", label: t("shop.sortDiscount") },
        { value: "price-asc", label: t("shop.sortPriceAscShort") },
        { value: "price-desc", label: t("shop.sortPriceDescShort") },
    ];
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [products, setProducts] = useState<FlashProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Fetch flash sale products from API
    useEffect(() => {
        const fetchFlashProducts = async () => {
            try {
                const res = await fetch('/api/products/flash-sale');
                if (!res.ok) throw new Error('Failed to fetch flash sale products');
                const data = await res.json();

                if (data.products) {
                    setProducts(data.products);
                    setCountdown(data.countdown);
                }
            } catch (error) {
                logger.error('Failed to fetch flash sale products', error as Error, { context: 'flash-sale-page' });
                toast.error(language === "vi" ? 'Không thể tải sản phẩm Flash Sale' : 'Failed to load Flash Sale products');
            } finally {
                setLoading(false);
            }
        };

        fetchFlashProducts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Countdown timer based on API response or Fallback Fake Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const calculateTimeLeft = (endTime: number) => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);

            return { hours: h, minutes: m, seconds: s };
        };

        if (countdown) {
            // Có Data thật từ API
            const endTime = new Date(countdown).getTime();

            setTimeLeft(calculateTimeLeft(endTime));
            timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(endTime));
            }, 1000);
        } else {
            // Không có Data API -> Chạy Fallback 24H LocalStorage y hệt Trang chủ
            const DURATION = 24 * 60 * 60 * 1000;
            const startFallbackTimer = () => {
                const calcFallbackTime = (endTime: number) => {
                    const now = Date.now();
                    const diff = endTime - now;

                    if (diff <= 0) {
                        const newEndTime = Date.now() + DURATION;
                        localStorage.setItem("flash_sale_end_time", newEndTime.toString());
                        return calcFallbackTime(newEndTime);
                    }

                    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const m = Math.floor((diff / 1000 / 60) % 60);
                    const s = Math.floor((diff / 1000) % 60);

                    return { hours: h, minutes: m, seconds: s };
                };

                const storedEndTime = localStorage.getItem("flash_sale_end_time");
                let endTime: number;

                if (!storedEndTime) {
                    endTime = Date.now() + DURATION;
                    localStorage.setItem("flash_sale_end_time", endTime.toString());
                } else {
                    endTime = parseInt(storedEndTime, 10);
                }

                setTimeLeft(calcFallbackTime(endTime));

                timer = setInterval(() => {
                    const currentEndTime = parseInt(localStorage.getItem("flash_sale_end_time") || "0", 10);
                    setTimeLeft(calcFallbackTime(currentEndTime));
                }, 1000);
            };

            startFallbackTimer();
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const handleAddToCart = (product: FlashProduct) => {
        if (product.inventory <= 0) {
            toast.error(language === "vi" ? "Sản phẩm đã hết hàng" : "Product is out of stock");
            return;
        }
        addItem({
            productId: product.id,
            slug: product.slug || undefined,
            name: product.name,
            price: product.salePrice,
            image: product.image || undefined,
            inventory: product.inventory,
            category: product.category || undefined,
        });
        toast.success(language === "vi" ? `Đã thêm ${product.name} vào giỏ hàng!` : `Added ${product.name} to cart!`);
    };

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "discount":
                return b.discount - a.discount;
            case "price-asc":
                return a.salePrice - b.salePrice;
            case "price-desc":
                return b.salePrice - a.salePrice;
            default:
                return b.soldCount - a.soldCount;
        }
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-50" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] invert" />

                {/* Subtle Luxury Glow Effects */}
                <div className="absolute top-0 right-[-10%] w-[50%] h-[100%] bg-gradient-to-br from-rose-300/30 via-pink-200/30 to-transparent blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-[-10%] w-[40%] h-[80%] bg-gradient-to-tr from-pink-300/20 via-rose-200/20 to-transparent blur-3xl rounded-full" />

                <div className="relative page-container-wide py-16 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-full mb-6 border border-rose-200 shadow-sm"
                        >
                            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">{language === "vi" ? "Đặc Quyền Hội Viên" : "Exclusive Offers"}</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest mb-6 text-slate-900 drop-shadow-sm leading-tight text-center">
                            FLASH <span className="text-rose-500 font-black">SALE</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 text-center">
                            {t("shop.flashSaleSubtitle")}
                        </p>

                        {/* Elegant Countdown Timer */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 bg-white/80 backdrop-blur-md border border-rose-100 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto shadow-2xl shadow-rose-100">
                            <div className="flex flex-col items-center sm:items-start gap-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-rose-500" />
                                    <span className="text-slate-800 font-bold text-base md:text-lg uppercase tracking-widest">{language === "vi" ? "Kết thúc sau" : "Ends in"}</span>
                                </div>
                                <span className="text-slate-500 text-sm font-medium">{language === "vi" ? "Không bỏ lỡ mức giá Đặc quyền" : "Don't miss out on Exclusive prices"}</span>
                            </div>

                            <div className="hidden sm:block w-px h-16 bg-rose-200 mx-4" />

                            <div className="flex items-center gap-4">
                                {[
                                    { value: timeLeft.hours, label: language === "vi" ? "Giờ" : "Hrs" },
                                    { value: timeLeft.minutes, label: language === "vi" ? "Phút" : "Min" },
                                    { value: timeLeft.seconds, label: language === "vi" ? "Giây" : "Sec" },
                                ].map((time, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-widest tabular-nums">
                                                {String(time.value).padStart(2, "0")}
                                            </span>
                                            <span className="text-xs md:text-sm font-bold text-rose-500 uppercase tracking-widest mt-2">{time.label}</span>
                                        </div>
                                        {i < 2 && <span className="text-4xl font-black text-rose-200 -mt-6">:</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section className="page-container-wide py-12 -mt-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8 bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span className="font-bold">{products.length} {t("shop.productsCount")} {language === "vi" ? "đang giảm giá" : "on sale"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <div className="relative hidden sm:block">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 bg-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* View Mode */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-2xl transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
                            >
                                <Grid2X2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-2xl transition-all ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">{language === "vi" ? "Đang tải sản phẩm Flash Sale..." : "Loading Flash Sale products..."}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100">
                        <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">{language === "vi" ? "Chưa có sản phẩm Flash Sale" : "No Flash Sale products yet"}</h3>
                        <p className="text-slate-500 mb-6">
                            {language === "vi" ? "Hãy quay lại sau để xem các ưu đãi sốc nhất!" : "Come back later for the best deals!"}
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold"
                        >
                            {language === "vi" ? "Xem tất cả sản phẩm" : "View all products"}
                        </Link>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className={viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }>
                        {sortedProducts.map((product, index) => {
                            const totalStock = product.inventory + product.soldCount;
                            const soldPercent = totalStock > 0 ? (product.soldCount / totalStock) * 100 : 0;
                            const isAlmostSoldOut = soldPercent >= 80 || product.inventory <= 5;

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex" : ""
                                        }`}
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className={viewMode === "list" ? "w-56 flex-shrink-0" : "block"}
                                    >
                                        <div className={`relative bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden ${viewMode === "list" ? "h-full" : "aspect-square"
                                            }`}>
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-4xl mb-2">🔥</div>
                                                        <span className="text-sm font-bold text-slate-300">{product.category}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Luxury Badge */}
                                            <div className="absolute top-4 left-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-none border border-amber-400/30">
                                                -{product.discount}% OFF
                                            </div>

                                            {/* Hot Badge */}
                                            {product.isHot && (
                                                <div className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Flame className="w-5 h-5 text-white" />
                                                </div>
                                            )}

                                            {/* Badge Text */}
                                            {product.badgeText && !product.isHot && (
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-black rounded-full shadow-lg">
                                                    {product.badgeText}
                                                </div>
                                            )}

                                            {/* Wishlist Button */}
                                            <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                                                <Heart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>

                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Price */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-2xl font-black text-red-500">${product.salePrice.toFixed(2)}</span>
                                                <span className="text-sm font-medium text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                            </div>

                                            {/* Stock Progress */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                                    <span className={isAlmostSoldOut ? "text-red-500" : "text-slate-500"}>
                                                        {isAlmostSoldOut && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                                                        {t("shop.remaining")} {product.inventory} {t("shop.productsCount")}
                                                    </span>
                                                    <span className={isAlmostSoldOut ? "text-red-500" : "text-amber-600"}>
                                                        {Math.round(soldPercent)}% {t("shop.sold")}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${soldPercent}%` }}
                                                        transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                                                        className={`h-full rounded-full ${isAlmostSoldOut
                                                            ? "bg-red-500"
                                                            : "bg-amber-500"
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add to Cart */}
                                        <motion.button
                                            onClick={() => handleAddToCart(product)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={product.inventory <= 0}
                                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-none font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {product.inventory > 0 ? t("shop.addToCart") : t("shop.outOfStock")}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* View All Products */}
                <div className="text-center mt-12">
                    <Link
                        href="/products?sale=true"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        {language === "vi" ? "Xem tất cả sản phẩm khuyến mãi" : "View all promotional products"}
                    </Link>
                </div>
            </section>
        </div>
    );
}
