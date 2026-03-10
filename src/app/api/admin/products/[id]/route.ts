/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET /api/admin/products/[id] - Lấy chi tiết sản phẩm cho trang admin (không include reviews/flash sale nặng)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                productImages: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            images: product.productImages,
        });
    } catch (error) {
        logger.error("Admin product fetch error", error as Error, {
            context: "admin-product-get",
        });
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PUT /api/admin/products/[id] - Cập nhật sản phẩm từ trang admin
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const {
            name,
            description,
            price,
            originalPrice,
            salePrice,
            isOnSale,
            badgeText,
            tags,
            category,
            inventory,
            image,
            featured,
            weight,
            images: galleryImages,
        } = body;

        // Normalize numeric fields defensively
        const normalizeNumber = (val: unknown): number | null => {
            if (typeof val === "number" && Number.isFinite(val)) return val;
            if (typeof val === "string" && val.trim() !== "") {
                const parsed = Number.parseFloat(val);
                if (!Number.isNaN(parsed)) return parsed;
            }
            return null;
        };

        const priceNumber = normalizeNumber(price);
        const originalPriceNumber = normalizeNumber(originalPrice);
        const salePriceNumber = normalizeNumber(salePrice);

        let inventoryNumber: number | null = null;
        if (typeof inventory === "number" && Number.isFinite(inventory)) {
            inventoryNumber = Math.trunc(inventory);
        } else if (typeof inventory === "string" && inventory.trim() !== "") {
            const parsed = Number.parseInt(inventory, 10);
            if (!Number.isNaN(parsed)) inventoryNumber = parsed;
        }

        const updatedProduct = await prisma.$transaction(async (tx) => {
            // Update main product info
            const product = await tx.product.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    // Không tự đổi slug khi đổi tên để tránh link cũ 404
                    ...(description && { description }),
                    ...(priceNumber !== null && { price: priceNumber }),
                    ...(originalPrice !== undefined && { originalPrice: originalPriceNumber }),
                    ...(salePrice !== undefined && { salePrice: salePriceNumber }),
                    ...(typeof isOnSale !== "undefined" && {
                        isOnSale: !!isOnSale && !!salePriceNumber,
                    }),
                    ...(badgeText !== undefined && { badgeText: badgeText || null }),
                    ...(tags !== undefined && { tags: tags || null }),
                    ...(category && { category }),
                    ...(inventoryNumber !== null && { inventory: inventoryNumber }),
                    ...(image !== undefined && { image: image || null }),
                    ...(typeof featured !== "undefined" && { featured }),
                    ...(weight !== undefined && { weight: weight || null }),
                },
            });

            // Update gallery images if provided
            if (galleryImages && Array.isArray(galleryImages)) {
                await tx.productimage.deleteMany({
                    where: { productId: id },
                });

                if (galleryImages.length > 0) {
                    await tx.productimage.createMany({
                        data: galleryImages.map((url: string, index: number) => ({
                            productId: id,
                            imageUrl: url,
                            order: index,
                            isPrimary: false,
                        })),
                    });
                }
            }

            return product;
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        logger.error("Admin product update error", error as Error, {
            context: "admin-product-put",
        });
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

