/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

const POPULAR_SEARCHES = [
    "Cá khô",
    "Tôm khô",
    "Mực khô",
    "Trái cây sấy",
    "Mứt tết",
    "Gia vị Việt"
];

export default function HomeSearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const debouncedQuery = useDebounce(query, 300);

    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        try {
            const res = await fetch(`/api/products/search-hints?q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.hints || []);
            }
        } catch {
            // Silent fail
            setSuggestions([]);
        }
    }, []);

    // Fetch suggestions when user types (defer to avoid sync state in effect)
    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            if (debouncedQuery.length >= 2) {
                fetchSuggestions(debouncedQuery);
            } else {
                setSuggestions([]);
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [debouncedQuery, fetchSuggestions]);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setQuery("");
            setIsFocused(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <div className="relative max-w-4xl mx-auto mt-0 z-20 px-4 py-6 md:py-8">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <form onSubmit={handleSubmit} className="relative">
                    {/* Search Input */}
                    <div className={`relative bg-white rounded-full shadow-2xl transition-all duration-500 border-[3px] ${isFocused
                        ? 'border-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_15px_60px_-15px_rgba(16,185,129,0.4)]'
                        : 'border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-100'
                        }`}>
                        <Search className={`absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 transition-colors duration-300 ${isFocused ? 'text-emerald-600' : 'text-slate-400'}`} />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder="Tìm cá khô, tôm khô, đặc sản Việt Nam..."
                            className="w-full pl-16 md:pl-20 pr-28 md:pr-40 py-5 md:py-6 rounded-full text-lg md:text-xl font-semibold outline-none placeholder:text-slate-400 bg-transparent text-slate-800"
                        />

                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute right-28 md:right-40 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: "0 15px 30px -5px rgba(16, 185, 129, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-black text-base md:text-xl transition-all shadow-lg flex items-center gap-2"
                        >
                            <span className="hidden leading-none sm:inline">Khám Phá</span>
                            <span className="sm:hidden leading-none">Tìm</span>
                        </motion.button>
                    </div>


                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {isFocused && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                            >
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSearch(suggestion)}
                                        className="w-full px-6 py-4 text-left hover:bg-emerald-50 transition-colors flex items-center gap-4 border-b border-slate-50 last:border-0 group"
                                    >
                                        <Search className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        <span className="font-semibold text-lg text-slate-700 group-hover:text-emerald-700">{suggestion}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>

                {/* Popular Searches */}
                {!isFocused && !query && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-5"
                    >
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            <span className="text-base text-slate-600 font-bold uppercase tracking-wider">Mọi người hay tìm:</span>
                        </div>
                        {POPULAR_SEARCHES.map((search) => (
                            <button
                                key={search}
                                type="button"
                                onClick={() => handleSearch(search)}
                                className="px-4 py-2 bg-white/80 hover:bg-emerald-600 hover:text-white text-sm md:text-base font-semibold text-slate-700 rounded-full border border-slate-200 hover:border-emerald-600 transition-all hover:scale-105 shadow-sm hover:shadow-emerald-200/50"
                            >
                                {search}
                            </button>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div >
    );
}
