/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản Phẩm | LIKEFOOD",
    description: "Khám phá các sản phẩm đặc sản Việt Nam chất lượng cao",
    openGraph: {
        title: "Sản Phẩm | LIKEFOOD",
        description: "Khám phá các sản phẩm đặc sản Việt Nam chất lượng cao",
        type: "website",
    },
};

// Enable ISR for product listing page
export const revalidate = 60; // Revalidate every 60 seconds

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
