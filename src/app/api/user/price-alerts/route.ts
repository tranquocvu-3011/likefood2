/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET user's price alerts (wishlist products with price tracking)
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get user's wishlist products
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        salePrice: true,
                        originalPrice: true,
                        image: true,
                        isOnSale: true,
                        saleStartAt: true,
                        saleEndAt: true,
                    },
                },
            },
        });

        // Check for price drops
        const alerts = wishlist
            .filter(item => {
                const product = item.product;
                const currentPrice = product.salePrice || product.price;
                const originalPrice = product.originalPrice || product.price;
                
                // Price drop if current price is lower than original
                return currentPrice < originalPrice;
            })
            .map(item => {
                const product = item.product;
                const currentPrice = product.salePrice || product.price;
                const originalPrice = product.originalPrice || product.price;
                const dropPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                
                return {
                    productId: product.id,
                    productName: product.name,
                    productSlug: product.slug,
                    productImage: product.image,
                    originalPrice,
                    currentPrice,
                    dropPercent,
                };
            });

        return NextResponse.json({ alerts });
    } catch (error) {
        console.error("Failed to fetch price alerts:", error);
        return NextResponse.json({ error: "Failed to fetch price alerts" }, { status: 500 });
    }
}
