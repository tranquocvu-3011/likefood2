/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 *
 * GET /api/categories/menu
 * Returns active categories with up to 4 real products each — used by MegaMenu.
 * Lightweight, cached response (60s stale-while-revalidate).
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 60; // ISR: revalidate every 60s

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true, isVisible: true, parentId: null },
            orderBy: { position: "asc" },
            select: { id: true, name: true, slug: true },
            take: 8,
        });

        // Fetch up to 4 products per category in parallel
        const results = await Promise.all(
            categories.map(async (cat) => {
                const products = await prisma.product.findMany({
                    where: {
                        isDeleted: false,
                        isVisible: true,
                        OR: [
                            { categoryId: cat.id },
                            { category: cat.name },
                        ],
                    },
                    orderBy: [
                        { soldCount: "desc" },
                        { ratingAvg: "desc" },
                    ],
                    take: 4,
                    select: {
                        id: true,
                        slug: true,
                        name: true,
                        price: true,
                        salePrice: true,
                        image: true,
                    },
                });

                return {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    products,
                };
            })
        );

        // Only return categories that have at least 1 product
        const withProducts = results.filter((c) => c.products.length > 0);

        return NextResponse.json({ categories: withProducts });
    } catch (error) {
        console.error("[CATEGORIES_MENU_GET]", error);
        return NextResponse.json({ categories: [] }, { status: 500 });
    }
}
