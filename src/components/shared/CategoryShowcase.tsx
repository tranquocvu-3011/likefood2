/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
* LIKEFOOD - Vietnamese Specialty Marketplace
* Copyright (c) 2026 LIKEFOOD Team
* Licensed under the MIT License
* https://github.com/tranquocvu-3011/likefood
*/

"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/lib/i18n/context";

export default function CategoryShowcase() {
    const [dynamicCounts, setDynamicCounts] = useState<Record<string, number>>({});
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const { t, language } = useLanguage();

    const handleImageError = (src: string) => {
        setFailedImages(prev => new Set(prev).add(src));
    };

    const categories = [
        {
            name: language === "vi" ? "Cá khô" : "Dried Fish",
            dbName: "Cá khô",
            slug: "ca-kho",
            matchKeys: ["cá khô", "ca kho", "cakh", "ca"], // Thêm key để match dữ liệu api
            image: "/cakho.png",
            color: "bg-blue-50 text-blue-600 border-blue-100",
            iconBg: "bg-blue-100"
        },
        {
            name: language === "vi" ? "Tôm & Mực khô" : "Dried Shrimp & Squid",
            dbName: "Tôm & Mực khô",
            slug: "muc-kho",
            matchKeys: ["mực khô", "tôm khô", "mực", "tôm", "muc kho", "tom kho"],
            image: "/muckho.png",
            color: "bg-rose-50 text-rose-600 border-rose-100",
            iconBg: "bg-rose-100"
        },
        {
            name: language === "vi" ? "Trái cây sấy" : "Dried Fruits",
            dbName: "Trái cây sấy",
            slug: "trai-cay-say",
            matchKeys: ["trái cây sấy", "trai cay say", "hoa quả sấy"],
            image: "/traicaysay.png",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            iconBg: "bg-emerald-100"
        },
        {
            name: language === "vi" ? "Trà & Bánh mứt" : "Tea & Sweets",
            dbName: "Trà & Bánh mứt",
            slug: "banh-mut",
            matchKeys: ["bánh mứt", "trà", "banh mut", "tra"],
            image: "/mut_traicay.png",
            color: "bg-amber-50 text-amber-600 border-amber-100",
            iconBg: "bg-amber-100"
        },
        {
            name: language === "vi" ? "Gia vị Việt" : "Vietnamese Spices",
            dbName: "Gia vị Việt",
            slug: "gia-vi",
            matchKeys: ["gia vị", "gia vi"],
            image: "/giavi.png",
            color: "bg-orange-50 text-orange-600 border-orange-100",
            iconBg: "bg-orange-100"
        }
    ];

    // Fetch dynamic counts from API
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then((data: unknown) => {
                const counts: Record<string, number> = {};
                if (Array.isArray(data)) {
                    data.forEach((cat) => {
                        if (cat && typeof cat === "object" && "name" in cat && "productCount" in cat) {
                            const name = typeof (cat as { name?: unknown }).name === "string" ? (cat as { name: string }).name.toLowerCase() : null;
                            const productCount = typeof (cat as { productCount?: unknown }).productCount === "number"
                                ? (cat as { productCount: number }).productCount
                                : Number((cat as { productCount?: unknown }).productCount ?? 0);

                            if (name) {
                                // Find which predefined category this matches
                                const matchedCat = categories.find(c =>
                                    c.matchKeys.some(key => name.includes(key.toLowerCase()))
                                );

                                if (matchedCat) {
                                    // Aggregate counts for matches
                                    counts[matchedCat.slug] = (counts[matchedCat.slug] || 0) + productCount;
                                }
                            }
                        }
                    });
                }
                setDynamicCounts(counts);
            })
            .catch(error => {
                logger.warn('Failed to load category counts', { context: 'category-showcase', error: error as Error });
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="bg-slate-50 py-10 md:py-16 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute top-10 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[80px] -left-[200px] pointer-events-none" />
            <div className="absolute bottom-10 w-[300px] h-[300px] bg-amber-100/40 rounded-full blur-[80px] -right-[150px] pointer-events-none" />

            <div className="w-full mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-8 gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {language === "vi" ? "Khám Phá" : "Explore"}
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                        {t("home.categories")} <span className="text-emerald-600">{language === "vi" ? "Thực Phẩm" : "Food"}</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl">
                        {language === "vi" ? "Khám phá đặc sản Việt Nam chính gốc thông qua từng danh mục tuyển chọn kỹ lưỡng." : "Explore authentic Vietnamese specialties through carefully curated categories."}
                    </p>
                </div>

                {/* Category Grid - Modern Fresh Design with tighter gaps */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group h-full"
                        >
                            <Link
                                href={`/products?category=${encodeURIComponent(category.dbName)}`}
                                className="block h-full bg-white rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 hover:border-emerald-100 transition-all duration-300 group-hover:-translate-y-2 flex flex-col"
                            >
                                {/* Top Content: Icon & Badge */}
                                <div className="flex items-center justify-between mb-4 md:mb-5">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${category.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <ShoppingBag className={`w-4 h-4 md:w-5 md:h-5 ${category.color.split(' ')[1]}`} />
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold ${category.color} flex items-center gap-1`}>
                                        <span>{dynamicCounts[category.slug] ?? 0}</span>
                                        <span className="opacity-70 text-[9px] uppercase font-semibold">{language === "vi" ? "sản phẩm" : "Items"}</span>
                                    </div>
                                </div>

                                {/* Central Image */}
                                <div className="relative w-full aspect-square md:aspect-[4/3] mb-4 md:mb-5 rounded-2xl overflow-hidden flex items-center justify-center">
                                    <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                                        {failedImages.has(category.image) ? (
                                            <div className={`w-full h-full ${category.iconBg} flex items-center justify-center`}>
                                                <ShoppingBag className={`w-12 h-12 ${category.color.split(' ')[1]} opacity-40`} />
                                            </div>
                                        ) : (
                                            <Image
                                                src={`${category.image}?v=2`}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                                onError={() => handleImageError(category.image)}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="mt-auto flex items-center justify-between">
                                    <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 text-base md:text-lg">
                                        {category.name}
                                    </h3>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors border border-slate-100 group-hover:border-emerald-100">
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors -translate-x-0.5 group-hover:translate-x-0" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
