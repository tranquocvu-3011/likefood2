/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageContainerProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  eyebrow?: string;
}

export function AdminPageContainer({
  title,
  subtitle,
  action,
  children,
  eyebrow = "Quản trị",
}: AdminPageContainerProps) {
  return (
    <div className="space-y-3">
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 px-4 py-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-0.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{eyebrow}</p>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">{title}</h1>
                {subtitle ? (
                  <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm lg:p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminTableContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
