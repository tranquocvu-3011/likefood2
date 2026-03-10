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
import { Prisma } from "../../../../generated/client";

// GET all customers (admin)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20));
        const skip = (page - 1) * limit;

        const where: Prisma.userWhereInput = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ];
        }

        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where: {
                    ...where,
                    role: "USER",
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    createdAt: true,
                    _count: {
                        select: {
                            reviews: true,
                            wishlists: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.user.count({
                where: {
                    ...where,
                    role: "USER",
                },
            }),
        ]);

        // Get order stats in a single query (avoid N+1)
        const orderStats = await prisma.order.groupBy({
            by: ["userId"],
            where: { userId: { in: customers.map((c) => c.id) } },
            _count: { _all: true },
            _sum: { total: true },
        });
        const statsMap = new Map(
            orderStats.map((s) => [s.userId, { count: s._count._all, total: s._sum.total ?? 0 }])
        );
        const customersWithStats = customers.map((customer) => ({
            ...customer,
            totalSpent: statsMap.get(customer.id)?.total ?? 0,
            orderCount: statsMap.get(customer.id)?.count ?? 0,
        }));

        return NextResponse.json({
            customers: customersWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Customers fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
