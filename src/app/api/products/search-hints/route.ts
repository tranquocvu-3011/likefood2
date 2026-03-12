/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/client";
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

        // Use COLLATE utf8mb4_bin for accent-sensitive matching
        // (default utf8mb4_unicode_ci strips Vietnamese diacritics, causing false positives)
        const like = `%${q}%`;
        const products = await prisma.$queryRaw<Array<{
            id: string;
            name: string;
            category: string | null;
            price: number;
            image: string | null;
            slug: string | null;
        }>>(Prisma.sql`
            SELECT id, name, category, price, image, slug
            FROM product
            WHERE (
                name     COLLATE utf8mb4_bin LIKE ${like}
                OR category COLLATE utf8mb4_bin LIKE ${like}
            )
            AND inventory > 0
            AND isDeleted = 0
            AND isVisible = 1
            LIMIT 6
        `);

        const res = NextResponse.json({ hints: products });
        res.headers.set("Cache-Control", "no-store");
        return res;
    } catch {
        return NextResponse.json({ hints: [] });
    }
}
