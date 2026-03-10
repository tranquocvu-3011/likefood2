/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Heart, Loader2, Mail, Package, Phone, RefreshCw, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminFilterBar } from "@/components/admin/AdminSearch";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/currency";

interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  totalSpent: number;
  orderCount: number;
  _count: {
    reviews: number;
    wishlists: number;
  };
}

interface CustomerSegment {
  segment: string;
  count: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ page: page.toString(), limit: '12' });
        if (debouncedSearch) params.set('search', debouncedSearch);
        const response = await fetch(`/api/admin/customers?${params.toString()}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || 'Unable to load customers.');
        setCustomers(Array.isArray(data.customers) ? data.customers : []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load customers.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadSegments = async () => {
    setIsLoadingSegments(true);
    try {
      const response = await fetch('/api/ai/admin?type=customers');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Unable to generate customer segments.');
      setSegments(Array.isArray(data.segments) ? data.segments : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate customer segments.');
    } finally {
      setIsLoadingSegments(false);
    }
  };

  const stats = useMemo(() => {
    const revenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const orders = customers.reduce((sum, customer) => sum + customer.orderCount, 0);
    return { revenue, orders };
  }, [customers]);

  return (
    <AdminPageContainer
      title="Customer relationships"
      subtitle="Track customer value, intent signals, and AI-generated segments in one operator view."
      action={
        <>
          <a href="/api/admin/export?type=customers" download>
            <Button variant="outline" size="lg">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </a>
          <Button size="lg" onClick={() => void loadSegments()} disabled={isLoadingSegments}>
            {isLoadingSegments ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI segments
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="p-5"><Stat label="Visible customers" value={`${total}`} tone="text-slate-950" /></AdminCard>
        <AdminCard className="p-5"><Stat label="Visible revenue" value={formatPrice(stats.revenue)} tone="text-emerald-600" /></AdminCard>
        <AdminCard className="p-5"><Stat label="Visible orders" value={`${stats.orders}`} tone="text-sky-600" /></AdminCard>
        <AdminCard className="p-5"><Stat label="AI segments" value={`${segments.length}`} tone="text-violet-600" /></AdminCard>
      </div>

      {segments.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {segments.map((segment) => (
            <AdminCard key={segment.segment} className="p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{segment.segment}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{segment.count}</p>
              <p className="mt-2 text-sm text-slate-500">Revenue {formatPrice(segment.totalRevenue)} · AOV {formatPrice(segment.avgOrderValue)}</p>
            </AdminCard>
          ))}
        </div>
      ) : null}

      <AdminFilterBar searchQuery={search} setSearchQuery={setSearch} searchPlaceholder="Search by customer name or email">
        <Button variant="outline" size="sm" onClick={() => setSearch('')}>
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </AdminFilterBar>

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : customers.length === 0 ? (
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
          <CardContent className="py-20 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-200" />
            <h3 className="mt-4 text-lg font-black text-slate-950">No customers matched</h3>
            <p className="mt-2 text-sm text-slate-500">Try another query or clear the search box.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
              <Card key={customer.id} className="rounded-[2rem] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-700">
                      {(customer.name || customer.email).slice(0, 1).toUpperCase()}
                    </div>
                    <Link href={`/admin/customers/${customer.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-900">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-950">{customer.name || 'No display name'}</h3>
                    <p className="mt-1 text-sm text-slate-500">Joined {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{customer.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{customer.phone || 'No phone on file'}</div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                    <MiniStat icon={Package} label="Orders" value={`${customer.orderCount}`} />
                    <MiniStat icon={Heart} label="Wishlists" value={`${customer._count.wishlists}`} />
                    <MiniStat icon={Sparkles} label="Reviews" value={`${customer._count.reviews}`} />
                  </div>

                  <div className="mt-5 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Lifetime value</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{formatPrice(customer.totalSpent)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <AdminPagination page={page} setPage={setPage} pageSize={12} total={totalPages * 12 >= total ? total : total} itemLabel="customers" />
        </>
      )}
    </AdminPageContainer>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p><p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p></div>;
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return <div className="text-center"><Icon className="mx-auto h-4 w-4 text-slate-400" /><p className="mt-2 text-sm font-black text-slate-950">{value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p></div>;
}
