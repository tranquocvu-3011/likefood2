/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { z } from "zod";

/**
 * SEC-07: Environment Variable Validation
 * Validates all required environment variables at startup to fail fast
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // Auth - Critical
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  
  // Security - CRITICAL for production
  ALLOWED_ORIGIN: z.string().min(1, "ALLOWED_ORIGIN must be set in production").optional(),
  ADMIN_2FA_SECRET: z.string().min(32, "ADMIN_2FA_SECRET must be at least 32 characters").optional(),
  
  // Stripe (required if payments enabled)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // Redis (required for rate limiting in production)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  // Accept both plain email and 'Display Name <email>' nodemailer format
  SMTP_FROM: z.string().optional(),
  
  // AI
  GEMINI_API_KEY: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
});

// Override SMTP_FROM to accept nodemailer format 'Display Name <email@domain.com>'
// Zod's .email() rejects the display name format which nodemailer supports

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return parsed config
 * Call this at app startup to fail fast if env vars are missing
 */
export function validateEnv() {
  // Check if we're in build time (Next.js build process)
  const isBuilding = process.env.__NEXT_BUILDING === "true";
  // Only check production runtime requirements when NOT building
  const isProductionRuntime = process.env.NODE_ENV === "production" && !isBuilding;
  
  // Create a copy of process.env for validation
  const env = { ...process.env };
  
  // For production runtime (not build), ensure critical vars are present
  if (isProductionRuntime) {
    if (!env.ALLOWED_ORIGIN) {
      throw new Error("CRITICAL: ALLOWED_ORIGIN must be set in production! Use the production domain (e.g. https://likefood.com).");
    }
    if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.length < 32) {
      throw new Error("CRITICAL: NEXTAUTH_SECRET must be at least 32 characters in production!");
    }
  }
  
  // Validate all env vars using Zod
  const result = envSchema.safeParse(env);
  
  if (!result.success) {
    const issues = result.error?.issues ?? [];
    const errors = issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join("\n");
    throw new Error(`Environment validation failed:\n${errors || result.error?.message || "Unknown validation error"}`);
  }
  
  return result.data as EnvConfig;
}

// Export singleton instance
let envConfig: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!envConfig) {
    envConfig = validateEnv();
  }
  return envConfig;
}

export default getEnv;
