/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

// GET /api/search/suggestions?q=abc — Returns product name suggestions for autocomplete
export async function GET(request: NextRequest) {
    try {
        const identifier = getRateLimitIdentifier(request);
        const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60000, maxRequests: 30 });
        if (!rl.success) return rl.error as unknown as NextResponse;

        const q = request.nextUrl.searchParams.get("q")?.trim();
        if (!q || q.length < 2) {
            return NextResponse.json([]);
        }
        // Prevent extremely long queries
        if (q.length > 100) {
            return NextResponse.json([]);
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { category: { contains: q } },
                    { tags: { contains: q } },
                ],
                inventory: { gt: 0 },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                category: true,
                price: true,
                salePrice: true,
                image: true,
                productImages: {
                    orderBy: { order: "asc" },
                    take: 1,
                    select: { imageUrl: true }
                },
            },
            take: 6,
            orderBy: { soldCount: "desc" },
        });

        const suggestions = products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: p.salePrice ?? p.price,
            image: p.image || p.productImages?.[0]?.imageUrl || null,
        }));

        const res = NextResponse.json(suggestions);
        res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
        return res;
    } catch (error) {
        console.error("Search suggestions error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
