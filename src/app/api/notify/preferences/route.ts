/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@/generated/client";
import prisma from "@/lib/prisma";

interface NotificationPreferences {
  userId: string;
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    flashSales: boolean;
    newsletters: boolean;
    recommendations: boolean;
  };
  push: {
    enabled: boolean;
    orderUpdates: boolean;
    flashSales: boolean;
    priceDrops: boolean;
    restocks: boolean;
  };
  sms: {
    enabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
  marketing: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    if (session.user.id !== userId && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Try to get existing preferences
    const preferences = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });

    // If not exists, return defaults
    if (!preferences?.notificationPreferences) {
      const defaults: NotificationPreferences = {
        userId,
        email: {
          orderUpdates: true,
          promotions: true,
          flashSales: true,
          newsletters: false,
          recommendations: true,
        },
        push: {
          enabled: true,
          orderUpdates: true,
          flashSales: true,
          priceDrops: true,
          restocks: false,
        },
        sms: {
          enabled: false,
          orderUpdates: true,
          promotions: false,
        },
        marketing: true,
      };

      return NextResponse.json({
        success: true,
        preferences: defaults,
      });
    }

    return NextResponse.json({
      success: true,
      preferences: preferences.notificationPreferences,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, preferences } = body as { userId: string; preferences: NotificationPreferences };

    if (!userId || !preferences) {
      return NextResponse.json(
        { error: "Missing required fields: userId, preferences" },
        { status: 400 }
      );
    }

    if (session.user.id !== userId && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update user preferences
    await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: preferences as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
