/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
    try {
        const identifier = getRateLimitIdentifier(req);
        const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60000, maxRequests: 30 });
        if (!rl.success) return NextResponse.json({ hints: [] }, { status: 429 });

        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";

        if (!q || q.length < 2) {
            return NextResponse.json({ hints: [] });
        }

        if (q.length > 100) {
            return NextResponse.json({ hints: [] });
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { category: { contains: q } },
                ],
                inventory: { gt: 0 }
            },
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                image: true,
                slug: true,
            },
            take: 6,
        });

        return NextResponse.json({ hints: products });
    } catch {
        return NextResponse.json({ hints: [] });
    }
}
