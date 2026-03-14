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

// GET /api/flash-sales - Lấy danh sách flash sale campaigns
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get("active");

        const now = new Date();
        const where: {
            isActive?: boolean;
            startAt?: { lte: Date };
            endAt?: { gte: Date };
        } = {};

        if (active === "true") {
            where.isActive = true;
            where.startAt = { lte: now };
            where.endAt = { gte: now };
        }

        const campaigns = await prisma.flashsalecampaign.findMany({
            where,
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
                                ratingAvg: true,
                                soldCount: true,
                                productImages: {
                                    orderBy: { order: "asc" },
                                    take: 1,
                                    select: { imageUrl: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { startAt: 'desc' }
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        logger.error("Get flash sales error", error as Error, {
            context: "flash-sales-api-get"
        });
        return NextResponse.json(
            { error: "Failed to fetch flash sales" },
            { status: 500 }
        );
    }
}

// POST /api/flash-sales - Tạo flash sale campaign mới (Admin only)
export async function POST(request: NextRequest) {
    // K-01: Auth guard — chỉ ADMIN và SUPER_ADMIN được tạo flash sale
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const [{ createFlashSaleSchema }, { validationErrorResponse }] = await Promise.all([
            import('@/lib/validations/flashsale'),
            import('@/lib/validations/utils'),
        ]);

        const parsed = createFlashSaleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                validationErrorResponse(parsed.error),
                { status: 400 }
            );
        }

        const { name, startAt, endAt, isActive } = parsed.data;

        const campaign = await prisma.flashsalecampaign.create({
            data: {
                name,
                startAt,
                endAt,
                isActive: isActive ?? true
            }
        });

        logger.info("Flash sale campaign created", { campaignId: campaign.id });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        logger.error("Create flash sale error", error as Error, {
            context: "flash-sales-api-post"
        });
        return NextResponse.json(
            { error: "Failed to create flash sale" },
            { status: 500 }
        );
    }
}
