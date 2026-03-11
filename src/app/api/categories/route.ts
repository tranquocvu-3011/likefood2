/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from '@/lib/ratelimit';

export async function GET(req: NextRequest) {
    const identifier = getRateLimitIdentifier(req);
    const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60 * 1000, maxRequests: 30 });
    if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    try {
        // Get distinct categories from products with inventory
        const products = await prisma.product.findMany({
            where: {
                inventory: { gt: 0 }
            },
            select: {
                category: true
            },
            distinct: ['category']
        });

        // Map to category list with counts
        const categoriesWithCounts = await Promise.all(
            products.map(async (p) => {
                const count = await prisma.product.count({
                    where: {
                        category: p.category,
                        inventory: { gt: 0 }
                    }
                });
                return {
                    name: p.category,
                    slug: p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown',
                    productCount: count
                };
            })
        );

        // Sort by product count descending
        categoriesWithCounts.sort((a, b) => b.productCount - a.productCount);

        const res = NextResponse.json(categoriesWithCounts);
        // Categories thay đổi ít → cache 10 phút
        res.headers.set(
            "Cache-Control",
            "public, s-maxage=600, stale-while-revalidate=1200"
        );
        return res;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
