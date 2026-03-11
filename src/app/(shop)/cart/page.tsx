"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ArrowLeft, Bookmark } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import { RelatedProduct } from "@/types/product";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/lib/i18n/context";
import { CartItemList, CartSummary, CouponSection, SavedItemsList } from "@/components/cart";
import { CartItem } from "@/components/cart/CartItemList";
import { SavedItem } from "@/components/cart/SavedItemsList";

export default function CartPage() {
    const { items, removeItem, updateQuantity, addItem } = useCart();
    const { t, language } = useLanguage();
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCouponCode, setAppliedCouponCode] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(items.map(i => i.id)));

    // Keep selectedIds in sync when items change (e.g. item removed externally)
    useEffect(() => {
        setSelectedIds(prev => new Set([...prev].filter(id => items.some(i => i.id === id))));
    }, [items]);

    const [savedForLater, setSavedForLater] = useState<typeof items>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem('savedForLater');
        if (!saved) return [];
        try { return JSON.parse(saved); } catch { return []; }
    });
    const [showSavedTab, setShowSavedTab] = useState(false);

    // Load savedForLater from localStorage on mount — handled via lazy useState initializer above

    // Persist savedForLater to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
    }, [savedForLater]);

    // Selected items calculation
    const allSelected = items.length > 0 && selectedIds.size === items.length;
    const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

    const selectedTotal = useMemo(() => {
        return items
            .filter(item => selectedIds.has(item.id))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items, selectedIds]);

    const selectedCount = useMemo(() => {
        return items.filter(item => selectedIds.has(item.id)).reduce((sum, item) => sum + item.quantity, 0);
    }, [items, selectedIds]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(i => i.id)));
        }
    };

    const removeSelected = (ids: Set<string>) => {
        ids.forEach(id => removeItem(id));
        setSelectedIds(new Set());
        toast.success(language === "vi" ? `Đã xoá ${ids.size} sản phẩm khỏi giỏ hàng` : `Removed ${ids.size} items from cart`);
    };

    const saveForLater = (item: CartItem) => {
        setSavedForLater(prev => {
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, { ...item, productId: item.productId }];
        });
        removeItem(item.id);
        toast.success(language === "vi" ? `Đã lưu ${item.name} để mua sau` : `Saved ${item.name} for later`);
    };

    const moveToCart = (item: SavedItem) => {
        if (!item.productId) return;
        addItem(item);
        setSavedForLater(prev => prev.filter(i => i.id !== item.id));
        toast.success(language === "vi" ? `Đã thêm ${item.name} vào giỏ hàng` : `Added ${item.name} to cart`);
    };

    const removeSaved = (id: string) => {
        setSavedForLater(prev => prev.filter(i => i.id !== id));
        toast.success(language === "vi" ? "Đã xóa khỏi danh sách đã lưu" : "Removed from saved list");
    };

    // Check for out-of-stock items among selected items only
    const hasOutOfStockItems = items.filter(item => selectedIds.has(item.id)).some(item => (item.inventory ?? 0) <= 0);
    const canCheckout = selectedIds.size > 0 && !hasOutOfStockItems;

    if (items.length === 0) {
        const quickLinks = [
            { label: language === "vi" ? "Cá khô" : "Dried Fish", href: "/products?category=C%C3%A1+kh%C3%B4" },
            { label: language === "vi" ? "Hải sản" : "Seafood", href: "/products?category=H%E1%BA%A3i+s%E1%BA%A3n" },
            { label: language === "vi" ? "Gia vị" : "Spices", href: "/products?category=Gia+v%E1%BB%8B" },
            { label: language === "vi" ? "Quà tặng" : "Gift Sets", href: "/products?tag=gift" },
        ];
        return (
            <div className="page-container-wide py-24 text-center">
                {/* Illustration */}
                <div className="relative w-40 h-40 mx-auto mb-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-100 rounded-[3rem] rotate-6" />
                    <div className="absolute inset-0 bg-white rounded-[3rem] flex items-center justify-center shadow-xl shadow-primary/10">
                        <ShoppingBag className="w-16 h-16 text-primary/60" />
                    </div>
                    {/* Floating dots for decoration */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full opacity-40" />
                    <div className="absolute -bottom-3 -left-2 w-8 h-8 bg-emerald-200 rounded-full opacity-60" />
                </div>

                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{t("cart.emptyCart")}</h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
                    {t("cart.emptyCartDesc")}
                </p>

                <Link href="/products" prefetch={true}>
                    <button className="bg-primary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 mb-12">
                        {t("cart.shopNow")}
                    </button>
                </Link>

                {/* Category quick-links */}
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className="px-5 py-2.5 rounded-full border-2 border-slate-200 text-sm font-bold text-slate-600 hover:border-primary hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-container-wide py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
            <Link href="/products" prefetch={true} className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary mb-12 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> {t("shop.continueShopping")}
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-black uppercase tracking-tighter">
                    {t("cart.yourCart")} <span className="text-primary">({items.length})</span>
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSavedTab(false)}
                        className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${!showSavedTab
                            ? "bg-primary text-white shadow-lg"
                            : "bg-white text-slate-600 border border-slate-200"
                            }`}
                    >
                        {t("common.cart")} ({items.length})
                    </button>
                    <button
                        onClick={() => setShowSavedTab(true)}
                        className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${showSavedTab
                            ? "bg-primary text-white shadow-lg"
                            : "bg-white text-slate-600 border border-slate-200"
                            }`}
                    >
                        <Bookmark className="w-4 h-4 inline mr-1" />
                        {language === "vi" ? "Đã lưu" : "Saved"} ({savedForLater.length})
                    </button>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-8">
                    {showSavedTab ? (
                        <SavedItemsList
                            items={savedForLater}
                            onMoveToCart={moveToCart}
                            onRemove={removeSaved}
                        />
                    ) : (
                        <CartItemList
                            items={items}
                            selectedIds={selectedIds}
                            onToggleSelect={toggleSelect}
                            onToggleAll={toggleAll}
                            allSelected={allSelected}
                            someSelected={someSelected}
                            onRemoveItem={removeItem}
                            onUpdateQuantity={updateQuantity}
                            onRemoveSelected={removeSelected}
                            onSaveForLater={saveForLater}
                        />
                    )}
                </div>

                <div className="lg:col-span-4 mt-16 lg:mt-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <CouponSection
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        couponApplied={couponApplied}
                        setCouponApplied={setCouponApplied}
                        couponDiscount={couponDiscount}
                        setCouponDiscount={setCouponDiscount}
                        appliedCouponCode={appliedCouponCode}
                        setAppliedCouponCode={setAppliedCouponCode}
                        selectedTotal={selectedTotal}
                    />
                    <CartSummary
                        selectedTotal={selectedTotal}
                        couponDiscount={couponDiscount}
                        selectedCount={selectedCount}
                        canCheckout={canCheckout}
                        hasOutOfStockItems={hasOutOfStockItems}
                    />
                </div>
            </div>

            {/* Related Products Suggestions */}
            {items.length > 0 && (
                <div className="mt-20">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">{language === "vi" ? "Có thể bạn cũng thích" : "You may also like"}</h2>
                    <RelatedProductsSection categories={[...new Set(items.map(i => i.category || 'all'))]} />
                </div>
            )}
        </div>
    );
}

function RelatedProductsSection({ categories }: { categories: string[] }) {
    const [products, setProducts] = useState<RelatedProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const params = new URLSearchParams();
                if (categories.length > 0 && categories[0] !== 'all') {
                    params.set('category', categories[0]);
                }
                params.set('limit', '4');
                const res = await fetch(`/api/products?${params}`);
                const data = await res.json();
                setProducts(data.products?.slice(0, 4) || []);
            } catch {
                logger.warn('Failed to load related products', { context: 'cart-page' });
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [categories]);

    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div className="h-64 bg-slate-100 rounded-2xl animate-pulse" /></div>;

    if (products.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
