/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Contact page layout with SEO metadata
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    const title = isEn ? "Contact Us - LIKEFOOD" : "Liên Hệ - LIKEFOOD";
    const description = isEn
        ? "Get in touch with LIKEFOOD. We're here to help with orders, product questions, and customer support. 24/7 assistance available."
        : "Liên hệ với LIKEFOOD. Chúng tôi sẵn sàng hỗ trợ đơn hàng, tư vấn sản phẩm và chăm sóc khách hàng. Hỗ trợ 24/7.";

    return {
        title,
        description,
        alternates: { canonical: "/contact" },
        openGraph: {
            title,
            description,
            type: "website",
            url: "/contact",
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
