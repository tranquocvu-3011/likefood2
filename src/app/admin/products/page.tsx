"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, Loader2, Package, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AdminCard,
  AdminPageContainer,
  AdminTableContainer,
} from "@/components/admin/AdminPageContainer";
import { AdminFilterBar } from "@/components/admin/AdminSearch";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/currency";
import { ADMIN_CATEGORY_OPTIONS, getAdminCategoryLabel } from "@/lib/admin-catalog";

interface Product {
  id: string;
  slug?: string | null;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  weight?: string | null;
  inventory: number;
  soldCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  image?: string | null;
  featured?: boolean;
}

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "name", label: "Tên A-Z" },
  { value: "price-asc", label: "Giá thấp-cao" },
  { value: "price-desc", label: "Giá cao-thấp" },
  { value: "best-selling", label: "Bán chạy" },
  { value: "top-rated", label: "Đánh giá cao" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
        sort,
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("category", category);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load products.");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [category, debouncedSearch, page, sort]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => product.inventory > 0 && product.inventory < 10).length;
    const outOfStock = products.filter((product) => product.inventory <= 0).length;
    const featured = products.filter((product) => product.featured).length;
    const topRated = products.filter((product) => (product.ratingAvg || 0) >= 4.5).length;
    return { lowStock, outOfStock, featured, topRated };
  }, [products]);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Đã xóa sản phẩm này?")) {
      return;
    }

    setDeleteId(productId);
    try {
      const response = await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete product.");
      }

      toast.success("Product removed.");
      await fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminPageContainer
      title="Quản lý sản phẩm"
      subtitle="Quản lý danh mục, giá cả, tồn kho và sản phẩm từ một bảng vận hành thân thiện."
      action={
        <>
          <Button variant="outline" size="lg" onClick={() => void fetchProducts()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Link href="/admin/products/new">
            <Button size="lg">
              <Plus className="h-4 w-4" />
              Tạo sản phẩm
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="p-5">
          <Stat label="Tổng sản phẩm" value={`${total}`} tone="text-slate-950" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Sắp hết hàng" value={`${stats.lowStock}`} tone="text-amber-600" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Hết hàng" value={`${stats.outOfStock}`} tone="text-rose-600" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Nổi bật" value={`${stats.featured}`} tone="text-emerald-600" />
        </AdminCard>
      </div>

      <AdminFilterBar
        searchQuery={search}
        setSearchQuery={setSearch}
        searchPlaceholder="Tìm theo tên, slug sản phẩm"
      >
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 outline-none"
        >
          <option value="">Tất cả danh mục</option>
          {ADMIN_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminFilterBar>

      <AdminTableContainer>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {["Sản phẩm", "Danh mục", "Giá", "Khối lượng", "Tồn kho", "Đánh giá", "Thao tác"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-5">
                    <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <Package className="mx-auto h-10 w-10 text-slate-200" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">Không tìm thấy sản phẩm</h3>
                  <p className="mt-2 text-sm text-slate-500">Điều chỉnh bộ lọc hoặc tạo sản phẩm mới.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const deleting = deleteId === product.id;
                const healthTone =
                  product.inventory <= 0
                    ? "bg-rose-100 text-rose-600"
                    : product.inventory < 10
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600";
                const healthLabel = product.inventory <= 0 ? "Hết" : product.inventory < 10 ? "Thấp" : "Đủ";

                return (
                  <tr key={product.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-950">{product.name}</p>
                          <p className="mt-1 text-xs font-medium text-slate-400">/{product.slug || product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
                        {getAdminCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-black text-slate-950">{formatPrice(product.price)}</p>
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <p className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{product.weight || "-"}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <span className="text-slate-950">{product.inventory}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${healthTone}`}>
                          {healthLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {product.ratingAvg ? `${product.ratingAvg.toFixed(1)} (${product.ratingCount || 0})` : "Chưa có đánh giá"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/products/${product.slug || product.id}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                            Xem
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleDelete(product.id)}
                          disabled={deleting}
                        >
                          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <AdminPagination page={page} setPage={setPage} pageSize={PAGE_SIZE} total={total} itemLabel="sản phẩm" />
      </AdminTableContainer>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="p-5">
          <Stat label="Top-rated products in view" value={`${stats.topRated}`} tone="text-sky-600" />
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use ratings to spot which product pages are ready for stronger promotion or featured placement.
          </p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Operator note</p>
          <p className="mt-2 text-xl font-black text-slate-950">One place to add, fix, and retire products</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Creation, editing, pricing, variant updates, and removal now flow through the same admin structure so the catalog team can move faster with less guesswork.
          </p>
        </AdminCard>
      </div>
    </AdminPageContainer>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
