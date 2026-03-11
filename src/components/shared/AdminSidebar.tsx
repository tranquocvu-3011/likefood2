"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Sparkles,
  Ticket,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { label: "Bảng điều khiển", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Phân tích", href: "/admin/analytics", icon: BarChart3 },
      { label: "Phòng AI", href: "/admin/ai", icon: Sparkles },
    ],
  },
  {
    title: "Thương mại",
    items: [
      { label: "Đơn hàng", href: "/admin/orders", icon: ClipboardList },
      { label: "Sản phẩm", href: "/admin/products", icon: Package },
      { label: "Danh mục", href: "/admin/categories", icon: FolderTree },
      { label: "Kho hàng", href: "/admin/inventory", icon: Package },
      { label: "Mã giảm giá", href: "/admin/coupons", icon: Ticket },
      { label: "Flash Sale", href: "/admin/flash-sales", icon: Zap },
    ],
  },
  {
    title: "Khách hàng",
    items: [
      { label: "Khách hàng", href: "/admin/customers", icon: Users },
      { label: "Người dùng", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Nội dung",
    items: [
      { label: "Bài viết", href: "/admin/posts", icon: FileText },
      { label: "Quản lý nội dung", href: "/admin/cms", icon: LayoutDashboard },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="fixed left-3 top-3 z-[70] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm text-slate-600 shadow-md lg:hidden"
        aria-label="Mở/đóng điều hướng"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Đóng điều hướng"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl px-3 py-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-200",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-2 px-1 pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md">
              <Bot className="h-4.5 w-4.5" />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">LIKEFOOD</p>
                <h2 className="truncate text-sm font-bold tracking-tight text-slate-900">Bảng quản trị</h2>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-slate-300 hover:bg-white hover:text-slate-600 lg:inline-flex"
            aria-label="Thu gọn điều hướng"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
          <p className={cn("text-[9px] font-semibold uppercase tracking-wider text-slate-400", collapsed && "sr-only")}>
            Trạng thái hệ thống
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            {!collapsed ? <p className="text-xs font-medium text-slate-600">Hệ thống hoạt động tốt</p> : null}
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed ? (
                <p className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
              ) : null}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-all duration-150",
                        active
                          ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                          active ? "bg-white/15" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2.5 rounded-lg border border-rose-100 bg-rose-50/80 px-2 py-2 text-[13px] font-medium text-rose-600 transition hover:bg-rose-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <LogOut className="h-4 w-4" />
            </span>
            {!collapsed ? <span>Đăng xuất</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
}
