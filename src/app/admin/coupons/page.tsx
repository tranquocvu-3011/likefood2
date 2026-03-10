/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Ticket, Plus, Edit2, Trash2, X, Loader2,
    Search, Calendar, Percent, DollarSign, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Coupon {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscount?: number | null;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
}

const EMPTY_FORM = {
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 100,
    isActive: true,
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

    const fetchCoupons = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (filter !== "all") params.set("status", filter);
            const res = await fetch(`/api/admin/coupons?${params}`);
            const data = await res.json();
            setCoupons(Array.isArray(data) ? data : data.coupons || []);
        } catch {
            toast.error("Không thể tải danh sách mã giảm giá");
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingId
                ? `/api/admin/coupons/${editingId}`
                : "/api/admin/coupons";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    discountValue: Number(form.discountValue),
                    minOrderValue: Number(form.minOrderValue),
                    maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
                    usageLimit: Number(form.usageLimit),
                }),
            });

            if (res.ok) {
                toast.success(editingId ? "Cập nhật mã giảm giá thành công" : "Tạo mã giảm giá thành công");
                setShowForm(false);
                setEditingId(null);
                setForm(EMPTY_FORM);
                fetchCoupons();
            } else {
                const data = await res.json();
                toast.error(data.error || "Không thể lưu mã giảm giá");
            }
        } catch {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setForm({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscount: coupon.maxDiscount || 0,
            startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
            endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
            usageLimit: coupon.usageLimit,
            isActive: coupon.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Đã xóa mã giảm giá");
                fetchCoupons();
            } else {
                toast.error("Không thể xóa mã giảm giá");
            }
        } catch {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setDeletingId(null);
        }
    };

    const getCouponStatus = (coupon: Coupon) => {
        const now = new Date();
        const end = new Date(coupon.endDate);
        const start = new Date(coupon.startDate);
        if (!coupon.isActive) return { label: "Tắt", color: "bg-slate-100 text-slate-500" };
        if (now > end) return { label: "Hết hạn", color: "bg-red-50 text-red-600" };
        if (now < start) return { label: "Sắp tới", color: "bg-blue-50 text-blue-600" };
        return { label: "Đang hoạt động", color: "bg-green-50 text-green-600" };
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Mã giảm giá</h1>
                    <p className="text-slate-500 font-medium">Quản lý voucher và khuyến mãi cho shop</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
                    className="px-6 py-3 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Tạo mã mới
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm mã giảm giá..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "active", "expired"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? "bg-primary text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                {f === "all" ? "Tất cả" : f === "active" ? "Đang hoạt động" : "Hết hạn"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                {editingId ? "Sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Code */}
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Mã giảm giá</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: SALE50, FREESHIP..."
                                    required
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold uppercase tracking-wider"
                                />
                            </div>

                            {/* Discount Type + Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Loại giảm</label>
                                    <select
                                        value={form.discountType}
                                        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    >
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED">Số tiền cố định ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Giá trị</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form.discountValue}
                                            onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                                            min={0}
                                            required
                                            className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                                            {form.discountType === "PERCENTAGE" ? "%" : "$"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Min Order + Max Discount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Đơn tối thiểu ($)</label>
                                    <input
                                        type="number"
                                        value={form.minOrderValue}
                                        onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                                        min={0}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Giảm tối đa ($)</label>
                                    <input
                                        type="number"
                                        value={form.maxDiscount || ""}
                                        onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) || 0 })}
                                        min={0}
                                        placeholder="Không giới hạn"
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Usage Limit + Active */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Giới hạn sử dụng</label>
                                    <input
                                        type="number"
                                        value={form.usageLimit}
                                        onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                                        min={1}
                                        required
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded-lg accent-primary"
                                        />
                                        <span className="text-sm font-bold text-slate-700">Kích hoạt ngay</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? "Cập nhật" : "Tạo mã giảm giá"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Mã</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Loại giảm</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Giá trị</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Đơn tối thiểu</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Thời hạn</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Đã dùng</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="p-16 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Ticket className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-black uppercase tracking-tighter mb-1">Chưa có mã giảm giá</h3>
                                            <p className="text-slate-400 text-sm">Tạo mã giảm giá đầu tiên để thu hút khách hàng.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCoupons.map((coupon) => {
                                const status = getCouponStatus(coupon);
                                return (
                                    <tr key={coupon.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Ticket className="w-4 h-4 text-primary" />
                                                <span className="font-black text-primary tracking-wider">{coupon.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">
                                                {coupon.discountType === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-slate-900">
                                                {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-500">${coupon.minOrderValue}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs text-slate-500">
                                                <p>{new Date(coupon.startDate).toLocaleDateString("vi-VN")}</p>
                                                <p>→ {new Date(coupon.endDate).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-700">
                                                {coupon.usedCount} / {coupon.usageLimit}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    disabled={deletingId === coupon.id}
                                                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
                                                    title="Xóa"
                                                >
                                                    {deletingId === coupon.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
