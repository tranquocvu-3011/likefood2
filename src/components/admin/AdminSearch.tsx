"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

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
  searchPlaceholder = "Tìm kiếm...",
  children,
}: AdminFilterBarProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {children ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              <SlidersHorizontal className="h-3 w-3" />
              Bộ lọc
            </div>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
