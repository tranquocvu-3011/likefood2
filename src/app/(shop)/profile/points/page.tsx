/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { 
    ArrowLeft, Loader2, Plus, Minus, Gift, Clock, 
    CheckCircle2, Info, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { logger } from "@/lib/logger";

interface PointTransaction {
    id: string;
    amount: number;
    type: string;
    description?: string | null;
    orderId?: string | null;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    EARN: { label: "Tích điểm", color: "text-green-600", bgColor: "bg-green-50", icon: Plus },
    SPEND: { label: "Sử dụng điểm", color: "text-red-600", bgColor: "bg-red-50", icon: Minus },
    REFUND: { label: "Hoàn điểm", color: "text-blue-600", bgColor: "bg-blue-50", icon: CheckCircle2 },
    EXPIRED: { label: "Hết hạn", color: "text-slate-500", bgColor: "bg-slate-50", icon: Clock },
};

export default function PointsHistoryPage() {
    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const [transactions, setTransactions] = useState<PointTransaction[]>([]);
    const [_pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
    const [currentPoints, setCurrentPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = `/api/user/points?page=1&limit=50${filter !== "all" ? `&type=${filter}` : ''}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
                setPagination(data.pagination);
                setCurrentPoints(data.currentPoints || 0);
            }
        } catch (error) {
            logger.error("Failed to fetch points", error as Error, { context: 'profile-points-page' });
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=" + window.location.pathname);
        }

        if (sessionStatus === "authenticated") {
            fetchTransactions();
        }
    }, [sessionStatus, router, filter, fetchTransactions]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getTypeConfig = (type: string) => {
        return typeConfig[type] || { label: type, color: "text-slate-600", bgColor: "bg-slate-50", icon: Info };
    };

    // Calculate totals
    const totalEarned = transactions
        .filter(t => t.type === "EARN")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = transactions
        .filter(t => t.type === "SPEND")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
                {/* Header */}
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Quay lại hồ sơ</span>
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
                        Lịch sử điểm LIKEFOOD
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Theo dõi lịch sử tích và sử dụng điểm của bạn
                    </p>
                </div>

                {/* Points Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="rounded-3xl border-none shadow-xl shadow-amber-100/40 bg-gradient-to-br from-amber-400 to-amber-500 overflow-hidden">
                        <CardContent className="p-8 text-white">
                            <p className="text-white/80 font-medium mb-2">Số dư hiện tại</p>
                            <p className="text-5xl font-black tracking-tighter">{currentPoints}</p>
                            <p className="text-white/70 font-medium mt-2">LIKEFOOD Xu</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-none shadow-lg shadow-green-100/40 bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-slate-500 font-medium">Tổng tích lũy</p>
                            </div>
                            <p className="text-3xl font-black text-green-600">+{totalEarned}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-none shadow-lg shadow-red-100/40 bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                    <Minus className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-slate-500 font-medium">Tổng đã sử dụng</p>
                            </div>
                            <p className="text-3xl font-black text-red-600">-{totalSpent}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {[
                        { value: "all", label: "Tất cả" },
                        { value: "EARN", label: "Tích điểm" },
                        { value: "SPEND", label: "Sử dụng" },
                        { value: "REFUND", label: "Hoàn điểm" },
                        { value: "EXPIRED", label: "Hết hạn" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
                                filter === option.value
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                {transactions.length === 0 ? (
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 bg-white overflow-hidden">
                        <CardContent className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Gift className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                                Chưa có giao dịch
                            </h3>
                            <p className="text-slate-400 font-medium mb-8">
                                Lịch sử điểm của bạn sẽ xuất hiện tại đây
                            </p>
                            <Link href="/products">
                                <button className="px-8 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                                    Mua sắm ngay
                                </button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 bg-white overflow-hidden">
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {transactions.map((transaction) => {
                                    const config = getTypeConfig(transaction.type);
                                    const isPositive = transaction.amount > 0;
                                    const isExpanded = expandedId === transaction.id;
                                    
                                    return (
                                        <div 
                                            key={transaction.id}
                                            className="p-4 hover:bg-slate-50 transition-colors"
                                        >
                                            <div 
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                                        <config.icon className={`w-6 h-6 ${config.color}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">
                                                            {config.label}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {formatDate(transaction.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className={`text-xl font-black ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                                        {isPositive ? "+" : ""}{transaction.amount}
                                                    </p>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {isExpanded && transaction.description && (
                                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-sm text-slate-600">
                                                        {transaction.description}
                                                    </p>
                                                    {transaction.orderId && (
                                                        <Link 
                                                            href={`/profile/orders/${transaction.orderId}`}
                                                            className="inline-block mt-2 text-sm text-primary hover:underline"
                                                        >
                                                            Xem đơn hàng
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
