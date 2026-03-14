/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

// GET /api/flash-sales/[id] - Lấy chi tiết campaign
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const campaign = await prisma.flashsalecampaign.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                                price: true,
                                category: true,
                                productImages: {
                                    orderBy: { order: "asc" },
                                    take: 1,
                                    select: { imageUrl: true }
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        logger.error("Get flash sale campaign error", error as Error, {
            context: "flash-sales-get-by-id",
        });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/flash-sales/[id] - Cập nhật campaign (admin)
export async function PATCH(
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

        const { name, description, discountType, discountValue, startAt, endAt, isActive } = body;

        const VALID_DISCOUNT_TYPES = new Set(["PERCENTAGE", "FIXED"]);
        if (discountType !== undefined && !VALID_DISCOUNT_TYPES.has(discountType)) {
            return NextResponse.json({ error: "discountType không hợp lệ" }, { status: 400 });
        }

        const parsedDiscountValue = discountValue !== undefined ? parseFloat(discountValue) : undefined;
        if (parsedDiscountValue !== undefined && (isNaN(parsedDiscountValue) || parsedDiscountValue < 0)) {
            return NextResponse.json({ error: "discountValue phải là số không âm" }, { status: 400 });
        }

        const parsedStartAt = startAt !== undefined ? new Date(startAt) : undefined;
        const parsedEndAt = endAt !== undefined ? new Date(endAt) : undefined;
        if (parsedStartAt && isNaN(parsedStartAt.getTime())) {
            return NextResponse.json({ error: "startAt không hợp lệ" }, { status: 400 });
        }
        if (parsedEndAt && isNaN(parsedEndAt.getTime())) {
            return NextResponse.json({ error: "endAt không hợp lệ" }, { status: 400 });
        }
        if (parsedStartAt && parsedEndAt && parsedEndAt <= parsedStartAt) {
            return NextResponse.json({ error: "endAt phải sau startAt" }, { status: 400 });
        }

        const campaign = await prisma.flashsalecampaign.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: String(name).slice(0, 200) }),
                ...(description !== undefined && { description: String(description).slice(0, 1000) }),
                ...(discountType !== undefined && { discountType }),
                ...(parsedDiscountValue !== undefined && { discountValue: parsedDiscountValue }),
                ...(parsedStartAt !== undefined && { startAt: parsedStartAt }),
                ...(parsedEndAt !== undefined && { endAt: parsedEndAt }),
                ...(isActive !== undefined && typeof isActive === "boolean" && { isActive }),
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        logger.error("Update flash sale campaign error", error as Error, {
            context: "flash-sales-patch",
        });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/flash-sales/[id] - Xóa campaign (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const campaign = await prisma.flashsalecampaign.findUnique({ where: { id } });
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        // Delete related flashsaleproducts first (cascade if not set in schema)
        await prisma.flashsaleproduct.deleteMany({ where: { campaignId: id } });
        await prisma.flashsalecampaign.delete({ where: { id } });

        logger.info("Flash sale campaign deleted", { campaignId: id, adminId: session.user.id });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error("Delete flash sale campaign error", error as Error, {
            context: "flash-sales-delete",
        });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
