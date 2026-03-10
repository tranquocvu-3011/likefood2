/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/lib/logger";
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: NextRequest) {
    // Rate limit: 10 per minute per IP to protect Gemini API cost
    const identifier = getRateLimitIdentifier(req);
    const rl = await applyRateLimit(identifier, apiRateLimit, { windowMs: 60 * 1000, maxRequests: 10 });
    if (!rl.success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });
        }

        // Fetch approved reviews
        const reviews = await prisma.review.findMany({
            where: {
                productId,
                status: "APPROVED",
                NOT: [
                    { comment: null },
                    { comment: "" }
                ]
            },
            select: {
                rating: true,
                comment: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" },
            take: 20 // Limit for context
        });

        if (reviews.length === 0) {
            return NextResponse.json({ summary: "Chưa có đánh giá chi tiết nào cho sản phẩm này." });
        }

        // If very few reviews, just return a simple formatted list or handle locally
        if (reviews.length < 3) {
            const combined = reviews.map(r => `- [${r.rating}*] ${r.comment}`).join("\n");
            return NextResponse.json({
                summary: `Dựa trên ${reviews.length} đánh giá gần đây:\n${combined}`
            });
        }

        // Build prompt for Gemini
        const reviewsText = reviews.map(r => `Rating: ${r.rating}, Comment: ${r.comment}`).join("\n---\n");

        const systemPrompt = `
Bạn là chuyên gia phân tích dữ liệu mua sắm của LIKEFOOD.
Hãy tóm tắt các đánh giá sau đây của khách hàng về một sản phẩm.
Yêu cầu:
1. Ngôn ngữ: Tiếng Việt.
2. Cấu trúc:
   - Một câu tóm tắt tổng quan về mức độ hài lòng.
   - Ưu điểm: (liệt kê 2-3 điểm nổi bật).
   - Nhược điểm: (nếu có, nếu không thì ghi là chưa có ghi nhận tiêu cực nào).
3. Phong cách: Thân thiện, khách quan, chuyên nghiệp.
4. Không bịa đặt thông tin không có trong dữ liệu.
`;

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            // Local simple summarization fallback
            const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
            return NextResponse.json({
                summary: `Tóm tắt (Hệ thống AI đang bảo trì): Khách hàng đánh giá trung bình ${avgRating.toFixed(1)}/5 sao. Đa số khách hàng hài lòng với chất lượng sản phẩm.`
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `${systemPrompt}\n\nDưới đây là danh sách các đánh giá:\n${reviewsText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ summary: text });

    } catch (error) {
        logger.error("AI Summarize Error", error as Error, { context: "ai-summarize-api" });
        return NextResponse.json({ error: "Failed to summarize reviews" }, { status: 500 });
    }
}
