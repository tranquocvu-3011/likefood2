/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Helper: Tự động detect URL phù hợp cho cả local và VPS
 */

import { headers } from "next/headers";

/**
 * Server-side: Lấy app URL dựa trên request headers (tự detect domain).
 * - Khi chạy local → http://localhost:3000
 * - Khi chạy VPS   → https://likefood.vudev.io.vn
 */
export async function getAppUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") || "http";

    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    // Fallback nếu không có request context (build time, scripts, etc.)
  }

  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Client-side: Lấy app URL từ env hoặc window.location.
 * Dùng trong client components hoặc hooks.
 */
export function getClientAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
