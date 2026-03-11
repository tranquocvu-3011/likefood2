"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { tracking } from "@/lib/tracking";

interface CartItem {
    id: string; // Composite ID: productId_variantId (or just productId if no variant)
    productId: string;
    variantId?: string;
    slug?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    inventory?: number; // For stock checking
    category?: string;
}

export type AddableProduct = Omit<CartItem, "id" | "quantity"> & {
    id?: string;
    quantity?: number;
};

interface CartContextType {
    items: CartItem[];
    addItem: (product: AddableProduct) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    lastAddedId: string | null;
    clearLastAddedId: () => void;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        const savedCart = window.localStorage.getItem("likefood-cart");
        if (!savedCart) return [];
        try {
            const parsed = JSON.parse(savedCart) as CartItem[];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse cart", e);
            return [];
        }
    });

    const [lastAddedId, setLastAddedId] = useState<string | null>(null);
    const [isCartOpen, setCartOpen] = useState(false);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("likefood-cart", JSON.stringify(items));
    }, [items]);

    const clearLastAddedId = React.useCallback(() => setLastAddedId(null), []);

    const addItem = React.useCallback((product: AddableProduct) => {
        const productQuantity = product.quantity || 1;
        const cartItemId = product.variantId
            ? `${product.productId}_${product.variantId}`
            : product.productId;

        setLastAddedId(cartItemId);
        // Reset lastAddedId after animation duration
        setTimeout(() => setLastAddedId(null), 1000);

        setItems((current) => {
            const existing = current.find((item) => item.id === cartItemId);
            if (existing) {
                const newQuantity = existing.quantity + productQuantity;
                toast.success(
                    `Đã cập nhật ${product.name} (${newQuantity} sản phẩm)`,
                    {
                        description: "Sản phẩm đã có trong giỏ hàng",
                        id: `cart-${cartItemId}`,
                    }
                );
                return current.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            const newItem = {
                ...product,
                id: cartItemId,
                quantity: productQuantity
            } as CartItem;

            const newItems = [...current, newItem];

            // Track add to cart
            tracking.addToCart(product.productId, product.name, product.price, productQuantity);

            // Automatically open MiniCart when user adds an item
            if (typeof window !== "undefined" && !window.location.pathname.includes("/checkout")) {
                setCartOpen(true);
            }

            toast.success(`Đã thêm ${product.name} vào giỏ hàng`, {
                description: "Sản phẩm đã được thêm thành công",
                id: `cart-${cartItemId}`,
                action: {
                    label: "Hoàn tác",
                    onClick: () => {
                        setItems(current);
                        toast.info(`Đã hoàn tác: ${product.name} đã được gỡ khỏi giỏ hàng`);
                    },
                },
            });

            return newItems;
        });
    }, []);

    const removeItem = React.useCallback((id: string) => {
        setItems((current) => {
            const item = current.find((item) => item.id === id);
            if (item) {
                toast.success(`Đã xóa ${item.name} khỏi giỏ hàng`, {
                    description: "Sản phẩm đã được gỡ bỏ",
                    id: `cart-${item.id}`,
                });
                // Track remove from cart
                tracking.removeFromCart(item.id, item.name, item.price, item.quantity);
            }
            return current.filter((item) => item.id !== id);
        });
    }, []);

    const updateQuantity = React.useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((current) => {
            const item = current.find((item) => item.id === id);
            if (item && item.quantity !== quantity) {
                toast.success(
                    `Đã cập nhật số lượng ${item.name} thành ${quantity}`,
                    {
                        description: "Số lượng đã được cập nhật",
                        id: `cart-qty-${item.id}`,
                    }
                );
            }
            return current.map((item) => (item.id === id ? { ...item, quantity } : item));
        });
    }, [removeItem]);

    const clearCart = React.useCallback(() => setItems([]), []);

    const totalItems = React.useMemo(() =>
        items.reduce((sum, item) => sum + item.quantity, 0),
        [items]);

    const totalPrice = React.useMemo(() =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]);

    const value = React.useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastAddedId,
        clearLastAddedId,
        isCartOpen,
        setCartOpen,
    }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, lastAddedId, clearLastAddedId, isCartOpen]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
