/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/ratelimit";
import { getEnv } from "@/lib/env";

/**
 * PROD-03: Health Check Endpoint
 * Returns status of all critical services
 * Protected with secret header to prevent abuse
 */

export async function GET(req: Request) {
    const start = Date.now();
    
    // Optional secret protection
    const secret = req.headers.get("x-health-secret");
    const expectedSecret = process.env.HEALTH_SECRET;

    // If HEALTH_SECRET is not configured, return a minimal public response
    // to avoid leaking infrastructure details without authentication
    if (!expectedSecret) {
        return NextResponse.json({ status: "ok" });
    }

    // If HEALTH_SECRET is set, require it
    if (secret !== expectedSecret) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        latency: 0,
        services: {} as Record<string, { status: string; latency?: number; error?: string }>,
    };

    // Check database
    try {
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = {
            status: "ok",
            latency: Date.now() - dbStart,
        };
    } catch (error) {
        health.services.database = {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        };
        health.status = "degraded";
    }

    // Check Redis
    if (redis) {
        try {
            const redisStart = Date.now();
            await redis.ping();
            health.services.redis = {
                status: "ok",
                latency: Date.now() - redisStart,
            };
        } catch (error) {
            health.services.redis = {
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
            };
            // Redis is optional, so don't degrade overall status
        }
    } else {
        health.services.redis = {
            status: "not_configured",
        };
    }

    // Check environment variables
    try {
        getEnv();
        health.services.env = {
            status: "ok",
        };
    } catch (error) {
        health.services.env = {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        };
        health.status = "unhealthy";
    }

    // Overall latency
    const totalLatency = Date.now() - start;
    health.latency = totalLatency;
    
    const statusCode = health.status === "healthy" ? 200 : 
                       health.status === "degraded" ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
}
