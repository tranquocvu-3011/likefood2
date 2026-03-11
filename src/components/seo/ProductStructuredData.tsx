"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import Script from "next/script";
import { useEffect, useState } from "react";

interface ProductForSchema {
  id: string;
  slug?: string | null;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  category?: string;
  avgRating?: number;
  reviewCount?: number;
}

interface PublicSettings {
  SEO_SITE_URL?: string;
}

interface Props {
  product: ProductForSchema;
}

export default function ProductStructuredData({ product }: Props) {
  const [siteUrl, setSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/settings");
        if (!res.ok) {
          throw new Error("settings failed");
        }
        const data: PublicSettings = await res.json();
        if (data.SEO_SITE_URL) {
          setSiteUrl(data.SEO_SITE_URL);
          return;
        }
      } catch {
        // fallback: use window location on client
        if (typeof window !== "undefined") {
          setSiteUrl(window.location.origin);
        }
      }
    };
    load();
  }, []);

  if (!siteUrl) return null;

  const url = `${siteUrl}/products/${product.slug || product.id}`;
  const images = product.image ? [product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`] : [];
  const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description || "",
    sku: product.id,
    category: product.category || undefined,
    aggregateRating:
      product.avgRating && product.reviewCount && product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.avgRating.toFixed(1),
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: currentPrice.toFixed(2),
      availability: currentPrice > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };

  // Breadcrumb schema for this product
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id={`breadcrumb-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

