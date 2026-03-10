/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface AdminFilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
}

export function AdminFilterBar({
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search...",
  children,
}: AdminFilterBarProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] lg:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-primary focus:bg-white"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {children ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </div>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
