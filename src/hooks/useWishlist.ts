/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useWishlist() {
    const { data: session } = useSession();
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    // Fetch wishlist IDs
    const fetchWishlistIds = useCallback(async () => {
        if (!session?.user) {
            setWishlistIds(new Set());
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("/api/user/wishlist");
            if (res.ok) {
                const products = await res.json();
                const ids = Array.isArray(products)
                    ? products
                        .filter((p): p is { id: string } => p && typeof p === "object" && typeof (p as { id?: unknown }).id === "string")
                        .map((p) => p.id)
                    : [];
                setWishlistIds(new Set(ids));
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchWishlistIds();
    }, [fetchWishlistIds]);

    // Toggle wishlist item
    const toggleWishlist = useCallback(async (productId: string) => {
        if (!session?.user) {
            return false;
        }

        const isInWishlist = wishlistIds.has(productId);

        try {
            if (isInWishlist) {
                const res = await fetch(`/api/user/wishlist?productId=${productId}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    setWishlistIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(productId);
                        return newSet;
                    });
                    return true;
                }
            } else {
                const res = await fetch("/api/user/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId }),
                });
                if (res.ok) {
                    setWishlistIds(prev => new Set(prev).add(productId));
                    return true;
                }
            }
        } catch (error) {
            console.error("Failed to toggle wishlist:", error);
        }

        return false;
    }, [session, wishlistIds]);

    return {
        wishlistIds,
        isInWishlist: (productId: string) => wishlistIds.has(productId),
        toggleWishlist,
        isLoading,
        refresh: fetchWishlistIds,
    };
}
