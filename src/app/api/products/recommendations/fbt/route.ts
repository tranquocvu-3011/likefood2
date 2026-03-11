/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
    // Rate limit: prevent DB hammering via FBT heavy queries
    const identifier = getRateLimitIdentifier(req);
    const rateResult = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60 * 1000, maxRequests: 30 });
    if (!rateResult.success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const identifier = searchParams.get("product");

        if (!identifier) {
            return NextResponse.json({ error: "Product ID or slug is required" }, { status: 400 });
        }

        // Find product first
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { slug: identifier }
                ]
            },
            select: { id: true, category: true }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const productId = product.id;

        // 1. Find all orders containing this product
        const ordersWithProduct = await prisma.orderitem.findMany({
            where: { productId },
            select: { orderId: true }
        });

        const orderIds = ordersWithProduct.map(o => o.orderId);

        // 2. Find other products in those same orders
        const otherProductsInOrders = await prisma.orderitem.findMany({
            where: {
                orderId: { in: orderIds },
                productId: { not: productId }
            },
            select: { productId: true }
        });

        // 3. Count frequencies
        const frequencyMap: Record<string, number> = {};
        otherProductsInOrders.forEach(item => {
            frequencyMap[item.productId] = (frequencyMap[item.productId] || 0) + 1;
        });

        // 4. Sort and get top IDs
        const sortedIds = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        // 5. Fetch full product details for these IDs
        let recommendedProducts = await prisma.product.findMany({
            where: { id: { in: sortedIds } },
            select: {
                id: true,
                slug: true,
                name: true,
                price: true,
                originalPrice: true,
                salePrice: true,
                isOnSale: true,
                image: true,
                inventory: true,
                category: true
            }
        });

        // 6. Fallback if not enough products found (too little order data)
        if (recommendedProducts.length < 2) {
            const fallbackProducts = await prisma.product.findMany({
                where: {
                    id: { not: productId },
                    category: product.category,
                    inventory: { gt: 0 }
                },
                take: 3 - recommendedProducts.length,
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    price: true,
                    originalPrice: true,
                    salePrice: true,
                    isOnSale: true,
                    image: true,
                    inventory: true,
                    category: true
                }
            });
            recommendedProducts = [...recommendedProducts, ...fallbackProducts];
        }

        return NextResponse.json(recommendedProducts);

    } catch (error) {
        logger.error("Frequently Bought Together Error", error as Error, { context: "fbt-api" });
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }
}
