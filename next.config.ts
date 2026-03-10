import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })
    : (config: NextConfig) => config;

const nextConfig: NextConfig = {
    // ═══════════════════════════════════════════════════
    // 🚀 PERFORMANCE OPTIMIZATIONS
    // ═══════════════════════════════════════════════════

    // Tree-shake large icon/utility libraries — chỉ import đúng icon cần dùng
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "framer-motion",
            "date-fns",
            "zod",
            "react-markdown",
            "remark-gfm",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
        ],
    },

    // Không bundle các package server-only vào client
    serverExternalPackages: [
        "@prisma/client",
        "prisma",
        "bcryptjs",
        "nodemailer",
        "stripe",
    ],

    // Turbopack config (required by Next.js 16)
    turbopack: {},

    // ═══════════════════════════════════════════════════
    // 🖼️ IMAGE OPTIMIZATION
    // ═══════════════════════════════════════════════════
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        // SEC-06: Restrict remote patterns to known domains only
        remotePatterns: [
            // Google profile photos for OAuth
            {
                protocol: "https",
                hostname: "**.googleusercontent.com",
            },
            // Google Drive (if used for images)
            {
                protocol: "https",
                hostname: "drive.google.com",
            },
            // Add your image CDN here when configured (e.g., Cloudinary, AWS S3)
            // Example for Cloudinary:
            // {
            //     protocol: "https",
            //     hostname: "**.cloudinary.com",
            // },
            // Example for AWS S3:
            // {
            //     protocol: "https",
            //     hostname: "**.s3.amazonaws.com",
            // },
        ],
        // SEC-06: Allow local images from public folder subpaths
        localPatterns: [
            { pathname: "/uploads/**" },
            { pathname: "/images/**" },
            { pathname: "/categories/**" },
            { pathname: "/loadtrang.png" },
            { pathname: "/*.png" },
            { pathname: "/*.jpg" },
            { pathname: "/*.jpeg" },
            { pathname: "/*.webp" },
            { pathname: "/*.svg" },
            { pathname: "/*.avif" },
        ],
    },

    // ═══════════════════════════════════════════════════
    // ⚡ COMPILER & CACHING
    // ═══════════════════════════════════════════════════

    // Bật SWC compiler optimizations
    compiler: {
        // Loại bỏ console.log trong production
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
    },

    // Powered by header không cần thiết
    poweredByHeader: false,

    // Cho phép React Strict Mode (phát hiện lỗi sớm)
    reactStrictMode: true,

    // Output standalone cho Docker deployment (tạo ra server.js + minimal node_modules)
    output: "standalone",
};

const sentryConfig = {
  // Upload source maps to Sentry when SENTRY_AUTH_TOKEN is set
  silent: !process.env.CI,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Automatically tree-shake Sentry logger in production
  hideSourceMaps: true,
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryConfig);
