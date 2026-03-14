/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Flash Sale page layout with SEO metadata
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    const title = isEn ? "Flash Sale - Exclusive Deals | LIKEFOOD" : "Flash Sale - Ưu Đãi Đặc Biệt | LIKEFOOD";
    const description = isEn
        ? "Don't miss LIKEFOOD Flash Sale! Limited-time discounts on premium Vietnamese dried seafood, fruits, and specialty products. Shop now before they're gone."
        : "Đừng bỏ lỡ Flash Sale LIKEFOOD! Giảm giá có thời hạn cho cá khô, tôm khô, trái cây sấy và đặc sản Việt Nam cao cấp. Mua ngay kẻo hết.";

    return {
        title,
        description,
        alternates: { canonical: "/flash-sale" },
        openGraph: {
            title,
            description,
            type: "website",
            url: "/flash-sale",
        },
    };
}

export default function FlashSaleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
