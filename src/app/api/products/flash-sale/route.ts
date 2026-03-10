/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/products/flash-sale - Get products currently on flash sale
export async function GET() {
    try {
        const now = new Date();

        // Get products that are on sale and within the sale time window
        const flashProducts = await prisma.product.findMany({
            where: {
                isOnSale: true,
                salePrice: { not: null },
                saleStartAt: { lte: now },
                saleEndAt: { gte: now },
                inventory: { gt: 0 }
            },
            orderBy: [
                { saleStartAt: 'desc' },
                { createdAt: 'desc' }
            ],
            take: 20
        });

        // Calculate discount percentage and format response
        const products = flashProducts.map(product => {
            const discount = product.salePrice && product.price > 0
                ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                : 0;

            return {
                id: product.id,
                slug: product.slug || product.id,
                name: product.name,
                originalPrice: product.price,
                salePrice: product.salePrice,
                discount,
                image: product.image,
                category: product.category,
                inventory: product.inventory,
                soldCount: 0, // Can be tracked separately
                badgeText: product.badgeText,
                saleEndAt: product.saleEndAt,
                isHot: discount >= 30 // Mark as hot if 30%+ off
            };
        });

        // Get the earliest end time for countdown
        const nextEndTime = flashProducts.length > 0
            ? Math.min(...flashProducts.filter(p => p.saleEndAt).map(p => p.saleEndAt!.getTime()))
            : null;

        return NextResponse.json({
            products,
            countdown: nextEndTime ? new Date(nextEndTime).toISOString() : null,
            total: products.length
        });

    } catch (error) {
        console.error('Flash sale error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra khi lấy sản phẩm flash sale' },
            { status: 500 }
        );
    }
}

// POST /api/products/flash-sale - Set flash sale for a product (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, salePrice, saleStartAt, saleEndAt, badgeText } = await request.json();

        if (!productId || salePrice === undefined) {
            return NextResponse.json(
                { error: 'productId và salePrice là bắt buộc' },
                { status: 400 }
            );
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                salePrice: salePrice || null,
                saleStartAt: saleStartAt ? new Date(saleStartAt) : new Date(),
                saleEndAt: saleEndAt ? new Date(saleEndAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
                isOnSale: salePrice > 0,
                badgeText: badgeText || null
            }
        });

        return NextResponse.json({
            success: true,
            product: {
                id: product.id,
                name: product.name,
                salePrice: product.salePrice,
                isOnSale: product.isOnSale,
                saleStartAt: product.saleStartAt,
                saleEndAt: product.saleEndAt
            }
        });

    } catch (error) {
        console.error('Set flash sale error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra khi thiết lập flash sale' },
            { status: 500 }
        );
    }
}
