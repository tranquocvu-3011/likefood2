/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import type { Metadata } from "next";
import { FAQContent } from "@/components/faq/FAQContent";

export const revalidate = 86400; // 24 hours for static content

export const metadata: Metadata = {
    title: "Câu hỏi thường gặp - LIKEFOOD",
    description: "Giải đáp các câu hỏi thường gặp về đặt hàng, vận chuyển, thanh toán và chính sách đổi trả tại LIKEFOOD.",
};

export default function FAQPage() {
    return <FAQContent />;
}
