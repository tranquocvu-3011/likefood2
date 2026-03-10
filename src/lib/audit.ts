/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Audit Logging System
 * Tracks security events, admin actions, and user activities
 */

import prisma from "@/lib/prisma";

export type AuditAction =
  | "USER_LOGIN"
  | "USER_LOGIN_FAILED"
  | "USER_LOGOUT"
  | "USER_REGISTER"
  | "USER_PASSWORD_CHANGE"
  | "USER_ROLE_CHANGE"
  | "USER_DELETE"
  | "ORDER_CREATE"
  | "ORDER_UPDATE"
  | "ORDER_CANCEL"
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "COUPON_CREATE"
  | "COUPON_UPDATE"
  | "COUPON_DELETE"
  | "ADMIN_LOGIN"
  | "ADMIN_LOGIN_FAILED"
  | "FILE_UPLOAD"
  | "SETTINGS_CHANGE"
  | "AI_REQUEST";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  severity?: AuditSeverity;
}

class AuditLogger {
  private async log(entry: AuditLogEntry) {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        action: entry.action,
        userId: entry.userId || null,
        userEmail: entry.userEmail || null,
        resource: entry.resource || null,
        resourceId: entry.resourceId || null,
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        severity: entry.severity || "INFO",
      };

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("[AUDIT]", JSON.stringify(logEntry));
      }

      // Always write structured audit log to logger (production-ready format)
      // This integrates with log aggregation tools (Sentry, Datadog, Logflare, etc.)
      const severity = logEntry.severity;
      if (severity === "CRITICAL") {
        console.error("[AUDIT:CRITICAL]", JSON.stringify(logEntry));
      } else if (severity === "WARNING") {
        console.warn("[AUDIT:WARNING]", JSON.stringify(logEntry));
      } else {
        console.info("[AUDIT:INFO]", JSON.stringify(logEntry));
      }

      // In production: write to a dedicated auditlog table when available
      // For now, only write CRITICAL security events to notification table (admin notifications)
      if (logEntry.severity === "CRITICAL" && entry.userId) {
        await prisma.notification.create({
          data: {
            userId: entry.userId,
            type: "system",
            title: `[SECURITY] ${entry.action}`,
            message: `Critical security event: ${entry.action}. IP: ${entry.ipAddress || "unknown"}`,
            isRead: false,
          },
        }).catch(() => {
          console.error("[AUDIT] Failed to write critical notification");
        });
      }
    } catch (error) {
      console.error("[AUDIT] Critical error in audit logging:", error);
    }
  }

  async logUserLogin(userId: string, email: string, ipAddress?: string, success = true) {
    await this.log({
      userId,
      userEmail: email,
      action: success ? "USER_LOGIN" : "USER_LOGIN_FAILED",
      ipAddress,
      severity: success ? "INFO" : "WARNING",
      details: { success },
    });
  }

  async logAdminAction(
    adminUserId: string,
    action: AuditAction,
    resource?: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ) {
    await this.log({
      userId: adminUserId,
      action,
      resource,
      resourceId,
      details,
      severity: "INFO",
    });
  }

  async logSecurityEvent(
    action: AuditAction,
    details: Record<string, unknown>,
    severity: AuditSeverity = "WARNING"
  ) {
    await this.log({
      action,
      details,
      severity,
    });
  }

  async logApiRequest(
    userId: string | undefined,
    endpoint: string,
    method: string,
    statusCode: number
  ) {
    if (process.env.NODE_ENV !== "production") return;

    await this.log({
      userId,
      action: "AI_REQUEST" as AuditAction,
      details: { endpoint, method, statusCode },
      severity: statusCode >= 400 ? "WARNING" : "INFO",
    });
  }
}

export const auditLogger = new AuditLogger();
