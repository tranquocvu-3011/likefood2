"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

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
  { value: "week", label: "7 ngày" },
  { value: "month", label: "30 ngày" },
  { value: "quarter", label: "90 ngày" },
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
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-800 px-4 py-5 text-white lg:px-6 lg:py-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Bảng quản trị</p>
              <h1 className="mt-1.5 text-xl font-bold tracking-tight lg:text-2xl">Quản lý cửa hàng nhanh chóng</h1>
              <p className="mt-1.5 text-xs text-white/70">
                Chào mừng trở lại, {session?.user?.name || 'Admin'}. Không gian này tổng hợp doanh thu, rủi ro, vận hành và gợi ý AI tại một nơi.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5 backdrop-blur">
              {RANGES.map((option) => (
                <button key={option.value} type="button" onClick={() => setRange(option.value)} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${range === option.value ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'}`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-4">
        <MetricCard label="Doanh thu" value={formatPrice(data.revenue.total)} meta={`${data.revenue.change.toFixed(1)}%`} tone="emerald" />
        <MetricCard label="Đơn hàng" value={`${data.orders.total}`} meta={`${data.orders.pending} đang chờ`} tone="sky" />
        <MetricCard label="Khách hàng" value={`${data.customers.total}`} meta={`${data.customers.change.toFixed(1)}% thay đổi`} tone="violet" />
        <MetricCard label="Sắp hết hàng" value={`${data.products.lowStock}`} meta={`${data.products.total} sản phẩm`} tone="amber" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Card className="rounded-xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Xu hướng doanh thu</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">7 điểm dữ liệu gần nhất</h2>
                </div>
                <Link href="/admin/analytics"><Button variant="outline" size="sm" className="h-7 text-xs">Xem phân tích<ArrowRight className="h-3 w-3" /></Button></Link>
              </div>
              {data.revenueChart.length === 0 ? <EmptyState message="Chưa có dữ liệu doanh thu." /> : (
                <div className="mt-5 flex h-44 items-end gap-2">
                  {data.revenueChart.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="text-[9px] font-medium text-slate-400">{formatPrice(item.value)}</div>
                      <div className="flex h-32 w-full items-end rounded-lg bg-slate-100 p-1.5">
                        <div className="w-full rounded-md bg-gradient-to-t from-teal-600 to-emerald-400" style={{ height: `${Math.max((item.value / maxChartValue) * 100, 6)}%` }} />
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Vận hành gần đây</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Đơn hàng mới nhất</h2>
                </div>
                <Link href="/admin/orders"><Button variant="outline" size="sm" className="h-7 text-xs">Xem đơn hàng<ArrowRight className="h-3 w-3" /></Button></Link>
              </div>
              <div className="mt-4 space-y-2">
                {data.recentOrders.length === 0 ? <EmptyState message="Chưa có đơn hàng nào." /> : data.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{order.userEmail || 'Khách vãng lai'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{order.status}</span>
                      <span className="text-xs font-bold text-slate-800">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Tín hiệu AI</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Gợi ý hành động</h2>
                </div>
                <Link href="/admin/ai"><Button variant="outline" size="sm" className="h-7 text-xs"><Sparkles className="h-3 w-3" />Mở phòng AI</Button></Link>
              </div>
              <div className="mt-4 space-y-2">
                {data.aiInsights.length === 0 ? <EmptyState message="AI chưa có gợi ý nào." /> : data.aiInsights.slice(0, 4).map((insight) => (
                  <div key={insight.title} className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{insight.description}</p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${insight.type === 'warning' ? 'bg-amber-100 text-amber-700' : insight.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{insight.metric || insight.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Rủi ro tồn kho</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Danh sách sắp hết hàng</h2>
                </div>
                <Link href="/admin/products"><Button variant="outline" size="sm" className="h-7 text-xs">Xem sản phẩm<ArrowRight className="h-3 w-3" /></Button></Link>
              </div>
              <div className="mt-4 space-y-2">
                {data.lowStockProducts.length === 0 ? <EmptyState message="Không có sản phẩm sắp hết hàng." /> : data.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Còn {product.inventory} đơn vị</p>
                    </div>
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
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
    emerald: 'bg-emerald-100 text-emerald-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600',
  } satisfies Record<string, string>;
  const icons = {
    emerald: TrendingUp,
    sky: ClipboardList,
    violet: Users,
    amber: Boxes,
  } satisfies Record<string, typeof TrendingUp>;
  const Icon = icons[tone];

  return (
    <Card className="rounded-xl border-slate-200/80 bg-white shadow-sm">
      <CardContent className="p-3 lg:p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{meta}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[tone]}`}><Icon className="h-4 w-4" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-500">{message}</div>;
}
