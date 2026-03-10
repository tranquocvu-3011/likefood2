/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Public read-only settings exposed cho frontend (không bao gồm secret)
const PUBLIC_KEYS = [
    // Site info
    "SITE_NAME",
    "SITE_TAGLINE",
    "SITE_SUPPORT_EMAIL",
    "SITE_SUPPORT_PHONE",
    "SITE_ADDRESS",
    "SITE_FACEBOOK_URL",
    "SITE_ZALO_URL",
    // Stats
    "STAT_PRODUCTS_COUNT",
    "STAT_CATEGORIES_COUNT",
    "STAT_SUPPORT_TEXT",
    // Navigation & footer
    "NAV_PRIMARY_LINKS",
    "FOOTER_LINK_GROUPS",
    // Static pages content
    "ABOUT_STORY_TEXT",
    "SHIPPING_POLICY_CONTENT",
    "PRIVACY_POLICY_CONTENT",
    "TERMS_OF_SERVICE_CONTENT",
    // SEO
    "SEO_DEFAULT_TITLE",
    "SEO_DEFAULT_DESCRIPTION",
    "SEO_SITE_URL",
    "SEO_OG_IMAGE_URL",
    "SEO_FAVICON_URL",
    // Payments (chỉ trạng thái, không secret)
    "PAYMENT_COD_ENABLED",
    "PAYMENT_BANK_ENABLED",
    "PAYMENT_MOMO_ENABLED",
    "PAYMENT_PAYPAL_ENABLED",
    "PAYMENT_STRIPE_ENABLED",
    "BANK_NAME",
    "BANK_ACCOUNT_NAME",
    "BANK_ACCOUNT_NUMBER",
    // Feature flags
    "FEATURE_VOUCHER_ENABLED",
    "FEATURE_FLASH_SALE_ENABLED",
    "FEATURE_WISHLIST_ENABLED",
    "FEATURE_REVIEWS_ENABLED",
    "FEATURE_BLOG_ENABLED",
    "FEATURE_NEWSLETTER_ENABLED",
    "SITE_MAINTENANCE_MODE",
] as const;

export async function GET() {
    try {
        const settings = await prisma.systemsetting.findMany({
            where: {
                key: {
                    in: PUBLIC_KEYS as unknown as string[],
                },
            },
        });

        interface Setting {
            key: string;
            value: string;
        }

        const map = settings.reduce<Record<string, string>>((acc: Record<string, string>, curr: Setting) => {
            if ((PUBLIC_KEYS as readonly string[]).includes(curr.key)) {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {} as Record<string, string>);

        const res = NextResponse.json(map);
        // Public settings ít thay đổi → cho phép cache 5 phút ở edge/CDN
        res.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
        );
        return res;
    } catch (error) {
        console.error("[PUBLIC_SETTINGS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

