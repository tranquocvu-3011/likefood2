/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  products: "Products",
  new: "Create",
  edit: "Edit",
  orders: "Orders",
  customers: "Customers",
  users: "Users",
  coupons: "Coupons",
  analytics: "Analytics",
  settings: "Settings",
  ai: "AI Lab",
  inventory: "Inventory",
  categories: "Categories",
  brands: "Brands",
  'flash-sales': "Flash Sales",
  posts: "Posts",
  cms: "CMS",
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/admin/dashboard") {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = PATH_LABELS[segment] || (segment.length > 18 ? `${segment.slice(0, 8)}...` : segment);
    return {
      href,
      label,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
      <Link
        href="/admin/dashboard"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-900"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb) => (
        <span key={crumb.href} className="inline-flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          {crumb.isLast ? (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 font-bold text-slate-900">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="rounded-full border border-transparent px-3 py-2 font-medium text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
