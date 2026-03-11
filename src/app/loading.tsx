"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="text-center flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4 animate-pulse">
          <Image
            src="/loadtrang.png"
            alt="Loading..."
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
        <p className="text-slate-600 font-medium tracking-widest uppercase text-sm animate-bounce">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}
