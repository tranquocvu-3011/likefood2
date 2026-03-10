/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Metadata } from "next";
import prisma from "@/lib/prisma";

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id: slug },
                    { slug: slug }
                ]
            },
            select: {
                name: true,
                description: true,
                price: true,
                salePrice: true,
                image: true,
                category: true,
            },
        });

        if (!product) {
            return {
                title: "Sản phẩm không tồn tại",
                description: "Không tìm thấy sản phẩm",
            };
        }

        const title = `${product.name} - ${product.category} | LIKEFOOD`;
        const description = product.description || `${product.name} - Sản phẩm ${product.category} chất lượng cao`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: product.image ? [product.image] : [],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: product.image ? [product.image] : [],
            },
        };
    } catch {
        // Log error but don't throw - return default metadata
        // logger.error("Failed to generate metadata", error as Error, { context: "product-layout", slug });
        return {
            title: "Sản phẩm | LIKEFOOD",
            description: "Xem chi tiết sản phẩm",
        };
    }
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
