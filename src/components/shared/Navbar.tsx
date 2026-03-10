/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search, Menu, X, ChevronDown, Heart, Phone, Sparkles, Headphones, Mic, Home, Flame, Settings, FileText, ShoppingBag, Scale, Info, HelpCircle, Gift } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import MiniCart from "@/components/cart/MiniCart";
import MegaMenu from "@/components/navbar/MegaMenu";
import UserDropdown from "@/components/navbar/UserDropdown";
import LanguageToggle from "@/components/navbar/LanguageToggle";
import { useLanguage } from "@/lib/i18n/context";
import { logger } from "@/lib/logger";

type NavItem = {
    label: string;
    href: string;
    icon?: string;
    highlight?: boolean;
};

function NavbarContent() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Array<{
        id: string;
        name: string;
        slug?: string;
        category?: string;
        price?: number;
        image?: string;
    }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingHints, setIsLoadingHints] = useState(false);
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [supportPhone, setSupportPhone] = useState<string | null>(null);
    const [navLinks, setNavLinks] = useState<NavItem[] | null>(null);
    const [trendingKeywords] = useState(["Cá lóc khô", "Tôm khô", "Xoài sấy", "Nước mắm"]);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const { totalItems, lastAddedId } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load thông tin liên hệ & menu public từ settings (SQL)
    useEffect(() => {
        const loadSiteConfig = async () => {
            try {
                const res = await fetch("/api/public/settings");
                if (!res.ok) return;
                const data = await res.json();
                if (data.SITE_SUPPORT_PHONE) {
                    setSupportPhone(data.SITE_SUPPORT_PHONE);
                }

                if (data.NAV_PRIMARY_LINKS) {
                    try {
                        const parsed = JSON.parse(data.NAV_PRIMARY_LINKS) as NavItem[];
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setNavLinks(parsed);
                        }
                    } catch {
                        // ignore invalid JSON, fallback to default links
                    }
                }
            } catch {
                // ignore
            }
        };
        loadSiteConfig();
    }, []);

    // Fetch wishlist count when session changes
    useEffect(() => {
        if (session?.user) {
            fetchWishlistCount();
        } else {
            setWishlistCount(0);
        }
    }, [session]);

    const fetchWishlistCount = async () => {
        try {
            const res = await fetch("/api/user/wishlist");
            if (res.ok) {
                const data = await res.json();
                setWishlistCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (error) {
            logger.warn("Failed to fetch wishlist", { context: 'navbar', error: error as Error });
        }
    };

    // Scroll effect: hysteresis + hide-on-scroll-down for full navbar
    useEffect(() => {
        const ENTER_COMPACT = 120; // scrollY > 120 => thu nhỏ navbar
        const EXIT_COMPACT = 40;   // scrollY < 40  => mở rộng lại (chỉ gần sát đầu trang)
        const HIDE_THRESHOLD = 40; // bắt đầu cho phép ẩn khi đã rời xa top một chút
        const DIR_EPS = 8;         // ngưỡng để nhận biết cuộn lên/xuống rõ rệt

        let lastY = window.scrollY || 0;

        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastY;
            lastY = currentY;

            // Thu nhỏ / mở rộng navbar dựa trên vị trí tuyệt đối (hysteresis)
            setIsScrolled((prev) => {
                if (!prev && currentY > ENTER_COMPACT) return true;
                if (prev && currentY < EXIT_COMPACT) return false;
                return prev;
            });

            // Ẩn / hiện navbar dựa trên hướng cuộn
            setIsHidden((prev) => {
                // Luôn hiện khi rất gần đầu trang
                if (currentY < EXIT_COMPACT) return false;

                // Cuộn xuống đủ mạnh
                if (delta > DIR_EPS && currentY > HIDE_THRESHOLD) {
                    return true;
                }

                // Cuộn lên đủ mạnh -> hiện lại
                if (delta < -DIR_EPS) {
                    return false;
                }

                return prev;
            });
        };

        // Khởi tạo trạng thái theo vị trí hiện tại (F5 giữa trang...)
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) setSearchQuery(query);
    }, [searchParams]);

    // Autocomplete Logic
    useEffect(() => {
        const fetchHints = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }
            setIsLoadingHints(true);
            try {
                const res = await fetch(`/api/products/search-hints?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.hints || []);
                }
            } catch (error) {
                logger.warn("Autocomplete error", { context: 'navbar', error: error as Error });
            } finally {
                setIsLoadingHints(false);
            }
        };

        const timer = setTimeout(() => {
            if (showSuggestions) fetchHints();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, showSuggestions]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <motion.nav
                className={`sticky top-0 z-[100] transition-all duration-500 ease-in-out will-change-transform ${isScrolled
                    ? "bg-gradient-to-br from-cyan-50/95 via-sky-50/95 to-cyan-100/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
                    : "bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100"
                    }`}
                initial={{ y: 0 }}
                animate={{ y: isHidden ? -120 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Skip to Content Link for Accessibility */}
                <a href="#main-content" className="skip-to-content">
                    Skip to main content
                </a>

                {/* ========== TOP UTILITY BAR ========== */}
                <AnimatePresence mode="wait">
                    {!isScrolled && (
                        <motion.div
                            key="top-bar"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 text-white overflow-hidden"
                        >
                            <div className="w-full px-4 sm:px-6 lg:px-[6%]">
                                <div className="flex h-10 items-center justify-between text-[11px]">
                                    {/* Left: Quick Links */}
                                    <div className="flex items-center gap-6">

                                        <a
                                            href={supportPhone ? `tel:${supportPhone.replace(/[^0-9+]/g, "")}` : "tel:0869226687"}
                                            className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span className="font-bold hidden sm:inline">
                                                {supportPhone || "0869.226.687"}
                                            </span>
                                        </a>
                                        <Link href="/contact" className="hidden lg:flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                                            <Headphones className="w-3.5 h-3.5" />
                                            <span className="font-medium">{t("common.support")}</span>
                                        </Link>
                                    </div>

                                    {/* Center: Flash Promo (Hidden on mobile) */}
                                    <div className="hidden lg:flex items-center gap-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-yellow-400"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </motion.div>
                                        <Link href="/products?sale=true" className="font-bold text-yellow-300 hover:text-yellow-200 transition-colors">
                                            🔥 {t("navbar.flashSalePromo")}
                                        </Link>
                                    </div>

                                    {/* Right: Auth & Utils */}
                                    <div className="flex items-center gap-4">
                                        <LanguageToggle />
                                        {session ? (
                                            <span className="font-medium text-slate-300">
                                                {t("navbar.hello")} , <span className="text-white font-bold">{session.user.name}</span>
                                            </span>
                                        ) : (
                                            <>
                                                <Link href="/login" className="font-bold hover:text-primary transition-colors">{t("common.login")}</Link>
                                                <Link href="/register" className="font-bold hover:text-primary transition-colors hidden sm:inline">{t("navbar.register")}</Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ========== MAIN HEADER ========== */}
                <div className={`w-full px-4 sm:px-6 lg:px-[6%] border-b border-slate-100/50 transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}>
                    <div className="flex items-center justify-between gap-4 lg:gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <motion.img
                                src="/logo.png"
                                alt="LIKEFOOD"
                                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? "h-6 xs:h-7 sm:h-8" : "h-7 xs:h-9 sm:h-10"}`}
                                whileHover={{ scale: 1.03 }}
                            />
                        </Link>

                        {/* Mobile Search Bar Component (Shopee style) - Visible on mobile/tablet */}
                        <div className="flex-1 md:hidden max-w-[65%] xs:max-w-none ml-1">
                            <motion.button
                                onClick={() => {
                                    setIsOpen(true);
                                    setTimeout(() => searchInputRef.current?.focus(), 150);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-100/80 border border-slate-200/50 rounded-2xl text-slate-400 shadow-inner"
                                whileTap={{ scale: 0.98 }}
                            >
                                <Search className="w-4 h-4 text-primary" />
                                <span className="text-[12px] font-bold truncate">{t("common.searchPlaceholder")}</span>
                            </motion.button>
                        </div>

                        {/* Category Button - Desktop */}
                        <div className="hidden lg:block">
                            <motion.button
                                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 text-[12px] font-black uppercase tracking-wider rounded-2xl transition-all border ${isMegaMenuOpen
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-slate-50 text-slate-700 border-slate-200/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                                }`}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Menu className="w-4 h-4" />
                                <span>{t("navbar.categoryBtn")}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                            </motion.button>
                        </div>

                        {/* ========== SEARCH BAR ========== */}
                        <div className="hidden md:flex flex-1 max-w-2xl relative">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 flex items-center gap-2 text-slate-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={t("common.search")}
                                        value={searchQuery}
                                        onFocus={() => setShowSuggestions(true)}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-full text-[13px] font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <div className="absolute right-2 flex items-center gap-1">
                                        <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors" title="Tìm bằng giọng nói">
                                            <Mic className="w-4 h-4" />
                                        </button>
                                        <motion.button
                                            type="submit"
                                            className="px-5 py-2 bg-primary text-white rounded-full font-black text-[11px] uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Search className="w-3.5 h-3.5" />
                                            <span className="hidden xl:inline">{t("common.search")}</span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* ========== SEARCH DROPDOWN ========== */}
                                <AnimatePresence>
                                    {showSuggestions && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                            className="absolute top-full left-0 right-0 mt-3 bg-white/98 backdrop-blur-2xl border border-slate-100 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.15)] overflow-hidden z-[60]"
                                        >
                                            {searchQuery.length < 2 ? (
                                                /* Trending Keywords */
                                                    <div className="p-5">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Sparkles className="w-4 h-4 text-primary" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t("common.popularSearches")}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {trendingKeywords.map((kw) => (
                                                            <button
                                                                key={kw}
                                                                onClick={() => {
                                                                    setSearchQuery(kw);
                                                                    router.push(`/products?search=${encodeURIComponent(kw)}`);
                                                                    setShowSuggestions(false);
                                                                }}
                                                                className="px-4 py-2.5 bg-slate-50 hover:bg-primary/10 text-slate-600 hover:text-primary rounded-2xl text-[12px] font-bold transition-all"
                                                            >
                                                                🔥 {kw}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : isLoadingHints ? (
                                                <div className="p-8 flex flex-col items-center justify-center gap-3">
                                                    <div className="w-8 h-8 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t("common.searching")}</span>
                                                </div>
                                            ) : suggestions.length > 0 ? (
                                                <div className="py-2">
                                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                                                        <span>{t("common.suggestionsFor")} &quot;{searchQuery}&quot;</span>
                                                        <div className="h-px flex-1 bg-slate-100 ml-4" />
                                                    </div>
                                                    <div className="px-2 max-h-[300px] overflow-y-auto">
                                                        {suggestions.map((item) => (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => {
                                                                    router.push(`/products/${item.slug || item.id}`);
                                                                    setShowSuggestions(false);
                                                                }}
                                                                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-primary/5 rounded-2xl transition-all text-left group"
                                                            >
                                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/50 relative">
                                                                    {item.image ? (
                                                                        <Image
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            fill
                                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                            sizes="56px"
                                                                        />
                                                                    ) : (
                                                                        <ShoppingCart className="w-5 h-5 text-slate-300" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.name}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className="text-[11px] font-medium text-slate-400">{item.category}</span>
                                                                        <span className="text-slate-200">•</span>
                                                                        <span className="text-[12px] font-black text-primary">${item.price?.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-300 opacity-0 group-hover:opacity-100 transition-all mr-2" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="p-3 border-t border-slate-100">
                                                        <Link
                                                            href={`/products?search=${encodeURIComponent(searchQuery)}`}
                                                            onClick={() => setShowSuggestions(false)}
                                                            className="block px-4 py-3.5 text-[11px] font-black text-white bg-slate-900 hover:bg-primary rounded-2xl text-center shadow-lg transition-all uppercase tracking-widest"
                                                        >
                                                            {t("common.viewAllResults")} &quot;{searchQuery}&quot;
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-10 text-center flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                        <Search className="w-8 h-8 text-slate-200" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-black text-slate-900">{t("common.noProductFound")}</p>
                                                        <p className="text-[11px] font-medium text-slate-400 mt-1">{t("common.tryOtherKeyword")}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {showSuggestions && (
                                    <div className="fixed inset-0 z-[45]" onClick={() => setShowSuggestions(false)} />
                                )}
                            </form>
                        </div>

                        {/* ========== ACTION ICONS (Refined for Mobile) ========== */}
                        <div className="flex items-center gap-1.5 xs:gap-2">
                            {/* Wishlist - Hidden on small mobile to save space */}
                            <Link href="/profile/wishlist" className="hidden sm:flex">
                                <motion.div
                                    whileHover={{
                                        y: -4,
                                        backgroundColor: "rgba(244, 63, 94, 0.05)",
                                        borderColor: "rgba(244, 63, 94, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-slate-50/50 hover:bg-white border border-transparent rounded-2xl transition-all group relative"
                                >
                                    <Heart className="w-5 h-5 text-slate-600 group-hover:text-rose-500 transition-colors" />
                                    {isMounted && wishlistCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                                        >
                                            {wishlistCount}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Cart */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setIsMiniCartOpen(!isMiniCartOpen)}
                                    animate={lastAddedId ? {
                                        x: [0, -4, 4, -4, 4, 0],
                                        scale: [1, 1.1, 1],
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                    whileHover={{
                                        y: -4,
                                        backgroundColor: "rgba(16, 185, 129, 0.05)",
                                        borderColor: "rgba(16, 185, 129, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-slate-50/50 hover:bg-white border border-transparent rounded-2xl transition-all group relative"
                                >
                                    <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                                    {isMounted && totalItems > 0 && (
                                        <motion.span
                                            className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black w-5.5 h-5.5 flex items-center justify-center rounded-full border-2 border-white shadow-xl"
                                            initial={{ scale: 0, y: 10 }}
                                            animate={{ scale: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                            key={totalItems} // Trigger re-animation on count change
                                        >
                                            {totalItems > 99 ? "99+" : totalItems}
                                        </motion.span>
                                    )}
                                </motion.button>
                                <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
                            </div>

                            {/* User Avatar - Desktop only, Mobile uses Drawer */}
                            {session && (
                                <div className="hidden lg:block relative">
                                    <motion.button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="relative w-10 h-10 bg-slate-50 hover:bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all"
                                        whileHover={{ y: -2 }}
                                    >
                                        {session.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt="Avatar"
                                                fill
                                                className="object-cover rounded-2xl"
                                                sizes="40px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                    </motion.button>
                                    <UserDropdown
                                        isOpen={isUserMenuOpen}
                                        onClose={() => setIsUserMenuOpen(false)}
                                        user={session.user}
                                    />
                                </div>
                            )}

                            {/* Mobile Menu Toggle (Glassmorphism style) */}
                            <motion.button
                                className={`lg:hidden p-2.5 rounded-2xl transition-all shadow-lg ${isOpen
                                    ? "bg-primary text-white shadow-primary/20"
                                    : "bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200/50 shadow-slate-900/5"}`}
                                onClick={() => setIsOpen(!isOpen)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isOpen ? <X key="x" className="w-5 h-5" /> : <Menu key="m" className="w-5 h-5" />}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ========== QUICK NAV ROW ========== */}
                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="border-b border-sky-100/80 overflow-hidden hidden lg:block bg-gradient-to-r from-sky-50/70 via-white/90 to-cyan-50/70"
                        >
                            <div className="w-full px-4 sm:px-6 lg:px-[6%]">
                                {navLinks ? (
                                    /* Admin override — use custom links from DB */
                                    <div className="flex items-center justify-center gap-1 py-1.5">
                                        {navLinks.map((item) => (
                                            <Link key={item.href} href={item.href} className={`px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center gap-1.5 ${item.highlight ? "text-red-500 hover:bg-red-50" : "text-slate-600 hover:text-primary hover:bg-primary/5"}`}>
                                                {item.icon && <span>{item.icon}</span>}
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                /* Default beautiful nav */
                                <div className="flex items-center justify-center gap-0.5 py-1.5">

                                    {/* Home */}
                                    <Link href="/" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("common.home")}</span>
                                    </Link>

                                    {/* Products */}
                                    <Link href="/products" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("common.products")}</span>
                                    </Link>

                                    {/* About */}
                                    <Link href="/about" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <Info className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("common.about")}</span>
                                    </Link>

                                    {/* Divider */}
                                    <div className="w-px h-4 bg-slate-200/80 mx-1" />

                                    {/* Flash Sale — highlighted pill */}
                                    <Link href="/flash-sale" className="relative flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl shadow-sm shadow-red-200 hover:shadow-md hover:shadow-red-200 hover:from-red-600 hover:to-rose-600 transition-all group">
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>Flash Sale</span>
                                    </Link>

                                    {/* Voucher */}
                                    <Link href="/vouchers" className="relative flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all group">
                                        <Gift className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("navbar.voucher")}</span>
                                        <span className="text-[8px] font-black px-1 py-0.5 bg-emerald-500 text-white rounded-full leading-none group-hover:bg-white group-hover:text-emerald-600 transition-colors">HOT</span>
                                    </Link>

                                    {/* Compare */}
                                    <Link href="/compare" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <Scale className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>So sánh</span>
                                    </Link>

                                    {/* Divider */}
                                    <div className="w-px h-4 bg-slate-200/80 mx-1" />

                                    {/* Posts */}
                                    <Link href="/posts" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("navbar.posts")}</span>
                                    </Link>

                                    {/* FAQ */}
                                    <Link href="/faq" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <HelpCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>FAQ</span>
                                    </Link>

                                    {/* Contact */}
                                    <Link href="/contact" className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                        <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span>{t("common.contact")}</span>
                                    </Link>

                                </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MegaMenu — positioned relative to full nav bottom */}
                <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

            </motion.nav >

            {/* ========== MOBILE MENU DRAWER (Moved outside for fixed positioning) ========== */}
            <AnimatePresence>
                {
                    isOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] lg:hidden"
                            />

                            {/* Drawer Content */}
                            <motion.div
                                className="lg:hidden fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[160] overflow-y-auto shadow-2xl"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {/* Mobile Menu Header */}
                                <div className="sticky top-0 bg-white/95 backdrop-blur-xl px-5 py-4 flex items-center justify-between border-b border-slate-100 z-10">
                                    <Link href="/" onClick={() => setIsOpen(false)}>
                                        <motion.img
                                            src="/logo.png"
                                            alt="Logo"
                                            className="h-7 xs:h-8 sm:h-9 w-auto"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        />
                                    </Link>
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-5 h-5 text-slate-800" />
                                    </motion.button>
                                </div>

                                <div className="p-5 space-y-8 pb-32">
                                    {/* Mobile Search - Prominent in Drawer */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <form onSubmit={handleSearch} className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-primary">
                                                <Search className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder={t("common.searchProducts")}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm"
                                            />
                                        </form>
                                    </motion.div>

                                    {/* Popular Categories Grid - Refined */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("navbar.featuredCategories")}</h3>
                                            <Link href="/products" className="text-[10px] font-bold text-primary" onClick={() => setIsOpen(false)}>{t("common.viewAll")}</Link>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { name: t("navbar.driedFish"), icon: "🐟", color: "bg-blue-50", href: "/products?category=Cá khô" },
                                                { name: t("navbar.shrimpSquid"), icon: "🦐", color: "bg-rose-50", href: "/products?category=Tôm & Mực khô" },
                                                { name: t("navbar.fruits"), icon: "🥭", color: "bg-emerald-50", href: "/products?category=Trái cây sấy" },
                                                { name: t("navbar.spices"), icon: "🌶️", color: "bg-orange-50", href: "/products?category=Gia vị Việt" },
                                            ].map((cat, idx) => (
                                                <motion.div
                                                    key={cat.name}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 + idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={cat.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex flex-col items-center gap-2 group"
                                                    >
                                                        <div className={`w-full aspect-square flex items-center justify-center rounded-2xl ${cat.color} border border-transparent group-hover:border-primary/20 transition-all shadow-sm`}>
                                                            <span className="text-xl">{cat.icon}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-600 line-clamp-1">{cat.name}</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick Links with Icons */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">{t("navbar.discover")}</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { label: t("common.home"), href: "/", icon: <Home className="w-5 h-5" /> },
                                                { label: t("common.flashSale"), href: "/products?sale=true", icon: <Flame className="w-5 h-5 text-red-500" />, highlight: true },
                                                { label: t("navbar.orderHistory"), href: "/profile/orders", icon: <ShoppingCart className="w-5 h-5" /> },
                                                { label: t("navbar.wishlist"), href: "/profile/wishlist", icon: <Heart className="w-5 h-5 text-rose-500" /> },
                                                { label: t("navbar.posts"), href: "/posts", icon: <FileText className="w-5 h-5 text-emerald-500" /> },
                                                { label: t("navbar.supportCenter"), href: "/contact", icon: <Phone className="w-5 h-5 text-primary" /> },
                                            ].map((item, idx) => (
                                                <motion.div
                                                    key={item.href}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all border ${item.highlight ? "bg-red-50/50 border-red-100/50" : "bg-slate-50 border-transparent hover:border-slate-100"
                                                            }`}
                                                    >
                                                        <div className={`w-9 h-9 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                                            {item.icon}
                                                        </div>
                                                        <span className={`text-[13px] font-bold ${item.highlight ? "text-red-600" : "text-slate-700"}`}>{item.label}</span>
                                                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-300 ml-auto" />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Auth Actions for Mobile */}
                                    {!session && (
                                        <motion.div
                                            className="pt-6 border-t border-slate-100 space-y-3"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-black text-[12px] uppercase tracking-wider shadow-lg shadow-primary/20">
                                                    {t("navbar.loginNow")}
                                                </Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full h-11 rounded-2xl border border-slate-200 text-slate-600 font-bold text-[12px] uppercase tracking-wider hover:bg-slate-50 transition-all">
                                                    {t("navbar.createAccount")}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )}

                                    {/* Session Info if Logged In */}
                                    {session && (
                                        <motion.div
                                            className="p-4 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm overflow-hidden p-0.5 relative">
                                                <Image
                                                    src={session.user.image || "/images/default-avatar.png"}
                                                    className="object-cover rounded-[14px]"
                                                    alt="User"
                                                    fill
                                                    sizes="48px"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t("navbar.member")}</p>
                                                <p className="text-[14px] font-bold text-slate-800 truncate max-w-[150px]">{session.user.name}</p>
                                            </div>
                                            <Link href="/profile" className="ml-auto" onClick={() => setIsOpen(false)}>
                                                <Button size="sm" variant="ghost" className="p-2 text-primary hover:bg-primary/10 rounded-2xl">
                                                    <Settings className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >
        </>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={
            <nav className="sticky top-0 z-[100] bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100 border-b border-slate-100 shadow-sm">
                <div className="w-full px-4 sm:px-6 lg:px-[8%]">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-8 bg-slate-200/50 animate-pulse rounded-lg" />
                            <div className="hidden md:block w-96 h-10 bg-slate-100 animate-pulse rounded-full" />
                        </div>
                        <div className="flex items-center gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 bg-slate-100 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        }>
            <NavbarContent />
        </Suspense>
    );
}
