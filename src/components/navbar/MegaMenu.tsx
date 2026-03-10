/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Sparkles, Fish, Shell, Apple, Coffee, Flame, Gift, Zap, ArrowRight } from "lucide-react";

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    {
        name: "Cá khô",
        slug: "ca-kho",
        icon: Fish,
        color: "from-blue-500 to-cyan-400",
        bg: "bg-blue-50",
        textColor: "text-blue-600",
        items: ["Cá lóc khô", "Cá chỉ vàng", "Cá basa khô", "Cá sặc rằn", "Cá kèo khô"],
        featured: { name: "Khô cá lóc Châu Đốc", discount: "20%" }
    },
    {
        name: "Tôm & Mực khô",
        slug: "tom-muc-kho",
        icon: Shell,
        color: "from-orange-500 to-amber-400",
        bg: "bg-orange-50",
        textColor: "text-orange-600",
        items: ["Tôm khô Cà Mau", "Mực khô Phan Thiết", "Tép khô", "Mực rim me"],
        featured: { name: "Tôm khô size lớn", discount: "15%" }
    },
    {
        name: "Trái cây sấy",
        slug: "trai-cay-say",
        icon: Apple,
        color: "from-emerald-500 to-green-400",
        bg: "bg-emerald-50",
        textColor: "text-emerald-600",
        items: ["Xoài sấy dẻo", "Chuối sấy giòn", "Mít sấy", "Thanh long sấy", "Khoai lang sấy"],
        featured: { name: "Combo trái cây sấy", discount: "25%" }
    },
    {
        name: "Trà & Bánh mứt",
        slug: "tra-banh-mut",
        icon: Coffee,
        color: "from-amber-500 to-yellow-400",
        bg: "bg-amber-50",
        textColor: "text-amber-600",
        items: ["Trà sen Huế", "Trà atiso", "Mứt gừng", "Bánh tráng", "Kẹo dừa"],
        featured: null
    },
    {
        name: "Gia vị Việt",
        slug: "gia-vi-viet",
        icon: Flame,
        color: "from-red-500 to-rose-400",
        bg: "bg-red-50",
        textColor: "text-red-600",
        items: ["Nước mắm Phú Quốc", "Muối tôm Tây Ninh", "Sa tế", "Tương ớt", "Mắm ruốc"],
        featured: null
    },
    {
        name: "Quà tặng",
        slug: "qua-tang",
        icon: Gift,
        color: "from-violet-500 to-purple-400",
        bg: "bg-violet-50",
        textColor: "text-violet-600",
        items: ["Set quà Tết", "Combo gia đình", "Hộp quà cao cấp", "Túi quà xinh"],
        featured: { name: "Set quà Tết 2026", discount: "30%" }
    }
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    return (
        <>
            {/* Invisible click-outside catcher — không mờ, không blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60]"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1000px] max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.05)] z-[70] overflow-hidden"
                    >
                        {/* Accent strip */}
                        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-primary to-teal-400" />

                        <div className="flex">
                            {/* ── Categories ── */}
                            <div className="flex-1 p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                            Danh mục sản phẩm
                                        </span>
                                    </div>
                                    <Link
                                        href="/products"
                                        onClick={onClose}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Xem tất cả <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                {/* Grid 3 × 2 */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                                            onClick={onClose}
                                            className="group flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition-all duration-150"
                                        >
                                            {/* Icon */}
                                            <div className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-150 flex-shrink-0`}>
                                                <cat.icon className="w-[18px] h-[18px] text-white" />
                                            </div>

                                            {/* Text */}
                                            <div className="min-w-0">
                                                <h4 className={`text-[12.5px] font-bold text-slate-800 group-hover:${cat.textColor} transition-colors leading-snug mb-1.5`}>
                                                    {cat.name}
                                                </h4>
                                                <div className="space-y-0.5">
                                                    {cat.items.slice(0, 3).map((item) => (
                                                        <p key={item} className="text-[11px] text-slate-400 group-hover:text-slate-500 truncate transition-colors">
                                                            {item}
                                                        </p>
                                                    ))}
                                                    {cat.items.length > 3 && (
                                                        <p className="text-[10px] font-semibold text-primary/60 group-hover:text-primary transition-colors">
                                                            +{cat.items.length - 3} sản phẩm
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <Link
                                        href="/products"
                                        onClick={onClose}
                                        className="group flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[12px] font-bold tracking-wide transition-colors shadow-sm hover:shadow-md hover:shadow-primary/25"
                                    >
                                        Khám phá toàn bộ sản phẩm
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* ── Sidebar: Ưu đãi nổi bật ── */}
                            <div className="w-[220px] flex-shrink-0 bg-slate-50/70 border-l border-slate-100 p-5 flex flex-col gap-4">
                                {/* Sidebar header */}
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                                        Ưu đãi nổi bật
                                    </span>
                                </div>

                                {/* Deal cards */}
                                <div className="space-y-2 flex-1">
                                    {categories.filter(c => c.featured).map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                                            onClick={onClose}
                                            className="group flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-primary/25 hover:shadow-sm transition-all duration-150"
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                                <cat.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-slate-700 group-hover:text-primary transition-colors truncate leading-tight">
                                                    {cat.featured?.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Ưu đãi có hạn</p>
                                            </div>
                                            <span className="text-[9px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                                -{cat.featured?.discount}
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Flash Sale CTA */}
                                <Link
                                    href="/flash-sale"
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-red-200"
                                >
                                    🔥 Flash Sale
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
