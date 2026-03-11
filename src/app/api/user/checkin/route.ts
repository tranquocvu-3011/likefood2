/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { applyRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Rate limit: per-user, 20 requests/minute (tránh "Quá nhiều yêu cầu" khi điểm danh)
    const identifier = `checkin:${session.user.id}`;
    const rl = await applyRateLimit(identifier, null, { windowMs: 60000, maxRequests: 20 });
    if (!rl.success) return rl.error as unknown as NextResponse;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = session.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { lastCheckIn: true, points: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const now = new Date();
        const lastCheckIn = user.lastCheckIn;

        // Check if already checked in today (Vietnamese timezone UTC+7)
        const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const todayVN = nowVN.toISOString().slice(0, 10);
        if (lastCheckIn) {
            const lastVN = new Date(lastCheckIn.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
            if (todayVN === lastVN) {
                return NextResponse.json({
                    error: "Bạn đã điểm danh hôm nay rồi!",
                    alreadyCheckedIn: true,
                }, { status: 400 });
            }
        }

        // Points logic: 10 points per check-in
        const pointsToEarn = 10;

        const updatedUser = await prisma.$transaction(async (tx) => {
            const u = await tx.user.update({
                where: { id: userId },
                data: {
                    points: { increment: pointsToEarn },
                    lastCheckIn: now
                }
            });

            await tx.pointtransaction.create({
                data: {
                    userId,
                    amount: pointsToEarn,
                    type: "EARN",
                    description: "Điểm danh hàng ngày",
                }
            });

            return u;
        });

        return NextResponse.json({
            message: "Điểm danh thành công!",
            earned: pointsToEarn,
            totalPoints: updatedUser.points,
            lastCheckIn: updatedUser.lastCheckIn
        });

    } catch (_error) {
        logger.error("Check-in error", _error as Error, { userId: session.user.id });
        return NextResponse.json({ error: "Lỗi hệ thống khi điểm danh" }, { status: 500 });
    }
}

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { lastCheckIn: true, points: true }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let canCheckIn = true;
        if (user.lastCheckIn) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastDate = new Date(user.lastCheckIn);
            lastDate.setHours(0, 0, 0, 0);
            if (today.getTime() === lastDate.getTime()) {
                canCheckIn = false;
            }
        }

        // Calculate the Monday of the current week (UTC+7 Vietnam time)
        const now = new Date();
        const vnOffset = 7 * 60 * 60 * 1000;
        const vnNow = new Date(now.getTime() + vnOffset);
        const vnDow = vnNow.getUTCDay(); // 0=Sun, 1=Mon...
        const daysToMonday = vnDow === 0 ? 6 : vnDow - 1;
        const mondayVN = new Date(vnNow);
        mondayVN.setUTCDate(vnNow.getUTCDate() - daysToMonday);
        mondayVN.setUTCHours(0, 0, 0, 0);
        // Convert back to UTC for DB query
        const mondayUTC = new Date(mondayVN.getTime() - vnOffset);

        // Get all daily check-in transactions this week
        const weekCheckIns = await prisma.pointtransaction.findMany({
            where: {
                userId: session.user.id,
                type: "EARN",
                description: "Điểm danh hàng ngày",
                createdAt: { gte: mondayUTC },
            },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        // Map each check-in to a day index (0=Mon ... 6=Sun) in Vietnam timezone
        const checkedDaysThisWeek: number[] = weekCheckIns.map((t) => {
            const vnDate = new Date(t.createdAt.getTime() + vnOffset);
            const dow = vnDate.getUTCDay(); // 0=Sun, 1=Mon...
            return dow === 0 ? 6 : dow - 1; // 0=Mon...6=Sun
        });

        return NextResponse.json({
            points: user.points,
            lastCheckIn: user.lastCheckIn,
            canCheckIn,
            checkedDaysThisWeek,
        });
    } catch (_error) {
        return NextResponse.json({ error: "Failed to fetch check-in status" }, { status: 500 });
    }
}
