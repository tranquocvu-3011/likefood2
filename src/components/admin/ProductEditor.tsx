"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChefHat,
  Loader2,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/ImageUpload";
import { formatPrice } from "@/lib/currency";
import { ADMIN_CATEGORY_OPTIONS, getAdminCategoryLabel } from "@/lib/admin-catalog";

interface AiInsights {
  benefits: string[];
  origin: string;
  howToUse: string;
  seoTitle: string;
  seoDescription: string;
}

interface VariantRecord {
  id: string;
  weight: string | null;
  flavor: string | null;
  priceAdjustment: number;
  stock: number;
  sku: string | null;
  isActive: boolean;
}

interface ProductSubmitPayload {
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  salePrice: number | null;
  category: string;
  weight: string | null;
  inventory: number;
  image: string | null;
  images: string[];
  featured: boolean;
  badgeText: string | null;
  tags: string | null;
  isOnSale: boolean;
}

interface ProductEditorProps {
  mode: "create" | "edit";
  productId?: string;
  initialValues: {
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    salePrice: string;
    category: string;
    weight: string;
    inventory: string;
    image: string;
    images: string[];
    featured: boolean;
    badgeText: string;
    tags: string;
    isOnSale: boolean;
  };
  initialVariants?: VariantRecord[];
  onSubmit: (payload: ProductSubmitPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const EMPTY_VARIANT = {
  weight: "",
  flavor: "",
  priceAdjustment: "0",
  stock: "0",
  sku: "",
  isActive: true,
};

export default function ProductEditor({
  mode,
  productId,
  initialValues,
  initialVariants = [],
  onSubmit,
  onDelete,
}: ProductEditorProps) {
  const [formData, setFormData] = useState(initialValues);
  const [variants, setVariants] = useState<VariantRecord[]>(initialVariants);
  const [variantDraft, setVariantDraft] = useState(EMPTY_VARIANT);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState(EMPTY_VARIANT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiBrief, setAiBrief] = useState("");
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [variantBusyId, setVariantBusyId] = useState<string | null>(null);

  const currentCategory = useMemo(
    () => ADMIN_CATEGORY_OPTIONS.find((option) => option.value === formData.category),
    [formData.category]
  );
  const basePrice = Number.parseFloat(formData.price) || 0;
  const tagCount = formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean).length;

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): ProductSubmitPayload | null => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      toast.error("Tên, mô tả và danh mục là bắt buộc.");
      return null;
    }

    const parsedPrice = Number.parseFloat(formData.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Vui lòng nhập giá cơ bản hợp lệ.");
      return null;
    }

    const parsedInventory = Number.parseInt(formData.inventory, 10);
    if (Number.isNaN(parsedInventory) || parsedInventory < 0) {
      toast.error("Tồn kho phải từ 0 trở lên.");
      return null;
    }

    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parsedPrice,
      originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
      salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : null,
      category: formData.category,
      weight: formData.weight.trim() || null,
      inventory: parsedInventory,
      image: formData.image.trim() || null,
      images: formData.images.filter((url) => url.trim() !== ""),
      featured: formData.featured,
      badgeText: formData.badgeText.trim() || null,
      tags: formData.tags.trim() || null,
      isOnSale: formData.isOnSale,
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm("Xóa sản phẩm này? Hành động này không thể hoàn tác.")) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name.trim() || !formData.category) {
      toast.error("Vui lòng nhập tên và danh mục trước khi dùng AI.");
      return;
    }

    setIsGenerating(true);
    setAiInsights(null);
    try {
      const response = await fetch("/api/admin/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          features: aiBrief.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Không thể tạo nội dung AI lúc này.");

      setFormData((prev) => ({
        ...prev,
        description: data.description || prev.description,
        tags: !prev.tags && Array.isArray(data.tags) && data.tags.length > 0 ? data.tags.join(", ") : prev.tags,
      }));

      setAiInsights({
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        origin: data.origin || "",
        howToUse: data.howToUse || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
      });
      toast.success("AI đã tạo nội dung mới cho sản phẩm.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo nội dung AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addVariant = async () => {
    if (!productId) return;
    setVariantBusyId("new");
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: variantDraft.weight || null,
          flavor: variantDraft.flavor || null,
          priceAdjustment: Number.parseFloat(variantDraft.priceAdjustment) || 0,
          stock: Number.parseInt(variantDraft.stock, 10) || 0,
          sku: variantDraft.sku || null,
          isActive: variantDraft.isActive,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Không thể thêm biến thể.");
      setVariants((prev) => [data, ...prev]);
      setVariantDraft(EMPTY_VARIANT);
      toast.success("Đã tạo biến thể.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể thêm biến thể.");
    } finally {
      setVariantBusyId(null);
    }
  };

  const saveVariant = async (variantId: string) => {
    if (!productId) return;
    setVariantBusyId(variantId);
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: editingVariant.weight || null,
          flavor: editingVariant.flavor || null,
          priceAdjustment: Number.parseFloat(editingVariant.priceAdjustment) || 0,
          stock: Number.parseInt(editingVariant.stock, 10) || 0,
          sku: editingVariant.sku || null,
          isActive: editingVariant.isActive,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Không thể cập nhật biến thể.");
      setVariants((prev) => prev.map((variant) => (variant.id === variantId ? data : variant)));
      setEditingVariantId(null);
      toast.success("Đã cập nhật biến thể.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật biến thể.");
    } finally {
      setVariantBusyId(null);
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!productId) return;
    if (!window.confirm("Xóa biến thể này?")) return;

    setVariantBusyId(variantId);
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Không thể xóa biến thể.");
      setVariants((prev) => prev.filter((variant) => variant.id !== variantId));
      toast.success(data?.message || "Đã xóa biến thể.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa biến thể.");
    } finally {
      setVariantBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Quay lại sản phẩm
          </Link>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">{mode === "create" ? "Tạo sản phẩm" : "Chỉnh sửa sản phẩm"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tạo hồ sơ sản phẩm dễ trình bày, dễ định giá và dễ bảo trì.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onDelete ? (
            <Button type="button" variant="outline" size="lg" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Xóa
            </Button>
          ) : null}
          <Button type="submit" form="product-editor-form" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <form id="product-editor-form" onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Thông tin cơ bản</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Thông tin sản phẩm</h2>
                </div>
                {currentCategory ? <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">{currentCategory.label}</span> : null}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Tên sản phẩm" required className="md:col-span-2">
                  <input value={formData.name} onChange={(event) => updateField("name", event.target.value)} className="admin-input" placeholder="Example: Kho ca loc premium" />
                </Field>
                <Field label="Danh mục" required>
                  <select value={formData.category} onChange={(event) => updateField("category", event.target.value)} className="admin-input">
                    <option value="">Chọn danh mục</option>
                    {ADMIN_CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Quy cách / trọng lượng">
                  <input value={formData.weight} onChange={(event) => updateField("weight", event.target.value)} className="admin-input" placeholder="500g, 1kg, gift box" />
                </Field>
                <Field label="Mô tả" required className="md:col-span-2">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-medium text-slate-500">Mô tả xuất xứ, hương vị, cách dùng, bảo quản và lý do nên mua.</p>
                      <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <WandSparkles className="h-3.5 w-3.5" />}
                        Nháp AI
                      </button>
                    </div>
                    <textarea rows={8} value={formData.description} onChange={(event) => updateField("description", event.target.value)} className="admin-textarea" placeholder="Mô tả điểm đặc biệt, đối tượng phù hợp và cách định vị sản phẩm." />
                    <textarea rows={3} value={aiBrief} onChange={(event) => setAiBrief(event.target.value)} className="admin-textarea text-sm" placeholder="Nháp AI tùy chọn: xuất xứ, đối tượng, ghi chú hương vị, quà tặng, cách dùng tốt nhất..." />
                  </div>
                </Field>
              </div>

              {aiInsights ? (
                <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700"><Sparkles className="h-3.5 w-3.5" />Gợi ý từ AI</div>
                    <button type="button" onClick={() => setAiInsights(null)} className="text-slate-400 transition hover:text-slate-700"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <InsightBlock icon={MapPin} label="Xuất xứ" value={aiInsights.origin} />
                    <InsightBlock icon={ChefHat} label="Cách dùng" value={aiInsights.howToUse} />
                  </div>
                  {aiInsights.benefits.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{aiInsights.benefits.map((benefit) => <span key={benefit} className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700">{benefit}</span>)}</div> : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Giá & tồn kho</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quản lý thương mại</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Giá cơ bản (USD)" required><input type="number" min="0" step="0.01" value={formData.price} onChange={(event) => updateField("price", event.target.value)} className="admin-input" placeholder="29.00" /></Field>
                <Field label="Tồn kho" required><input type="number" min="0" step="1" value={formData.inventory} onChange={(event) => updateField("inventory", event.target.value)} className="admin-input" placeholder="100" /></Field>
                <Field label="Giá gốc (không bắt buộc)"><input type="number" min="0" step="0.01" value={formData.originalPrice} onChange={(event) => updateField("originalPrice", event.target.value)} className="admin-input" placeholder="35.00" /></Field>
                <Field label="Giá khuyến mãi (không bắt buộc)"><input type="number" min="0" step="0.01" value={formData.salePrice} onChange={(event) => updateField("salePrice", event.target.value)} className="admin-input" placeholder="25.00" /></Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <MetricTile label="Giá cơ bản" value={formatPrice(basePrice)} />
                <MetricTile label="Trạng thái KM" value={formData.isOnSale ? "Đang áp dụng" : "Tắt"} />
                <MetricTile label="Số tag" value={`${tagCount}`} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleRow title="Đánh dấu nổi bật" description="Hiển thị sản phẩm ở các vị trí nổi bật." checked={formData.featured} onChange={(checked) => updateField("featured", checked)} />
                <ToggleRow title="Hiển thị khuyến mãi" description="Nếu bật và có giá KM, sản phẩm sẽ hiển thị giá khuyến mãi." checked={formData.isOnSale} onChange={(checked) => updateField("isOnSale", checked)} />
              </div>
            </CardContent>
          </Card>

          {productId ? (
            <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Biến thể</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quản lý biến thể</h2>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{variants.length} biến thể</div>
                </div>

                <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-6">
                  <MiniInput label="Trọng lượng" value={variantDraft.weight} onChange={(value) => setVariantDraft((prev) => ({ ...prev, weight: value }))} placeholder="500g" />
                  <MiniInput label="Hương vị" value={variantDraft.flavor} onChange={(value) => setVariantDraft((prev) => ({ ...prev, flavor: value }))} placeholder="Original" />
                  <MiniInput label="Điều chỉnh giá" value={variantDraft.priceAdjustment} onChange={(value) => setVariantDraft((prev) => ({ ...prev, priceAdjustment: value }))} placeholder="0" type="number" />
                  <MiniInput label="Tồn kho" value={variantDraft.stock} onChange={(value) => setVariantDraft((prev) => ({ ...prev, stock: value }))} placeholder="0" type="number" />
                  <MiniInput label="SKU" value={variantDraft.sku} onChange={(value) => setVariantDraft((prev) => ({ ...prev, sku: value }))} placeholder="SKU-001" />
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Hành động</p>
                    <Button type="button" size="sm" onClick={addVariant} disabled={variantBusyId === "new"} className="w-full justify-center">
                      {variantBusyId === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Thêm
                    </Button>
                  </div>
                </div>

                {variants.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">Thêm biến thể khi sản phẩm có nhiều kích thước, hương vị hoặc mức giá khác nhau.</div>
                ) : (
                  <div className="space-y-3">
                    {variants.map((variant) => {
                      const isEditing = editingVariantId === variant.id;
                      const busy = variantBusyId === variant.id;
                      return (
                        <div key={variant.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                          {isEditing ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                              <MiniInput label="Trọng lượng" value={editingVariant.weight} onChange={(value) => setEditingVariant((prev) => ({ ...prev, weight: value }))} placeholder="500g" />
                              <MiniInput label="Hương vị" value={editingVariant.flavor} onChange={(value) => setEditingVariant((prev) => ({ ...prev, flavor: value }))} placeholder="Original" />
                              <MiniInput label="Điều chỉnh giá" value={editingVariant.priceAdjustment} onChange={(value) => setEditingVariant((prev) => ({ ...prev, priceAdjustment: value }))} placeholder="0" type="number" />
                              <MiniInput label="Tồn kho" value={editingVariant.stock} onChange={(value) => setEditingVariant((prev) => ({ ...prev, stock: value }))} placeholder="0" type="number" />
                              <MiniInput label="SKU" value={editingVariant.sku} onChange={(value) => setEditingVariant((prev) => ({ ...prev, sku: value }))} placeholder="SKU-001" />
                              <div className="flex items-end gap-2">
                                <Button type="button" size="sm" onClick={() => saveVariant(variant.id)} disabled={busy} className="flex-1">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Lưu</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setEditingVariantId(null)}>Hủy</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                <VariantStat label="Trọng lượng" value={variant.weight || "-"} />
                                <VariantStat label="Hương vị" value={variant.flavor || "-"} />
                                <VariantStat label="Điều chỉnh giá" value={formatPrice(variant.priceAdjustment)} />
                                <VariantStat label="Tồn kho" value={`${variant.stock}`} />
                                <VariantStat label="SKU" value={variant.sku || "-"} />
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.16em] ${variant.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{variant.isActive ? "Hoạt động" : "Ẩn"}</span>
                                <Button type="button" size="sm" variant="outline" onClick={() => { setEditingVariantId(variant.id); setEditingVariant({ weight: variant.weight || "", flavor: variant.flavor || "", priceAdjustment: String(variant.priceAdjustment ?? 0), stock: String(variant.stock ?? 0), sku: variant.sku || "", isActive: variant.isActive }); }}>Sửa</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => deleteVariant(variant.id)} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}Xóa</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-8 xl:sticky xl:top-8 xl:self-start">
          <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Trình bày sản phẩm</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Nhãn & tìm kiếm</h2>
              </div>
              <Field label="Nhãn hiệu"><input value={formData.badgeText} onChange={(event) => updateField("badgeText", event.target.value)} className="admin-input" placeholder="Best seller, New, Limited" /></Field>
              <Field label="Thẻ tag"><textarea rows={4} value={formData.tags} onChange={(event) => updateField("tags", event.target.value)} className="admin-textarea" placeholder="giftable, premium, ready-to-serve" /></Field>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="font-black text-slate-900">Xem trước</p>
                <p className="mt-2">Danh mục: {getAdminCategoryLabel(formData.category)}</p>
                <p>Tồn kho: {formData.inventory || "0"}</p>
                <p>Nổi bật: {formData.featured ? "Có" : "Không"}</p>
                <p>Đang KM: {formData.isOnSale ? "Có" : "Không"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.25rem] border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Hình ảnh</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quản lý hình ảnh</h2>
              </div>
              <Field label="Ảnh đại diện"><input value={formData.image} onChange={(event) => updateField("image", event.target.value)} className="admin-input" placeholder="Primary image URL" /></Field>
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Thư viện ảnh</p>
                <ImageUpload value={formData.images} onChange={(value) => updateField("images", value)} onRemove={(url) => updateField("images", formData.images.filter((item) => item !== url))} multiple />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <style jsx global>{`
        .admin-input { width: 100%; height: 3.4rem; border-radius: 1rem; border: 1px solid rgb(226 232 240); background: rgb(248 250 252); padding: 0 1rem; font-size: 0.95rem; font-weight: 600; color: rgb(15 23 42); outline: none; transition: border-color 0.2s ease, background-color 0.2s ease; }
        .admin-input:focus { border-color: rgba(15, 23, 42, 0.3); background: white; }
        .admin-textarea { width: 100%; border-radius: 1.2rem; border: 1px solid rgb(226 232 240); background: rgb(248 250 252); padding: 1rem; font-weight: 500; color: rgb(15 23 42); outline: none; transition: border-color 0.2s ease, background-color 0.2s ease; }
        .admin-textarea:focus { border-color: rgba(15, 23, 42, 0.3); background: white; }
      `}</style>
    </div>
  );
}

function Field({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return <div className={className}><label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{label}{required ? " *" : ""}</label>{children}</div>;
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-2 text-lg font-black text-slate-950">{value}</p></div>;
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"><div><p className="font-black text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div><button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-10 w-18 items-center rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-200"}`}><span className={`inline-block h-8 w-8 transform rounded-full bg-white transition ${checked ? "translate-x-9" : "translate-x-1"}`} /></button></div>;
}

function InsightBlock({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  if (!value) return null;
  return <div className="rounded-[1.35rem] border border-white/80 bg-white/80 p-4"><div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400"><Icon className="h-3.5 w-3.5 text-emerald-600" />{label}</div><p className="mt-2 text-sm leading-6 text-slate-700">{value}</p></div>;
}

function MiniInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div className="space-y-2"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="admin-input h-11" placeholder={placeholder} /></div>;
}

function VariantStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-3 py-3"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p><p className="mt-1 text-sm font-black text-slate-950">{value}</p></div>;
}
