/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/logger";
import { Prisma } from "../../../generated/client";

// Normalize category slugs / English names -> Vietnamese DB-canonical names
const CATEGORY_SLUG_MAP: Record<string, string> = {
    // URL slugs
    "ca-kho": "Cá khô",
    "muc-kho": "Tôm & Mực khô",
    "trai-cay-say": "Trái cây sấy",
    "banh-mut": "Trà & Bánh mứt",
    "gia-vi": "Gia vị Việt",
    // Footer compatibility aliases
    "spice": "Gia vị Việt",
    // English display names
    "Dried Fish": "Cá khô",
    "Dried Shrimp & Squid": "Tôm & Mực khô",
    "Dried Fruits": "Trái cây sấy",
    "Tea & Sweets": "Trà & Bánh mứt",
    "Vietnamese Spices": "Gia vị Việt",
};

// GET all products with search, filter, pagination
export async function GET(req: Request) {
    try {
        // API-01: Validate query parameters with Zod schema
        const { searchParams } = new URL(req.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        const { productQuerySchema } = await import('@/lib/validations/product');
        const { validationErrorResponse } = await import('@/lib/validations/utils');
        const validationResult = productQuerySchema.safeParse(queryParams);

        if (!validationResult.success) {
            return NextResponse.json(
                validationErrorResponse(validationResult.error),
                { status: 400 }
            );
        }

        const {
            search,
            category,
            minPrice,
            maxPrice,
            featured,
            inStock,
            ratingGte,
            tags,
            freeShipping,
            sort,
            page,
            limit
        } = validationResult.data;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.productWhereInput = {};
        const andConditions: Prisma.productWhereInput[] = [];

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { category: { contains: search } },
            ];
        }

        if (category && category !== "Tất cả" && category !== "All Categories") {
            const normalizedCategory = category.trim();

            if (normalizedCategory === "gifts") {
                andConditions.push({
                    OR: [
                        { tags: { contains: "gift" } },
                        { badgeText: { contains: "gift" } },
                    ],
                });
            } else if (normalizedCategory === "seafood") {
                andConditions.push({
                    category: { in: ["Cá khô", "Tôm & Mực khô"] },
                });
            } else {
                const dbCategory = CATEGORY_SLUG_MAP[normalizedCategory] ?? normalizedCategory;
                andConditions.push({ category: dbCategory });
            }
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
        }

        if (featured) {
            where.featured = true;
        }

        if (inStock) {
            where.inventory = { gt: 0 };
        }

        if (ratingGte) {
            where.ratingAvg = { gte: ratingGte };
        }

        if (tags) {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            if (tagList.length > 0) {
                andConditions.push(...tagList.map(tag => ({
                    tags: { contains: tag }
                })));
            }
        }

        if (andConditions.length > 0) {
            where.AND = andConditions;
        }

        // Build orderBy
        let orderBy: Prisma.productOrderByWithRelationInput = {};
        switch (sort) {
            case "price-asc":
                orderBy = { price: "asc" };
                break;
            case "price-desc":
                orderBy = { price: "desc" };
                break;
            case "best-selling":
                orderBy = { soldCount: "desc" };
                break;
            case "top-rated":
                orderBy = { ratingAvg: "desc" };
                break;
            case "name":
                orderBy = { name: "asc" };
                break;
            case "newest":
            default:
                orderBy = { createdAt: "desc" };
                break;
        }

        // Get products and total count
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    originalPrice: true,
                    salePrice: true,
                    saleStartAt: true,
                    saleEndAt: true,
                    isOnSale: true,
                    badgeText: true,
                    image: true,
                    category: true,
                    weight: true,
                    inventory: true,
                    featured: true,
                    tags: true,
                    ratingAvg: true,
                    ratingCount: true,
                    soldCount: true,
                    createdAt: true,
                },
            }),
            prisma.product.count({ where }),
        ]);

        // If free shipping filter is enabled, check for active shipping vouchers
        let filteredProducts = products;
        if (freeShipping) {
            const now = new Date();
            const shippingCoupons = await prisma.coupon.findMany({
                where: {
                    category: "shipping",
                    isActive: true,
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                select: { id: true },
            });

            // For simplicity, if there are active shipping vouchers, show all products
            // In a more complex system, you'd check per-product eligibility
            // For now, we'll just return all products if shipping vouchers exist
            if (shippingCoupons.length === 0) {
                filteredProducts = [];
            }
        }

        // Normalize pricing + add flash sale flag to products
        const now = new Date();
        const normalizedProducts = filteredProducts.map((p) => {
            // Determine current price vs original
            let currentPrice = p.price;
            let original = p.originalPrice ?? null;

            if (p.salePrice && p.salePrice < p.price) {
                currentPrice = p.salePrice;
                if (!original || original <= currentPrice) {
                    original = p.price;
                }
            }

            const isFlashSale =
                p.isOnSale &&
                !!p.salePrice &&
                !!p.saleStartAt &&
                !!p.saleEndAt &&
                p.saleStartAt <= now &&
                p.saleEndAt >= now;

            return {
                ...p,
                price: currentPrice,
                originalPrice: original,
                isFlashSale,
            };
        });

        // Add cache-control header
        const response = NextResponse.json({
            products: normalizedProducts,
            pagination: {
                page,
                limit,
                total: freeShipping ? filteredProducts.length : total,
                totalPages: Math.ceil((freeShipping ? filteredProducts.length : total) / limit),
            },
        });

        // Set cache headers
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

        return response;
    } catch (error) {
        logger.error("Failed to fetch products", error as Error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST new product
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            name,
            description,
            price,
            originalPrice,
            salePrice,
            isOnSale,
            badgeText,
            tags,
            category,
            inventory,
            weight,
            image,
            featured,
            images: galleryImages,
        } = body;

        // Normalize numeric fields defensively
        let priceNumber = 0;
        if (typeof price === "number" && Number.isFinite(price)) {
            priceNumber = price;
        } else if (typeof price === "string" && price.trim() !== "") {
            const parsed = Number.parseFloat(price);
            if (!Number.isNaN(parsed)) priceNumber = parsed;
        }

        let inventoryNumber = 0;
        if (typeof inventory === "number" && Number.isFinite(inventory)) {
            inventoryNumber = Math.trunc(inventory);
        } else if (typeof inventory === "string" && inventory.trim() !== "") {
            const parsed = Number.parseInt(inventory, 10);
            if (!Number.isNaN(parsed)) inventoryNumber = parsed;
        }

        // Normalize optional pricing fields
        let originalPriceNumber: number | null = null;
        if (typeof originalPrice === "number" && Number.isFinite(originalPrice)) {
            originalPriceNumber = originalPrice;
        } else if (typeof originalPrice === "string" && originalPrice.trim() !== "") {
            const parsed = Number.parseFloat(originalPrice);
            if (!Number.isNaN(parsed)) originalPriceNumber = parsed;
        }

        let salePriceNumber: number | null = null;
        if (typeof salePrice === "number" && Number.isFinite(salePrice)) {
            salePriceNumber = salePrice;
        } else if (typeof salePrice === "string" && salePrice.trim() !== "") {
            const parsed = Number.parseFloat(salePrice);
            if (!Number.isNaN(parsed)) salePriceNumber = parsed;
        }

        const slug = generateSlug(name);

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: priceNumber,
                originalPrice: originalPriceNumber,
                salePrice: salePriceNumber,
                isOnSale: !!isOnSale && !!salePriceNumber,
                badgeText: badgeText ?? null,
                tags: tags ?? null,
                category,
                weight: weight || null,
                inventory: inventoryNumber,
                image: image || null,
                featured: featured || false,
                // Add gallery images if provided
                ...(galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0 && {
                    productImages: {
                        create: galleryImages.map((url: string, index: number) => ({
                            imageUrl: url,
                            order: index,
                            isPrimary: false
                        }))
                    }
                })
            },
            include: {
                productImages: true
            }
        });

        return NextResponse.json({
            ...product,
            images: product.productImages
        });
    } catch (error) {
        logger.error("Product creation error", error as Error, { context: "products-api-post" });
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}

