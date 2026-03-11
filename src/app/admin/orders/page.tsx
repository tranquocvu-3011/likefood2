"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ClipboardList, Download, Eye, Loader2, RefreshCw, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminPageContainer, AdminTableContainer } from "@/components/admin/AdminPageContainer";
import { AdminFilterBar } from "@/components/admin/AdminSearch";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/currency";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  userEmail?: string;
  userName?: string;
  itemCount?: number;
}

const STATUS_FILTERS = ["TẤT CẢ", "CHỜ XỬ LÝ", "ĐÃ XÁC NHẬN", "ĐANG CHUẨN BỊ", "ĐANG GIAO", "ĐÃ GIAO", "HOÀN THÀNH", "ĐÃ HỦY"];
const STATUS_VALUES = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "COMPLETED", "CANCELLED"];
const NEXT_ACTIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
};
const PAGE_SIZE = 15;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("TẤT CẢ");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: PAGE_SIZE.toString() });
      if (status !== 'TẤT CẢ') params.set('status', STATUS_VALUES[STATUS_FILTERS.indexOf(status)] || status);
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Unable to load orders.');
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setTotal(data.pagination?.total || data.total || 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load orders.');
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, debouncedSearch, page, status]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch, dateFrom, dateTo]);

  const updateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Unable to update order status.');
      toast.success(`Đơn hàng đã chuyển sang ${nextStatus}.`);
      await loadOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminPageContainer
      title="Quản lý đơn hàng"
      subtitle="Theo dõi vận hành đơn hàng với bộ lọc nhanh, thao tác tiếp theo và truy cập trực tiếp vào từng đơn."
      action={
        <>
          <a href="/api/admin/export?type=orders" download>
            <Button variant="outline" size="lg"><Download className="h-4 w-4" />Xuất CSV</Button>
          </a>
          <Button variant="outline" size="lg" onClick={() => void loadOrders()} disabled={isLoading}><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />Làm mới</Button>
        </>
      }
    >
      <AdminFilterBar searchQuery={search} setSearchQuery={setSearch} searchPlaceholder="Tìm theo mã đơn hoặc số điện thoại">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="bg-transparent outline-none" />
          <span className="text-slate-300">đến</span>
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="bg-transparent outline-none" />
        </div>
      </AdminFilterBar>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${status === item ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
            {item}
          </button>
        ))}
      </div>

      <AdminTableContainer>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {['Đơn hàng', 'Khách hàng', 'Ngày tạo', 'Tổng tiền', 'Trạng thái', 'Thao tác', 'Chi tiết'].map((header) => <th key={header} className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{header}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? Array.from({ length: 6 }).map((_, index) => <tr key={index} className="animate-pulse"><td colSpan={7} className="px-6 py-5"><div className="h-4 w-2/3 rounded-full bg-slate-100" /></td></tr>) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-20 text-center"><ClipboardList className="mx-auto h-10 w-10 text-slate-200" /><h3 className="mt-4 text-lg font-black text-slate-950">No orders found</h3><p className="mt-2 text-sm text-slate-500">Try another search or status filter.</p></td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-5"><p className="font-black text-slate-950">#{order.id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-slate-400">{order.itemCount || 0} sản phẩm</p></td>
                <td className="px-6 py-5"><p className="font-bold text-slate-900">{order.userName || order.userEmail || 'Khách vãng lai'}</p><p className="mt-1 text-sm text-slate-500">{order.userEmail || 'Không có email'}</p></td>
                <td className="px-6 py-5 text-sm font-medium text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                <td className="px-6 py-5 text-sm font-black text-slate-950">{formatPrice(order.total)}</td>
                <td className="px-6 py-5"><span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700">{order.status}</span></td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {(NEXT_ACTIONS[order.status] || []).map((nextStatus) => (
                      <Button key={nextStatus} size="sm" variant="outline" onClick={() => updateStatus(order.id, nextStatus)} disabled={updatingId === order.id}>
                        {updatingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                        {nextStatus}
                      </Button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5"><Link href={`/admin/orders/${order.id}`}><Button size="sm" variant="outline"><Eye className="h-4 w-4" />Mở</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPagination page={page} setPage={setPage} pageSize={PAGE_SIZE} total={total} itemLabel="đơn hàng" />
      </AdminTableContainer>
    </AdminPageContainer>
  );
}
