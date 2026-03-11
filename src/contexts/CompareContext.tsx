"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image?: string;
    description?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    inventory?: number;
    tags?: string[];
}

interface CompareContextType {
    compareItems: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
    maxItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareItems, setCompareItems] = useState<Product[]>(() => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem("compare_items");
        if (!stored) return [];
        try { return JSON.parse(stored); } catch { return []; }
    });
    const maxItems = 4;

    useEffect(() => {
        localStorage.setItem("compare_items", JSON.stringify(compareItems));
    }, [compareItems]);

    const addToCompare = (product: Product) => {
        setCompareItems((prev) => {
            if (prev.length >= maxItems) return prev;
            if (prev.some((p) => p.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromCompare = (productId: string) => {
        setCompareItems((prev) => prev.filter((p) => p.id !== productId));
    };

    const isInCompare = (productId: string) => {
        return compareItems.some((p) => p.id === productId);
    };

    const clearCompare = () => {
        setCompareItems([]);
    };

    return (
        <CompareContext.Provider
            value={{
                compareItems,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
                maxItems,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
