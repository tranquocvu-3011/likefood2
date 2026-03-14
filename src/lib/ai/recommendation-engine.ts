/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import type { brand, product, productimage, productvariant } from "@/generated/client";
import prisma from "@/lib/prisma";

export type RecommendationType =
  | "frequently_bought_together"
  | "similar"
  | "personalized"
  | "trending"
  | "cross_sell"
  | "up_sell"
  | "new_arrivals"
  | "based_on_history";

export interface RecommendationInput {
  userId?: string;
  sessionId: string;
  currentProductId?: string;
  cartItems?: Array<{ productId: string; quantity: number }>;
  browseHistory?: string[];
  preferences?: UserPreferences;
  category?: string;
  limit?: number;
}

export interface UserPreferences {
  favoriteCategories?: string[];
  priceRange?: { min: number; max: number };
  brands?: string[];
  dietaryPreferences?: string[];
}

export interface ProductRecommendation {
  id?: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  isOnSale?: boolean;
  image: string | null;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  score: number;
  reason: string;
}

export interface RecommendationResult {
  type: RecommendationType;
  products: ProductRecommendation[];
  reason: string;
}

type ProductWithRelations = product & {
  brand: brand | null;
  productVariants: productvariant[];
  productImages?: productimage[];
};

function getProductPrice(productRecord: ProductWithRelations): number {
  const lowestVariantDelta = productRecord.productVariants.length
    ? Math.min(...productRecord.productVariants.map((variant) => variant.priceAdjustment ?? 0))
    : 0;
  return productRecord.price + lowestVariantDelta;
}

function toRecommendation(productRecord: ProductWithRelations, score: number, reason: string): ProductRecommendation {
  const variantDelta = productRecord.productVariants.length
    ? Math.min(...productRecord.productVariants.map((variant) => variant.priceAdjustment ?? 0))
    : 0;

  const regularPrice = productRecord.price + variantDelta;
  const saleCandidate = productRecord.salePrice != null ? productRecord.salePrice + variantDelta : null;
  const useSalePrice = !!(productRecord.isOnSale && saleCandidate != null && saleCandidate < regularPrice);
  const currentPrice = useSalePrice ? (saleCandidate as number) : regularPrice;
  const comparePrice = productRecord.originalPrice != null
    ? productRecord.originalPrice + variantDelta
    : regularPrice;
  const hasDiscount = comparePrice > currentPrice;

  return {
    id: productRecord.id,
    productId: productRecord.id,
    name: productRecord.name,
    slug: productRecord.slug ?? productRecord.id,
    price: currentPrice,
    originalPrice: hasDiscount ? comparePrice : undefined,
    salePrice: hasDiscount ? currentPrice : undefined,
    isOnSale: hasDiscount,
    image: productRecord.image || productRecord.productImages?.[0]?.imageUrl || null,
    category: productRecord.category,
    brand: productRecord.brand?.name ?? undefined,
    rating: productRecord.ratingAvg || undefined,
    reviewCount: productRecord.ratingCount || undefined,
    stock: productRecord.inventory,
    score,
    reason,
  };
}

class RecommendationEngine {
  async getFrequentlyBoughtTogether(productId: string, limit = 5): Promise<RecommendationResult> {
    try {
      const baseItems = await prisma.orderitem.findMany({
        where: { productId },
        select: { orderId: true },
      });

      if (baseItems.length === 0) {
        return this.getFallbackRecommendations("frequently_bought_together", limit, "No purchase history found for this product yet.");
      }

      const orderIds = baseItems.map((item) => item.orderId);
      const relatedItems = await prisma.orderitem.findMany({
        where: {
          orderId: { in: orderIds },
          productId: { not: productId },
        },
        select: { productId: true },
      });

      const counts = relatedItems.reduce<Map<string, number>>((accumulator, item) => {
        accumulator.set(item.productId, (accumulator.get(item.productId) || 0) + 1);
        return accumulator;
      }, new Map());

      const rankedIds = Array.from(counts.entries())
        .sort((left, right) => right[1] - left[1])
        .slice(0, limit)
        .map(([relatedProductId]) => relatedProductId);

      if (rankedIds.length === 0) {
        return this.getFallbackRecommendations("frequently_bought_together", limit, "No co-purchase pattern is strong enough yet.");
      }

      const products = await this.loadProductsByIds(rankedIds);
      const scoreMap = new Map(rankedIds.map((relatedId) => [relatedId, counts.get(relatedId) || 0]));

      return {
        type: "frequently_bought_together",
        products: products.map((productRecord) => {
          const count = scoreMap.get(productRecord.id) || 0;
          return toRecommendation(productRecord, count / Math.max(baseItems.length, 1), "Frequently bought together");
        }),
        reason: `Built from ${baseItems.length} historical orders that included this product.`,
      };
    } catch (error) {
      console.error("Error getting frequently bought together:", error);
      return this.getFallbackRecommendations("frequently_bought_together", limit, "Unable to build co-purchase recommendations right now.");
    }
  }

