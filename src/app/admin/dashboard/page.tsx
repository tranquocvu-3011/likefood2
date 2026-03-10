/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes, ClipboardList, Loader2, Package, RefreshCw, Sparkles, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/currency";

interface DashboardData {
  revenue: { total: number; change: number };
  orders: { total: number; pending: number; processing?: number; shipping: number; delivered?: number; completed: number; cancelled?: number; change: number };
  customers: { total: number; change: number };
  products: { total: number; lowStock: number };
  recentOrders: Array<{ id: string; userEmail: string; total: number; status: string; createdAt?: string }>;
  lowStockProducts: Array<{ id: string; name: string; inventory: number; slug?: string | null }>;
  topProducts: Array<{ id: string; name: string; image?: string | null; soldCount: number; revenue: number }>;
  revenueChart: Array<{ label: string; value: number }>;
  aiInsights: Array<{ title: string; description: string; type: string; metric?: string }>;
}

const RANGES = [
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "quarter", label: "90 days" },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [range, setRange] = useState("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        if (range === "week") startDate.setDate(startDate.getDate() - 7);
        else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
        else startDate.setMonth(startDate.getMonth() - 3);

        const [analyticsRes, ordersRes, productsRes, aiRes] = await Promise.all([
          fetch(`/api/analytics/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
          fetch(`/api/orders?page=1&limit=5`),
          fetch(`/api/products?limit=8&sort=best-selling`),
          fetch(`/api/ai/admin?type=analytics`),
        ]);

        const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
        const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
        const aiData = aiRes.ok ? await aiRes.json() : { insights: [] };

        const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
        const products = Array.isArray(productsData?.products) ? productsData.products : [];

        setData({
          revenue: analytics?.revenue || { total: 0, change: 0 },
          orders: analytics?.orders || { total: 0, pending: 0, shipping: 0, completed: 0, change: 0 },
          customers: analytics?.customers || { total: 0, change: 0 },
          products: analytics?.products || { total: 0, lowStock: 0 },
          recentOrders: orders,
          lowStockProducts: products.filter((product: { inventory: number }) => product.inventory < 10).slice(0, 5),
          topProducts: products.slice(0, 5).map((product: { id: string; name: string; image?: string | null; soldCount?: number; price: number }) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            soldCount: product.soldCount || 0,
            revenue: (product.soldCount || 0) * product.price,
          })),
          revenueChart: analytics?.revenueByDay?.slice(-7).map((item: { date: string; revenue: number }) => ({
            label: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
            value: item.revenue,
          })) || [],
          aiInsights: Array.isArray(aiData?.insights) ? aiData.insights : [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [range]);

  const maxChartValue = useMemo(() => Math.max(...(data?.revenueChart.map((item) => item.value) || [0]), 1), [data]);

  if (isLoading || !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
        <div className="bg-[linear-gradient(135deg,#0f172a_0%,#164e63_45%,#16a34a_100%)] px-6 py-8 text-white lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Admin dashboard</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-5xl">Operate the store with fewer clicks</h1>
              <p className="mt-3 text-base leading-7 text-white/75">
                Welcome back, {session?.user?.name || 'Admin'}. This workspace surfaces revenue, risk, fulfillment, and AI prompts in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur">
              {RANGES.map((option) => (
                <button key={option.value} type="button" onClick={() => setRange(option.value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${range === option.value ? 'bg-white text-slate-950' : 'text-white/75 hover:text-white'}`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Revenue" value={formatPrice(data.revenue.total)} meta={`${data.revenue.change.toFixed(1)}%`} tone="emerald" />
        <MetricCard label="Orders" value={`${data.orders.total}`} meta={`${data.orders.pending} pending`} tone="sky" />
        <MetricCard label="Customers" value={`${data.customers.total}`} meta={`${data.customers.change.toFixed(1)}%`} tone="violet" />
        <MetricCard label="Low stock" value={`${data.products.lowStock}`} meta={`${data.products.total} products`} tone="amber" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Revenue trend</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Last seven data points</h2>
                </div>
                <Link href="/admin/analytics"><Button variant="outline" size="sm">Open analytics<ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              {data.revenueChart.length === 0 ? <EmptyState message="No revenue data available yet." /> : (
                <div className="mt-8 flex h-64 items-end gap-3">
                  {data.revenueChart.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                      <div className="text-[11px] font-bold text-slate-400">{formatPrice(item.value)}</div>
                      <div className="flex h-48 w-full items-end rounded-3xl bg-slate-100 p-2">
                        <div className="w-full rounded-[1rem] bg-[linear-gradient(180deg,#34d399_0%,#0f766e_100%)]" style={{ height: `${Math.max((item.value / maxChartValue) * 100, 6)}%` }} />
                      </div>
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Recent fulfillment</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Latest orders</h2>
                </div>
                <Link href="/admin/orders"><Button variant="outline" size="sm">Open orders<ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="mt-6 space-y-3">
                {data.recentOrders.length === 0 ? <EmptyState message="No orders available yet." /> : data.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-black text-slate-950">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.userEmail || 'Guest checkout'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{order.status}</span>
                      <span className="text-sm font-black text-slate-950">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">AI signals</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Suggested actions</h2>
                </div>
                <Link href="/admin/ai"><Button variant="outline" size="sm"><Sparkles className="h-4 w-4" />Open AI lab</Button></Link>
              </div>
              <div className="mt-6 space-y-3">
                {data.aiInsights.length === 0 ? <EmptyState message="AI has no recommendations yet." /> : data.aiInsights.slice(0, 4).map((insight) => (
                  <div key={insight.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950">{insight.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{insight.description}</p>
                      </div>
                      <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${insight.type === 'warning' ? 'bg-amber-100 text-amber-700' : insight.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{insight.metric || insight.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Stock risk</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Low inventory watchlist</h2>
                </div>
                <Link href="/admin/products"><Button variant="outline" size="sm">Review products<ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="mt-6 space-y-3">
                {data.lowStockProducts.length === 0 ? <EmptyState message="No low-stock products in the current slice." /> : data.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.inventory} units left</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, meta, tone }: { label: string; value: string; meta: string; tone: 'emerald' | 'sky' | 'violet' | 'amber' }) {
  const styles = {
    emerald: 'bg-emerald-100 text-emerald-700',
    sky: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
  } satisfies Record<string, string>;
  const icons = {
    emerald: TrendingUp,
    sky: ClipboardList,
    violet: Users,
    amber: Boxes,
  } satisfies Record<string, typeof TrendingUp>;
  const Icon = icons[tone];

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{meta}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${styles[tone]}`}><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">{message}</div>;
}
