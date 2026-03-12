"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import AdminSidebar from "@/components/shared/AdminSidebar";
import AdminBreadcrumbs from "@/components/shared/AdminBreadcrumbs";
import { CommandPalette, useCommandPalette } from "@/components/admin/CommandPalette";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    const { open, setOpen } = useCommandPalette();

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
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B] gap-4">
                <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <p className="font-semibold text-zinc-500 uppercase tracking-widest text-xs">Verifying...</p>
            </div>
        );
    }

    if (is2FAVerified === false) {
        return null; // Will redirect to /admin/verify
    }

    return (
        <div className="flex min-h-screen bg-[#0A0A0B]">
            <AdminSidebar />
            <main className="flex-1 lg:ml-56 p-4 lg:p-6 transition-all duration-200">
                <div className="max-w-[1600px] mx-auto">
                    <AdminBreadcrumbs />
                    {children}
                </div>
            </main>
            <CommandPalette open={open} onOpenChange={setOpen} />
        </div>
    );
}
