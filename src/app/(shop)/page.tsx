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
export const metadata: Metadata = {
  title: "LIKEFOOD - Đặc Sản Việt Nam Chính Gốc Tại Hoa Kỳ | Vietnamese Specialty Food Store",
  description: "Mua cá khô, tôm khô, mực khô, trái cây sấy và đặc sản Việt Nam chất lượng cao. Giao hàng toàn nước Mỹ trong 2-3 ngày. Miễn phí ship đơn từ $500. 100% chính hãng từ Việt Nam.",
  keywords: [
    "cá khô",
    "tôm khô",
    "mực khô",
    "đặc sản Việt Nam",
    "Vietnamese dried seafood",
    "trái cây sấy",
    "mứt tết",
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
    type: 'website',
    locale: 'vi_VN',
    url: 'https://likefood.com',
    siteName: 'LIKEFOOD',
    title: 'LIKEFOOD - Đặc Sản Việt Nam Chính Gốc Tại Hoa Kỳ',
    description: 'Mua đặc sản Việt Nam chính gốc, chất lượng cao. Giao hàng toàn nước Mỹ 2-3 ngày. Free ship đơn từ $500.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'LIKEFOOD - Vietnamese Specialty Food Store'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIKEFOOD - Đặc Sản Việt Nam Chính Gốc',
    description: 'Cá khô, tôm khô, mực khô, đặc sản Việt Nam chất lượng cao tại Hoa Kỳ',
    images: ['/twitter-image.png'],
    creator: '@likefood'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// ISR: Revalidate home page every 5 minutes
export const revalidate = 300;

export default async function Home() {
  return (
    <>
      <StructuredData />
      <div id="main-content" className="flex flex-col gap-0">
        {/* Section 1: Hero Banner với Overlay */}
        <HeroCarousel />
        <FlashSaleBanner />

        {/* Section 1.5: Homepage Search Bar */}
        <HomeSearchBar />

        {/* Section 2: Category Showcase */}
        <CategoryShowcase />

        {/* Section 3: Featured Products - Streaming with Skeleton */}
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

        {/* Section 4: Why Choose Us */}
        <WhyChooseUs />

        {/* Section 4.2: Personalized / Trending Recommendations */}
        <PersonalizedRecommendationsSection />

        {/* Section 4.5: Stats Section */}
        <StatsSection />

        {/* Section 5: Vietnam Story */}
        <VietnamStory />

        {/* Section 7: Customer Reviews */}
        <CustomerReviews />

        {/* Section 8: Recent Posts */}
        <RecentPosts />

        {/* Section 7.5: Recently Viewed Products */}
        <RecentlyViewedClient />

      </div>
    </>
  );
}
