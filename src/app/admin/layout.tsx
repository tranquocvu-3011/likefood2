/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // SEC-03: Server-side auth check - this runs BEFORE any client-side code
    const session = await getServerSession(authOptions);
    
    // If not logged in, redirect to login
    if (!session) {
        redirect("/login?callbackUrl=/admin");
    }
    
    // If logged in but not admin, redirect to home
    const userRole = session.user?.role;
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        redirect("/");
    }
    
    // Pass session to client component for 2FA check
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
