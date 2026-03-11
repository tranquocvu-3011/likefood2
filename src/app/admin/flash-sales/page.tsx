"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Zap, CalendarRange, Clock, Loader2, Trash2, PackageSearch } from "lucide-react";
import { toast } from "sonner";

interface FlashSaleCampaign {
    id: string;
    name: string;
    startAt: string;
    endAt: string;
    isActive: boolean;
    products: FlashSaleProduct[];
}

interface FlashSaleProduct {
    id: string;
    productId: string;
    flashSalePrice: number;
    stockLimit: number | null;
    soldCount: number;
    product: {
        id: string;
        name: string;
        slug: string | null;
        image: string | null;
        price: number;
        category: string;
        ratingAvg: number;
        soldCount: number;
    };
}

interface ProductOption {
    id: string;
    name: string;
    price: number;
    category: string;
}

export default function AdminFlashSalesPage() {
    const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newStartAt, setNewStartAt] = useState("");
    const [newEndAt, setNewEndAt] = useState("");
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [availableProducts, setAvailableProducts] = useState<ProductOption[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [flashPrice, setFlashPrice] = useState("");
    const [stockLimit, setStockLimit] = useState("");
    const [isDeletingCampaignId, setIsDeletingCampaignId] = useState<string | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/flash-sales");
            if (!res.ok) {
                toast.error("Không thể tải danh sách Flash Sale");
                return;
            }
            const data = await res.json();
            setCampaigns(data);
        } catch {
            toast.error("Lỗi kết nối tới server");
        } finally {
            setIsLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            setIsLoadingProducts(true);
            const res = await fetch("/api/products?limit=100");
            if (!res.ok) return;
            const data = await res.json();
            const items: ProductOption[] = (data.products || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
            }));
            setAvailableProducts(items);
        } catch {
            // silent
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!newName || !newStartAt || !newEndAt) {
            toast.error("Vui lòng nhập đủ tên, thời gian bắt đầu và kết thúc");
            return;
        }

        try {
            setIsCreating(true);
            const res = await fetch("/api/flash-sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    startAt: newStartAt,
                    endAt: newEndAt,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                toast.error(err?.error || "Không thể tạo campaign mới");
                return;
            }

            toast.success("Đã tạo Flash Sale mới");
            setNewName("");
            setNewStartAt("");
            setNewEndAt("");
            await loadCampaigns();
        } catch {
            toast.error("Lỗi kết nối khi tạo campaign");
        } finally {
            setIsCreating(false);
        }
    };

    const handleAddProductToCampaign = async () => {
        if (!selectedCampaignId || !selectedProductId || !flashPrice) {
            toast.error("Chọn campaign, sản phẩm và giá flash sale");
            return;
        }

        const price = parseFloat(flashPrice);
        if (Number.isNaN(price) || price <= 0) {
            toast.error("Giá flash sale không hợp lệ");
            return;
        }

        try {
            const res = await fetch(`/api/flash-sales/${selectedCampaignId}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: selectedProductId,
                    flashSalePrice: price,
                    stockLimit: stockLimit ? parseInt(stockLimit, 10) : undefined,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                toast.error(err?.error || "Không thể thêm sản phẩm vào Flash Sale");
                return;
            }

            toast.success("Đã thêm sản phẩm vào Flash Sale");
            setFlashPrice("");
            setStockLimit("");
            setSelectedProductId("");
            await loadCampaigns();
        } catch {
            toast.error("Lỗi kết nối khi thêm sản phẩm");
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        if (!confirm("Xóa toàn bộ chiến dịch này? Thao tác không thể hoàn tác.")) return;
        setIsDeletingCampaignId(campaignId);
        try {
            const res = await fetch(`/api/flash-sales/${campaignId}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                toast.error(err?.error || "Không thể xóa chiến dịch");
                return;
            }
            toast.success("Đã xóa chiến dịch Flash Sale");
            if (selectedCampaignId === campaignId) setSelectedCampaignId(null);
            await loadCampaigns();
        } catch {
            toast.error("Lỗi kết nối khi xóa chiến dịch");
        } finally {
            setIsDeletingCampaignId(null);
        }
    };

    const handleRemoveProduct = async (campaignId: string, productId: string) => {
        try {
            const res = await fetch(`/api/flash-sales/${campaignId}/products?productId=${productId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                toast.error(err?.error || "Không thể xoá sản phẩm khỏi Flash Sale");
                return;
            }
            toast.success("Đã xoá sản phẩm khỏi Flash Sale");
            await loadCampaigns();
        } catch {
            toast.error("Lỗi kết nối khi xoá sản phẩm");
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Flash Sale</h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Quản lý các chiến dịch Flash Sale, thời gian diễn ra và sản phẩm tham gia khuyến mãi.
                    </p>
                </div>
            </div>

            {/* Create campaign */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm">
                <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                                Tạo chiến dịch Flash Sale mới
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                Nhập tên và khoảng thời gian diễn ra chương trình.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Tên chiến dịch
                            </label>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Flash Sale cuối tuần"
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Bắt đầu
                            </label>
                            <input
                                type="datetime-local"
                                value={newStartAt}
                                onChange={(e) => setNewStartAt(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Kết thúc
                            </label>
                            <input
                                type="datetime-local"
                                value={newEndAt}
                                onChange={(e) => setNewEndAt(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCreateCampaign}
                            disabled={isCreating}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Tạo campaign
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Campaigns list */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm">
                <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CalendarRange className="w-5 h-5 text-slate-500" />
                        <div>
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                                Danh sách chiến dịch
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                Bấm vào 1 campaign để quản lý sản phẩm tham gia.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang tải danh sách Flash Sale...
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                            <PackageSearch className="w-6 h-6" />
                            Chưa có campaign Flash Sale nào.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {campaigns.map((c) => {
                                const start = new Date(c.startAt);
                                const end = new Date(c.endAt);
                                const now = new Date();
                                const isRunning = c.isActive && start <= now && end >= now;

                                return (
                                    <div
                                        key={c.id}
                                        className={`w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${selectedCampaignId === c.id ? "bg-slate-50" : ""
                                            }`}
                                    >
                                        <button
                                            className="flex-1 text-left"
                                            onClick={() => {
                                                setSelectedCampaignId(c.id);
                                                if (availableProducts.length === 0) {
                                                    loadProducts();
                                                }
                                            }}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                                                    {isRunning && (
                                                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-red-500 text-white">
                                                            Đang chạy
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {start.toLocaleString("vi-VN")} - {end.toLocaleString("vi-VN")}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{c.products?.length || 0} sản phẩm</span>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(c.id); }}
                                            disabled={isDeletingCampaignId === c.id}
                                            className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-40 transition-colors"
                                            title="Xóa chiến dịch"
                                        >
                                            {isDeletingCampaignId === c.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Campaign products manager */}
            <AnimatePresence>
                {selectedCampaignId && (
                    <motion.div
                        key={selectedCampaignId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
                            <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                                        Sản phẩm trong Flash Sale
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500">
                                        Thêm sản phẩm vào chiến dịch đang chọn, đặt giá flash sale và giới hạn số lượng.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Chọn sản phẩm
                                        </label>
                                        <select
                                            value={selectedProductId}
                                            onChange={(e) => setSelectedProductId(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                                        >
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {availableProducts.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - ${p.price.toFixed(2)}
                                                </option>
                                            ))}
                                        </select>
                                        {isLoadingProducts && (
                                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Đang tải danh sách sản phẩm...
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Giá Flash Sale (USD)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={flashPrice}
                                            onChange={(e) => setFlashPrice(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Giới hạn số lượng (tuỳ chọn)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={stockLimit}
                                            onChange={(e) => setStockLimit(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none"
                                            placeholder="VD: 50"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAddProductToCampaign}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm sản phẩm
                                    </Button>
                                </div>

                                {/* Products table */}
                                <div className="mt-4 border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                                <th className="px-4 py-2 text-left font-black">Sản phẩm</th>
                                                <th className="px-4 py-2 text-left font-black">Giá gốc</th>
                                                <th className="px-4 py-2 text-left font-black">Giá Flash</th>
                                                <th className="px-4 py-2 text-left font-black">Đã bán</th>
                                                <th className="px-4 py-2 text-left font-black">Giới hạn</th>
                                                <th className="px-4 py-2 text-right font-black"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaigns
                                                .find((c) => c.id === selectedCampaignId)
                                                ?.products?.map((fp) => (
                                                    <tr key={fp.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                                                        <td className="px-4 py-2">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-slate-900 line-clamp-1">
                                                                    {fp.product.name}
                                                                </span>
                                                                <span className="text-[11px] text-slate-400">
                                                                    {fp.product.category}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className="text-slate-500 font-medium">
                                                                ${fp.product.price.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className="text-red-500 font-bold">
                                                                ${fp.flashSalePrice.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className="text-slate-600 font-medium">{fp.soldCount}</span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className="text-slate-600 font-medium">
                                                                {fp.stockLimit ?? "Không giới hạn"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            <button
                                                                onClick={() => handleRemoveProduct(selectedCampaignId, fp.productId)}
                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {campaigns.find((c) => c.id === selectedCampaignId)?.products?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="px-4 py-6 text-center text-xs text-slate-400"
                                                    >
                                                        Chưa có sản phẩm nào trong chiến dịch này.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

