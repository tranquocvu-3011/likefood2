/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Product-related TypeScript types and interfaces
 */

export interface Product {
    id: string;
    slug?: string | null;
    name: string;
    description?: string | null;
    price: number;
    originalPrice?: number | null;
    salePrice?: number | null;
    isOnSale?: boolean;
    badgeText?: string | null;
    image?: string | null;
    category: string;
    inventory: number;
    ratingAvg?: number;
    ratingCount?: number;
    soldCount?: number;
    hasVoucher?: boolean;
    hasFreeship?: boolean;
    isFlashSale?: boolean;
    saleStartAt?: Date | null;
    saleEndAt?: Date | null;
    perUserLimit?: number | null;
}

export interface RelatedProduct {
    id: string;
    slug?: string | null;
    name: string;
    price: number;
    originalPrice?: number | null;
    salePrice?: number | null;
    image?: string | null;
    category: string;
    inventory: number;
    ratingAvg?: number;
    ratingCount?: number;
    soldCount?: number;
    hasVoucher?: boolean;
    hasFreeship?: boolean;
    isFlashSale?: boolean;
}

export interface ProductCardProps {
    product: Product | RelatedProduct;
}

export interface ProductVariant {
    id: string;
    weight?: string | null;
    flavor?: string | null;
    price?: number | null;
    inventory?: number | null;
}

export interface ProductSearchHint {
    id: string;
    name: string;
    category: string;
    price: number;
    image?: string | null;
    slug?: string | null;
}
