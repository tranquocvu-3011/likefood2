/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProductEditor from "@/components/admin/ProductEditor";

interface VariantRecord {
  id: string;
  weight: string | null;
  flavor: string | null;
  priceAdjustment: number;
  stock: number;
  sku: string | null;
  isActive: boolean;
}

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  salePrice: "",
  category: "",
  weight: "",
  inventory: "0",
  image: "",
  images: [] as string[],
  featured: false,
  badgeText: "",
  tags: "",
  isOnSale: false,
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [variants, setVariants] = useState<VariantRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [productResponse, variantResponse] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch(`/api/admin/products/${productId}/variants`),
        ]);

        const productData = await productResponse.json().catch(() => ({}));
        if (!productResponse.ok) {
          throw new Error(productData?.error || "Unable to load product.");
        }

        setProduct({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price?.toString?.() || "",
          originalPrice: productData.originalPrice?.toString?.() || "",
          salePrice: productData.salePrice?.toString?.() || "",
          category: productData.category || "",
          weight: productData.weight || "",
          inventory: String(productData.inventory ?? 0),
          image: productData.image || "",
          images: Array.isArray(productData.images)
            ? productData.images
                .map((image: { imageUrl?: string } | string) =>
                  typeof image === "string" ? image : image?.imageUrl || ""
                )
                .filter(Boolean)
            : [],
          featured: Boolean(productData.featured),
          badgeText: productData.badgeText || "",
          tags: productData.tags || "",
          isOnSale: Boolean(productData.isOnSale),
        });

        if (variantResponse.ok) {
          const variantData = await variantResponse.json().catch(() => []);
          setVariants(Array.isArray(variantData) ? variantData : []);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load product.");
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      void load();
    }
  }, [productId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProductEditor
      mode="edit"
      productId={productId}
      initialValues={product}
      initialVariants={variants}
      onSubmit={async (payload) => {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.error(data?.error || "Unable to save changes.");
          return;
        }

        toast.success("Product updated.");
        router.refresh();
      }}
      onDelete={async () => {
        const response = await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.error(data?.error || "Unable to delete product.");
          return;
        }

        toast.success("Product deleted.");
        router.push("/admin/products");
      }}
    />
  );
}
