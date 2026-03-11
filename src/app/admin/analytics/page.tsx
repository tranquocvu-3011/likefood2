"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Loader2, Package, Target, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/currency";

interface AnalyticsData {
  revenue: { total: number; change: number };
  orders: { total: number; pending: number; processing?: number; shipping: number; delivered?: number; completed: number; cancelled?: number; change: number };
  customers: { total: number; change: number };
  products: { total: number; lowStock: number };
  revenueByDay: { date: string; revenue: number }[];
  topProducts: Array<{ id: string; name: string; image?: string | null; quantitySold: number }>;
}

const RANGES = [7, 30, 90, 365];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const response = await fetch(`/api/analytics/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        const nextData = await response.json().catch(() => ({}));
        if (response.ok) {
          setData(nextData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [days]);

  const maxRevenue = useMemo(() => Math.max(...(data?.revenueByDay.map((entry) => entry.revenue) || [0]), 1), [data]);
  const averageOrderValue = data && data.orders.total > 0 ? data.revenue.total / data.orders.total : 0;
  const conversionProxy = data && data.customers.total > 0 ? (data.orders.total / data.customers.total) * 100 : 0;

  if (isLoading || !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const statusRows = [
    { label: 'Chờ xử lý', value: data.orders.pending, tone: 'bg-amber-500' },
    { label: 'Đang giao', value: data.orders.shipping, tone: 'bg-sky-500' },
    { label: 'Hoàn thành', value: data.orders.completed, tone: 'bg-emerald-500' },
    { label: 'Đã hủy', value: data.orders.cancelled || 0, tone: 'bg-rose-500' },
  ];
  const maxStatus = Math.max(...statusRows.map((row) => row.value), 1);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
        <div className="bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_50%,#f0fdf4_100%)] px-6 py-8 lg:px-8 lg:py-9">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Phân tích</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Báo cáo hiệu suất</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">Theo dõi doanh thu, cơ cấu đơn hàng, hiệu quả khách hàng và sản phẩm bán chạy mà không cần rời khỏi trang quản trị.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              {RANGES.map((range) => (
                <button key={range} type="button" onClick={() => setDays(range)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${days === range ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                  {range} ngày
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Metric label="Doanh thu" value={formatPrice(data.revenue.total)} change={data.revenue.change} icon={TrendingUp} />
        <Metric label="Đơn hàng" value={`${data.orders.total}`} change={data.orders.change} icon={BarChart3} />
        <Metric label="Khách hàng" value={`${data.customers.total}`} change={data.customers.change} icon={Users} />
        <Metric label="Giá trị TB" value={formatPrice(averageOrderValue)} icon={Target} />
        <Metric label="Đơn/khách" value={`${conversionProxy.toFixed(1)}%`} icon={Package} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Doanh thu theo ngày</h2>
            <div className="mt-8 flex h-72 items-end gap-3">
              {data.revenueByDay.slice(-10).map((entry) => (
                <div key={entry.date} className="flex flex-1 flex-col items-center gap-3">
                  <div className="text-[11px] font-bold text-slate-400">{formatPrice(entry.revenue)}</div>
                  <div className="flex h-52 w-full items-end rounded-3xl bg-slate-100 p-2">
                    <div className="w-full rounded-[1rem] bg-[linear-gradient(180deg,#60a5fa_0%,#1d4ed8_100%)]" style={{ height: `${Math.max((entry.revenue / maxRevenue) * 100, 6)}%` }} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Phân bố trạng thái đơn</h2>
              <div className="mt-6 space-y-4">
                {statusRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-slate-900">{row.label}</span>
                      <span className="text-sm font-medium text-slate-500">{row.value}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full ${row.tone}`} style={{ width: `${(row.value / maxStatus) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Sản phẩm bán chạy</h2>
              <div className="mt-6 space-y-3">
                {data.topProducts.length === 0 ? <p className="text-sm text-slate-500">Chưa có dữ liệu bán hàng.</p> : data.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-black text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">Đã bán {product.quantitySold} đơn vị</p>
                    </div>
                    <Package className="h-5 w-5 text-slate-400" />
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

function Metric({ label, value, change, icon: Icon }: { label: string; value: string; change?: number; icon: typeof TrendingUp }) {
  const positive = typeof change === 'number' ? change >= 0 : true;
  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            {typeof change === 'number' ? <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{Math.abs(change).toFixed(1)}%</div> : null}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}
