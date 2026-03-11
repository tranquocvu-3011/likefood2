/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/auth/magic-link/confirm?token=xxx&email=xxx
// Xác thực magic link và redirect sang app với session
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
            return NextResponse.redirect(new URL("/login?error=invalid_link", req.url));
        }

        const user = await prisma.user.findUnique({
            where: { email: decodeURIComponent(email) },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.redirect(new URL("/login?error=invalid_link", req.url));
        }

        // Tìm token hợp lệ
        const verificationToken = await prisma.verificationtoken.findFirst({
            where: {
                identifier: `magic:${user.id}`,
                token,
                expires: { gte: new Date() },
            },
        });

        if (!verificationToken) {
            return NextResponse.redirect(new URL("/login?error=expired_link", req.url));
        }

        // Redirect đến trang magic-login-success với thông tin để frontend signIn
        // Không xóa token ở đây, để NextAuth authorize handling xóa 
        // để tránh lỗi mất token khi đăng nhập
        const url = new URL("/magic-login-success", req.url);
        url.searchParams.set("email", email);
        url.searchParams.set("token", token);
        url.searchParams.set("verified", "true");
        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Magic link confirm error:", error);
        return NextResponse.redirect(new URL("/login?error=server_error", req.url));
    }
}
