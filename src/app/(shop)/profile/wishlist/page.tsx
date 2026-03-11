"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface WishlistProduct {
    id: string;
    slug?: string | null;
    name: string;
    price: number;
    category: string;
    image?: string | null;
    inventory: number;
    description?: string | null;
    originalPrice?: number | null;
    salePrice?: number | null;
    isFlashSale?: boolean;
    ratingAvg?: number | null;
}

export default function WishlistPage() {
    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const { addItem } = useCart();
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchWishlist = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/user/wishlist");
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            logger.error("Failed to fetch wishlist", error as Error, { context: 'wishlist-page' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=/profile/wishlist");
            return;
        }

        if (sessionStatus === "authenticated") {
            fetchWishlist();
        }
    }, [sessionStatus, router, fetchWishlist]);

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            setRemovingId(productId);
            const res = await fetch(`/api/user/wishlist?productId=${productId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== productId));
                toast.success("Đã xóa khỏi danh sách yêu thích");
            }
        } catch (error) {
            logger.error("Failed to remove from wishlist", error as Error, { context: 'wishlist-page' });
            toast.error("Không thể xóa sản phẩm");
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = (product: WishlistProduct) => {
        addItem({
            productId: product.id,
            slug: product.slug || undefined,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.image || undefined,
            quantity: 1,
            inventory: product.inventory,
            category: product.category,
        });
    };

    if (sessionStatus === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="page-container-wide py-20 text-center">
                <div className="bg-muted w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black/5">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
                    Chưa có sản phẩm yêu thích
                </h1>
                <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                    Hãy thêm sản phẩm bạn thích vào danh sách yêu thích để dễ dàng tìm lại sau nhé!
                </p>
                <Link href="/products" prefetch={true}>
                    <Button className="bg-primary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95">
                        Khám phá sản phẩm
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container-wide py-20 bg-slate-50 min-h-screen">
            <Link href="/products" prefetch={true} className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary mb-12 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Tiếp tục mua sắm
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-black uppercase tracking-tighter">
                    Danh sách yêu thích <span className="text-primary">({products.length})</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                        <Link href={`/products/${product.slug || product.id}`} prefetch={true}>
                            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ShoppingBag className="w-16 h-16 text-slate-200" />
                                    </div>
                                )}
                                {product.isFlashSale && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg">
                                        Flash Sale
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="p-5">
                            <Link href={`/products/${product.slug || product.id}`} prefetch={true}>
                                <h3 className="font-black text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-xl font-black text-primary">
                                    ${(product.salePrice || product.price).toFixed(2)}
                                </span>
                                {product.originalPrice && product.originalPrice > (product.salePrice || product.price) && (
                                    <span className="text-sm text-slate-400 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.inventory <= 0}
                                    className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {product.inventory > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveFromWishlist(product.id)}
                                    disabled={removingId === product.id}
                                    className="h-11 w-11 rounded-full border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    {removingId === product.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
