"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * AI Chatbot — Messenger-style premium interface
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 */

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatOpen } from "@/contexts/ChatOpenContext";
import { analytics } from "@/lib/analytics/sdk";
import { useLanguage } from "@/lib/i18n/context";
import DOMPurify from "isomorphic-dompurify";
import {
  ArrowUp,
  RotateCcw,
  Sparkles,
  X,
  Minus,
  Bot,
  Zap,
} from "lucide-react";

/* ─── Types ─── */
interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE_VI = {
  id: "initial",
  role: "model" as const,
  content:
    "Xin chào! 👋 Mình là **LIKEFOOD AI** — trợ lý ẩm thực thông minh của bạn.\n\n🛒 Gợi ý sản phẩm phù hợp\n📦 Theo dõi đơn hàng\n🎁 Tư vấn combo & quà biếu\n💬 Giải đáp mọi thắc mắc\n\nBạn cần mình giúp gì nào? 😊",
  timestamp: new Date(),
};

const INITIAL_MESSAGE_EN = {
  id: "initial",
  role: "model" as const,
  content:
    "Hello! 👋 I'm **LIKEFOOD AI** — your smart food shopping assistant.\n\n🛒 Product recommendations\n📦 Order tracking\n🎁 Gift combos & suggestions\n💬 Answer your questions\n\nHow can I help you today? 😊",
  timestamp: new Date(),
};

const QUICK_REPLIES_VI = [
  { emoji: "🍵", text: "Gợi ý trà & cà phê" },
  { emoji: "🎁", text: "Combo quà biếu" },
  { emoji: "🚚", text: "Phí giao hàng" },
  { emoji: "📦", text: "Theo dõi đơn hàng" },
];

const QUICK_REPLIES_EN = [
  { emoji: "🍵", text: "Tea & Coffee suggestions" },
  { emoji: "🎁", text: "Gift combos" },
  { emoji: "🚚", text: "Shipping fees" },
  { emoji: "📦", text: "Track order" },
];

/* ─── Helpers ─── */
function formatTime(date: Date) {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**  Simple markdown → HTML (bold, italic, links, line breaks) - SANITIZED */
function renderMarkdown(text: string) {
  // First convert markdown to HTML
  const rawHtml = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  
  // Then sanitize to prevent XSS
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['br', 'strong', 'em'],
    ALLOWED_ATTR: ['class'],
  });
}

/* ─── Typing Indicator (Messenger-style dots) ─── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <BotAvatar size="sm" />
      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm border border-slate-100">
        <div className="flex items-center gap-1">
          <motion.span
            className="block h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="block h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="block h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Bot Avatar ─── */
function BotAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  return (
    <div className={`${dims} shrink-0 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 ring-2 ring-white`}>
      <Bot className={size === "sm" ? "h-3.5 w-3.5 text-white" : "h-4.5 w-4.5 text-white"} />
    </div>
  );
}

