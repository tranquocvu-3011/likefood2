/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { logger } from "@/lib/logger";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        image?: string | null;
    };
}

interface Order {
    id: string;
    status: string;
    total: number;
    subtotal?: number;
    shippingFee?: number;
    discount?: number;
    shippingAddress?: string | null;
    shippingCity?: string | null;
    shippingZipCode?: string | null;
    shippingPhone?: string | null;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    createdAt: string;
    items: OrderItem[];
}

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/user/orders/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                router.push("/profile/orders");
            }
        } catch (error) {
            logger.error("Failed to fetch order", error as Error, { context: 'order-invoice-page' });
            router.push("/profile/orders");
        } finally {
            setIsLoading(false);
        }
    }, [params.id, router]);

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }
        if (sessionStatus === "authenticated" && params.id) {
            fetchOrder();
        }
    }, [sessionStatus, params.id, router, fetchOrder]);

    const handlePrint = () => {
        window.print();
    };

    if (sessionStatus === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="page-container-wide">
                {/* Print Header - Hidden on screen, visible when printing */}
                <div className="hidden print:block mb-8 text-center">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">LIKEFOOD</h1>
                    <p className="text-slate-600">Hóa đơn bán hàng</p>
                </div>

                {/* Screen Header */}
                <div className="print:hidden mb-8 flex items-center justify-between">
                    <Link
                        href={`/orders/${params.id}`}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold">Quay lại đơn hàng</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            In / Tải PDF
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:rounded-none">
                    {/* Header */}
                    <div className="mb-8 pb-8 border-b-2 border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-primary">
                                    LIKEFOOD
                                </h1>
                                <p className="text-slate-600 font-medium">Tinh hoa đặc sản Việt Nam</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                    Hóa đơn số
                                </p>
                                <p className="text-2xl font-black text-slate-900">
                                    #{order.id.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-sm text-slate-500 mt-2">
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                                Thông tin khách hàng
                            </h3>
                            <p className="font-bold text-slate-900">{session?.user?.name || "Khách hàng"}</p>
                            <p className="text-slate-600 text-sm mt-1">{session?.user?.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                                Địa chỉ giao hàng
                            </h3>
                            {order.shippingAddress && (
                                <p className="text-slate-900 font-medium">
                                    {order.shippingAddress}
                                    {order.shippingCity && `, ${order.shippingCity}`}
                                    {order.shippingZipCode && ` ${order.shippingZipCode}`}
                                </p>
                            )}
                            {order.shippingPhone && (
                                <p className="text-slate-600 text-sm mt-1">{order.shippingPhone}</p>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                        Sản phẩm
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                        Số lượng
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                        Đơn giá
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-slate-900">{item.product.name}</p>
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-600 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 px-4 text-right text-slate-600 font-medium">
                                            {formatPrice(item.price)}
                                        </td>
                                        <td className="py-4 px-4 text-right font-black text-slate-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-8 pt-8 border-t-2 border-slate-200">
                        <div className="max-w-md ml-auto space-y-3">
                            <div className="flex justify-between text-slate-600">
                                <span className="font-bold">Tạm tính:</span>
                                <span className="font-black">{formatPrice(order.subtotal ?? order.total)}</span>
                            </div>
                            {order.shippingFee && order.shippingFee > 0 && (
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-bold">Vận chuyển:</span>
                                    <span className="font-black">{formatPrice(order.shippingFee)}</span>
                                </div>
                            )}
                            {(order.discount ?? 0) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="font-bold">Giảm giá:</span>
                                    <span className="font-black">-{formatPrice(order.discount || 0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-2xl font-black pt-3 border-t-2 border-slate-200">
                                <span>Tổng cộng:</span>
                                <span className="text-primary">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                        <p>Cảm ơn bạn đã mua sắm tại LIKEFOOD!</p>
                        <p className="mt-2">Hóa đơn này được tạo tự động và có giá trị pháp lý.</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
}
