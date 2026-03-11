"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Ticket, CheckCircle2, XCircle, Clock, Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { logger } from "@/lib/logger";

interface Voucher {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    startDate: string;
    endDate: string;
    category: string;
    status: "available" | "used" | "expired";
    claimedAt: string;
    usedAt: string | null;
}

const tabs = [
    { id: "all", label: "Tất cả", icon: Ticket },
    { id: "available", label: "Có thể dùng", icon: CheckCircle2 },
    { id: "used", label: "Đã dùng", icon: XCircle },
    { id: "expired", label: "Hết hạn", icon: Clock },
];

export default function VoucherWalletPage() {
    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const fetchVouchers = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = activeTab === "all"
                ? "/api/user/vouchers"
                : `/api/user/vouchers?status=${activeTab}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setVouchers(data.vouchers || []);
            }
        } catch (error) {
            logger.error("Failed to fetch vouchers", error as Error, { context: 'profile-vouchers-page' });
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=/profile/vouchers");
            return;
        }

        if (sessionStatus === "authenticated") {
            fetchVouchers();
        }
    }, [sessionStatus, activeTab, router, fetchVouchers]);

    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            toast.success(`Đã sao chép mã ${code}!`);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch {
            toast.error("Không thể sao chép mã");
        }
    };

    const formatDiscount = (voucher: Voucher) => {
        if (voucher.discountType === "PERCENTAGE") {
            return `${voucher.discountValue}%`;
        }
        return `$${voucher.discountValue.toFixed(2)}`;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "shipping": return "from-blue-500 to-cyan-500";
            case "flash": return "from-orange-500 to-red-500";
            case "new": return "from-emerald-500 to-teal-500";
            default: return "from-primary to-emerald-500";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available": return "bg-green-50 text-green-600 border-green-200";
            case "used": return "bg-slate-50 text-slate-400 border-slate-200";
            case "expired": return "bg-red-50 text-red-400 border-red-200";
            default: return "bg-slate-50 text-slate-400 border-slate-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "available": return "Có thể dùng";
            case "used": return "Đã dùng";
            case "expired": return "Hết hạn";
            default: return status;
        }
    };

    if (sessionStatus === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="page-container-wide">
                <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold">Quay lại Profile</span>
                </Link>

                <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">
                    Ví Voucher của tôi
                </h1>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Vouchers Grid */}
                {vouchers.length === 0 ? (
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 bg-white">
                        <CardContent className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Ticket className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                                Chưa có voucher nào
                            </h3>
                            <p className="text-slate-400 font-medium mb-8">
                                {activeTab === "available"
                                    ? "Bạn chưa có voucher nào có thể sử dụng"
                                    : activeTab === "used"
                                        ? "Bạn chưa sử dụng voucher nào"
                                        : activeTab === "expired"
                                            ? "Bạn chưa có voucher nào hết hạn"
                                            : "Hãy lưu voucher tại Voucher Center để sử dụng"}
                            </p>
                            <Link href="/vouchers">
                                <button className="px-8 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                                    Xem Voucher Center
                                </button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((voucher, index) => (
                            <motion.div
                                key={voucher.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white rounded-3xl shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-amber-100 transition-all overflow-hidden"
                            >
                                {/* Top Gradient Bar */}
                                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(voucher.category)}`} />

                                <CardContent className="p-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(voucher.status)}`}>
                                            {voucher.status === "available" && <CheckCircle2 className="w-3 h-3" />}
                                            {voucher.status === "used" && <XCircle className="w-3 h-3" />}
                                            {voucher.status === "expired" && <Clock className="w-3 h-3" />}
                                            {getStatusText(voucher.status)}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600`}>
                                            {voucher.category === "shipping" ? "Free Ship" :
                                                voucher.category === "flash" ? "Flash Sale" :
                                                    voucher.category === "new" ? "Khách mới" : "Tất cả"}
                                        </span>
                                    </div>

                                    {/* Discount */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(voucher.category)} flex items-center justify-center shadow-lg`}>
                                            <span className="text-2xl font-black text-white">{formatDiscount(voucher)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">{voucher.code}</h3>
                                            {voucher.maxDiscount && (
                                                <p className="text-xs font-bold text-slate-400">Tối đa ${voucher.maxDiscount.toFixed(2)}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-2 mb-4 text-xs font-medium text-slate-500">
                                        {voucher.minOrderValue && (
                                            <p>Đơn tối thiểu: ${voucher.minOrderValue.toFixed(2)}</p>
                                        )}
                                        <p>HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}</p>
                                        {voucher.usedAt && (
                                            <p className="text-slate-400">Đã dùng: {new Date(voucher.usedAt).toLocaleDateString("vi-VN")}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {voucher.status === "available" && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopyCode(voucher.code)}
                                                className={`flex-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${copiedCode === voucher.code
                                                    ? "bg-green-500 text-white"
                                                    : `bg-gradient-to-r ${getCategoryColor(voucher.category)} text-white shadow-lg`
                                                    }`}
                                            >
                                                {copiedCode === voucher.code ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Check className="w-4 h-4" />
                                                        Đã sao chép
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Copy className="w-4 h-4" />
                                                        Sao chép mã
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
