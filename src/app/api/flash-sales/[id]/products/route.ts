/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "../../../../../lib/prisma";
import { logger } from "@/lib/logger";

// GET /api/flash-sales/[id]/products - Lấy sản phẩm trong campaign
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const products = await prisma.flashsaleproduct.findMany({
            where: { campaignId: id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                        price: true,
                        category: true,
                        ratingAvg: true,
                        ratingCount: true,
                        soldCount: true,
                        inventory: true
                    }
                }
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        logger.error("Get flash sale products error", error as Error, {
            context: "flash-sales-products-api-get"
        });
        return NextResponse.json(
            { error: "Failed to fetch flash sale products" },
            { status: 500 }
        );
    }
}

// POST /api/flash-sales/[id]/products - Thêm sản phẩm vào campaign (Admin)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();

        const [{ addProductToFlashSaleSchema }, { validationErrorResponse }] = await Promise.all([
            import('@/lib/validations/flashsale'),
            import('@/lib/validations/utils'),
        ]);

        const parsed = addProductToFlashSaleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                validationErrorResponse(parsed.error),
                { status: 400 }
            );
        }

        const { productId, flashSalePrice, stockLimit } = parsed.data;

        // Check if campaign exists
        const campaign = await prisma.flashsalecampaign.findUnique({
            where: { id }
        });

        if (!campaign) {
            return NextResponse.json(
                { error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Add product to campaign
        const flashSaleProduct = await prisma.flashsaleproduct.create({
            data: {
                campaignId: id,
                productId,
                flashSalePrice,
                stockLimit,
                soldCount: 0
            },
            include: {
                product: {
                    select: {
                        name: true,
                        slug: true,
                        price: true
                    }
                }
            }
        });

        logger.info("Product added to flash sale", {
            flashSaleProductId: flashSaleProduct.id,
            campaignId: id,
            productId
        });

        return NextResponse.json(flashSaleProduct, { status: 201 });
    } catch (error) {
        logger.error("Add product to flash sale error", error as Error, {
            context: "flash-sales-products-api-post"
        });
        return NextResponse.json(
            { error: "Failed to add product to flash sale" },
            { status: 500 }
        );
    }
}

// DELETE /api/flash-sales/[id]/products - Xóa sản phẩm khỏi campaign
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { error: "productId is required" },
                { status: 400 }
            );
        }

        // Validate với schema chung
        const [{ removeProductFromFlashSaleSchema }, { validationErrorResponse }] = await Promise.all([
            import('@/lib/validations/flashsale'),
            import('@/lib/validations/utils'),
        ]);

        const parsed = removeProductFromFlashSaleSchema.safeParse({
            flashSaleId: id,
            productId,
        });

        if (!parsed.success) {
            return NextResponse.json(
                validationErrorResponse(parsed.error),
                { status: 400 }
            );
        }

        await prisma.flashsaleproduct.delete({
            where: {
                campaignId_productId: {
                    campaignId: id,
                    productId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error("Remove product from flash sale error", error as Error, {
            context: "flash-sales-products-api-delete"
        });
        return NextResponse.json(
            { error: "Failed to remove product from flash sale" },
            { status: 500 }
        );
    }
}
