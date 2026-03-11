"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageSearch, Package, AlertTriangle, RefreshCw, Sparkles, Loader2, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface InventoryProduct {
    id: string;
    name: string;
    category: string;
    inventory: number;
    soldCount: number;
}

interface InventoryForecast {
    productId: string;
    productName: string;
    currentStock: number;
    daysUntilStockout: number;
    recommendedRestock: number;
    confidence: number;
}

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<InventoryProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [onlyLowStock, setOnlyLowStock] = useState(false);
    const [forecasts, setForecasts] = useState<InventoryForecast[]>([]);
    const [isLoadingForecast, setIsLoadingForecast] = useState(false);
    const [showForecast, setShowForecast] = useState(false);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/products?limit=500&sort=name");
            if (!res.ok) {
                toast.error("Không thể tải danh sách kho hàng");
                return;
            }
            const data = await res.json();
            const items: InventoryProduct[] = (data.products || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                inventory: p.inventory ?? 0,
                soldCount: p.soldCount ?? 0,
            }));
            setProducts(items);
        } catch {
            toast.error("Lỗi kết nối tới server");
        } finally {
            setIsLoading(false);
        }
    };

    const loadForecast = async () => {
        setIsLoadingForecast(true);
        try {
            const res = await fetch("/api/ai/admin?type=inventory");
            if (res.ok) {
                const data = await res.json();
                setForecasts(data.forecasts || []);
                setShowForecast(true);
            }
        } catch (error) {
            console.error("Forecast error:", error);
            toast.error("Không thể tải dự báo AI");
        } finally {
            setIsLoadingForecast(false);
        }
    };

    const lowStockThreshold = 10;

    const filtered = products.filter((p) =>
        onlyLowStock ? p.inventory <= lowStockThreshold : true
    );

    const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);
    const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);
    const lowStockCount = products.filter((p) => p.inventory <= lowStockThreshold).length;

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Quản lý kho</h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Xem nhanh số lượng tồn kho, sản phẩm bán chạy và cảnh báo gần hết hàng.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadInventory}
                    disabled={isLoading}
                    className="rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Làm mới dữ liệu
                </Button>
            </div>

            {/* AI Forecast Section */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-[2rem] p-6 border border-violet-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-violet-500 text-white shadow-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight">AI Dự báo tồn kho</h3>
                            <p className="text-xs text-violet-600 font-medium">Dự đoán sản phẩm cần nhập thêm</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={loadForecast}
                        disabled={isLoadingForecast}
                        className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-100"
                    >
                        {isLoadingForecast ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {showForecast ? "Làm mới" : "Xem dự báo"}
                    </Button>
                </div>

                {showForecast && forecasts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {forecasts.slice(0, 6).map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-violet-100 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.productName}</h4>
                                    <span className={`text-xs font-black px-2 py-1 rounded-full ${
                                        item.daysUntilStockout < 7 ? 'bg-red-100 text-red-700' :
                                        item.daysUntilStockout < 14 ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {item.daysUntilStockout} ngày
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <p>Tồn kho: <span className="font-bold text-slate-700">{item.currentStock}</span></p>
                                    <p>Đề xuất nhập: <span className="font-bold text-violet-600">{item.recommendedRestock}</span></p>
                                    <p>Độ tin cậy: <span className="font-bold">{Math.round(item.confidence * 100)}%</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForecast && forecasts.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                        <TrendingDown className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>Không có dữ liệu dự báo</p>
                    </div>
                )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Tổng tồn kho
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-black text-slate-900">{totalInventory}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Tổng đã bán
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-black text-slate-900">{totalSold}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Gần hết hàng (&lt;= {lowStockThreshold})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-black text-amber-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> {lowStockCount}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm">
                <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-slate-500" />
                        <div>
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                                Danh sách sản phẩm trong kho
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                Bật chế độ lọc để xem nhanh các sản phẩm sắp hết hàng.
                            </CardDescription>
                        </div>
                    </div>
                    <button
                        onClick={() => setOnlyLowStock((v) => !v)}
                        className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${onlyLowStock
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-white text-slate-500 border-slate-200"
                            }`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Chỉ xem gần hết hàng
                    </button>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
                            <PackageSearch className="w-4 h-4 animate-pulse" />
                            Đang tải dữ liệu kho...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                            <PackageSearch className="w-6 h-6" />
                            Không có sản phẩm nào trong bộ lọc hiện tại.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                        <th className="px-4 py-2 text-left font-black">Sản phẩm</th>
                                        <th className="px-4 py-2 text-left font-black">Danh mục</th>
                                        <th className="px-4 py-2 text-right font-black">Tồn kho</th>
                                        <th className="px-4 py-2 text-right font-black">Đã bán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr
                                            key={p.id}
                                            className={`border-t border-slate-100 ${p.inventory <= lowStockThreshold ? "bg-amber-50/40" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <td className="px-4 py-2">
                                                <span className="font-semibold text-slate-900 line-clamp-1">
                                                    {p.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-xs text-slate-500">{p.category}</span>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <span className={`font-bold ${p.inventory <= lowStockThreshold ? "text-amber-700" : "text-slate-800"
                                                    }`}>
                                                    {p.inventory}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <span className="font-medium text-slate-600">{p.soldCount}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

