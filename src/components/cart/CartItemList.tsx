/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { Trash2, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/context";

export interface CartItem {
    id: string;
    name: string;
    slug?: string;
    price: number;
    quantity: number;
    image?: string;
    inventory?: number;
    productId: string;
}

interface CartItemListProps {
    items: CartItem[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleAll: () => void;
    allSelected: boolean;
    someSelected: boolean;
    onRemoveItem: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveSelected: (ids: Set<string>) => void;
    onSaveForLater: (item: CartItem) => void;
}

export function CartItemList({
    items,
    selectedIds,
    onToggleSelect,
    onToggleAll,
    allSelected,
    someSelected,
    onRemoveItem,
    onUpdateQuantity,
    onRemoveSelected,
    onSaveForLater,
}: CartItemListProps) {
    const { language } = useLanguage();
    const session = useSession();

    return (
        <div className="space-y-6">
            {/* Select All Bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <button
                    onClick={onToggleAll}
                    className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-primary transition-colors"
                >
                    {allSelected ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                    ) : someSelected ? (
                        <div className="relative">
                            <Square className="w-5 h-5 text-primary" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2.5 h-0.5 bg-primary rounded" />
                            </div>
                        </div>
                    ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                    )}
                    {language === "vi" ? `Chọn tất cả (${items.length} sản phẩm)` : `Select all (${items.length} items)`}
                </button>
                {selectedIds.size > 0 && (
                    <button
                        onClick={() => onRemoveSelected(selectedIds)}
                        className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        {language === "vi" ? `Xoá đã chọn (${selectedIds.size})` : `Delete selected (${selectedIds.size})`}
                    </button>
                )}
            </div>

            {/* Cart Items */}
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`flex gap-4 md:gap-8 p-5 md:p-6 bg-white rounded-3xl border transition-all ${selectedIds.has(item.id) ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-slate-100 shadow-sm'
                        }`}
                >
                    {/* Checkbox */}
                    <button
                        onClick={() => onToggleSelect(item.id)}
                        className="flex-shrink-0 mt-1 md:mt-5 p-2 -ml-2"
                    >
                        {selectedIds.has(item.id) ? (
                            <CheckSquare className="w-6 h-6 text-primary" />
                        ) : (
                            <Square className="w-6 h-6 text-slate-300 hover:text-slate-400 transition-colors" />
                        )}
                    </button>

                    {/* Image */}
                    <Link
                        href={`/products/${item.slug || item.id}`}
                        className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-3xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100 flex items-center justify-center group/img relative"
                    >
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                                sizes="128px"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-primary/10 rounded-lg" />
                        )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex justify-between items-start">
                                <Link href={`/products/${item.slug || item.id}`}>
                                    <h3 className="font-black text-lg md:text-xl hover:text-primary transition-colors tracking-tight line-clamp-1">{item.name}</h3>
                                </Link>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-slate-900 font-black text-lg mt-1">{formatPrice(item.price)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center border-2 border-slate-100 rounded-2xl p-1.5 bg-white shadow-sm">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-colors text-slate-600 hover:text-primary font-black text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 md:px-4 font-black text-lg md:text-xl w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-colors text-slate-600 hover:text-primary font-black text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                {session.data?.user ? (
                                    <button
                                        onClick={() => onSaveForLater(item)}
                                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                                    >
                                        {language === "vi" ? "Lưu sau" : "Save for later"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
