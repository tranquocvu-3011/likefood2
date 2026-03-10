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
import { Clock, Truck, CheckCircle2, X, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { logger } from "@/lib/logger";

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        product: {
            id: string;
            slug?: string | null;
            name: string;
            image?: string | null;
        };
    }[];
}

export default function OrdersPage() {
    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = filter === "all"
                ? "/api/user/orders"
                : `/api/user/orders?status=${filter}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            logger.error("Failed to fetch orders", error as Error, { context: 'profile-orders-page' });
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=" + window.location.pathname);
        }

        if (sessionStatus === "authenticated") {
            fetchOrders();
        }
    }, [sessionStatus, filter, router, fetchOrders]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Clock className="w-4 h-4" />;
            case "SHIPPING":
                return <Truck className="w-4 h-4" />;
            case "COMPLETED":
                return <CheckCircle2 className="w-4 h-4" />;
            case "CANCELLED":
                return <X className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-50 text-orange-600 border-orange-100";
            case "SHIPPING":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "COMPLETED":
                return "bg-green-50 text-green-600 border-green-100";
            case "CANCELLED":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Đang chờ";
            case "SHIPPING":
                return "Đang giao";
            case "COMPLETED":
                return "Hoàn thành";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status;
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
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
                        Đơn hàng của tôi
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Xem lịch sử mua hàng và theo dõi đơn hàng của bạn
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {[
                        { value: "all", label: "Tất cả" },
                        { value: "PENDING", label: "Đang chờ" },
                        { value: "SHIPPING", label: "Đang giao" },
                        { value: "COMPLETED", label: "Hoàn thành" },
                        { value: "CANCELLED", label: "Đã hủy" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${filter === option.value
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 bg-white overflow-hidden">
                        <CardContent className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                                Chưa có đơn hàng nào
                            </h3>
                            <p className="text-slate-400 font-medium mb-8">
                                Đơn hàng của bạn sẽ xuất hiện tại đây
                            </p>
                            <Link href="/products">
                                <button className="px-8 py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                                    Mua sắm ngay
                                </button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.id} className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl transition-all overflow-hidden bg-white mb-6">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        Mã đơn hàng
                                                    </p>
                                                    <p className="text-lg font-black text-slate-900">
                                                        #{order.id.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusText(order.status)}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                                <span>
                                                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span>{order.items.length} sản phẩm</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 relative"
                                                    >
                                                        {item.product.image ? (
                                                            <Image
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="56px"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400">
                                                                {item.product.name[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100 shadow-inner">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-4">
                                            <div className="text-right">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                    Tổng tiền
                                                </p>
                                                <p className="text-2xl font-black text-primary">
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                            <Link href={`/orders/${order.id}`}>
                                                <button className="px-6 py-3 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    Xem chi tiết
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
