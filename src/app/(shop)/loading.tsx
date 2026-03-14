/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { cookies } from "next/headers";

export default async function Loading() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const text = lang === "en" ? "Loading..." : "Đang tải...";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-600 font-bold">{text}</p>
            </div>
        </div>
    );
}
