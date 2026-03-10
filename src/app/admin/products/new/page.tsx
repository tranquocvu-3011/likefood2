/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductEditor from "@/components/admin/ProductEditor";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  salePrice: "",
  category: "",
  weight: "",
  inventory: "100",
  image: "",
  images: [] as string[],
  featured: false,
  badgeText: "",
  tags: "",
  isOnSale: false,
};

export default function NewProductPage() {
  const router = useRouter();

  return (
    <ProductEditor
      mode="create"
      initialValues={EMPTY_PRODUCT}
      onSubmit={async (payload) => {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.error(data?.error || "Unable to create product.");
          return;
        }

        toast.success("Product created.");
        router.push(`/admin/products/${data.id}/edit`);
      }}
    />
  );
}
