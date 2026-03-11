"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import AdminSidebar from "@/components/shared/AdminSidebar";
import AdminBreadcrumbs from "@/components/shared/AdminBreadcrumbs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [is2FAVerified, setIs2FAVerified] = useState<boolean | null>(null);
    const [isChecking2FA, setIsChecking2FA] = useState(true);
    const isLoginPage = pathname === "/admin/login";
    const isVerifyPage = pathname === "/admin/verify";
    const isBypassPage = isLoginPage || isVerifyPage;

    useEffect(() => {
        if (isBypassPage) {
            setIsChecking2FA(false);
            return;
        }

        // Check 2FA session cookie
        const check2FASession = async () => {
            try {
                const response = await fetch("/api/auth/admin-verify", {
                    method: "GET",
                    credentials: "include",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIs2FAVerified(data.verified);
                } else {
                    setIs2FAVerified(false);
                }
            } catch {
                setIs2FAVerified(false);
            } finally {
                setIsChecking2FA(false);
            }
        };

        check2FASession();
    }, [pathname]);

    useEffect(() => {
        if (isChecking2FA) return;
        
        if (!isBypassPage && is2FAVerified === false) {
            router.push("/admin/verify");
        }
    }, [is2FAVerified, isChecking2FA, router, isBypassPage]);

    if (isBypassPage) return <>{children}</>;

    if (isChecking2FA) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Đang kiểm tra bảo mật...</p>
            </div>
        );
    }

    if (is2FAVerified === false) {
        return null; // Will redirect to /admin/verify
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/80">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64 p-3 lg:p-4 transition-all duration-200">
                <AdminBreadcrumbs />
                <div className="mt-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
