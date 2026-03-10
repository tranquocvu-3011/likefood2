/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface ProductVariant {
  name?: string | null;
  weight?: string | null;
  flavor?: string | null;
}

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
  variant?: ProductVariant | null;
}

interface OrderEvent {
  id: string;
  status: string;
  note?: string | null;
  createdAt: string;
}

interface OrderData {
  id: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingZipCode?: string | null;
  shippingPhone?: string | null;
  shippingMethod?: string | null;
  paymentMethod?: string | null;
  paymentStatus: string;
  trackingCode?: string | null;
  carrier?: string | null;
  createdAt: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  events?: OrderEvent[];
}

const STATUS_META: Record<string, { label: string; desc: string; tone: string; icon: typeof Clock3 }> = {
  PENDING: { label: "Dang cho xac nhan", desc: "Don hang da duoc ghi nhan va dang cho doi ngu xac nhan.", tone: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock3 },
  CONFIRMED: { label: "Da xac nhan", desc: "Don hang da duoc xac nhan va chuyen sang buoc chuan bi.", tone: "bg-sky-100 text-sky-700 border-sky-200", icon: CheckCircle2 },
  PROCESSING: { label: "Dang chuan bi", desc: "San pham dang duoc dong goi va kiem tra truoc khi giao.", tone: "bg-violet-100 text-violet-700 border-violet-200", icon: Package },
  SHIPPING: { label: "Dang giao hang", desc: "Don hang dang tren duong den dia chi nhan cua ban.", tone: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: Truck },
  DELIVERED: { label: "Da giao hang", desc: "Don hang da den noi. Ban co the kiem tra va gui danh gia.", tone: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  COMPLETED: { label: "Hoan thanh", desc: "Don hang da hoan tat. Ban co the mua lai nhanh tu don nay.", tone: "bg-green-100 text-green-700 border-green-200", icon: Check },
  CANCELLED: { label: "Da huy", desc: "Don hang da duoc huy va khong tiep tuc xu ly.", tone: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle },
  REFUNDED: { label: "Da hoan tien", desc: "Yeu cau hoan tien da duoc xu ly cho don hang nay.", tone: "bg-slate-200 text-slate-700 border-slate-300", icon: RefreshCw },
};

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED"];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shippingLabel(value?: string | null) {
  if (value === "express") return "Giao hang nhanh";
  if (value === "overnight") return "Giao hang uu tien";
  return "Giao hang tieu chuan";
}

