/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import prisma from "@/lib/prisma";
import dynamic from "next/dynamic";

const FeaturedStickyShowcase = dynamic(
    () => import("@/components/shared/FeaturedStickyShowcase"),
    { ssr: true }
);

export default async function FeaturedProductsSection() {
    let rawProducts: Array<{
        id: string;
        slug: string | null;
        name: string;
        price: number;
        originalPrice: number | null;
        image: string | null;
        category: string;
    }> = [];

    try {
        rawProducts = await prisma.product.findMany({
            where: { featured: true, inventory: { gt: 0 } },
            select: {
                id: true,
                slug: true,
                name: true,
                price: true,
                originalPrice: true,
                image: true,
                category: true,
            },
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            take: 8,
        });

        if (rawProducts.length === 0) {
            rawProducts = await prisma.product.findMany({
                where: { inventory: { gt: 0 } },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    price: true,
                    originalPrice: true,
                    image: true,
                    category: true,
                },
                orderBy: [{ createdAt: "desc" }, { id: "asc" }],
                take: 8,
            });
        }
    } catch (error) {
        console.error("FeaturedProductsSection fetch error:", error);
        // Return empty array instead of null to allow parent to handle gracefully
        return <FeaturedStickyShowcase products={[]} />;
    }

    if (rawProducts.length === 0) {
        // Return empty showcase instead of silent null
        return <FeaturedStickyShowcase products={[]} />;
    }

    const products = rawProducts.map(p => ({
        id: p.id,
        slug: p.slug || p.id,
        name: p.name,
        price: p.price,
        basePrice: p.originalPrice ?? undefined,
        image: p.image ?? undefined,
        category: p.category,
        colorLabel: p.category,
    }));

    return <FeaturedStickyShowcase products={products} />;
}
