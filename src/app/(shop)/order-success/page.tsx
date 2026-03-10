/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Mail, Package, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/currency";
import { logger } from "@/lib/logger";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        slug?: string | null;
        name: string;
        image?: string | null;
    };
}

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    shippingAddress?: string | null;
    shippingCity?: string | null;
    shippingZipCode?: string | null;
    shippingPhone?: string | null;
    shippingMethod?: string | null;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    items: OrderItem[];
}

function getShippingMethodLabel(method?: string | null) {
    switch (method) {
        case "standard":
            return "Giao hàng tiêu chuẩn";
        case "express":
            return "Giao hàng nhanh";
        case "overnight":
            return "Giao hàng ưu tiên";
        default:
            return "Phương thức tiêu chuẩn";
    }
}

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        if (!orderId) {
            router.push("/");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/orders/${orderId}`);
            if (!response.ok) {
                router.push("/");
                return;
            }

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            logger.error("Failed to fetch order", error as Error, { context: "order-success-page" });
            router.push("/");
        } finally {
            setIsLoading(false);
        }
    }, [orderId, router]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const orderDate = useMemo(() => {
        if (!order?.createdAt) {
            return "";
        }

        return new Date(order.createdAt).toLocaleString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [order?.createdAt]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24">
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f4_100%)] pt-24 pb-20">
            <div className="page-container-wide space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-[2.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
                >
                    <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.9fr] lg:px-10 lg:py-10">
                        <div className="space-y-5">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_20px_50px_rgba(34,197,94,0.3)]">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Đơn hàng đã được ghi nhận</p>
                                <h1 className="text-4xl font-black uppercase tracking-tight text-slate-950 lg:text-5xl">
                                    Cảm ơn bạn, đơn hàng đã được tạo thành công
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">
                                    LIKEFOOD đã lưu lại đơn #{order.id.slice(-8).toUpperCase()}. Từ đây bạn có thể tiếp tục mua sắm hoặc mở chi tiết đơn để theo dõi trạng thái xử lý.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="xl" className="shadow-[0_16px_40px_rgba(34,197,94,0.2)]">
                                    <Link href="/products">Tiếp tục mua sắm</Link>
                                </Button>
                                <Button asChild variant="outline" size="xl" className="border-slate-200 bg-white text-slate-950 hover:bg-slate-50">
                                    <Link href={`/orders/${order.id}`}>Xem chi tiết đơn hàng</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                { label: "Mã đơn", value: `#${order.id.slice(-8).toUpperCase()}` },
                                { label: "Ngày đặt", value: orderDate },
                                { label: "Tổng thanh toán", value: formatPrice(order.total) },
                            ].map((item) => (
                                <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                                    <p className="mt-2 text-base font-black text-slate-950">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
                        <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Sản phẩm trong đơn</h2>
                                </div>
                                <div className="mt-6 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                                            <div className="relative h-18 w-18 h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        fill
                                                        sizes="72px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                        <ShoppingBag className="h-7 w-7" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Link href={`/products/${item.product.slug || item.product.id}`} className="block text-lg font-black tracking-tight text-slate-950 transition hover:text-primary">
                                                    {item.product.name}
                                                </Link>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-right text-lg font-black text-slate-950">
                                                {formatPrice(item.quantity * item.price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    <div className="space-y-6">
                        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                                <CardContent className="space-y-5 p-6 lg:p-8">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-primary" />
                                        <h2 className="text-xl font-black tracking-tight text-slate-950">Thông tin giao hàng</h2>
                                    </div>
                                    <div className="space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Địa chỉ</p>
                                            <p className="mt-1 font-medium text-slate-900">
                                                {order.shippingAddress || "Địa chỉ sẽ được cập nhật trong chi tiết đơn hàng"}
                                                {order.shippingCity ? `, ${order.shippingCity}` : ""}
                                                {order.shippingZipCode ? ` ${order.shippingZipCode}` : ""}
                                            </p>
                                        </div>
                                        {order.shippingPhone && (
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Điện thoại nhận hàng</p>
                                                <p className="mt-1 font-medium text-slate-900">{order.shippingPhone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Phương thức giao</p>
                                            <p className="mt-1 font-medium text-slate-900">{getShippingMethodLabel(order.shippingMethod)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>

                        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                            <Card className="rounded-[2.25rem] border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] text-white shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
                                <CardContent className="space-y-4 p-6 lg:p-8">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-emerald-200" />
                                        <h2 className="text-xl font-black tracking-tight">Bước tiếp theo</h2>
                                    </div>
                                    <p className="text-sm leading-7 text-white/80">
                                        LIKEFOOD sẽ cố gắng gửi email xác nhận sớm nhất có thể. Trong lúc chờ, bạn luôn có thể mở chi tiết đơn hàng để xem trạng thái mới nhất ngay trên website.
                                    </p>
                                    <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-sm text-white/85">
                                        <p>1. Kiểm tra lại địa chỉ và thông tin nhận hàng trong trang đơn.</p>
                                        <p>2. Theo dõi tiến trình xử lý khi đơn được xác nhận và chuyển sang vận chuyển.</p>
                                        <p>3. Dùng nút mua lại sau này nếu bạn muốn đặt nhanh lần kế tiếp.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
}
