/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useEffect, useState } from "react";

interface PublicSettings {
    ABOUT_STORY_TEXT?: string;
}

export function AboutDynamicSection() {
    const [story, setStory] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/public/settings");
                if (!res.ok) return;
                const data: PublicSettings = await res.json();
                if (data.ABOUT_STORY_TEXT) {
                    setStory(data.ABOUT_STORY_TEXT);
                }
            } catch {
                // ignore
            }
        };
        load();
    }, []);

    if (!story) return null;

    return (
        <section className="py-16 bg-white">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] max-w-4xl">
                <div className="bg-slate-50 rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm">
                    <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">
                        Câu chuyện LIKEFOOD
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base lg:text-lg">
                        {story}
                    </p>
                </div>
            </div>
        </section>
    );
}

