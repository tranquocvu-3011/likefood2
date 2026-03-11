"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Loader2, X, LayoutGrid, List, Filter, Star, Package, Truck } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGridSkeleton } from "@/components/ui/product-skeleton";
import { tracking } from "@/lib/tracking";
import { prefetchCommonRoutes } from "@/lib/prefetch";
import type { Product, ProductSearchHint } from "@/types/product";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";

// Categories will be translated dynamically based on language

// Normalize category slugs / English names → Vietnamese DB-canonical names
const CATEGORY_TO_DB: Record<string, string> = {
    // URL slugs
    "ca-kho": "Cá khô",
    "muc-kho": "Tôm & Mực khô",
    "trai-cay-say": "Trái cây sấy",
    "banh-mut": "Trà & Bánh mứt",
    "gia-vi": "Gia vị Việt",
    // English display names
    "Dried Fish": "Cá khô",
    "Dried Shrimp & Squid": "Tôm & Mực khô",
    "Dried Fruits": "Trái cây sấy",
    "Tea & Sweets": "Trà & Bánh mứt",
    "Vietnamese Spices": "Gia vị Việt",
};

// Vietnamese canonical name → English display name
const VI_TO_EN_NAME: Record<string, string> = {
    "Cá khô": "Dried Fish",
    "Tôm & Mực khô": "Dried Shrimp & Squid",
    "Trái cây sấy": "Dried Fruits",
    "Trà & Bánh mứt": "Tea & Sweets",
    "Gia vị Việt": "Vietnamese Spices",
};

function ProductCatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const querySearch = searchParams.get("search") || "";

    const CATEGORIES = [
        t("shopPage.allCategories"),
        language === "vi" ? "Cá khô" : "Dried Fish",
        language === "vi" ? "Tôm & Mực khô" : "Dried Shrimp & Squid",
        language === "vi" ? "Trái cây sấy" : "Dried Fruits",
        language === "vi" ? "Trà & Bánh mứt" : "Tea & Sweets",
        language === "vi" ? "Gia vị Việt" : "Vietnamese Spices",
    ];

    const TAGS = [
        { id: "gift", label: t("shopPage.tagGift") },
        { id: "diet", label: t("shopPage.tagDiet") },
        { id: "spicy", label: t("shopPage.tagSpicy") },
    ];

    const SORT_OPTIONS = [
        { value: "newest", label: t("shopPage.sortNewest") },
        { value: "best-selling", label: t("shopPage.sortBestSelling") },
        { value: "top-rated", label: t("shopPage.sortTopRated") },
        { value: "price-asc", label: t("shopPage.sortPriceAsc") },
        { value: "price-desc", label: t("shopPage.sortPriceDesc") },
        { value: "name", label: t("shopPage.sortNameAZ") },
    ];
    const queryCategory = searchParams.get("category") || t("shopPage.allCategories");
    const queryMinPrice = searchParams.get("minPrice") || "";
    const queryMaxPrice = searchParams.get("maxPrice") || "";
    const queryTags = searchParams.get("tags") || "";
    const queryRatingGte = searchParams.get("rating_gte");
    const queryInStock = searchParams.get("in_stock");
    const querySort = searchParams.get("sort") || "newest";
    const queryPage = (() => {
        const raw = searchParams.get("page");
        const num = raw ? parseInt(raw, 10) : 1;
        return Number.isNaN(num) || num < 1 ? 1 : num;
    })();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search hints & recent searches
    const [searchHints, setSearchHints] = useState<ProductSearchHint[]>([]);
    const [showSearchHints, setShowSearchHints] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [voucherFlags, setVoucherFlags] = useState<{ hasVoucher: boolean; hasFreeship: boolean }>({
        hasVoucher: false,
        hasFreeship: false,
    });

    // Filters
    const [searchQuery, setSearchQuery] = useState(querySearch);
    const [selectedCategory, setSelectedCategory] = useState(queryCategory || t("shopPage.allCategories"));
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("newest");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number>(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [freeShippingOnly, setFreeShippingOnly] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // UI States
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(24);

    // Show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Debounce search query and price inputs
    const debouncedSearch = useDebounce(searchQuery, 400);
    const debouncedMinPrice = useDebounce(minPrice, 600);
    const debouncedMaxPrice = useDebounce(maxPrice, 600);

    // Prefetch common routes on mount for better performance
    useEffect(() => {
        prefetchCommonRoutes(router);
    }, [router]);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const stored = window.localStorage.getItem("lf_recent_searches");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setRecentSearches(parsed.slice(0, 8));
                }
            }
        } catch {
            // ignore
        }
    }, []);

    // Fetch active voucher flags once (best-effort)
    useEffect(() => {
        let active = true;
        const run = async () => {
            try {
                const [allRes, shipRes] = await Promise.all([
                    fetch("/api/vouchers?category=all"),
                    fetch("/api/vouchers?category=shipping"),
                ]);
                const all = allRes.ok ? await allRes.json() : [];
                const ship = shipRes.ok ? await shipRes.json() : [];
                if (!active) return;
                setVoucherFlags({
                    hasVoucher: Array.isArray(all) && all.length > 0,
                    hasFreeship: Array.isArray(ship) && ship.length > 0,
                });
            } catch {
                // ignore
            }
        };
        run();
        return () => {
            active = false;
        };
    }, []);

    // Ref to prevent "Sync URL from state" overwriting the URL with stale state
    // immediately after a URL-driven navigation (race condition fix)
    const skipNextUrlSync = useRef(false);
    // Ref to ensure "Load recent filters" only runs once on mount
    const hasLoadedFiltersRef = useRef(false);
    // AbortController ref for cancelling stale fetch requests
    const abortControllerRef = useRef<AbortController | null>(null);

    // Sync local state from URL query (deep link + back/forward)
    useEffect(() => {
        skipNextUrlSync.current = true;
        setSearchQuery(querySearch);
        // Normalize slug / English category name → current-language display name
        const viName = CATEGORY_TO_DB[queryCategory] ?? queryCategory;
        const displayCat = language === "en"
            ? (VI_TO_EN_NAME[viName] ?? viName)
            : viName;
        setSelectedCategory(displayCat || queryCategory);
        setMinPrice(queryMinPrice);
        setMaxPrice(queryMaxPrice);
        setSelectedTags(
            queryTags
                ? queryTags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : []
        );
        setMinRating(queryRatingGte ? Number(queryRatingGte) || 0 : 0);
        setInStockOnly(queryInStock === "true");
        setSort(querySort || "newest");
        setPage(queryPage);
    }, [
        querySearch,
        queryCategory,
        language,
        queryMinPrice,
        queryMaxPrice,
        queryTags,
        queryRatingGte,
        queryInStock,
        querySort,
        queryPage,
    ]);

    // Sync URL from state (full filter/sort/page)
    useEffect(() => {
        // Skip once after URL→state sync to avoid overwriting the URL with stale state
        if (skipNextUrlSync.current) {
            skipNextUrlSync.current = false;
            return;
        }

        const params = new URLSearchParams();

        if (debouncedSearch) params.set("search", debouncedSearch);
        if (selectedCategory && selectedCategory !== t("shopPage.allCategories")) params.set("category", selectedCategory);
        if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
        if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
        if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
        if (minRating) params.set("rating_gte", minRating.toString());
        if (inStockOnly) params.set("in_stock", "true");
        if (freeShippingOnly) params.set("free_shipping", "true");
        if (sort && sort !== "newest") params.set("sort", sort);
        if (page > 1) params.set("page", page.toString());

        const newQuery = params.toString();
        // Normalize comparison: decode both to avoid %20 vs + encoding mismatch
        const normalizeQuery = (q: string) => new URLSearchParams(q).toString();
        if (normalizeQuery(newQuery) === normalizeQuery(searchParams.toString())) return;

        router.push(newQuery ? `/products?${newQuery}` : "/products", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        debouncedSearch,
        selectedCategory,
        debouncedMinPrice,
        debouncedMaxPrice,
        selectedTags,
        minRating,
        inStockOnly,
        freeShippingOnly,
        sort,
        page,
        router,
        searchParams,
    ]);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        // Cancel any in-flight request to prevent stale responses overwriting newer ones
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (debouncedSearch) params.append("search", debouncedSearch);
            if (selectedCategory && selectedCategory !== t("shopPage.allCategories")) {
                // Always send the Vietnamese DB-canonical name to the API
                params.append("category", CATEGORY_TO_DB[selectedCategory] ?? selectedCategory);
            }
            if (debouncedMinPrice) params.append("minPrice", debouncedMinPrice);
            if (debouncedMaxPrice) params.append("maxPrice", debouncedMaxPrice);
            if (selectedTags.length > 0) params.append("tags", selectedTags.join(","));
            if (minRating) params.append("rating_gte", minRating.toString());
            if (inStockOnly) params.append("in_stock", "true");
            if (freeShippingOnly) params.append("free_shipping", "true");
            params.append("sort", sort);
            params.append("page", page.toString());
            params.append("limit", itemsPerPage.toString());

            const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();
            if (!controller.signal.aborted) {
                setProducts(data.products || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotal(data.pagination?.total || 0);
            }
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            logger.error("Products fetch error", err as Error, {
                context: "products-page",
                search: debouncedSearch,
                category: selectedCategory,
                page
            });
            if (!controller.signal.aborted) {
                setError(t("shopPage.loadError"));
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false);
            }
        }
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        debouncedSearch,
        selectedCategory,
        debouncedMinPrice,
        debouncedMaxPrice,
        sort,
        page,
        selectedTags,
        minRating,
        inStockOnly,
        freeShippingOnly,
        itemsPerPage,
    ]);

    // Fetch search hints when user types
    useEffect(() => {
        let active = true;
        const fetchHints = async () => {
            if (!debouncedSearch || debouncedSearch.length < 2) {
                if (active) {
                    setSearchHints([]);
                }
                return;
            }
            try {
                const res = await fetch(`/api/products/search-hints?q=${encodeURIComponent(debouncedSearch)}`);
                if (!res.ok) return;
                const data = await res.json();
                if (active) {
                    setSearchHints(data.hints || []);
                }
            } catch {
                if (active) {
                    setSearchHints([]);
                }
            }
        };

        fetchHints();

        return () => {
            active = false;
        };
    }, [debouncedSearch]);

    // Close search hints when clicking outside
    const searchContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setShowSearchHints(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const lastTrackedList = useRef<{ category?: string; search?: string } | null>(null);

    useEffect(() => {
        fetchProducts();

        // Track view_item_list event nhưng tránh spam liên tục (gây lag & log ồ ạt ở dev)
        const categoryParam = selectedCategory !== t("shopPage.allCategories") ? selectedCategory : undefined;
        const searchParam = debouncedSearch || undefined;
        const key = { category: categoryParam, search: searchParam };

        if (
            lastTrackedList.current &&
            lastTrackedList.current.category === key.category &&
            lastTrackedList.current.search === key.search
        ) {
            return;
        }

        tracking.viewItemList(categoryParam, searchParam);
        lastTrackedList.current = key;
    }, [fetchProducts, selectedCategory, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset to page 1 when filters change (use debounced prices to avoid reset on every keystroke)
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedCategory, debouncedMinPrice, debouncedMaxPrice, selectedTags, minRating, inStockOnly, freeShippingOnly, sort, itemsPerPage]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(t("shopPage.allCategories"));
        setMinPrice("");
        setMaxPrice("");
        setSelectedTags([]);
        setMinRating(0);
        setInStockOnly(false);
        setFreeShippingOnly(false);
        setSort("newest");
        setPage(1);
        router.push("/products", { scroll: false });
        // Clear recent filters
        localStorage.removeItem("recent_filters");
    };

    const hasActiveFilters =
        searchQuery !== "" ||
        selectedCategory !== t("shopPage.allCategories") ||
        minPrice !== "" ||
        maxPrice !== "" ||
        selectedTags.length > 0 ||
        minRating > 0 ||
        inStockOnly ||
        freeShippingOnly ||
        sort !== "newest";

    // Save recent filters
    useEffect(() => {
        if (!hasActiveFilters) return;
        const filters = {
            category: selectedCategory,
            minPrice,
            maxPrice,
            tags: selectedTags,
            rating: minRating,
            inStock: inStockOnly,
            freeShipping: freeShippingOnly,
            sort,
        };
        localStorage.setItem("recent_filters", JSON.stringify(filters));
    }, [selectedCategory, minPrice, maxPrice, selectedTags, minRating, inStockOnly, freeShippingOnly, sort, hasActiveFilters]);

    // Load recent filters on mount ONLY — skip if the URL already carries any params
    useEffect(() => {
        if (hasLoadedFiltersRef.current) return;
        hasLoadedFiltersRef.current = true;
        // Don't restore saved filters when the user navigated here with explicit URL params
        if (searchParams.toString()) return;
        const saved = localStorage.getItem("recent_filters");
        if (saved) {
            try {
                const filters = JSON.parse(saved);
                if (filters.category) setSelectedCategory(filters.category);
                if (filters.minPrice) setMinPrice(filters.minPrice);
                if (filters.maxPrice) setMaxPrice(filters.maxPrice);
                if (filters.tags) setSelectedTags(filters.tags);
                if (filters.rating) setMinRating(filters.rating);
                if (filters.inStock) setInStockOnly(filters.inStock);
                if (filters.sort) setSort(filters.sort);
            } catch {
                logger.warn("Failed to load recent filters", { context: "products-page" });
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Get category gradient based on name  
    const getCategoryGradient = (cat: string) => {
        if (!cat) return 'from-primary to-orange-600';
        const lower = cat.toLowerCase();
        if (lower.includes('cá') || lower.includes('tôm') || lower.includes('mực')) return 'from-sky-500 to-blue-600';
        if (lower.includes('trái cây')) return 'from-emerald-500 to-green-600';
        if (lower.includes('bánh') || lower.includes('trà')) return 'from-amber-500 to-yellow-600';
        if (lower.includes('gia vị')) return 'from-rose-500 to-red-600';
        return 'from-primary to-orange-600';
    };

    return (
        <>
        <div className="bg-slate-50 min-h-screen">
            {/* Layout thu gọn: max-width nhỏ lại ~ một nửa so với full width */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header section - Cleaned up to avoid double search bar */}
            <section className="bg-white pt-10 pb-6 border-b border-slate-100">
                <div>
                    {/* Breadcrumbs */}
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-primary">
                            {t("common.home")}
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-bold">{t("common.products")}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-6xl text-black">
                                {t("shopPage.shopTitle")} <span className="text-primary">LIKEFOOD</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                {t("shopPage.qualityProducts")}
                            </p>
                        </div>

                        {/* Search bar + total products */}
                        <div className="w-full md:w-[380px] relative" ref={searchContainerRef}>
                            <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl mb-2 flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                    {t("shopPage.available")}
                                </span>
                                <span className="font-black text-xl flex items-center gap-2">
                                    {total}
                                    <span className="text-[10px] uppercase opacity-60 tracking-widest font-bold">
                                        {t("shopPage.productsCount")}
                                    </span>
                                </span>
                            </div>
                            <div className="relative">
                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSearchHints(true);
                                        }}
                                        onFocus={() => setShowSearchHints(true)}
                                        placeholder={t("shopPage.searchPlaceholder")}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setShowSearchHints(false);
                                            }}
                                            className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                        {/* Search hints + recent searches dropdown */}
                                {showSearchHints && (searchHints.length > 0 || recentSearches.length > 0) && (
                                    <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl border border-slate-100 shadow-xl max-h-80 overflow-y-auto">
                                        {recentSearches.length > 0 && (
                                            <div className="px-4 pt-3 pb-2 border-b border-slate-50">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                                    {t("shopPage.recentSearches")}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((term) => (
                                                        <button
                                                            key={term}
                                                            onClick={() => {
                                                                setSearchQuery(term);
                                                                setShowSearchHints(false);
                                                            }}
                                                            className="px-3 py-1.5 rounded-full bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100"
                                                        >
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {searchHints.length > 0 && (
                                            <div className="py-2">
                                                {searchHints.map((hint) => (
                                                    <button
                                                        key={hint.id}
                                                        onClick={() => {
                                                            setSearchQuery(hint.name);
                                                            setShowSearchHints(false);

                                                            // Lưu vào recent searches
                                                            try {
                                                                const next = [
                                                                    hint.name,
                                                                    ...recentSearches.filter(
                                                                        (t) => t !== hint.name
                                                                    ),
                                                                ].slice(0, 8);
                                                                setRecentSearches(next);
                                                                if (typeof window !== "undefined") {
                                                                    window.localStorage.setItem(
                                                                        "lf_recent_searches",
                                                                        JSON.stringify(next)
                                                                    );
                                                                }
                                                            } catch {
                                                                // ignore
                                                            }
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                                                            <Search className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-slate-900">
                                                                {hint.name}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400">
                                                                {hint.category}
                                                            </p>
                                                        </div>
                                                        <span className="text-[11px] font-black text-primary">
                                                            {hint.price != null ? formatPrice(hint.price) : ""}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobile: Filter toggle button */}
                    <div className="lg:hidden flex items-center justify-between mb-2">
                        <button
                            onClick={() => setShowMobileFilters(v => !v)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm"
                        >
                            <Filter className="w-4 h-4" />
                            {language === "vi" ? "Bộ lọc" : "Filters"}
                            {hasActiveFilters && (
                                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">
                                    {[selectedCategory !== t("shopPage.allCategories"), debouncedMinPrice || debouncedMaxPrice, selectedTags.length > 0, minRating > 0, inStockOnly, freeShippingOnly, sort !== "newest"].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                        <span className="text-xs text-slate-500 font-medium">{total} {t("shopPage.productsLabel")}</span>
                    </div>

                    {/* Filters Sidebar — desktop always visible, mobile conditionally shown */}
                    <div className={`w-full lg:w-56 shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
                        <div className="bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-100/80 sticky top-24 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                        <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    {t("shopPage.filters")}
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all"
                                    >
                                        {t("shopPage.clearFilters")}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1">
                                        {t("shopPage.productCategories")}
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                        {CATEGORIES.map((cat) => {
                                            const isActive = selectedCategory === cat;
                                            const gradient = getCategoryGradient(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`text-left px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive
                                                        ? `bg-gradient-to-r ${gradient} text-white shadow-md scale-[1.02]`
                                                        : "text-slate-600 hover:bg-slate-50 hover:pl-5"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-100/80">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1">
                                        {t("shopPage.priceRange")}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t("shopPage.priceFrom")}
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="bg-slate-50/80 px-3.5 py-2.5 rounded-2xl text-sm font-bold border border-slate-100 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 outline-none transition-all"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t("shopPage.priceTo")}
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="bg-slate-50/80 px-3.5 py-2.5 rounded-2xl text-sm font-bold border border-slate-100 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-100/80">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1">
                                        {t("shopPage.tags")}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {TAGS.map((tag) => {
                                            const isSelected = selectedTags.includes(tag.id);
                                            return (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedTags(selectedTags.filter(t => t !== tag.id));
                                                        } else {
                                                            setSelectedTags([...selectedTags, tag.id]);
                                                        }
                                                    }}
                                                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${isSelected
                                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                                                        : "text-slate-600 hover:bg-slate-50 bg-white border border-slate-100 hover:border-slate-200"
                                                        }`}
                                                >
                                                    {tag.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-100/80">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1">
                                        {t("shopPage.rating")}
                                    </h4>
                                    <button
                                        onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 ${minRating === 4
                                            ? "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 bg-white border border-slate-100"
                                            }`}
                                    >
                                        <span className="text-amber-400">⭐</span> {t("shopPage.ratingAbove4")}
                                    </button>
                                </div>

                                <div className="pt-5 border-t border-slate-100/80 space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                                            className="w-4.5 h-4.5 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-300 transition-all"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {t("shopPage.inStockOnly")}
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={freeShippingOnly}
                                            onChange={(e) => { setFreeShippingOnly(e.target.checked); setPage(1); }}
                                            className="w-4.5 h-4.5 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-300 transition-all"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {t("shopPage.freeShippingOnly")}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-3 mb-8">
                            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
                                <p className="text-slate-600 font-bold text-sm">
                                    {t("shopPage.showing")} <span className="text-emerald-600 font-black px-1.5 py-0.5 bg-emerald-50 rounded-md">{total}</span> {t("shopPage.productsLabel")}
                                    {selectedCategory !== t("shopPage.allCategories") && (
                                        <> {t("shopPage.inCategory")} <span className="text-slate-900 font-black tracking-wide">&quot;{selectedCategory}&quot;</span></>
                                    )}
                                    {debouncedSearch && (
                                        <> {t("shopPage.forSearch")} <span className="text-slate-900 font-black tracking-wide">&quot;{debouncedSearch}&quot;</span></>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                            {/* Items per page */}
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-3 py-2.5 shadow-sm">
                                <span className="text-xs font-bold text-slate-500">{language === "vi" ? "Hiển thị" : "Show"}:</span>
                                {[12, 24, 48].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => { setItemsPerPage(n); setPage(1); }}
                                        className={`w-8 h-7 rounded-xl text-xs font-black transition-all ${itemsPerPage === n ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                                    >{n}</button>
                                ))}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                    className="flex items-center gap-2 font-bold text-sm bg-white px-5 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
                                >
                                    {t("shopPage.sortBy")} {SORT_OPTIONS.find(opt => opt.value === sort)?.label || t("shopPage.sortNewest")}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
                                </button>

                                {showSortMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowSortMenu(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                            {SORT_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSort(option.value);
                                                        setShowSortMenu(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${sort === option.value
                                                        ? "bg-primary text-white"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-2xl transition-all ${viewMode === "grid"
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                        }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2.5 rounded-2xl transition-all ${viewMode === "list"
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                        }`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                            </div>{/* end right-side controls */}
                        </div>

                        {/* Applied Filters - Chips (all active filters) */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mb-8 p-4 sm:p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">{t("shopPage.filtering")}</span>

                                {searchQuery && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-2xl border border-slate-200">
                                        <Search className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs font-bold">&quot;{searchQuery}&quot;</span>
                                        <button onClick={() => { setSearchQuery(""); setPage(1); }} className="hover:bg-slate-200 rounded-full p-0.5 transition-colors text-slate-400 hover:text-slate-900"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {selectedCategory !== t("shopPage.allCategories") && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                                        <Package className="w-3 h-3" />
                                        <span className="text-xs font-bold">{selectedCategory}</span>
                                        <button onClick={() => { setSelectedCategory(t("shopPage.allCategories")); setPage(1); }} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {(minPrice || maxPrice) && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-2xl border border-slate-200">
                                        <span className="text-xs font-bold">
                                            {t("shopPage.priceLabel")} {minPrice ? formatPrice(Number(minPrice)) : "0"} – {maxPrice ? formatPrice(Number(maxPrice)) : "∞"}
                                        </span>
                                        <button onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }} className="hover:bg-slate-200 rounded-full p-0.5 transition-colors text-slate-400 hover:text-slate-900"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {selectedTags.map(tag => {
                                    const tagLabel = TAGS.find(t => t.id === tag)?.label ?? tag;
                                    return (
                                        <div key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
                                            <span className="text-xs font-bold">{tagLabel}</span>
                                            <button onClick={() => { setSelectedTags(prev => prev.filter(t => t !== tag)); setPage(1); }} className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    );
                                })}

                                {minRating > 0 && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold">{minRating}+</span>
                                        <button onClick={() => { setMinRating(0); setPage(1); }} className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {inStockOnly && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-2xl border border-green-200">
                                        <span className="text-xs font-bold">{language === "vi" ? "Còn hàng" : "In stock"}</span>
                                        <button onClick={() => { setInStockOnly(false); setPage(1); }} className="hover:bg-green-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {freeShippingOnly && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-2xl border border-sky-200">
                                        <Truck className="w-3 h-3" />
                                        <span className="text-xs font-bold">{language === "vi" ? "Miễn ship" : "Free ship"}</span>
                                        <button onClick={() => { setFreeShippingOnly(false); setPage(1); }} className="hover:bg-sky-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                {sort !== "newest" && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-2xl border border-violet-200">
                                        <span className="text-xs font-bold">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                                        <button onClick={() => { setSort("newest"); setPage(1); }} className="hover:bg-violet-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                )}

                                <button
                                    onClick={handleClearFilters}
                                    className="ml-auto px-3 py-1.5 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-2xl border border-rose-100 hover:border-rose-200 transition-colors uppercase tracking-widest"
                                >
                                    {t("shopPage.clearAll")}
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <ProductGridSkeleton count={12} />
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                                <p className="text-red-600 font-bold">{error}</p>
                                <button
                                    onClick={fetchProducts}
                                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                                >
                                    {t("shopPage.tryAgain")}
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!isLoading && !error && (
                            <>
                                {products.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-20 text-center">
                                        <p className="text-xl font-black uppercase tracking-tighter mb-2">
                                            {t("shopPage.noProductsFound")}
                                        </p>
                                        <p className="text-slate-500 font-medium mb-6">
                                            {t("shopPage.noResultsFor")}&nbsp;
                                            {debouncedSearch ? (
                                                <span className="font-black text-slate-900">
                                                    “{debouncedSearch}”
                                                </span>
                                            ) : (
                                                t("shopPage.currentFilters")
                                            )}
                                            .
                                        </p>

                                        {/* Gợi ý keyword/cate khi không có kết quả */}
                                        <div className="mb-6">
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                                {t("shopPage.quickSuggestions")}
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {(language === "vi"
                                                    ? ["cá khô", "mực", "tôm khô", "trái cây sấy"]
                                                    : ["dried fish", "squid", "dried shrimp", "dried fruits"]
                                                ).map((suggest) => (
                                                    <button
                                                        key={suggest}
                                                        onClick={() => {
                                                            setSearchQuery(suggest);
                                                            setSelectedCategory(t("shopPage.allCategories"));
                                                            setPage(1);
                                                        }}
                                                        className="px-4 py-2 rounded-full bg-slate-50 text-sm font-bold text-slate-600 hover:bg-slate-100"
                                                    >
                                                        {suggest}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {hasActiveFilters && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="px-8 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
                                            >
                                                {t("shopPage.clearFilters")}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className={`transition-all duration-300 ${viewMode === "grid"
                                            ? "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
                                            : "flex flex-col gap-3 sm:gap-4"
                                            }`}>
                                            {products.map((product, index) => (
                                                <div
                                                    key={product.id}
                                                    className="w-full animate-in fade-in slide-in-from-bottom-3"
                                                    style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
                                                >
                                                    <ProductCard
                                                        product={{
                                                            ...product,
                                                            onSale: product.isOnSale,
                                                            hasVoucher: voucherFlags.hasVoucher,
                                                            hasFreeship: voucherFlags.hasFreeship,
                                                        }}
                                                        viewMode={viewMode}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                                <button
                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white/80 disabled:hover:text-slate-700 disabled:hover:border-slate-200 disabled:cursor-not-allowed text-[10px] sm:text-xs"
                                                >
                                                    {t("shopPage.prevPage")}
                                                </button>

                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (page <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (page >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = page - 2 + i;
                                                        }

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setPage(pageNum)}
                                                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl sm:rounded-2xl font-black transition-all text-sm sm:text-base ${page === pageNum
                                                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                                                    : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={page === totalPages}
                                                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm disabled:opacity-40 disabled:hover:bg-white/80 disabled:hover:text-slate-700 disabled:hover:border-slate-200 disabled:cursor-not-allowed text-[10px] sm:text-xs"
                                                >
                                                    {t("shopPage.nextPage")}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/25 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                    aria-label={language === "vi" ? "Cuộn lên đầu trang" : "Scroll to top"}
                >
                    <ChevronUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
        </>
    );
}

export default function ProductCatalog() {
    return (
        <Suspense fallback={
            <div className="page-container-wide py-20">
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </div>
        }>
            <ProductCatalogContent />
        </Suspense>
    );
}
