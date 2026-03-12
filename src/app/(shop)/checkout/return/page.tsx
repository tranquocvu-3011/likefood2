"use client";

/**
 * LIKEFOOD - Stripe Embedded Checkout Return Page
 * After paying on embedded form, user lands here to see payment result
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowRight } from "lucide-react";

interface SessionStatus {
    status: string;
    customer_email: string | null;
    payment_status: string;
    orderId: string | null;
}

export default function CheckoutReturnPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("orderId");

    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/checkout/session-status?session_id=${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSessionStatus(data);
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [sessionId]);

    // Still checking status of open sessions — redirect back to checkout
    useEffect(() => {
        if (sessionStatus?.status === "open") {
            window.location.href = "/checkout";
        }
    }, [sessionStatus]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Đang xác nhận thanh toán...</p>
                </div>
            </div>
        );
    }

    if (!sessionId || !sessionStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center max-w-md px-6">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy phiên thanh toán</h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Phiên thanh toán không hợp lệ hoặc đã hết hạn.
                    </p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
                        <ShoppingBag className="w-4 h-4" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    // Payment successful
    if (sessionStatus.status === "complete") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
                <div className="text-center max-w-lg px-6 py-16">
                    {/* Success animation circle */}
                    <div className="relative mx-auto mb-8">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-emerald-200/30 rounded-full animate-ping" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
                        Thanh toán thành công! 🎉
                    </h1>

                    <p className="text-sm text-slate-500 mb-2 leading-relaxed">
                        Cảm ơn bạn đã đặt hàng tại <strong className="text-slate-700">LIKEFOOD</strong>.
                    </p>

                    {sessionStatus.customer_email && (
                        <p className="text-sm text-slate-500 mb-6">
                            Email xác nhận sẽ được gửi đến{" "}
                            <strong className="text-slate-700">{sessionStatus.customer_email}</strong>
                        </p>
                    )}

                    {(orderId || sessionStatus.orderId) && (
                        <div className="inline-block bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 mb-8">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Mã đơn hàng</span>
                            <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                                {orderId || sessionStatus.orderId}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {(orderId || sessionStatus.orderId) && (
                            <Link
                                href={`/profile/orders/${orderId || sessionStatus.orderId}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                            >
                                Xem đơn hàng
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Payment failed or other status
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center max-w-md px-6">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-slate-900 mb-2">Thanh toán chưa hoàn tất</h1>
                <p className="text-sm text-slate-500 mb-6">
                    Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
                </p>
                <Link href="/checkout" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
                    Thử lại
                </Link>
            </div>
        </div>
    );
}
