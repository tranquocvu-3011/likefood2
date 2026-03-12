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
                title: "Sản phẩm không tồn tại | LIKEFOOD",
                description: "Không tìm thấy sản phẩm yêu cầu.",
            };
        }

        const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        const priceStr = `$${currentPrice.toFixed(2)}`;
        const title = `${product.name} - ${product.category} | LIKEFOOD`;
        
        // Tạo description tối ưu cho SEO: 150-160 ký tự, chứa giá & keywords
        const description = product.description 
            ? `${product.description.substring(0, 140)}... [Giá: ${priceStr}]` 
            : `Mua ngay ${product.name} chính gốc - Đặc sản ${product.category} chất lượng cao tại LIKEFOOD chỉ với ${priceStr}. Giao hàng nhanh toàn nước Mỹ, đảm bảo vệ sinh an toàn thực phẩm.`;

        const images = product.image ? [product.image] : ["/og-image.png"];

        return {
            title,
            description,
            alternates: {
                canonical: `/products/${slug}`,
            },
            openGraph: {
                title,
                description,
                images,
                type: "website",
                siteName: "LIKEFOOD",
                locale: "vi_VN",
                url: `/products/${slug}`,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images,
                creator: "@likefood",
            },
        };
    } catch (error) {
        return {
            title: "Sản phẩm Đặc sản Việt Nam | LIKEFOOD",
            description: "Khám phá các loại đặc sản Việt Nam chất lượng cao tại LIKEFOOD.",
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
