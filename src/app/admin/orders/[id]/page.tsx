/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Loader2,
  Package,
  Save,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variant?: { name?: string | null; weight?: string | null; flavor?: string | null; sku?: string | null } | null;
  product: {
    id: string;
    slug?: string | null;
    name: string;
    image?: string | null;
    price: number;
  };
}

interface OrderEvent {
  id: string;
  status: string;
  note?: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal?: number | null;
  shippingFee?: number;
  discount?: number;
  couponCode?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingZipCode?: string | null;
  shippingPhone?: string | null;
  shippingMethod?: string | null;
  trackingCode?: string | null;
  carrier?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  user?: {
    id: string;
    email: string;
    name: string | null;
    phone?: string | null;
  };
  events?: OrderEvent[];
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Dang cho xac nhan", desc: "Moi tao", icon: Clock3, tone: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "CONFIRMED", label: "Da xac nhan", desc: "Da nhan don", icon: CheckCircle2, tone: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "PROCESSING", label: "Dang chuan bi", desc: "Dong goi", icon: Package, tone: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "SHIPPING", label: "Dang giao", desc: "Fulfillment", icon: Truck, tone: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { value: "DELIVERED", label: "Da giao", desc: "Da den noi", icon: Check, tone: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "COMPLETED", label: "Hoan thanh", desc: "Dong don", icon: CheckCircle2, tone: "bg-green-100 text-green-700 border-green-200" },
  { value: "CANCELLED", label: "Da huy", desc: "Dung xu ly", icon: XCircle, tone: "bg-rose-100 text-rose-700 border-rose-200" },
];

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
  if (value === "express") return "Express";
  if (value === "overnight") return "Priority";
  return "Standard";
}

