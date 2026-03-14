/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Blog/Posts layout with SEO metadata
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    const title = isEn ? "Blog - Food Guides & News | LIKEFOOD" : "Bài Viết - Cẩm Nang & Tin Tức | LIKEFOOD";
    const description = isEn
        ? "Explore LIKEFOOD's blog for Vietnamese food guides, cooking tips, product reviews, promotions, and the latest news from our team."
        : "Khám phá blog LIKEFOOD với cẩm nang ẩm thực Việt, mẹo nấu ăn, đánh giá sản phẩm, khuyến mãi và tin tức mới nhất.";

    return {
        title,
        description,
        alternates: { canonical: "/posts" },
        openGraph: {
            title,
            description,
            type: "website",
            url: "/posts",
        },
    };
}

export default function PostsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
