/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Product Detail Page — Server Component
 * Fetches product data server-side for SEO, then passes to interactive client component.
 */

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

async function getProduct(slug: string) {
    const product = await prisma.product.findFirst({
        where: {
            OR: [
                { id: slug },
                { slug: slug },
            ],
            isDeleted: false,
            isVisible: true,
        },
        include: {
            categoryRel: true,
            productImages: {
                orderBy: [
                    { isPrimary: "desc" },
                    { order: "asc" },
                ],
            },
            productVariants: {
                where: { isActive: true },
                orderBy: { createdAt: "asc" },
            },
            specifications: {
                orderBy: { order: "asc" },
            },
            shipping: true,
            productTags: {
                include: { tag: true },
            },
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    if (!product) return null;

    const productMetrics = product as unknown as {
        ratingAvg?: number | null;
        ratingCount?: number | null;
        originalPrice?: number | null;
        salePrice?: number | null;
        soldCount?: number | null;
    };

    const avgRating = productMetrics.ratingAvg ?? 0;
    const reviewCount = productMetrics.ratingCount ?? 0;

    // Flash sale check
    const now = new Date();
    const isFlashSale =
        product.isOnSale &&
        product.salePrice &&
        product.saleStartAt &&
        product.saleEndAt &&
        product.saleStartAt <= now &&
        product.saleEndAt >= now;

    return {
        ...product,
        avgRating: Math.round((avgRating as number) * 10) / 10,
        reviewCount,
        images: product.productImages,
        variants: product.productVariants,
        tags: product.productTags?.map((pt) => pt.tag).filter(Boolean) ?? [],
        specifications: product.specifications ?? [],
        shipping: product.shipping ?? null,
        originalPrice: productMetrics.originalPrice || null,
        salePrice: productMetrics.salePrice || null,
        soldCount: productMetrics.soldCount || 0,
        isFlashSale: !!isFlashSale,
        saleStartAt: product.saleStartAt,
        saleEndAt: product.saleEndAt,
        // Serialize dates/Decimals for client component
        reviews: product.reviews.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
        })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}

async function getRelatedProducts(slug: string) {
    try {
        const product = await prisma.product.findFirst({
            where: {
                OR: [{ id: slug }, { slug: slug }],
                isDeleted: false,
            },
            select: { id: true, category: true },
        });

        if (!product) return [];

        const related = await prisma.product.findMany({
            where: {
                category: product.category,
                id: { not: product.id },
                isDeleted: false,
                isVisible: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                originalPrice: true,
                salePrice: true,
                isOnSale: true,
                image: true,
                category: true,
                inventory: true,
                badgeText: true,
            },
            take: 4,
            orderBy: { createdAt: "desc" },
        });

        return related;
    } catch {
        return [];
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(slug);

    // Serialize for client: convert any remaining Date/Decimal to plain values
    const serializedProduct = JSON.parse(JSON.stringify(product));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

    return (
        <ProductDetailClient
            initialProduct={serializedProduct}
            initialRelated={serializedRelated}
        />
    );
}
