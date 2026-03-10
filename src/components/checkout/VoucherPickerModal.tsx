/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Ticket, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface Voucher {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    discountAmount?: number;
    minOrderValue?: number | null;
    maxDiscount?: number | null;
    category?: string;
    canUse?: boolean;
    reason?: string;
    expiresAt?: Date | null;
    usageLimit?: number | null;
    usedCount?: number;
    type?: "PERCENTAGE" | "FIXED" | "SHIPPING";
    value?: number;
}

interface VoucherPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderTotal: number;
    selectedVoucher: Voucher | null;
    onSelectVoucher: (voucher: Voucher | null) => void;
}

export default function VoucherPickerModal({
    isOpen,
    onClose,
    orderTotal,
    selectedVoucher,
    onSelectVoucher,
}: VoucherPickerModalProps) {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/vouchers/checkout?orderTotal=${orderTotal}`);
            if (res.ok) {
                const data = await res.json();
                setVouchers(data.vouchers || []);
            }
        } catch (error) {
            logger.error("Failed to fetch vouchers", error as Error, { context: 'voucher-picker-modal' });
            toast.error("Không thể tải voucher");
        } finally {
            setLoading(false);
        }
    }, [orderTotal]);

    useEffect(() => {
        if (isOpen) {
            fetchVouchers();
        }
    }, [isOpen, fetchVouchers]);

    const handleSelect = (voucher: Voucher) => {
        if (!voucher.canUse) {
            toast.error(voucher.reason);
            return;
        }
        onSelectVoucher(voucher);
        toast.success(`Đã áp dụng voucher ${voucher.code}`);
        onClose();
    };

    const handleRemove = () => {
        onSelectVoucher(null);
        toast.success("Đã xóa voucher");
        onClose();
    };

    const formatDiscount = (voucher: Voucher) => {
        if (voucher.discountType === "PERCENTAGE") {
            return `${voucher.discountValue}%`;
        }
        return `$${voucher.discountValue.toFixed(2)}`;
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case "shipping": return "from-blue-500 to-cyan-500";
            case "flash": return "from-orange-500 to-red-500";
            case "new": return "from-emerald-500 to-teal-500";
            default: return "from-primary to-emerald-500";
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Chọn Voucher</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {selectedVoucher && (
                        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-widest text-green-600 mb-1">
                                        Voucher đang áp dụng
                                    </p>
                                    <p className="text-lg font-black text-green-900">{selectedVoucher.code}</p>
                                    <p className="text-sm text-green-700">
                                        Giảm {formatDiscount(selectedVoucher)} - Tiết kiệm ${selectedVoucher.discountAmount?.toFixed(2) ?? selectedVoucher.discountValue.toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleRemove}
                                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-500">Đang tải voucher...</p>
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="text-center py-12">
                            <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Bạn chưa có voucher nào</p>
                            <p className="text-sm text-slate-400 mt-2">Hãy lưu voucher tại trang Vouchers để sử dụng</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {vouchers.map((voucher) => (
                                <button
                                    key={voucher.id}
                                    onClick={() => handleSelect(voucher)}
                                    disabled={!voucher.canUse}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedVoucher?.id === voucher.id
                                            ? "border-primary bg-primary/5"
                                            : voucher.canUse
                                                ? "border-slate-200 hover:border-primary/50 bg-white"
                                                : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getCategoryColor(voucher.category)} flex items-center justify-center`}>
                                                    <Ticket className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg text-slate-900">{voucher.code}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {voucher.category === "shipping" ? "Free Ship" :
                                                            voucher.category === "flash" ? "Flash Sale" :
                                                                voucher.category === "new" ? "Khách mới" : "Tất cả"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl font-black text-primary">
                                                    {formatDiscount(voucher)}
                                                </span>
                                                {voucher.maxDiscount && (
                                                    <span className="text-xs text-slate-400">
                                                        (Tối đa ${voucher.maxDiscount.toFixed(2)})
                                                    </span>
                                                )}
                                            </div>
                                            {voucher.minOrderValue && (
                                                <p className="text-xs text-slate-500">
                                                    Đơn tối thiểu: ${voucher.minOrderValue.toFixed(2)}
                                                </p>
                                            )}
                                            {!voucher.canUse && voucher.reason && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{voucher.reason}</span>
                                                </div>
                                            )}
                                        </div>
                                        {selectedVoucher?.id === voucher.id && (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <a
                            href="/vouchers"
                            className="block text-center text-sm font-bold text-primary hover:underline"
                        >
                            Xem thêm voucher tại Voucher Center →
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
