/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import React, { createContext, useContext, useState } from "react";
import { vi } from "./dictionaries/vi";
import { en } from "./dictionaries/en";

type Language = "vi" | "en";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = any;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
    dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === "undefined") return "vi";
        const saved = localStorage.getItem("language") as Language;
        return saved === "vi" || saved === "en" ? saved : "vi";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const dict = language === "vi" ? vi : en;

    const t = (path: string) => {
        const keys = path.split(".");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = dict;
        for (const key of keys) {
            result = result?.[key];
        }
        return typeof result === "string" ? result : path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dict }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
