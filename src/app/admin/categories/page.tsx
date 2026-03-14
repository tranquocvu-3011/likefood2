"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderTree, Plus, Pencil, Trash2, Loader2, Package, Search, X, Save } from "lucide-react";
import { toast } from "sonner";

interface CategoryInfo {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    isVisible: boolean;
    productCount: number;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch {
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleRename = async (cat: CategoryInfo) => {
        if (!editName.trim() || editName.trim() === cat.name) {
            setEditingId(null);
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: cat.id, name: editName.trim() }),
            });
            if (res.ok) {
                toast.success(`Đã đổi tên "${cat.name}" → "${editName.trim()}"`);
                setEditingId(null);
                fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.error || "Không thể đổi tên danh mục");
            }
        } catch {
            toast.error("Lỗi kết nối");
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async () => {
        if (!newCategory.trim()) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory.trim() }),
            });
            if (res.ok) {
                toast.success(`Đã tạo danh mục "${newCategory.trim()}"`);
                setNewCategory("");
                setShowAdd(false);
                fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.error || "Không thể tạo danh mục");
            }
        } catch {
            toast.error("Lỗi kết nối");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cat: CategoryInfo) => {
        if (cat.productCount > 0) {
            const ok = confirm(`Danh mục "${cat.name}" có ${cat.productCount} sản phẩm. Xóa sẽ gỡ liên kết danh mục khỏi các sản phẩm này. Tiếp tục?`);
            if (!ok) return;
        }
        setDeletingId(cat.id);
        try {
            const res = await fetch(`/api/admin/categories?id=${cat.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success(`Đã xóa danh mục "${cat.name}"`);
                fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.error || "Không thể xóa danh mục");
            }
        } catch {
            toast.error("Lỗi kết nối");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-xs font-black uppercase tracking-widest">Đang tải danh mục...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit uppercase">
                        Quản lý danh mục
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        {categories.length} danh mục · {totalProducts} sản phẩm
                    </p>
                </div>
                <Button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Thêm danh mục
                </Button>
            </div>

            {/* Add Category */}
            {showAdd && (
                <Card className="rounded-2xl border-emerald-200 bg-emerald-50/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex gap-3 items-center">
                            <input
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Tên danh mục mới..."
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                autoFocus
                            />
                            <Button
                                onClick={handleAdd}
                                disabled={saving || !newCategory.trim()}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => { setShowAdd(false); setNewCategory(""); }}
                                className="rounded-xl"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm danh mục..."
                />
            </div>

            {/* Categories List */}
            <div className="space-y-3">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                        <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">
                            {search ? "Không tìm thấy danh mục" : "Chưa có danh mục nào"}
                        </p>
                        {!search && (
                            <p className="text-slate-400 text-sm mt-2">
                                Nhấn &quot;Thêm danh mục&quot; để tạo danh mục mới
                            </p>
                        )}
                    </div>
                ) : (
                    filteredCategories.map((cat) => (
                        <Card key={cat.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <FolderTree className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleRename(cat);
                                                    if (e.key === "Escape") setEditingId(null);
                                                }}
                                                autoFocus
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleRename(cat)}
                                                disabled={saving}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setEditingId(null)}
                                                className="rounded-xl"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="min-w-0">
                                            <h3 className="font-black text-slate-900 truncate">{cat.name || "Chưa phân loại"}</h3>
                                            <p className="text-xs text-slate-400 font-medium">slug: {cat.slug}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-bold text-slate-600">{cat.productCount}</span>
                                        <span className="text-xs text-slate-400">SP</span>
                                    </div>

                                    {editingId !== cat.id && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(cat.id);
                                                    setEditName(cat.name || "");
                                                }}
                                                className="text-slate-400 hover:text-emerald-600 rounded-xl"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(cat)}
                                                disabled={deletingId === cat.id}
                                                className="text-slate-400 hover:text-red-500 rounded-xl"
                                            >
                                                {deletingId === cat.id
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Info */}
            <Card className="rounded-2xl border-slate-100 bg-slate-50/50">
                <CardContent className="p-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <strong>Lưu ý:</strong> Danh mục tạo tại đây sẽ hiển thị ngay trong Sidebar lọc trang Shop và Mega Menu điều hướng. Khi xóa danh mục, sản phẩm thuộc danh mục đó sẽ không còn liên kết danh mục (vẫn tồn tại sản phẩm).
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}