/* ─── Message Bubble ─── */
function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isModel = message.role === "model";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-end gap-2.5 ${isModel ? "justify-start" : "justify-end"}`}
    >
      {isModel && <BotAvatar size="sm" />}

      <div className={`group relative max-w-[82%] ${isModel ? "" : "order-1"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
            isModel
              ? "rounded-bl-md bg-white text-slate-700 shadow-sm border border-slate-100"
              : "rounded-br-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/30"
          }`}
        >
          <div
            className="whitespace-pre-wrap [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        </div>

        {/* Timestamp — show on last message or hover */}
        <div
          className={`mt-1 text-[10px] font-medium transition-opacity ${
            isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } ${isModel ? "text-slate-400 pl-1" : "text-slate-400 text-right pr-1"}`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {/* User "avatar" — initials */}
      {!isModel && (
        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow ring-2 ring-white">
          B
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function ChatbotAI() {
  const { setChatOpen } = useChatOpen();
  const { t, language, isVietnamese } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([isVietnamese ? INITIAL_MESSAGE_VI : INITIAL_MESSAGE_EN]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ─ Scroll hide for FAB ─ */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsVisible(y <= lastScrollY || y < 120);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ─ Auto-scroll on new message ─ */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  /* ─ Focus textarea ─ */
  useEffect(() => {
    if (isOpen && !isMinimized) textareaRef.current?.focus();
  }, [isOpen, isMinimized]);

  /* ─ Escape to close ─ */
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeAssistant();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setChatOpen(true);
  }, [setChatOpen]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setChatOpen(false);
  }, [setChatOpen]);

  const resetConversation = () => {
    setMessages([isVietnamese ? INITIAL_MESSAGE_VI : INITIAL_MESSAGE_EN]);
    setInput("");
    setShowQuickReplies(true);
  };

  /* ─ Send message ─ */
  const sendMessage = async (value?: string) => {
    const nextInput = (value ?? input).trim();
    if (!nextInput || isLoading) return;

    setShowQuickReplies(false);

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: nextInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea back
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: nextInput,
          sessionId: analytics.getSessionId(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || (isVietnamese ? "Không thể kết nối. Vui lòng thử lại!" : "Connection failed. Please try again!"));
      }

      const replyContent = data.content ?? data.response ?? (isVietnamese ? "Mình chưa có câu trả lời phù hợp. Bạn thử hỏi lại cụ thể hơn nhé! 😊" : "I don't have a suitable answer. Try asking more specifically! 😊");

      // Typing delay — giống người thật (1-2.5s dựa theo độ dài)
      const typingDelay = Math.min(800 + replyContent.length * 8, 2500);
      await new Promise((r) => setTimeout(r, typingDelay));

      const modelMessage: Message = {
        id: `${Date.now()}-model`,
        role: "model",
        content: replyContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "model",
          content: error instanceof Error ? error.message : (isVietnamese ? "Kết nối tạm gián đoạn. Thử lại sau ít phút nhé! 🙏" : "Connection interrupted. Try again later! 🙏"),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-24 right-4 z-[110] sm:bottom-20 sm:right-4 lg:bottom-4"
        >
          {/* ═══════ FAB Button ═══════ */}
          {!isOpen && (
            <motion.button
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={openAssistant}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-white/80 transition-shadow hover:shadow-2xl hover:shadow-emerald-500/40"
              aria-label={language === "vi" ? "LIKEFOOD AI - Mở chat" : "LIKEFOOD AI - Open chat"}
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
              {/* Shine */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
              {/* Icon */}
              <Bot className="relative h-6 w-6 text-white drop-shadow" />
              {/* AI badge */}
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow-lg ring-2 ring-white">
                <Zap className="h-2.5 w-2.5 text-amber-900" />
              </div>
            </motion.button>
          )}

          {/* ═══════ Chat Window ═══════ */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeAssistant}
                className="fixed inset-0 z-[109] bg-black/20"
              />

              {/* Chat panel */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="fixed bottom-0 right-0 top-0 z-[110] flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-4 sm:right-4 sm:top-auto sm:h-[600px] sm:w-[400px] sm:rounded-2xl sm:border sm:border-slate-200/80"
              >
                {/* ─── Header ─── */}
                <div className="shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/30">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      {/* Online dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-white tracking-wide">LIKEFOOD AI</p>
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      </div>
                      <p className="text-[11px] text-emerald-100/90 font-medium">
                        {isLoading ? (isVietnamese ? "Đang soạn tin nhắn..." : "Typing...") : (isVietnamese ? "Trực tuyến • Sẵn sàng hỗ trợ" : "Online • Ready to help")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
                        aria-label={isVietnamese ? "Thu nhỏ" : "Minimize"}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={closeAssistant}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
                        aria-label={isVietnamese ? "Đóng" : "Close"}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {isMinimized ? (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-600">{isVietnamese ? "Cuộc trò chuyện đang chờ..." : "Conversation on hold..."}</span>
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      {isVietnamese ? "Mở lại" : "Resume"}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ─── Messages ─── */}
                    <div
                      ref={scrollRef}
                      className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-slate-50 to-white"
                    >
                      {messages.map((msg, idx) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isLast={idx === messages.length - 1 && !isLoading}
                        />
                      ))}

                      {isLoading && <TypingIndicator />}

                      {/* Quick replies — only show at start */}
                      {showQuickReplies && messages.length <= 1 && !isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="pt-2"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 pl-10">
                            {isVietnamese ? "Gợi ý nhanh" : "Quick suggestions"}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pl-10">
                            {(isVietnamese ? QUICK_REPLIES_VI : QUICK_REPLIES_EN).map((qr) => (
                              <button
                                key={qr.text}
                                onClick={() => void sendMessage(qr.text)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm active:scale-95"
                              >
                                <span>{qr.emoji}</span>
                                <span>{qr.text}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* ─── Input Area (Messenger-style) ─── */}
                    <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-2.5">
                      <div className="flex items-end gap-2">
                        {/* Reset button */}
                        <button
                          onClick={resetConversation}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          aria-label={t("chat.newConversation")}
                          title={isVietnamese ? "Cuộc trò chuyện mới" : "New conversation"}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        {/* Input container */}
                        <div className="flex-1 flex items-end rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 transition-colors focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                          <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={isVietnamese ? "Nhắn tin cho LIKEFOOD AI..." : "Message LIKEFOOD AI..."}
                            rows={1}
                            className="flex-1 resize-none border-0 bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 max-h-[120px]"
                            style={{ height: "auto" }}
                          />
                        </div>

                        {/* Send button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => void sendMessage()}
                          disabled={!input.trim() || isLoading}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
                            input.trim() && !isLoading
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50 hover:shadow-lg"
                              : "bg-slate-100 text-slate-300 cursor-not-allowed"
                          }`}
                          aria-label={t("chat.send")}
                        >
                          <ArrowUp className="h-4.5 w-4.5" />
                        </motion.button>
                      </div>

                      {/* Powered by label */}
                      <p className="mt-1.5 text-center text-[9px] font-medium text-slate-300 tracking-wide">
                        Powered by LIKEFOOD AI • Gemini
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
