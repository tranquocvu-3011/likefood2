"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
    ArrowLeft, Clock, CheckCircle2, X, Loader2, 
    RefreshCw, AlertCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { logger } from "@/lib/logger";

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        image?: string | null;
    };
}

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    orderItems: OrderItem[];
}

interface RefundRequest {
    id: string;
    orderId: string;
    orderItemId?: string | null;
    reason: string;
    amount: number;
    status: string;
    adminNote?: string | null;
    refundMethod?: string | null;
    bankAccount?: string | null;
    bankName?: string | null;
    createdAt: string;
    updatedAt: string;
    order: Order;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: "Đang chờ", color: "bg-orange-500", icon: Clock },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-500", icon: CheckCircle2 },
    REJECTED: { label: "Từ chối", color: "bg-red-500", icon: X },
    PROCESSING: { label: "Đang xử lý", color: "bg-purple-500", icon: RefreshCw },
    COMPLETED: { label: "Hoàn thành", color: "bg-green-500", icon: CheckCircle2 },
    CANCELLED: { label: "Đã hủy", color: "bg-slate-500", icon: X },
};

export default function RefundsPage() {
    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    const fetchRefunds = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = filter === "all" 
                ? "/api/user/refunds" 
                : `/api/user/refunds?status=${filter}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setRefunds(data.refunds || []);
            }
        } catch (error) {
            logger.error("Failed to fetch refunds", error as Error, { context: 'profile-refunds-page' });
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=" + window.location.pathname);
        }

        if (sessionStatus === "authenticated") {
            fetchRefunds();
        }
    }, [sessionStatus, router, filter, fetchRefunds]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusConfig = (status: string) => {
        return statusConfig[status] || { label: status, color: "bg-slate-500", icon: Clock };
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
                {/* Header */}
                <div className="mb-12">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Quay lại hồ sơ</span>
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
                        Yêu cầu hoàn tiền
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Theo dõi trạng thái hoàn tiền của bạn
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {[
                        { value: "all", label: "Tất cả" },
                        { value: "PENDING", label: "Đang chờ" },
                        { value: "APPROVED", label: "Đã duyệt" },
                        { value: "PROCESSING", label: "Đang xử lý" },
                        { value: "COMPLETED", label: "Hoàn thành" },
                        { value: "REJECTED", label: "Từ chối" },
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

                {/* Refunds List */}
                {refunds.length === 0 ? (
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 bg-white overflow-hidden">
                        <CardContent className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <RefreshCw className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                                Chưa có yêu cầu hoàn tiền
                            </h3>
                            <p className="text-slate-400 font-medium mb-8">
                                Các yêu cầu hoàn tiền của bạn sẽ xuất hiện tại đây
                            </p>
                            <Link href="/profile/orders">
                                <button className="px-8 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                                    Xem đơn hàng
                                </button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {refunds.map((refund) => {
                            const status = getStatusConfig(refund.status);
                            
                            return (
                                <Card 
                                    key={refund.id} 
                                    className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl transition-all overflow-hidden bg-white"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center`}>
                                                    <status.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        Yêu cầu hoàn tiền #{refund.id.slice(-8).toUpperCase()}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Đơn hàng #{refund.order.id.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${status.color} text-white`}>
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        Số tiền
                                                    </p>
                                                    <p className="font-bold text-primary text-lg">
                                                        ${refund.amount.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        Ngày yêu cầu
                                                    </p>
                                                    <p className="font-medium text-slate-700">
                                                        {formatDate(refund.createdAt)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        Phương thức
                                                    </p>
                                                    <p className="font-medium text-slate-700">
                                                        {refund.refundMethod === "ORIGINAL" ? "Hoàn về thanh toán ban đầu" : "Chuyển khoản ngân hàng"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        Lý do
                                                    </p>
                                                    <p className="font-medium text-slate-700 line-clamp-1">
                                                        {refund.reason}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {refund.adminNote && (
                                            <div className="bg-blue-50 rounded-2xl p-4 mb-4 flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">
                                                        Phản hồi từ admin
                                                    </p>
                                                    <p className="text-sm text-blue-800">
                                                        {refund.adminNote}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <Link href={`/profile/orders/${refund.orderId}`}>
                                            <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                                Xem chi tiết đơn hàng
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
