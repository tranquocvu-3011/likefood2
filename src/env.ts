/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

/**
 * SEC-07: Environment Validation at Startup
 * 
 * This file validates all required environment variables at startup.
 * If any required variable is missing, the app will crash with a clear error.
 */

// ============================================
// Required vs Optional Variables Schema
// ============================================

const requiredInProduction = process.env.NODE_ENV === "production";

export const env = createEnv({
  /**
   * Specify what prefix the client-side variables should have.
   * This ensures the client doesn't accidentally leak env vars.
   * @default ''
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
    NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    // SEO & Social
    NEXT_PUBLIC_FB_APP_ID: z.string().optional(),
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SEO_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  },

  /**
   * Server-only variables.
   * These are not exposed to the client.
   */
  server: {
    // Database - REQUIRED in production
    DATABASE_URL: requiredInProduction 
      ? z.string().min(1, "DATABASE_URL is required in production")
      : z.string().optional(),
    DIRECT_URL: z.string().optional(),

    // Auth - REQUIRED in production
    NEXTAUTH_URL: requiredInProduction
      ? z.string().url("NEXTAUTH_URL must be a valid URL")
      : z.string().optional(),
    NEXTAUTH_SECRET: requiredInProduction
      ? z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters in production")
      : z.string().optional(),

    // Security - REQUIRED in production for CORS
    ALLOWED_ORIGIN: process.env.NODE_ENV === "production"
      ? z.string().min(1, "ALLOWED_ORIGIN is required in production")
      : z.string().optional(),

    // Redis - REQUIRED in production for rate limiting
    UPSTASH_REDIS_REST_URL: process.env.NODE_ENV === "production"
      ? z.string().url("UPSTASH_REDIS_REST_URL must be a valid URL")
      : z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // Stripe - REQUIRED if payment is enabled
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Email - REQUIRED in production
    SMTP_HOST: process.env.NODE_ENV === "production"
      ? z.string().min(1, "SMTP_HOST is required in production")
      : z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),

    // AI - Optional
    GEMINI_API_KEY: z.string().optional(),

    // Admin 2FA - Optional but recommended in production
    ADMIN_2FA_SECRET: z.string().optional(),

    // OAuth - Optional
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Captcha - Optional
    TURNSTILE_SECRET_KEY: z.string().optional(),

    // Sentry - Optional
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_DSN: z.string().optional(),

    // Email & Notifications
    CONTACT_INBOX: z.string().email().optional(),

    // Health check protection
    HEALTH_SECRET: z.string().optional(),
  },

  /**
   * Since we're using Next.js App Router, we need to pass the runtime env
   * variables in client action and server action, as well.
   * 
   * @link https://nextjs.org/docs/app/building-your-application/deploying#environment-variables
   * 
   * @example 'import { env } from "~/env"'
   */
  runtimeEnv: {
    // Client-side (public)
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SEO_SITE_URL: process.env.NEXT_PUBLIC_SEO_SITE_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,

    // Server-side (private)
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ADMIN_2FA_SECRET: process.env.ADMIN_2FA_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    CONTACT_INBOX: process.env.CONTACT_INBOX,
    HEALTH_SECRET: process.env.HEALTH_SECRET,
  },

  /**
   * Empty string is not a valid URL.
   * @link https://github.com/colinhacks/zod#strings
   */
  emptyStringAsUndefined: true,
});

/**
 * Helper function to check if we're in production
 */
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";

/**
 * Helper to get required env var or throw error
 * @deprecated Use the `env` object above instead
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
