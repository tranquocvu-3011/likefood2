"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/currency";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MiniCartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
    const { items, removeItem, updateQuantity, totalPrice } = useCart();

    const cartContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Cart Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl z-[9999] flex flex-col max-h-[85vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary/5 to-emerald-50 border-b border-slate-100">
                            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-4.5 h-4.5 text-primary" />
                                </div>
                                Giỏ hàng
                                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200">
                            {items.length === 0 ? (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center space-y-4 py-8">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1, type: "spring" }}
                                        className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center"
                                    >
                                        <ShoppingBag className="w-9 h-9 text-slate-200" />
                                    </motion.div>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1">Giỏ hàng trống</p>
                                        <p className="text-sm text-slate-400">Hãy thêm sản phẩm vào giỏ nhé!</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="mt-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors"
                                    >
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex gap-3.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group hover:border-primary/20 hover:bg-white transition-all duration-300"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-100">
                                                <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                                <div className="pr-7">
                                                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="font-black text-primary text-sm">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                {/* Quantity Control */}
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                                        >
                                                            <span className="text-sm font-bold leading-none">−</span>
                                                        </button>
                                                        <span className="w-7 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                                        >
                                                            <span className="text-sm font-bold leading-none">+</span>
                                                        </button>
                                                    </div>
                                                    <span className="text-xs font-black text-slate-500">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-2.5 right-2.5 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="bg-white border-t border-slate-100 p-5">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Tổng cộng</span>
                                    <span className="text-xl font-black text-slate-900">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="flex items-center justify-center py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs hover:border-primary hover:text-primary transition-all"
                                    >
                                        Xem chi tiết
                                    </Link>
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-white font-bold uppercase tracking-wider text-xs hover:shadow-lg hover:shadow-primary/25 transition-all group"
                                    >
                                        Thanh toán
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // Portal to body to escape navbar stacking context
    if (typeof document === "undefined") return null;
    return createPortal(cartContent, document.body);
}
