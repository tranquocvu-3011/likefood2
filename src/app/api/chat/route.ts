/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import { handleChatRequest } from "@/lib/ai/chatbot";
import { apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  // Rate limiting theo IP / user
  const identifier = getRateLimitIdentifier(request);
  const rate = await apiRateLimit?.limit(identifier);

  if (rate && !rate.success) {
    const retryAfter = Math.ceil((rate.reset - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: "Bạn gửi quá nhiều tin nhắn. Vui lòng chờ một lúc rồi thử lại.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { message, history } = body || {};

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Thiếu nội dung tin nhắn" },
        { status: 400 }
      );
    }

    if (message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Tin nhắn không được vượt quá 2000 ký tự." },
        { status: 400 }
      );
    }

    const result = await handleChatRequest({
      message,
      history: Array.isArray(history) ? history.slice(-10) : [],
    });

    return NextResponse.json({ reply: result.reply });
  } catch (error) {
    console.error("[CHAT_API_POST]", error);
    return NextResponse.json(
      { error: "Không thể xử lý chat. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

