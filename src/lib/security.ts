/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Security utilities for authentication and authorization
 */

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role as UserRole)) {
    throw new Error("Forbidden");
  }
  return session;
}

/**
 * Check if user is admin (ADMIN or SUPER_ADMIN)
 */
export async function requireAdmin() {
  return requireRole("ADMIN", "SUPER_ADMIN");
}

/**
 * Check if user is super admin
 */
export async function requireSuperAdmin() {
  return requireRole("SUPER_ADMIN");
}

/**
 * Require role with response (returns NextResponse instead of throwing)
 */
export async function requireRoleResponse(allowedRoles: UserRole[], message = "Unauthorized") {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: message }, { status: 401 });
  }

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // Authorization passed
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

/**
 * Get current user role
 */
export async function getCurrentUserRole(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.role || null;
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
}

/**
 * Get user agent from request headers
 */
export function getUserAgent(headers: Headers): string | null {
  return headers.get("user-agent") || null;
}
