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

// Whitelist of allowed setting keys — prevents arbitrary key injection into systemsetting
const ALLOWED_SETTING_KEYS = new Set([
    "site_name", "site_description", "site_logo", "site_favicon",
    "contact_email", "contact_phone", "contact_address",
    "shipping_fee", "free_shipping_threshold", "tax_rate",
    "maintenance_mode", "maintenance_message",
    "smtp_host", "smtp_port", "smtp_user",
    "facebook_url", "instagram_url", "tiktok_url", "youtube_url",
    "points_per_order", "points_redemption_rate",
    "checkin_points", "referral_points",
    "meta_title", "meta_description", "meta_keywords",
    "announcement_bar", "announcement_text",
    // Payment settings
    "payment_cod_enabled", "payment_bank_enabled", "payment_momo_enabled",
    "payment_paypal_enabled", "payment_stripe_enabled", "zalo_pay_enabled",
    "bank_name", "bank_account_name", "bank_account_number",
    "bank_qr_image_url", "momo_qr_image_url", "paypal_client_id", "zalo_pay_qr_url",
]);

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await prisma.systemsetting.findMany();
        const settingsMap = settings.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate keys against whitelist — reject unknown setting keys
        const entries = Object.entries(body);
        const unknownKeys = entries.filter(([key]) => !ALLOWED_SETTING_KEYS.has(key)).map(([key]) => key);
        if (unknownKeys.length > 0) {
            return NextResponse.json({ error: `Không được phép cập nhật cài đặt: ${unknownKeys.join(", ")}` }, { status: 400 });
        }

        // Cap value length to prevent large payload abuse
        const promises = entries.map(([key, value]) => {
            const strValue = String(value).slice(0, 5000);
            return prisma.systemsetting.upsert({
                where: { key },
                update: { value: strValue },
                create: { key, value: strValue },
            });
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[SETTINGS_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
