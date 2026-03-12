"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Loader2, Package, Search, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AdminPageContainer, AdminTableContainer } from "@/components/admin/AdminPageContainer";
import { AdminFilterBar } from "@/components/admin/AdminSearch";
import { useDebounce } from "@/hooks/useDebounce";

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    isActive: boolean;
    _count: {
        products: number;
    };
}

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({ name: "", logo: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 300);

    const fetchBrands = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.set("search", debouncedSearch);

            const res = await fetch(`/api/admin/brands?${params.toString()}`);
            const data = await res.json();
            setBrands(data.brands || []);
            setTotal(data.brands?.length || 0);
        } catch (err) {
            toast.error("Không tải được danh sách thương hiệu");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingBrand ? "/api/admin/brands" : "/api/admin/brands";
            const method = editingBrand ? "PATCH" : "POST";

            const body: any = { name: formData.name };
            if (formData.logo) body.logo = formData.logo;
            if (editingBrand) body.id = editingBrand.id;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Không thể lưu thương hiệu");
            }

            toast.success(editingBrand ? "Cập nhật thương hiệu thành công" : "Tạo thương hiệu thành công");
            setShowModal(false);
            setEditingBrand(null);
            setFormData({ name: "", logo: "" });
            fetchBrands();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Lỗi khi lưu thương hiệu");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name, logo: brand.logo || "" });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Không thể xóa thương hiệu");
            }

            toast.success(data.deactivated ? "Đã vô hiệu hóa thương hiệu" : "Xóa thương hiệu thành công");
            fetchBrands();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Lỗi khi xóa thương hiệu");
        } finally {
            setIsSubmitting(false);
            setDeleteId(null);
        }
    };

    const openNewBrandModal = () => {
        setEditingBrand(null);
        setFormData({ name: "", logo: "" });
        setShowModal(true);
    };

    return (
        <AdminPageContainer
            title="Quản lý thương hiệu"
            subtitle={`${total} thương hiệu đang kinh doanh.`}
            action={
                <Button 
                    onClick={openNewBrandModal}
                    className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/30 gap-2"
                >
                    <Plus className="w-5 h-5" /> Thêm thương hiệu
                </Button>
            }
        >
            <AdminFilterBar
                searchQuery={search}
                setSearchQuery={setSearch}
                searchPlaceholder="Tìm tên thương hiệu..."
            />

            <AdminTableContainer>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Thương hiệu</th>
                            <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Slug</th>
                            <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                            <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                            <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-8 py-10"><div className="h-4 bg-slate-100 rounded-full w-3/4" /></td>
                                </tr>
                            ))
                        ) : brands.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-20">
                                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 font-bold">Không tìm thấy thương hiệu nào</p>
                                </td>
                            </tr>
                        ) : brands.map((brand) => (
                            <tr key={brand.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0">
                                            {brand.logo ? (
                                                <Image
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                    unoptimized
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full flex items-center justify-center text-slate-400 font-black ${brand.logo ? 'hidden' : ''}`}>
                                                {brand.name[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">{brand.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm text-slate-500 font-mono">{brand.slug}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-bold text-slate-700">{brand._count.products}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${
                                        brand.isActive 
                                            ? "bg-green-50 text-green-600" 
                                            : "bg-slate-100 text-slate-500"
                                    }`}>
                                        {brand.isActive ? (
                                            <><Check className="w-3 h-3" /> Hoạt động</>
                                        ) : (
                                            <><X className="w-3 h-3" /> Không hoạt động</>
                                        )}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => handleEdit(brand)}
                                            className="p-2 rounded-xl hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-primary"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteId(brand.id)}
                                            className="p-2 rounded-xl hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-red-500"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AdminTableContainer>

            {/* Brand Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-black uppercase mb-6">
                            {editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                    Tên thương hiệu
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Nhập tên thương hiệu"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                    Logo URL (tùy chọn)
                                </label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingBrand(null); }}
                                    className="flex-1 h-12 rounded-full border-2 border-slate-200 font-bold"
                                    variant="outline"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 rounded-full bg-primary font-black uppercase"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : editingBrand ? (
                                        "Cập nhật"
                                    ) : (
                                        "Tạo mới"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black uppercase mb-2">Xóa thương hiệu?</h3>
                        <p className="text-slate-500 mb-6">Thương hiệu này sẽ bị xóa vĩnh viễn.</p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 h-12 rounded-full border-2 border-slate-200 font-bold"
                                variant="outline"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={() => handleDelete(deleteId)}
                                disabled={isSubmitting}
                                className="flex-1 h-12 rounded-full bg-red-500 font-black uppercase"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Xóa"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageContainer>
    );
}
