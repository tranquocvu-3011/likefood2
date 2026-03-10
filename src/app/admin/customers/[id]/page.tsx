/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";
import { AdminCard, AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface CustomerDetail {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  image: string | null;
  createdAt: string;
  totalSpent: number;
  completedOrders: number;
  avgOrderValue: number;
  addresses: Array<{
    id: string;
    address: string;
    city: string;
    state: string | null;
    zipCode: string;
    country: string;
    fullName: string;
    phone: string;
  }>;
  orders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{
      quantity: number;
      product: { name: string; image: string | null };
    }>;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    product: { name: string; slug: string | null };
  }>;
  wishlists: Array<{
    id: string;
    product: { name: string; image: string | null; price: number };
  }>;
  _count: {
    orders: number;
    reviews: number;
    wishlists: number;
  };
}

type DetailTab = "orders" | "reviews" | "wishlist";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPING: "Shipping",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  SHIPPED: "Shipping",
};

const STATUS_TONES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-sky-100 text-sky-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPING: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  REFUNDED: "bg-slate-200 text-slate-700",
  SHIPPED: "bg-violet-100 text-violet-700",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<DetailTab>("orders");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/customers/${customerId}`);
        if (!response.ok) {
          router.push("/admin/customers");
          return;
        }
        const data = await response.json();
        setCustomer(data);
      } catch {
        router.push("/admin/customers");
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      void load();
    }
  }, [customerId, router]);

  const metrics = useMemo(() => {
    if (!customer) {
      return [
        { label: "Lifetime revenue", value: "$0.00" },
        { label: "Completed orders", value: "0" },
        { label: "Average order", value: "$0.00" },
        { label: "Saved items", value: "0" },
      ];
    }

    return [
      { label: "Lifetime revenue", value: formatPrice(customer.totalSpent) },
      { label: "Completed orders", value: `${customer.completedOrders}` },
      { label: "Average order", value: formatPrice(customer.avgOrderValue) },
      { label: "Saved items", value: `${customer._count.wishlists}` },
    ];
  }, [customer]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <AdminPageContainer
      title={customer.name || customer.email}
      subtitle="Inspect customer value, order behavior, reviews, and wishlist activity from one clear admin profile."
      action={
        <Link href="/admin/customers">
          <Button variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <AdminCard key={metric.label} className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{metric.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminCard>
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              style={customer.image ? { backgroundImage: `url(${customer.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!customer.image ? <UserRound className="h-9 w-9" /> : null}
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{customer.name || "No display name"}</h2>
            <p className="mt-2 text-sm text-slate-500">Primary customer record for retention and support operations.</p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <InfoRow icon={Mail} label="Email" value={customer.email} />
            <InfoRow icon={Phone} label="Phone" value={customer.phone || "No phone on file"} />
            <InfoRow
              icon={Calendar}
              label="Joined"
              value={new Date(customer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Saved addresses</p>
            <div className="mt-4 space-y-3">
              {customer.addresses.length === 0 ? (
                <EmptyBlock message="No saved addresses for this customer yet." />
              ) : (
                customer.addresses.map((address) => (
                  <div key={address.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-black text-slate-950">{address.fullName}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {address.address}, {address.city}
                          {address.state ? `, ${address.state}` : ""} {address.zipCode}, {address.country}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </AdminCard>

        <div className="space-y-8">
          <AdminCard>
            <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
              {[
                { key: "orders", label: `Orders (${customer._count.orders})` },
                { key: "reviews", label: `Reviews (${customer._count.reviews})` },
                { key: "wishlist", label: `Wishlist (${customer._count.wishlists})` },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key as DetailTab)}
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                    tab === item.key ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {tab === "orders" ? (
                customer.orders.length === 0 ? (
                  <EmptyBlock message="No orders for this customer yet." />
                ) : (
                  customer.orders.map((order) => {
                    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const productNames = order.items.map((item) => item.product.name).filter(Boolean);
                    const status = order.status.toUpperCase();
                    return (
                      <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="font-black text-slate-950">Order #{order.id.slice(-8).toUpperCase()}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-500">{productNames.slice(0, 3).join(", ") || "No items recorded"}</p>
                              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                {totalUnits} units · {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex flex-col items-start gap-3 lg:items-end">
                              <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${STATUS_TONES[status] || "bg-slate-200 text-slate-700"}`}>
                                {STATUS_LABELS[status] || status}
                              </span>
                              <span className="text-lg font-black text-slate-950">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )
              ) : null}

              {tab === "reviews" ? (
                customer.reviews.length === 0 ? (
                  <EmptyBlock message="No review activity from this customer yet." />
                ) : (
                  customer.reviews.map((review) => (
                    <div key={review.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="font-black text-slate-950">{review.product.name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{review.comment || "No written comment."}</p>
                        </div>
                        <div className="flex flex-col items-start gap-2 lg:items-end">
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-200"}`} />
                            ))}
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : null}

              {tab === "wishlist" ? (
                customer.wishlists.length === 0 ? (
                  <EmptyBlock message="Wishlist is empty right now." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {customer.wishlists.map((entry) => (
                      <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white text-slate-400">
                            <Heart className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950">{entry.product.name}</p>
                            <p className="mt-2 text-sm font-bold text-slate-500">{formatPrice(entry.product.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : null}
            </div>
          </AdminCard>

          <AdminCard>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Operator snapshot</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <MiniStat icon={ShoppingBag} label="Orders" value={`${customer._count.orders}`} />
              <MiniStat icon={Star} label="Reviews" value={`${customer._count.reviews}`} />
              <MiniStat icon={Heart} label="Wishlist" value={`${customer._count.wishlists}`} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              This screen is designed for support, retention, and account quality checks. Recent order history, review quality, and saved-product intent are now visible together instead of being scattered across separate screens.
            </p>
          </AdminCard>
        </div>
      </div>
    </AdminPageContainer>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 text-center">
      <Icon className="mx-auto h-5 w-5 text-slate-400" />
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
      {message}
    </div>
  );
}
