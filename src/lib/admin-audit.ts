/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * ADM-001: Admin Audit Logger
 *
 * Wraps admin API mutations to automatically log who did what.
 * Use this in admin routes to maintain accountability.
 *
 * Usage:
 *   const result = await auditAdminAction({
 *       adminId: session.user.id,
 *       action: "UPDATE_ORDER_STATUS",
 *       entityType: "order",
 *       entityId: orderId,
 *       beforeData: { status: oldStatus },
 *       afterData: { status: newStatus },
 *   });
 */

import prisma from "@/lib/prisma";

interface AuditActionParams {
    adminId: string;
    targetUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    beforeData?: Record<string, unknown>;
    afterData?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

/**
 * Log an admin action to the audit trail
 */
export async function auditAdminAction(params: AuditActionParams): Promise<void> {
    try {
        await prisma.referralauditlog.create({
            data: {
                actorUserId: params.adminId,
                targetUserId: params.targetUserId || null,
                action: `ADMIN:${params.action}`,
                entityType: params.entityType,
                entityId: params.entityId || null,
                beforeData: params.beforeData ? JSON.stringify(params.beforeData) : null,
                afterData: params.afterData ? JSON.stringify(params.afterData) : null,
                metadata: params.metadata ? JSON.stringify(params.metadata) : null,
            },
        });
    } catch (error) {
        // Never let audit logging break the main flow
        console.error("[AUDIT] Failed to log admin action:", error);
    }
}

/**
 * Get recent admin actions for audit review
 */
export async function getAdminAuditLog(options: {
    limit?: number;
    offset?: number;
    action?: string;
    entityType?: string;
    adminId?: string;
}) {
    const { limit = 50, offset = 0, action, entityType, adminId } = options;

    const where: Record<string, unknown> = {
        action: { startsWith: "ADMIN:" },
    };
    if (action) where.action = `ADMIN:${action}`;
    if (entityType) where.entityType = entityType;
    if (adminId) where.actorUserId = adminId;

    const [logs, total] = await Promise.all([
        prisma.referralauditlog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
            include: {
                actor: { select: { id: true, name: true, email: true } },
                target: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.referralauditlog.count({ where }),
    ]);

    return { logs, total, limit, offset };
}
