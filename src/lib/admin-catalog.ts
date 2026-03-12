/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * getAdminCategoryLabel - Returns a display label for a category value.
 * Category data is now fetched live from /api/admin/categories.
 * This helper is kept as a fallback display utility.
 */
export function getAdminCategoryLabel(value?: string | null): string {
  if (!value) return "Chưa phân loại";
  return value;
}