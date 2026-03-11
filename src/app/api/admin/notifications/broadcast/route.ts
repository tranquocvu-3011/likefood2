/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { z } from "zod";

const broadcastSchema = z.object({
    title: z.string().min(1, "Title bắt buộc").max(200, "Title tối đa 200 ký tự"),
    message: z.string().min(1, "Message bắt buộc").max(2000, "Message tối đa 2000 ký tự"),
    link: z.string().url().optional().nullable(),
    channelInApp: z.boolean().default(true),
    channelEmail: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized: Super Admin only" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = broadcastSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const { title, message, link, channelInApp, channelEmail } = parsed.data;

        // Lấy danh sách user đã verify email (để gửi email)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                emailVerified: true,
            },
        });

        const userIds = users.map((u) => u.id);

        // Create in-app notifications in batches of 500
        if (channelInApp && userIds.length > 0) {
            const CHUNK_SIZE = 500;
            for (let i = 0; i < userIds.length; i += CHUNK_SIZE) {
                const chunk = userIds.slice(i, i + CHUNK_SIZE);
                await prisma.notification.createMany({
                    data: chunk.map((userId) => ({
                        userId,
                        type: "system",
                        title,
                        message,
                        link: link || null,
                        isRead: false,
                        createdAt: new Date(),
                    })),
                });
            }
        }

        // Email broadcast is handled by an external email service — not implemented inline
        if (channelEmail) {
            logger.warn("Email broadcast requested but not configured. Use an email service provider.", {
                context: "admin-broadcast-email",
                recipientCount: users.filter((u) => u.email && u.emailVerified).length,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error("Admin broadcast notification error", error as Error, {
            context: "admin-broadcast",
        });
        return NextResponse.json({ error: "Failed to send broadcast" }, { status: 500 });
    }
}

