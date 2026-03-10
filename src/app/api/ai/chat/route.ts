/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai/enhanced-chatbot";
import { trackChatbotMessage } from "@/lib/analytics/behavior";
import { applyRateLimit, apiRateLimit, getRateLimitIdentifier } from "@/lib/ratelimit";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

const AI_CHAT_WINDOW_MS = 60 * 60 * 1000;
const AI_CHAT_MAX_REQUESTS = 20;

const FALLBACK_MESSAGE =
  "Mình đang bận chút. Bạn thử gửi lại tin nhắn hoặc hỏi ngắn gọn hơn (ví dụ: phí giao hàng, gợi ý quà, theo dõi đơn hàng) nhé!";

function fallbackJson(sessionId: string) {
  return NextResponse.json({
    response: FALLBACK_MESSAGE,
    content: FALLBACK_MESSAGE,
    role: "model",
    intent: "UNKNOWN",
    confidence: 0,
    language: "vi",
    sessionId,
  });
}

export async function POST(req: NextRequest) {
  let chatSessionId = generateSessionId();

  try {
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = await applyRateLimit(identifier, apiRateLimit, {
      windowMs: AI_CHAT_WINDOW_MS,
      maxRequests: AI_CHAT_MAX_REQUESTS,
    });

    if (!rateLimitResult.success) {
      return rateLimitResult.error as unknown as NextResponse;
    }

    const body = await req.json().catch(() => ({}));
    const { message, sessionId, userId, messages } = body ?? {};

    let chatMessage = message;
    chatSessionId = typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : generateSessionId();

    if (!chatMessage && Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      chatMessage = typeof lastMessage?.content === "string" ? lastMessage.content.trim() : "";
    }

    if (typeof chatMessage !== "string" || !chatMessage.trim()) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    const trimmedMessage = chatMessage.trim();
    if (trimmedMessage.length > 2000) {
      return NextResponse.json({ error: "Message must be 2000 characters or fewer." }, { status: 400 });
    }

    const result = await chat({
      message: trimmedMessage,
      sessionId: chatSessionId,
      userId,
    });

    try {
      await trackChatbotMessage(chatSessionId, userId, trimmedMessage, result.intent, result.message);
    } catch (analyticsError) {
      console.error("Analytics tracking error:", analyticsError);
    }

    return NextResponse.json({
      response: result.message,
      content: result.message,
      role: "model",
      intent: result.intent,
      confidence: result.confidence,
      language: result.language,
      suggestions: result.suggestions,
      shouldEscalate: result.shouldEscalate,
      isNewUser: result.isNewUser,
      sessionId: chatSessionId,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return fallbackJson(chatSessionId);
  }
}

