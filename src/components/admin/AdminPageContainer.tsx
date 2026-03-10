/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿import { ReactNode } from "react";
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
  eyebrow = "Admin workspace",
}: AdminPageContainerProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
        <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_46%,#eff6ff_100%)] px-6 py-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">{title}</h1>
                {subtitle ? (
                  <p className="mt-2 text-sm leading-6 text-slate-500 lg:text-base">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
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
        "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] lg:p-8",
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
        "overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
