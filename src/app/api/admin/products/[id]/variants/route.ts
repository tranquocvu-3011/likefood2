/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/products/[id]/variants - List variants for a product
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const variants = await prisma.productvariant.findMany({
            where: { productId: id },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(variants);
    } catch (error) {
        console.error("Error fetching variants:", error);
        return NextResponse.json({ error: "Lỗi tải biến thể" }, { status: 500 });
    }
}

// POST /api/admin/products/[id]/variants - Create new variant
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { weight, flavor, priceAdjustment, stock, sku, isActive } = body;

        // Check product exists
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
        }

        // Check SKU uniqueness if provided
        if (sku) {
            const existingSku = await prisma.productvariant.findUnique({ where: { sku } });
            if (existingSku) {
                return NextResponse.json({ error: "SKU đã tồn tại" }, { status: 400 });
            }
        }

        const variant = await prisma.productvariant.create({
            data: {
                productId: id,
                weight: weight || null,
                flavor: flavor || null,
                priceAdjustment: parseFloat(priceAdjustment) || 0,
                stock: parseInt(stock) || 0,
                sku: sku || null,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json(variant, { status: 201 });
    } catch (error) {
        console.error("Error creating variant:", error);
        return NextResponse.json({ error: "Lỗi tạo biến thể" }, { status: 500 });
    }
}
