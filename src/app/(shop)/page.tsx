/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import dynamic from "next/dynamic";
import HeroCarousel from "@/components/shared/HeroCarousel";
import CategoryShowcase from "@/components/shared/CategoryShowcase";
import FlashSaleBanner from "@/components/shared/FlashSaleBanner";
import HomeSearchBar from "@/components/shared/HomeSearchBar";
import StructuredData from "@/components/seo/StructuredData";
import { RecentlyViewedClient } from "@/components/shared/ClientWrappers";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ui/product-skeleton";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import PersonalizedRecommendationsSection from "@/components/home/PersonalizedRecommendationsSection";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Lazy-load các section dưới fold để giảm JS ban đầu & cải thiện INP
const WhyChooseUs = dynamic(
  () => import("@/components/shared/WhyChooseUs"),
  { ssr: true }
);

const StatsSection = dynamic(
  () => import("@/components/shared/StatsSection"),
  { ssr: true }
);

const VietnamStory = dynamic(
  () => import("@/components/shared/VietnamStory"),
  { ssr: true }
);

const CustomerReviews = dynamic(
  () => import("@/components/shared/CustomerReviews"),
  { ssr: true }
);

const RecentPosts = dynamic(
  () => import("@/components/shared/RecentPosts"),
  { ssr: true }
);



// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  const title = isEn
    ? "LIKEFOOD - Authentic Vietnamese Specialty Store in the U.S."
    : "LIKEFOOD - Đặc sản Việt Nam chính gốc tại Hoa Kỳ";
  const description = isEn
    ? "Shop premium Vietnamese dried seafood, fruits, and regional specialties. Nationwide U.S. shipping in 2-3 days. Free shipping from $500 orders."
    : "Mua cá khô, tôm khô, mực khô, trái cây sấy và đặc sản Việt Nam chất lượng cao. Giao hàng toàn nước Mỹ trong 2-3 ngày. Miễn phí ship đơn từ $500.";

  return {
    title,
    description,
    keywords: [
      "ca kho",
      "tom kho",
      "muc kho",
      "đặc sản Việt Nam",
      "Vietnamese dried seafood",
      "trái cây sấy",
      "mứt Tết",
      "gia vị Việt Nam",
      "Vietnamese food USA",
      "Vietnamese specialty store"
    ],
    authors: [{ name: "LIKEFOOD Team" }],
    creator: "LIKEFOOD",
    publisher: "LIKEFOOD",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "vi_VN",
      url: "https://likefood.com",
      siteName: "LIKEFOOD",
      title,
      description,
      images: [{
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LIKEFOOD - Vietnamese Specialty Food Store"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.png"],
      creator: "@likefood"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Google verification is handled in root layout.tsx via NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env var
  };
}

// ISR: Revalidate home page every 5 minutes
export const revalidate = 300;

export default async function Home() {
  // Fetch homepage section visibility config from admin
  let sectionConfig: Record<string, { isActive: boolean; position: number }> = {};
  try {
    const sections = await prisma.homepageSection.findMany({
      select: { key: true, isActive: true, position: true },
    });
    sectionConfig = Object.fromEntries(
      sections.map((s) => [s.key, { isActive: s.isActive, position: s.position }])
    );
  } catch {
    // DB unavailable — show everything by default
  }

  // Returns true if section is active (defaults to true if not configured in admin)
  const show = (key: string) => sectionConfig[key]?.isActive ?? true;

  return (
    <>
      <StructuredData />
      <div id="main-content" className="flex flex-col gap-0">
        {/* Section 1: Hero Banner với Overlay */}
        {show("hero") && <HeroCarousel />}
        {show("flash-sale") && <FlashSaleBanner />}

        {/* Section 1.5: Homepage Search Bar */}
        {show("search") && <HomeSearchBar />}

        {/* Section 2: Category Showcase */}
        {show("categories") && <CategoryShowcase />}

        {/* Section 3: Featured Products - Streaming with Skeleton */}
        {show("featured-products") && (
        <Suspense fallback={
          <div className="w-full px-4 sm:px-6 lg:px-[6%] py-20">
            <div className="mb-12 text-center">
              <div className="h-4 w-32 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
              <div className="h-10 w-64 bg-slate-200 rounded-2xl mx-auto animate-pulse" />
            </div>
            <ProductGridSkeleton count={4} />
          </div>
        }>
          <FeaturedProductsSection />
        </Suspense>
        )}

        {/* Section 4: Why Choose Us */}
        {show("why-us") && <WhyChooseUs />}

        {/* Section 4.2: Personalized / Trending Recommendations */}
        {show("recommendations") && <PersonalizedRecommendationsSection />}

        {/* Section 4.5: Stats Section */}
        {show("stats") && <StatsSection />}

        {/* Section 5: Vietnam Story */}
        {show("vietnam-story") && <VietnamStory />}

        {/* Section 7: Customer Reviews */}
        {show("testimonials") && <CustomerReviews />}

        {/* Section 8: Recent Posts */}
        {show("posts") && <RecentPosts />}

        {/* Section 7.5: Recently Viewed Products */}
        {show("recently-viewed") && <RecentlyViewedClient />}

      </div>
    </>
  );
}
