/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Module-level cache for /api/public/settings to avoid duplicate fetches
 * across components on the same page. Cache expires after 5 minutes.
 */

type PublicSettings = Record<string, string>;

let cachedPromise: Promise<PublicSettings> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getPublicSettings(): Promise<PublicSettings> {
  const now = Date.now();

  if (cachedPromise && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPromise;
  }

  cacheTimestamp = now;
  cachedPromise = fetch("/api/public/settings")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json() as Promise<PublicSettings>;
    })
    .catch(() => {
      // Reset cache on failure so the next call retries
      cachedPromise = null;
      return {} as PublicSettings;
    });

  return cachedPromise;
}
