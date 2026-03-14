/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    const title = isEn ? "Products | LIKEFOOD" : "Sản phẩm | LIKEFOOD";
    const description = isEn
        ? "Explore premium Vietnamese specialty products at LIKEFOOD."
        : "Khám phá các sản phẩm đặc sản Việt Nam chất lượng cao tại LIKEFOOD.";

    return {
        title,
        description,
        alternates: { canonical: "/products" },
        openGraph: {
            title,
            description,
            type: "website",
        },
    };
}

// Enable ISR for product listing page
export const revalidate = 60; // Revalidate every 60 seconds

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
