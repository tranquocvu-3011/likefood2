"use client";

/**
 * LIKEFOOD - Admin Menu Management Page
 * Manage navigation menu items
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Menu, Plus, Pencil, Trash2, Loader2, Save, X, 
  GripVertical, Eye, EyeOff, ExternalLink, ChevronRight, ChevronDown 
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  url: string | null;
  categoryId: string | null;
  productId: string | null;
  pageId: string | null;
  icon: string | null;
  parentId: string | null;
  position: number;
  isVisible: boolean;
  isActive: boolean;
  children?: MenuItem[];
}

const MENU_TYPES = [
  { value: "LINK", label: "Liên kết nội bộ", icon: "🔗" },
  { value: "CATEGORY", label: "Danh mục sản phẩm", icon: "📁" },
  { value: "PRODUCT", label: "Sản phẩm", icon: "📦" },
  { value: "PAGE", label: "Trang động", icon: "📄" },
  { value: "EXTERNAL", label: "Liên kết ngoài", icon: "🌐" },
];

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const [newItem, setNewItem] = useState({
    name: "",
    slug: "",
    type: "LINK",
    url: "",
    icon: "",
    parentId: "" as string | null,
    position: 0,
    isVisible: true,
  });

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/menu");
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch {
      toast.error("Không thể tải menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: menuItems }),
      });

      if (res.ok) {
        toast.success("Đã lưu thứ tự menu");
        fetchMenuItems();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi lưu");
      }
    } catch {
      toast.error("Lỗi khi lưu menu");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMenu = async () => {
    if (!newItem.name) {
      toast.error("Tên menu là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        toast.success("Đã thêm menu");
        setShowAddDialog(false);
        setNewItem({
          name: "",
          slug: "",
          type: "LINK",
          url: "",
          icon: "",
          parentId: null,
          position: 0,
          isVisible: true,
        });
        fetchMenuItems();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi thêm menu");
      }
    } catch {
      toast.error("Lỗi khi thêm menu");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMenu = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            id: editingItem.id,
            name: editingItem.name,
            url: editingItem.url,
            isVisible: editingItem.isVisible,
            isActive: editingItem.isActive,
          }],
        }),
      });

      if (res.ok) {
        toast.success("Đã cập nhật menu");
        setShowEditDialog(false);
        setEditingItem(null);
        fetchMenuItems();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi cập nhật");
      }
    } catch {
      toast.error("Lỗi khi cập nhật menu");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa menu này?")) return;

    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa menu");
        fetchMenuItems();
      } else {
        const data = await res.json();
        toast.error(data.error || "Lỗi khi xóa");
      }
    } catch {
      toast.error("Lỗi khi xóa menu");
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...menuItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    newItems[index].position = index;
    newItems[newIndex].position = newIndex;
    setMenuItems(newItems);
  };

  const renderMenuItem = (item: MenuItem, index: number, isChild = false) => {
    const typeLabel = MENU_TYPES.find(t => t.value === item.type)?.label || item.type;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div
        key={item.id}
        className={`${isChild ? "ml-8 border-l-2 border-gray-200 pl-4" : ""} mb-2`}
      >
        <div className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
          {!isChild && (
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => moveItem(index, "down")}
                disabled={index === menuItems.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />

          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => toggleExpand(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-gray-500">({typeLabel})</span>
              {item.url && (
                <span className="text-xs text-gray-400 truncate max-w-[200px]">
                  → {item.url}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.isVisible ? (
              <Eye className="h-4 w-4 text-green-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingItem(item);
                setShowEditDialog(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => handleDeleteMenu(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {item.children!.map((child, childIndex) => 
              renderMenuItem(child, childIndex, true)
            )}
          </div>
        )}
      </div>
    );
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
          <h1 className="text-2xl font-bold">Quản lý Menu</h1>
          <p className="text-gray-500">Sắp xếp và quản lý menu điều hướng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveOrder} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Lưu thứ tự
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm menu
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Cấu trúc Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có menu nào</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm menu đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm menu mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên menu *</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Ví dụ: Sản phẩm"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={newItem.slug}
                onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                placeholder="Để trống sẽ tự tạo"
              />
            </div>
            <div>
              <Label>Loại menu *</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              >
                {MENU_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            {(newItem.type === "LINK" || newItem.type === "EXTERNAL") && (
              <div>
                <Label>URL</Label>
                <Input
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder={newItem.type === "EXTERNAL" ? "https://..." : "/products"}
                />
              </div>
            )}
            <div>
              <Label>Icon (class name)</Label>
              <Input
                value={newItem.icon}
                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                placeholder="Ví dụ: Lucide icon name"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={newItem.isVisible}
                onChange={(e) => setNewItem({ ...newItem, isVisible: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isVisible" className="cursor-pointer">Hiển thị menu</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddMenu} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa menu</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label>Tên menu *</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              {(editingItem.type === "LINK" || editingItem.type === "EXTERNAL") && (
                <div>
                  <Label>URL</Label>
                  <Input
                    value={editingItem.url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editVisible"
                    checked={editingItem.isVisible}
                    onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editVisible" className="cursor-pointer">Hiển thị</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editActive"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editActive" className="cursor-pointer">Hoạt động</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateMenu} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
