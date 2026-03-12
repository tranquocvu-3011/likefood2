/**
 * LIKEFOOD - Site Config API (Public)
 * Get public site settings
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get public site config
export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: { isPublic: true },
    });

    // Transform to key-value object
    const configObject: Record<string, string> = {};
    configs.forEach((config) => {
      configObject[config.key] = config.value;
    });

    return NextResponse.json(configObject);
  } catch (error) {
    console.error("Site config fetch error:", error);
    return NextResponse.json({ error: "Lỗi khi lấy cấu hình" }, { status: 500 });
  }
}