  async getSimilarProducts(productId: string, limit = 10): Promise<RecommendationResult> {
    try {
      const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
      });

      if (!currentProduct) {
        return this.getFallbackRecommendations("similar", limit, "The source product could not be found.");
      }

      const similarCandidates = await prisma.product.findMany({
        where: {
          id: { not: productId },
          category: currentProduct.category,
          isDeleted: false,
          inventory: { gt: 0 },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit * 3,
        orderBy: { soldCount: "desc" },
      });

      const basePrice = getProductPrice(currentProduct as ProductWithRelations);
      const products = similarCandidates
        .map((productRecord) => {
          const candidate = productRecord as ProductWithRelations;
          const priceGap = Math.abs(getProductPrice(candidate) - basePrice);
          const priceSimilarity = basePrice > 0 ? Math.max(0, 1 - priceGap / basePrice) : 0;
          const brandBonus = currentProduct.brandId && candidate.brand?.id === currentProduct.brandId ? 0.2 : 0;
          const popularityBonus = Math.min(candidate.soldCount / 500, 0.2);
          const score = 0.5 + priceSimilarity * 0.3 + brandBonus + popularityBonus;
          return toRecommendation(candidate, score, "Similar category and price band");
        })
        .sort((left, right) => right.score - left.score)
        .slice(0, limit);

      return {
        type: "similar",
        products,
        reason: `Similar products were matched from the ${currentProduct.category} category.`,
      };
    } catch (error) {
      console.error("Error getting similar products:", error);
      return this.getFallbackRecommendations("similar", limit, "Unable to compute similar products right now.");
    }
  }

  async getPersonalizedRecommendations(input: RecommendationInput): Promise<RecommendationResult> {
    try {
      const limit = input.limit || 10;
      const categoryPool = new Set<string>();
      const excludeIds = new Set<string>(input.currentProductId ? [input.currentProductId] : []);

      for (const item of input.cartItems || []) {
        excludeIds.add(item.productId);
      }

      if (input.category) {
        categoryPool.add(input.category);
      }

      if (input.preferences?.favoriteCategories?.length) {
        input.preferences.favoriteCategories.forEach((category) => categoryPool.add(category));
      }

      if (input.browseHistory?.length) {
        input.browseHistory.forEach((productId) => excludeIds.add(productId));
        const viewedProducts = await prisma.product.findMany({
          where: { id: { in: input.browseHistory } },
          select: { category: true },
        });
        viewedProducts.forEach((productRecord) => categoryPool.add(productRecord.category));
      }

      if (input.userId) {
        const pastItems = await prisma.orderitem.findMany({
          where: {
            order: {
              userId: input.userId,
              status: { in: ["DELIVERED", "COMPLETED"] },
            },
          },
          select: { productId: true },
          take: 25,
        });

        const orderedProductIds = pastItems.map((item) => item.productId);
        orderedProductIds.forEach((productId) => excludeIds.add(productId));

        if (orderedProductIds.length > 0) {
          const orderedProducts = await prisma.product.findMany({
            where: { id: { in: orderedProductIds } },
            select: { category: true },
          });
          orderedProducts.forEach((productRecord) => categoryPool.add(productRecord.category));
        }
      }

      if (categoryPool.size === 0) {
        return this.getTrendingProducts(limit, input.category);
      }

      const candidates = await prisma.product.findMany({
        where: {
          category: { in: Array.from(categoryPool) },
          id: { notIn: Array.from(excludeIds) },
          isDeleted: false,
          inventory: { gt: 0 },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit * 3,
        orderBy: [{ soldCount: "desc" }, { ratingAvg: "desc" }],
      });

      const filtered = this.applyPreferenceFilters(candidates as ProductWithRelations[], input.preferences)
        .slice(0, limit)
        .map((productRecord, index) => toRecommendation(productRecord, Math.max(0.95 - index * 0.05, 0.5), "Personalized from browsing, cart, and purchase patterns"));

      if (filtered.length === 0) {
        return this.getTrendingProducts(limit, input.category);
      }

      return {
        type: input.userId ? "personalized" : "based_on_history",
        products: filtered,
        reason: "Recommendations are based on the shopper's recent context and store behavior.",
      };
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      return this.getTrendingProducts(input.limit || 10, input.category);
    }
  }

  async getTrendingProducts(limit = 10, category?: string): Promise<RecommendationResult> {
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(category ? { category } : {}),
          isDeleted: false,
          inventory: { gt: 0 },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit,
        orderBy: [{ soldCount: "desc" }, { ratingAvg: "desc" }],
      });

      return {
        type: "trending",
        products: (products as ProductWithRelations[]).map((productRecord, index) =>
          toRecommendation(productRecord, Math.max(0.9 - index * 0.05, 0.4), "Trending with strong recent demand")
        ),
        reason: category ? `Trending picks from ${category}.` : "Trending picks across the store.",
      };
    } catch (error) {
      console.error("Error getting trending products:", error);
      return { type: "trending", products: [], reason: "Unable to load trending products." };
    }
  }

  async getCrossSellRecommendations(productIds: string[], limit = 5): Promise<RecommendationResult> {
    try {
      const currentProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { category: true },
      });
      const categories = Array.from(new Set(currentProducts.map((productRecord) => productRecord.category)));

      const products = await prisma.product.findMany({
        where: {
          category: { in: categories },
          id: { notIn: productIds },
          isDeleted: false,
          inventory: { gt: 0 },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit,
        orderBy: [{ soldCount: "desc" }, { ratingAvg: "desc" }],
      });

      return {
        type: "cross_sell",
        products: (products as ProductWithRelations[]).map((productRecord, index) =>
          toRecommendation(productRecord, Math.max(0.85 - index * 0.05, 0.4), "Complements items already in the basket")
        ),
        reason: "Cross-sell recommendations come from related categories already in the basket.",
      };
    } catch (error) {
      console.error("Error getting cross-sell recommendations:", error);
      return { type: "cross_sell", products: [], reason: "Unable to build cross-sell recommendations." };
    }
  }

  async getUpSellRecommendations(productId: string, limit = 5): Promise<RecommendationResult> {
    try {
      const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
      });

      if (!currentProduct) {
        return { type: "up_sell", products: [], reason: "The source product could not be found." };
      }

      const basePrice = getProductPrice(currentProduct as ProductWithRelations);
      const products = await prisma.product.findMany({
        where: {
          id: { not: productId },
          category: currentProduct.category,
          isDeleted: false,
          inventory: { gt: 0 },
          price: { gt: basePrice },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit,
        orderBy: [{ ratingAvg: "desc" }, { soldCount: "desc" }],
      });

      return {
        type: "up_sell",
        products: (products as ProductWithRelations[]).map((productRecord) => {
          const priceRatio = getProductPrice(productRecord) / Math.max(basePrice, 1);
          return toRecommendation(productRecord, priceRatio, "Higher-tier option in the same category");
        }),
        reason: `Up-sell options are drawn from the same category as ${currentProduct.name}.`,
      };
    } catch (error) {
      console.error("Error getting up-sell recommendations:", error);
      return { type: "up_sell", products: [], reason: "Unable to build up-sell recommendations." };
    }
  }

  async getNewArrivals(limit = 10, category?: string): Promise<RecommendationResult> {
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(category ? { category } : {}),
          isDeleted: false,
          inventory: { gt: 0 },
        },
        include: {
          brand: true,
          productVariants: { where: { isActive: true } },
          productImages: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return {
        type: "new_arrivals",
        products: (products as ProductWithRelations[]).map((productRecord, index) =>
          toRecommendation(productRecord, Math.max(0.9 - index * 0.05, 0.4), "New arrival with current stock")
        ),
        reason: category ? `Newest arrivals in ${category}.` : "Newest arrivals across the store.",
      };
    } catch (error) {
      console.error("Error getting new arrivals:", error);
      return { type: "new_arrivals", products: [], reason: "Unable to load new arrivals." };
    }
  }

  private async loadProductsByIds(productIds: string[]): Promise<ProductWithRelations[]> {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        brand: true,
        productVariants: { where: { isActive: true } },
      },
    });

    const productMap = new Map(products.map((productRecord) => [productRecord.id, productRecord as ProductWithRelations]));
    return productIds.map((id) => productMap.get(id)).filter((item): item is ProductWithRelations => Boolean(item));
  }

  private applyPreferenceFilters(products: ProductWithRelations[], preferences?: UserPreferences): ProductWithRelations[] {
    if (!preferences) return products;

    return products.filter((productRecord) => {
      const price = getProductPrice(productRecord);
      const matchesPrice = !preferences.priceRange || (price >= preferences.priceRange.min && price <= preferences.priceRange.max);
      const matchesBrand = !preferences.brands?.length || (productRecord.brand?.name ? preferences.brands.includes(productRecord.brand.name) : false);
      return matchesPrice && matchesBrand;
    });
  }

  private getFallbackRecommendations(type: RecommendationType, limit: number, reason: string): RecommendationResult {
    return {
      type,
      products: [],
      reason: `${reason} Requested limit: ${limit}.`,
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
