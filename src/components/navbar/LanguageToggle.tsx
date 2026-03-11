"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useLanguage } from "@/lib/i18n/context";

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
            <button
                onClick={() => setLanguage("vi")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === "vi"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                VI
            </button>
            <button
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === "en"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                EN
            </button>
        </div>
    );
}
