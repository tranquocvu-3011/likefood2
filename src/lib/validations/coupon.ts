/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { z } from 'zod';
import { positiveNumberSchema } from './common';

/**
 * Coupon validation schemas
 */

// Coupon query parameters
export const couponQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    isActive: z.coerce.boolean().optional(),
});

// Create coupon schema (admin)
export const createCouponSchema = z.object({
    code: z.string()
        .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
        .max(50, 'Mã giảm giá không được quá 50 ký tự')
        .toUpperCase(),
    description: z.string().max(500).optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.coerce.number()
        .min(0, 'Giá trị giảm không được âm')
        .max(100, 'Giảm giá theo phần trăm không được vượt quá 100%'),
    minOrderValue: positiveNumberSchema.optional().nullable(),
    maxDiscount: positiveNumberSchema.optional().nullable(),
    usageLimit: z.coerce.number().int().min(1).optional().nullable(),
    usagePerUser: z.coerce.number().int().min(1).default(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    isActive: z.boolean().default(true),
    category: z.string().default("all"),
});

// Update coupon schema (admin)
export const updateCouponSchema = createCouponSchema.partial();

// Validate coupon code (user)
export const validateCouponSchema = z.object({
    code: z.string().min(3).max(50).toUpperCase(),
});

// Export types
export type CouponQueryInput = z.infer<typeof couponQuerySchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
