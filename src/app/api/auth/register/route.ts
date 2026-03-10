/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { isValidEmailFormat, isDisposableEmail, isStrongPassword } from "@/lib/validation";
import { hasMXRecord } from "@/lib/validation-server";
import { registerRateLimit, getRateLimitIdentifier, applyRateLimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const identifier = getRateLimitIdentifier(req);
        const rateResult = await applyRateLimit(identifier, registerRateLimit);
        if (!rateResult.success && rateResult.error) {
            return rateResult.error;
        }

        const { email, password, name, phone, turnstileToken } = await req.json();

        if (!email || !password || !name || !phone) {
            return NextResponse.json(
                { error: "Vui lòng nhập đầy đủ thông tin." },
                { status: 400 }
            );
        }

        // --- VALIDATE TURNSTILE ---
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (siteKey && secretKey) {
            if (!turnstileToken) {
                return NextResponse.json(
                    { error: "Vui lòng xác thực CAPTCHA." },
                    { status: 400 }
                );
            }

            const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${secretKey}&response=${turnstileToken}`,
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return NextResponse.json(
                    { error: "Xác thực CAPTCHA thất bại. Vui lòng thử lại." },
                    { status: 400 }
                );
            }
        }

        // --- NEW VALIDATION ---
        if (!isValidEmailFormat(email)) {
            return NextResponse.json(
                { error: "Định dạng email không hợp lệ." },
                { status: 400 }
            );
        }

        if (isDisposableEmail(email)) {
            return NextResponse.json(
                { error: "Chúng tôi không chấp nhận dịch vụ email rác. Vui lòng dùng email thật." },
                { status: 400 }
            );
        }

        const mxExists = await hasMXRecord(email);
        if (!mxExists) {
            return NextResponse.json(
                { error: "Email này không tồn tại hoặc không thể nhận thư. Vui lòng kiểm tra lại." },
                { status: 400 }
            );
        }
        if (!isStrongPassword(password)) {
            return NextResponse.json(
                { error: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số." },
                { status: 400 }
            );
        }

        // --- END NEW VALIDATION ---

        // Ràng buộc độ dài số điện thoại cơ bản ở Backend
        if (phone.length < 9 || phone.length > 13) {
            return NextResponse.json(
                { error: "Số điện thoại không hợp lệ." },
                { status: 400 }
            );
        }

        // Check if user already exists
        // AUTH-04: Check BOTH email and phone in the same query to prevent enumeration
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: { contains: phone.replace(/\D/g, "").slice(-9) } }
                ]
            }
        });

        // AUTH-04: Return GENERIC message for BOTH cases to prevent user enumeration
        // Never reveal whether it's email or phone that exists
        if (existingUser) {
            return NextResponse.json(
                { error: "Tài khoản đã tồn tại. Vui lòng đăng nhập hoặc khôi phục mật khẩu." },
                { status: 200 } // Return 200 to not reveal that account exists
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: "USER"
            }
        });

        // Tạo mã OTP 6 ký tự (Chữ in hoa và số)
        const generateOTP = () => {
            const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let result = "";
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        const otp = generateOTP();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

        await prisma.verificationtoken.create({
            data: {
                identifier: email,
                token: otp,
                expires
            }
        });

        // Gửi email xác thực thật
        const emailResult = await sendVerificationEmail(email, otp);

        if (!emailResult.success) {
            logger.warn("[MAIL] Failed to send verification email", {
                context: "auth-register",
                email,
                error: emailResult.error,
            });
        }

        return NextResponse.json(
            {
                ok: true,
                status: "PENDING_EMAIL_VERIFY",
                message: "Vui lòng kiểm tra email để xác thực tài khoản."
            },
            { status: 201 }
        );
    } catch (error) {
        logger.error("Registration error", error as Error, { context: "auth-register" });
        return NextResponse.json(
            { error: "Đã có lỗi xảy ra trong quá trình đăng ký." },
            { status: 500 }
        );
    }
}
