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

// PUT - Rename a category (update all products with that category)
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { oldName, newName } = await request.json();

        if (!oldName || !newName) {
            return NextResponse.json({ error: "Cần cung cấp tên cũ và tên mới" }, { status: 400 });
        }
        if (typeof oldName !== "string" || oldName.trim().length === 0 || oldName.length > 200) {
            return NextResponse.json({ error: "oldName không hợp lệ (tối đa 200 ký tự)" }, { status: 400 });
        }
        if (typeof newName !== "string" || newName.trim().length === 0 || newName.length > 200) {
            return NextResponse.json({ error: "newName không hợp lệ (tối đa 200 ký tự)" }, { status: 400 });
        }

        // Check if newName already exists
        const existingProducts = await prisma.product.count({
            where: { category: newName },
        });

        if (existingProducts > 0 && oldName !== newName) {
            return NextResponse.json(
                { error: `Danh mục "${newName}" đã tồn tại với ${existingProducts} sản phẩm` },
                { status: 409 }
            );
        }

        // Update all products with old category name to new name
        const result = await prisma.product.updateMany({
            where: { category: oldName },
            data: { category: newName },
        });

        return NextResponse.json({
            message: `Đã đổi tên "${oldName}" → "${newName}" cho ${result.count} sản phẩm`,
            count: result.count,
        });
    } catch (error) {
        console.error("Category rename error:", error);
        return NextResponse.json({ error: "Lỗi khi đổi tên danh mục" }, { status: 500 });
    }
}

// GET - Get all categories with product counts
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            select: { category: true },
            distinct: ["category"],
        });

        const categoriesWithCounts = await Promise.all(
            products.map(async (p) => {
                const count = await prisma.product.count({
                    where: { category: p.category },
                });
                return {
                    name: p.category,
                    slug: p.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unknown",
                    productCount: count,
                };
            })
        );

        categoriesWithCounts.sort((a, b) => b.productCount - a.productCount);
        return NextResponse.json(categoriesWithCounts);
    } catch (error) {
        console.error("Category fetch error:", error);
        return NextResponse.json({ error: "Lỗi khi lấy danh mục" }, { status: 500 });
    }
}
