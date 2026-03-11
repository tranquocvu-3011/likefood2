/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

export interface AdminCategoryOption {
  value: string;
  label: string;
  description: string;
}

export const ADMIN_CATEGORY_OPTIONS: AdminCategoryOption[] = [
  { value: "CÃ¡ khÃ´", label: "Ca kho", description: "Dried fish and savory pantry staples" },
  { value: "TÃ´m & Má»±c khÃ´", label: "Tom va muc kho", description: "Dried shrimp, squid, and seafood snacks" },
  { value: "TrÃ¡i cÃ¢y sáº¥y", label: "Trai cay say", description: "Fruit chips, candied fruit, and shelf-stable snacks" },
  { value: "TrÃ  & BÃ¡nh má»©t", label: "Tra va banh mut", description: "Tea, sweets, and gift-friendly treats" },
  { value: "Gia vá»‹ Viá»‡t", label: "Gia vi Viet", description: "Sauces, spice blends, and pantry essentials" },
  { value: "ChÆ°a phÃ¢n loáº¡i", label: "Chua phan loai", description: "Needs further merchandising review" },
  { value: "KhÃ¡c", label: "Khac", description: "Everything outside the core catalog" },
];

const CATEGORY_LABEL_MAP = new Map(ADMIN_CATEGORY_OPTIONS.map((item) => [item.value, item.label]));

export function getAdminCategoryLabel(value?: string | null) {
  if (!value) return "Uncategorized";
  return CATEGORY_LABEL_MAP.get(value) || value;
}
