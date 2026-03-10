/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useCompare } from "@/contexts/CompareContext";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function CompareFloatingButton() {
    const { compareItems } = useCompare();
    const { language } = useLanguage();

    if (compareItems.length === 0) {
        return null;
    }

    return (
        <Link
            href="/compare"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-bold"
        >
            <ArrowLeftRight className="w-5 h-5" />
            {language === "vi" ? "So sánh" : "Compare"}
            <span className="bg-white text-primary px-2 py-0.5 rounded-full text-sm font-black">
                {compareItems.length}
            </span>
        </Link>
    );
}