function paymentLabel(value?: string | null) {
  if (value === "COD") return "Thanh toan khi nhan hang";
  if (value === "BANK_TRANSFER" || value === "BANK") return "Chuyen khoan ngan hang";
  if (value === "PAYPAL") return "PayPal";
  if (value === "STRIPE") return "The thanh toan";
  return value || "Chua cap nhat";
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { status: sessionStatus } = useSession();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [busy, setBusy] = useState<"cancel" | "refund" | "reorder" | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/user/orders/${orderId}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the tai chi tiet don hang.");
      setOrder({ ...data, items: data.items || data.orderItems || [], events: data.events || [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai chi tiet don hang.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/profile/orders/${orderId}`);
      return;
    }
    if (sessionStatus === "authenticated") {
      void fetchOrder();
    }
  }, [fetchOrder, orderId, router, sessionStatus]);

  const meta = order ? STATUS_META[order.status] || STATUS_META.PENDING : STATUS_META.PENDING;
  const StatusIcon = meta.icon;
  const items = order?.items || [];
  const events = useMemo(() => [...(order?.events || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [order?.events]);
  const stepIndex = order ? STEPS.indexOf(order.status) : -1;
  const progressWidth = order?.status === "COMPLETED" ? 100 : Math.max(0, ((stepIndex + 1) / STEPS.length) * 100);
  const canCancel = order ? ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status) : false;
  const canRefund = order ? ["DELIVERED", "COMPLETED"].includes(order.status) && order.paymentStatus === "PAID" : false;
  const canReorder = order ? ["DELIVERED", "COMPLETED"].includes(order.status) : false;

  const handleCopy = async () => {
    if (!order) return;
    await navigator.clipboard.writeText(order.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui long nhap ly do huy don.");
      return;
    }
    setBusy("cancel");
    try {
      const response = await fetch(`/api/user/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the huy don hang.");
      toast.success("Don hang da duoc huy.");
      setCancelOpen(false);
      setCancelReason("");
      await fetchOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the huy don hang.");
    } finally {
      setBusy(null);
    }
  };

  const submitRefund = async () => {
    if (!refundReason.trim()) {
      toast.error("Vui long nhap ly do hoan tien.");
      return;
    }
    setBusy("refund");
    try {
      const response = await fetch("/api/user/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason: refundReason.trim(), refundMethod: "ORIGINAL" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the gui yeu cau hoan tien.");
      toast.success("Yeu cau hoan tien da duoc gui.");
      setRefundOpen(false);
      setRefundReason("");
      await fetchOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the gui yeu cau hoan tien.");
    } finally {
      setBusy(null);
    }
  };

  const reorder = async () => {
    setBusy("reorder");
    try {
      const response = await fetch(`/api/user/orders/${orderId}/reorder`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the mua lai don hang.");
      toast.success(data?.message || "San pham da duoc them vao gio hang.");
      router.push("/cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the mua lai don hang.");
    } finally {
      setBusy(null);
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="page-container-wide">
          <Card className="rounded-[2.5rem] border border-rose-200 bg-white shadow-sm">
            <CardContent className="p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">Khong the mo chi tiet don hang</h1>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{error || "Don hang khong ton tai hoac ban khong co quyen xem don nay."}</p>
              <Button asChild size="xl" className="mt-6">
                <Link href="/profile/orders">Quay lai danh sach don hang</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] pt-24 pb-20">
        <div className="page-container-wide space-y-8">
          <Link href="/profile/orders" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Quay lai don hang
          </Link>

          <section className="overflow-hidden rounded-[2.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
              <div className="space-y-5">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full border ${meta.tone}`}>
                  <StatusIcon className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Don hang cua ban</p>
                  <h1 className="text-4xl font-black uppercase tracking-tight text-slate-950 lg:text-5xl">{meta.label}</h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">{meta.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">#{order.id.slice(-8).toUpperCase()}</span>
                  <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-primary/30 hover:text-primary">
                    <Copy className="h-4 w-4" />
                    {copied ? "Da sao chep" : "Sao chep ma don"}
                  </button>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Dat luc {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: "Tong thanh toan", value: formatPrice(order.total) },
                  { label: "Thanh toan", value: order.paymentStatus === "PAID" ? "Da thanh toan" : "Chua thanh toan" },
                  { label: "Van chuyen", value: shippingLabel(order.shippingMethod) },
                ].map((entry) => (
                  <div key={entry.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{entry.label}</p>
                    <p className="mt-2 text-base font-black text-slate-950">{entry.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Tien trinh xu ly</h2>
              </div>
              <div className="relative mt-8">
                <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-slate-100" />
                <div className="absolute left-0 top-6 h-1 rounded-full bg-primary transition-all duration-500" style={{ width: `${progressWidth}%` }} />
                <div className="relative grid grid-cols-5 gap-3">
                  {STEPS.map((step, index) => {
                    const stepMeta = STATUS_META[step];
                    const StepIcon = stepMeta.icon;
                    const active = index <= stepIndex || order.status === "COMPLETED";
                    return (
                      <div key={step} className="text-center">
                        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${active ? stepMeta.tone : "border-slate-200 bg-slate-100 text-slate-300"}`}>
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <p className={`mt-3 text-[11px] font-black uppercase tracking-[0.18em] ${active ? "text-slate-900" : "text-slate-400"}`}>{stepMeta.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(order.trackingCode || order.carrier) && (
                <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                  {order.trackingCode && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Ma van don</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{order.trackingCode}</p>
                    </div>
                  )}
                  {order.carrier && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Don vi van chuyen</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{order.carrier}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">San pham trong don</h2>
                  </div>
                  <div className="mt-6 space-y-4">
                    {items.map((item) => {
                      const variantLabel = item.variant?.name || [item.variant?.weight, item.variant?.flavor].filter(Boolean).join(" · ");
                      return (
                        <div key={item.id} className="flex gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                          <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                            {item.product.image ? (
                              <Image src={item.product.image} alt={item.product.name} fill sizes="84px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <Package className="h-7 w-7" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/products/${item.product.slug || item.product.id}`} className="block text-lg font-black tracking-tight text-slate-950 transition hover:text-primary">{item.product.name}</Link>
                            {variantLabel && <p className="mt-1 text-sm text-slate-500">{variantLabel}</p>}
                            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                              <span>{item.quantity} x {formatPrice(item.price)}</span>
                              <span className="text-lg font-black text-slate-950">{formatPrice(item.quantity * item.price)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {events.length > 0 && (
                <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-black tracking-tight text-slate-950">Lich su hoat dong</h2>
                    </div>
                    <div className="mt-6 space-y-5">
                      {events.map((event, index) => {
                        const eventMeta = STATUS_META[event.status] || STATUS_META.PENDING;
                        const EventIcon = eventMeta.icon;
                        return (
                          <div key={event.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${eventMeta.tone}`}>
                                <EventIcon className="h-4 w-4" />
                              </div>
                              {index < events.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                            </div>
                            <div className="pb-2">
                              <p className="text-sm font-black text-slate-950">{eventMeta.label}</p>
                              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{formatDate(event.createdAt)}</p>
                              {event.note && <p className="mt-2 text-sm leading-6 text-slate-600">{event.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-8">
              <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Thong tin giao hang</h2>
                  </div>
                  <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Dia chi</p>
                      <p className="mt-2 font-bold text-slate-950">{[order.shippingAddress, order.shippingCity, order.shippingZipCode].filter(Boolean).join(", ") || "Chua cap nhat"}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">So dien thoai</p>
                        <p className="mt-2 font-bold text-slate-950">{order.shippingPhone || "Chua cap nhat"}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Hinh thuc giao</p>
                        <p className="mt-2 font-bold text-slate-950">{shippingLabel(order.shippingMethod)}</p>
                      </div>
                    </div>
                    {(order.trackingCode || order.carrier) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Ma van don</p>
                          <p className="mt-2 font-bold text-slate-950">{order.trackingCode || "Dang cap nhat"}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Don vi giao</p>
                          <p className="mt-2 font-bold text-slate-950">{order.carrier || "Dang cap nhat"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Thanh toan</h2>
                  </div>
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Phuong thuc</p>
                      <p className="mt-2 font-bold text-slate-950">{paymentLabel(order.paymentMethod)}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Trang thai thanh toan</p>
                      <p className="mt-2 font-bold text-slate-950">{order.paymentStatus === "PAID" ? "Da thanh toan" : "Chua thanh toan"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Tong ket don hang</h2>
                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <SummaryRow label="Tam tinh" value={formatPrice(order.subtotal)} />
                    <SummaryRow label="Phi giao hang" value={formatPrice(order.shippingFee)} />
                    <SummaryRow label="Giam gia" value={`-${formatPrice(order.discount)}`} />
                    {order.couponCode && <SummaryRow label="Ma giam gia" value={order.couponCode} />}
                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <SummaryRow label="Tong thanh toan" value={formatPrice(order.total)} strong />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Hanh dong nhanh</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Chi hien nhung thao tac phu hop voi trang thai hien tai cua don hang.</p>
                  <div className="mt-6 grid gap-3">
                    {canReorder && (
                      <Button size="lg" onClick={reorder} disabled={busy === "reorder"} className="justify-between">
                        <span className="inline-flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Mua lai don nay
                        </span>
                        {busy === "reorder" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      </Button>
                    )}
                    {canRefund && (
                      <Button size="lg" variant="outline" onClick={() => setRefundOpen(true)}>
                        <span className="inline-flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Gui yeu cau hoan tien
                        </span>
                      </Button>
                    )}
                    {canCancel && (
                      <Button size="lg" variant="outline" onClick={() => setCancelOpen(true)}>
                        <span className="inline-flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Huy don hang
                        </span>
                      </Button>
                    )}
                    {!canReorder && !canRefund && !canCancel && (
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">Khong co hanh dong bo sung can thuc hien o trang thai hien tai.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ActionModal
        open={cancelOpen}
        title="Huy don hang"
        description="Ly do huy se duoc gui den he thong de doi ngu xu ly nhanh hon. Vui long mo ta ngan gon va ro rang."
        value={cancelReason}
        onChange={setCancelReason}
        onClose={() => setCancelOpen(false)}
        onConfirm={submitCancel}
        confirmLabel={busy === "cancel" ? "Dang xu ly..." : "Xac nhan huy don"}
        disabled={busy === "cancel"}
      />

      <ActionModal
        open={refundOpen}
        title="Gui yeu cau hoan tien"
        description="Hay cho chung toi biet ly do va tinh trang san pham de doi ngu ho tro phan hoi chinh xac hon."
        value={refundReason}
        onChange={setRefundReason}
        onClose={() => setRefundOpen(false)}
        onConfirm={submitRefund}
        confirmLabel={busy === "refund" ? "Dang gui..." : "Gui yeu cau"}
        disabled={busy === "refund"}
      />
    </>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? "text-base font-black text-slate-950" : "font-medium text-slate-500"}>{label}</span>
      <span className={strong ? "text-xl font-black text-slate-950" : "font-black text-slate-950"}>{value}</span>
    </div>
  );
}

function ActionModal({
  open,
  title,
  description,
  value,
  onChange,
  onClose,
  onConfirm,
  confirmLabel,
  disabled,
}: {
  open: boolean;
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  disabled?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)] lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Xac nhan thao tac</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900" aria-label="Dong">
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nhap thong tin bo sung cho doi ngu ho tro..."
          className="mt-6 min-h-[140px] w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-primary"
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>
            Dong
          </Button>
          <Button type="button" size="lg" onClick={onConfirm} disabled={disabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
