/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Currency formatting utilities for the storefront and admin UI.
 * The application is standardized on USD.
 */

export type Currency = "USD";

export interface CurrencyConfig {
    currency?: Currency;
    locale?: string;
}

const DEFAULT_CURRENCY: Currency = "USD";
const DEFAULT_LOCALE = "en-US";

export function setDefaultCurrency(_currency: Currency) {
    // Currency is fixed to USD for this application.
}

export function getDefaultCurrency(): Currency {
    return DEFAULT_CURRENCY;
}

export function formatPrice(price: number, config?: CurrencyConfig): string {
    return new Intl.NumberFormat(config?.locale || DEFAULT_LOCALE, {
        style: "currency",
        currency: DEFAULT_CURRENCY,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price || 0);
}

export function formatPriceNumber(price: number, config?: CurrencyConfig): string {
    return new Intl.NumberFormat(config?.locale || DEFAULT_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price || 0);
}

export function getCurrencySymbol(_currency?: Currency): string {
    return "$";
}

export function parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^\d.-]/g, "");
    return Number.parseFloat(cleaned) || 0;
}