function paymentLabel(value?: string | null) {
  if (value === "COD") return "Cash on delivery";
  if (value === "BANK_TRANSFER" || value === "BANK") return "Bank transfer";
  if (value === "PAYPAL") return "PayPal";
  if (value === "STRIPE") return "Card payment";
  return value || "Not set";
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [carrier, setCarrier] = useState("");

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the tai don hang.");
      setOrder({ ...data, items: data.items || data.orderItems || [], events: data.events || [] });
      setStatus(data.status || "PENDING");
      setNotes(data.notes || "");
      setTrackingCode(data.trackingCode || "");
      setCarrier(data.carrier || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai don hang.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      void fetchOrder();
    }
  }, [orderId]);

  const selectedStatus = useMemo(() => STATUS_OPTIONS.find((item) => item.value === status) || STATUS_OPTIONS[0], [status]);
  const items = order?.items || [];
  const events = useMemo(() => [...(order?.events || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [order?.events]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes, trackingCode, carrier }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Khong the cap nhat don hang.");
      toast.success("Da cap nhat don hang.");
      await fetchOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the cap nhat don hang.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Card className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white shadow-sm">
          <CardContent className="p-10 text-center">
            <XCircle className="mx-auto h-12 w-12 text-rose-500" />
            <h1 className="mt-4 text-2xl font-black text-slate-950">Khong the mo don hang</h1>
            <p className="mt-2 text-sm text-slate-500">{error || "Du lieu khong ton tai hoac ban khong co quyen truy cap."}</p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/admin/orders">Quay lai danh sach don</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Quay lai orders
        </Link>

        <section className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full border ${selectedStatus.tone}`}>
                <selectedStatus.icon className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Order detail</p>
                <h1 className="text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">#{order.id.slice(-8).toUpperCase()}</h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">{selectedStatus.label} · {selectedStatus.desc}. Theo doi khach hang, fulfillment va payment trong cung mot man hinh.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Created {formatDate(order.createdAt)}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Updated {formatDate(order.updatedAt)}</span>
                <span className={`rounded-full border px-4 py-2 ${selectedStatus.tone}`}>{selectedStatus.label}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Order total", value: formatPrice(order.total) },
                { label: "Payment", value: order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus || "Pending" },
                { label: "Shipping", value: shippingLabel(order.shippingMethod) },
              ].map((entry) => (
                <div key={entry.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{entry.label}</p>
                  <p className="mt-2 text-base font-black text-slate-950">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Customer and shipping</h2>
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Customer</p>
                    <p className="mt-2 text-lg font-black text-slate-950">{order.user?.name || "Guest checkout"}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.user?.email || "No email"}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.user?.phone || order.shippingPhone || "No phone"}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Shipping address</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-950">{[order.shippingAddress, order.shippingCity, order.shippingZipCode].filter(Boolean).join(", ") || "Address not set"}</p>
                    <p className="mt-2 text-sm text-slate-600">Method: {shippingLabel(order.shippingMethod)}</p>
                    {(order.trackingCode || order.carrier) && <p className="mt-1 text-sm text-slate-600">Tracking: {order.carrier || "Carrier pending"} · {order.trackingCode || "Code pending"}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Items in this order</h2>
                </div>
                <div className="mt-6 space-y-4">
                  {items.map((item) => {
                    const variantLabel = item.variant?.name || [item.variant?.weight, item.variant?.flavor, item.variant?.sku].filter(Boolean).join(" · ");
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
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Status timeline</h2>
                  </div>
                  <div className="mt-6 space-y-5">
                    {events.map((event, index) => {
                      const meta = STATUS_OPTIONS.find((item) => item.value === event.status) || STATUS_OPTIONS[0];
                      const EventIcon = meta.icon;
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${meta.tone}`}>
                              <EventIcon className="h-4 w-4" />
                            </div>
                            {index < events.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                          </div>
                          <div className="pb-2">
                            <p className="text-sm font-black text-slate-950">{meta.label}</p>
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

          <div className="space-y-8 xl:sticky xl:top-8 xl:self-start">
            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Fulfillment control</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Cap nhat trang thai</h2>
                  </div>
                  <div className={`rounded-full border px-4 py-2 text-sm font-black ${selectedStatus.tone}`}>{selectedStatus.label}</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {STATUS_OPTIONS.map((option) => {
                    const OptionIcon = option.icon;
                    const active = option.value === status;
                    return (
                      <button key={option.value} type="button" onClick={() => setStatus(option.value)} className={`rounded-[1.35rem] border p-4 text-left transition ${active ? option.tone : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-white/70" : "bg-white"}`}>
                            <OptionIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-black">{option.label}</p>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">{option.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Tracking code</label>
                    <input value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="UPS123456789" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Carrier</label>
                    <input value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="UPS, FedEx, USPS..." className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Internal note</label>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Them ghi chu cho doi van hanh, giao nhan hoac ho tro khach hang..." className="mt-2 min-h-[150px] w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-primary" />
                  </div>
                </div>

                <Button size="xl" className="mt-6 w-full justify-between" onClick={handleSave} disabled={isSaving}>
                  <span className="inline-flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Luu cap nhat
                  </span>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Payment and totals</h2>
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <SummaryRow label="Subtotal" value={formatPrice(order.subtotal || 0)} />
                  <SummaryRow label="Shipping fee" value={formatPrice(order.shippingFee || 0)} />
                  <SummaryRow label="Discount" value={`-${formatPrice(order.discount || 0)}`} />
                  {order.couponCode && <SummaryRow label="Coupon" value={order.couponCode} />}
                  <SummaryRow label="Payment method" value={paymentLabel(order.paymentMethod)} />
                  <SummaryRow label="Payment status" value={order.paymentStatus || "Pending"} />
                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <SummaryRow label="Order total" value={formatPrice(order.total)} strong />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Operational snapshot</h2>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Contact</p>
                    <p className="mt-2 text-sm font-bold text-slate-950">{order.user?.email || "Guest"}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.user?.phone || order.shippingPhone || "No phone"}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Tracking readiness</p>
                    <p className="mt-2 text-sm font-bold text-slate-950">{trackingCode ? "Tracking code da san sang" : "Can them tracking code khi giao hang"}</p>
                    <p className="mt-1 text-sm text-slate-600">{carrier ? `Carrier: ${carrier}` : "Carrier chua duoc gan"}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Delivery checkpoint</p>
                    <p className="mt-2 text-sm font-bold text-slate-950">{order.deliveredAt ? `Delivered ${formatDate(order.deliveredAt)}` : "Chua ghi nhan moc giao thanh cong"}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.shippedAt ? `Shipped ${formatDate(order.shippedAt)}` : "Chua ghi nhan moc giao van chuyen"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
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



