/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

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
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "AI Lab", href: "/admin/ai", icon: Sparkles },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ClipboardList },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Inventory", href: "/admin/inventory", icon: Package },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
      { label: "Flash sales", href: "/admin/flash-sales", icon: Zap },
    ],
  },
  {
    title: "Audience",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Posts", href: "/admin/posts", icon: FileText },
      { label: "CMS", href: "/admin/cms", icon: LayoutDashboard },
      { label: "Settings", href: "/admin/settings", icon: Settings },
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
        className="fixed left-4 top-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-lg lg:hidden"
        aria-label="Toggle admin navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin navigation"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-5 shadow-[0_18px_80px_rgba(15,23,42,0.08)] transition-all duration-300",
          collapsed ? "w-[92px]" : "w-[300px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-2 pb-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] bg-slate-950 text-white shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">LIKEFOOD</p>
                <h2 className="truncate text-lg font-black tracking-tight text-slate-950">Admin Console</h2>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 lg:inline-flex"
            aria-label="Collapse admin navigation"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
          <p className={cn("text-[11px] font-black uppercase tracking-[0.22em] text-slate-400", collapsed && "sr-only")}>
            Workspace focus
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {!collapsed ? <p className="text-sm font-bold text-slate-700">Operations healthy</p> : null}
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              {!collapsed ? (
                <p className="px-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {group.title}
                </p>
              ) : null}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-[1.35rem] px-3 py-3 text-sm font-bold transition",
                        active
                          ? "bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
                          : "text-slate-500 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] transition",
                          active ? "bg-white/10" : "bg-slate-100 text-slate-500 group-hover:bg-slate-950 group-hover:text-white"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
          {!collapsed ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Upgrade path</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Shell is component-driven so new admin screens can inherit the same controls and spacing without redesigning from scratch.
              </p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-white">
              <LogOut className="h-4.5 w-4.5" />
            </span>
            {!collapsed ? <span>Sign out</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
}
