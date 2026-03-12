"use client";

/**
 * LIKEFOOD - Admin Dynamic Pages Management
 * Manage About, FAQ, Policies, and custom pages
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Plus, Pencil, Trash2, Loader2, Save, X, 
  Eye, EyeOff, ChevronUp, ChevronDown, Settings, Copy, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  image: string | null;
  template: string;
  type: string;
  isPublished: boolean;
  isDefault: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const PAGE_TYPES = [
  { value: "about", label: "Giới thiệu", icon: "ℹ️" },
  { value: "faq", label: "FAQ - Câu hỏi thường gặp", icon: "❓" },
  { value: "policy", label: "Chính sách", icon: "📋" },
  { value: "contact", label: "Liên hệ", icon: "📞" },
  { value: "custom", label: "Trang tùy chỉnh", icon: "📄" },
];

const PAGE_TEMPLATES = [
  { value: "default", label: "Mặc định" },
  { value: "full-width", label: "Toàn chiều rộng" },
  { value: "sidebar", label: "Có thanh bên" },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    image: "",
    template: "default",
    type: "custom",
    isPublished: true,
    isDefault: false,
    order: 0,
  });

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch {
      toast.error("Không thể tải trang");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleAddPage = async () => {
    if (!newPage.title || !newPage.slug) {
      toast.error("Tiêu đề và slug là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage),
      });

      if (res.ok) {
        toast.success("Đã thêm trang");
        setShowAddDialog(false);
        setNewPage({
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          metaTitle: "",
          metaDescription: "",
          image: "",
          template: "default",
          type: "custom",
          isPublished: true,
          isDefault: false,
          order: 0,
        });
        fetchPages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi thêm");
      }
    } catch {
      toast.error("Lỗi khi thêm trang");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePage = async () => {
    if (!editingPage) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });

      if (res.ok) {
        toast.success("Đã cập nhật trang");
        setShowEditDialog(false);
        setEditingPage(null);
        fetchPages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi cập nhật");
      }
    } catch {
      toast.error("Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa trang này?")) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa trang");
        fetchPages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi xóa");
      }
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  const handleTogglePublish = async (page: DynamicPage) => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: page.id,
          isPublished: !page.isPublished,
        }),
      });

      if (res.ok) {
        fetchPages();
      }
    } catch {
      toast.error("Lỗi khi thay đổi trạng thái");
    }
  };

  const handleDuplicate = (page: DynamicPage) => {
    setNewPage({
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      content: page.content,
      excerpt: page.excerpt || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      image: page.image || "",
      template: page.template,
      type: page.type,
      isPublished: false,
      isDefault: false,
      order: 0,
    });
    setShowAddDialog(true);
  };

  const handlePreview = (page: DynamicPage) => {
    setPreviewContent(page.content);
    setShowPreview(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const movePage = (index: number, direction: "up" | "down") => {
    const newPages = [...pages];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newPages.length) return;
    
    [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
    newPages[index].order = index;
    newPages[newIndex].order = newIndex;
    setPages(newPages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Trang</h1>
          <p className="text-gray-500">Tạo và chỉnh sửa các trang nội dung (About, FAQ, Policies...)</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm trang mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => {
          const typeInfo = PAGE_TYPES.find(t => t.value === page.type);
          return (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {typeInfo?.icon || "📄"} {page.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {page.isPublished ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">/{page.slug}</p>
                {page.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{page.excerpt}</p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {typeInfo?.label || page.type}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {PAGE_TEMPLATES.find(t => t.value === page.template)?.label || page.template}
                  </span>
                  {page.isDefault && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(page)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPage(page);
                      setShowEditDialog(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(page)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {pages.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Chưa có trang nào</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo trang đầu tiên
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo trang mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tiêu đề *</Label>
                <Input
                  value={newPage.title}
                  onChange={(e) => {
                    setNewPage({ 
                      ...newPage, 
                      title: e.target.value,
                      slug: newPage.slug ? newPage.slug : generateSlug(e.target.value)
                    });
                  }}
                  placeholder="Giới thiệu"
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: generateSlug(e.target.value) })}
                  placeholder="gioi-thieu"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Loại trang</Label>
                <select
                  className="w-full h-10 px-3 border rounded-md"
                  value={newPage.type}
                  onChange={(e) => setNewPage({ ...newPage, type: e.target.value })}
                >
                  {PAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Giao diện</Label>
                <select
                  className="w-full h-10 px-3 border rounded-md"
                  value={newPage.template}
                  onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
                >
                  {PAGE_TEMPLATES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Tóm tắt</Label>
              <Textarea
                value={newPage.excerpt}
                onChange={(e) => setNewPage({ ...newPage, excerpt: e.target.value })}
                placeholder="Mô tả ngắn về trang..."
                rows={2}
              />
            </div>
            <div>
              <Label>Nội dung</Label>
              <Textarea
                value={newPage.content}
                onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                placeholder="Nội dung trang (hỗ trợ HTML)..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={newPage.metaTitle}
                  onChange={(e) => setNewPage({ ...newPage, metaTitle: e.target.value })}
                  placeholder="SEO Title"
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Input
                  value={newPage.metaDescription}
                  onChange={(e) => setNewPage({ ...newPage, metaDescription: e.target.value })}
                  placeholder="SEO Description"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newPublished"
                  checked={newPage.isPublished}
                  onChange={(e) => setNewPage({ ...newPage, isPublished: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="newPublished" className="cursor-pointer">Xuất bản</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newDefault"
                  checked={newPage.isDefault}
                  onChange={(e) => setNewPage({ ...newPage, isDefault: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="newDefault" className="cursor-pointer">Làm trang mặc định</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddPage} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Tạo trang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa trang</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tiêu đề *</Label>
                  <Input
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: generateSlug(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loại trang</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={editingPage.type}
                    onChange={(e) => setEditingPage({ ...editingPage, type: e.target.value })}
                  >
                    {PAGE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Giao diện</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={editingPage.template}
                    onChange={(e) => setEditingPage({ ...editingPage, template: e.target.value })}
                  >
                    {PAGE_TEMPLATES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Tóm tắt</Label>
                <Textarea
                  value={editingPage.excerpt || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Nội dung</Label>
                <Textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input
                    value={editingPage.metaTitle || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Input
                    value={editingPage.metaDescription || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editPublished"
                    checked={editingPage.isPublished}
                    onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editPublished" className="cursor-pointer">Xuất bản</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editDefault"
                    checked={editingPage.isDefault}
                    onChange={(e) => setEditingPage({ ...editingPage, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editDefault" className="cursor-pointer">Làm trang mặc định</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePage} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xem trước nội dung</DialogTitle>
          </DialogHeader>
          <div 
            className="prose max-w-none p-6 bg-gray-50 rounded-lg"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
