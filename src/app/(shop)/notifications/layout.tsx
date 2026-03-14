/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Notifications page layout with SEO metadata
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const isEn = cookieStore.get("language")?.value === "en";

    return {
        title: isEn ? "Notifications - LIKEFOOD" : "Thông Báo - LIKEFOOD",
        description: isEn
            ? "View your LIKEFOOD notifications — order updates, promotions, and important announcements."
            : "Xem thông báo LIKEFOOD — cập nhật đơn hàng, khuyến mãi và thông báo quan trọng.",
        robots: { index: false, follow: false },
    };
}

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
