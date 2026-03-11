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
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";
import {
  generateMarketingEmail,
  getAIAnalyticsInsights,
  getAIChatResponse,
  getAICustomerInsights,
  getAIInventoryForecast,
  getAIProductRecommendations,
  getAISEOSuggestions,
  getAIPricingStrategy,
  getAISummary,
} from "@/lib/ai/admin-service";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  // Rate limit: 30/min per admin to protect Gemini API costs
  const identifier = getRateLimitIdentifier(req);
  const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60 * 1000, maxRequests: 30 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    switch (type) {
      case "analytics": {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const orders = await prisma.order.findMany({
          where: {
            createdAt: { gte: startDate },
            status: { in: ["COMPLETED", "DELIVERED"] },
          },
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        });

        const grouped = orders.reduce<Record<string, { date: string; revenue: number; orders: number; customers: number }>>((accumulator, order) => {
          const date = order.createdAt.toISOString().split("T")[0];
          const current = accumulator[date] ?? { date, revenue: 0, orders: 0, customers: 0 };
          current.revenue += order.total;
          current.orders += 1;
          accumulator[date] = current;
          return accumulator;
        }, {});

        const insights = await getAIAnalyticsInsights(Object.values(grouped));
        return NextResponse.json({ insights });
      }

      case "inventory": {
        const products = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            inventory: true,
            soldCount: true,
            ratingAvg: true,
          },
        });

        const forecasts = await getAIInventoryForecast(products);
        return NextResponse.json({ forecasts: forecasts.slice(0, 10) });
      }

      case "customers": {
        const customers = await prisma.user.findMany({
          where: { role: "USER" },
          select: {
            id: true,
            name: true,
            email: true,
            orders: {
              select: { total: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
            createdAt: true,
          },
        });

        const customerData = customers.map((customer) => ({
          id: customer.id,
          name: customer.name || "Unknown",
          email: customer.email,
          totalSpent: customer.orders.reduce((sum, order) => sum + order.total, 0),
          orderCount: customer.orders.length,
          lastOrderDate: customer.orders[0]?.createdAt?.toISOString() || customer.createdAt.toISOString(),
          segment: customer.orders.reduce((sum, order) => sum + order.total, 0) >= 500 ? "VIP" : "Regular",
        }));

        const segments = await getAICustomerInsights(customerData);
        return NextResponse.json({ segments });
      }

      case "products": {
        const products = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            inventory: true,
            soldCount: true,
            ratingAvg: true,
          },
          orderBy: { soldCount: "desc" },
          take: 20,
        });

        const recommendations = await getAIProductRecommendations(products, 5);
        return NextResponse.json({ recommendations });
      }

      case "summary": {
        const [orderCount, revenue, customerCount] = await Promise.all([
          prisma.order.count(),
          prisma.order.aggregate({ _sum: { total: true } }),
          prisma.user.count({ where: { role: "USER" } }),
        ]);

        const summary = await getAISummary({
          revenue: revenue._sum.total || 0,
          orders: orderCount,
          customers: customerCount,
          period: "overall",
        });

        return NextResponse.json({ summary });
      }

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("AI Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: 20/min per IP to protect Gemini API costs
  const identifier = getRateLimitIdentifier(req);
  const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60 * 1000, maxRequests: 20 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const action = body?.action;
    const data = body?.data ?? {};

    switch (action) {
      case "seo_suggestions": {
        const suggestions = await getAISEOSuggestions(data.productName, data.category, data.description);
        return NextResponse.json(suggestions);
      }

      case "pricing_strategy": {
        const strategy = await getAIPricingStrategy(data.product, data.competitors || []);
        return NextResponse.json(strategy);
      }

      case "generate_email": {
        const email = await generateMarketingEmail(data.type, data.context);
        return NextResponse.json({ email });
      }

      case "chat": {
        const chatMessage = body?.data?.message ?? body?.message;
        if (!chatMessage || typeof chatMessage !== "string") {
          return NextResponse.json({ error: "Message is required." }, { status: 400 });
        }
        if (chatMessage.length > 2000) {
          return NextResponse.json({ error: "Message must be 2000 characters or fewer." }, { status: 400 });
        }

        const [recentOrders, revenueStats, customerCount, topProducts] = await Promise.all([
          prisma.order.count({
            where: {
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          }),
          prisma.order.aggregate({
            where: { status: { in: ["COMPLETED", "DELIVERED"] } },
            _sum: { total: true },
          }),
          prisma.user.count({ where: { role: "USER" } }),
          prisma.product.findMany({
            orderBy: { soldCount: "desc" },
            take: 5,
            select: { name: true, soldCount: true, inventory: true, price: true },
          }),
        ]);

        const liveContext = {
          recentOrders,
          totalCustomers: customerCount,
          totalRevenue: revenueStats._sum.total || 0,
          topProducts: topProducts.map((product) => `${product.name} | sold ${product.soldCount} | stock ${product.inventory} | ${product.price.toFixed(2)} USD`),
        };

        const response = await getAIChatResponse(chatMessage, {
          ...liveContext,
          ...(body?.data?.context ?? body?.context ?? {}),
        });

        return NextResponse.json({ response });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("AI Admin POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
