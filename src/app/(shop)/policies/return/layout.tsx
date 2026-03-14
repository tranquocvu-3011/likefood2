/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Return Policy layout with SEO metadata
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    const title = isEn ? "Return Policy | LIKEFOOD" : "Chính Sách Đổi Trả | LIKEFOOD";
    const description = isEn
        ? "LIKEFOOD return and refund policy. Learn about eligible return cases, the return process, and our commitment to customer satisfaction."
        : "Chính sách đổi trả và hoàn tiền tại LIKEFOOD. Tìm hiểu các trường hợp đổi trả, quy trình và cam kết chất lượng khách hàng.";

    return {
        title,
        description,
        alternates: { canonical: "/policies/return" },
        openGraph: {
            title,
            description,
            type: "website",
            url: "/policies/return",
        },
    };
}

export default function ReturnPolicyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
