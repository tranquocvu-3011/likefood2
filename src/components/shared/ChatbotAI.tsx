"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatOpen } from "@/contexts/ChatOpenContext";
import { analytics } from "@/lib/analytics/sdk";
import { useLanguage } from "@/lib/i18n/context";
import {
  ArrowUp,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "initial",
  role: "model",
  content:
    "Xin chào! Mình là **LIKEFOOD AI** - trợ lý thông minh của cửa hàng. Mình có thể:\n\n• Gợi ý sản phẩm phù hợp với nhu cầu của bạn\n• Giải đáp về chính sách giao hàng, đổi trả\n• Hướng dẫn theo dõi đơn hàng\n• Tư vấn quà biếu, combo tiết kiệm\n\nBạn cần hỗ trợ gì ạ?",
  timestamp: new Date(),
};

const SUGGESTED_PROMPTS = [
  "Tôi muốn mua trà / cà phê đặc sản",
  "Gợi ý quà biếu đặc sản Việt cho gia đình ở Mỹ",
  "Phí giao hàng và mức freeship hiện tại là gì?",
  "Tôi cần đồ ăn vặt gọn nhẹ để mang đi làm",
  "Hướng dẫn theo dõi đơn hàng sau khi thanh toán",
];

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatbotAI() {
  const { setChatOpen } = useChatOpen();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      textareaRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setIsMinimized(false);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, setChatOpen]);

  const openAssistant = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setChatOpen(true);
  };

  const closeAssistant = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setChatOpen(false);
  };

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  const sendMessage = async (value?: string) => {
    const nextInput = (value ?? input).trim();
    if (!nextInput || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: nextInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: nextInput,
          sessionId: analytics.getSessionId(),
          history: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Không thể kết nối trợ lý AI.");
      }

      const modelMessage: Message = {
        id: `${Date.now()}-model`,
        role: "model",
        content: data.content ?? data.response ?? "Mình chưa có câu trả lời phù hợp. Bạn thử đặt câu hỏi cụ thể hơn nhé!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: `${Date.now()}-error`,
        role: "model",
        content:
          error instanceof Error
            ? error.message
            : "Trợ lý AI đang tạm thời gián đoạn. Bạn thử lại sau ít phút nhé!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-20 right-4 z-[110] sm:bottom-6 sm:right-5 lg:bottom-8 lg:right-6"
        >
          {!isOpen && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={openAssistant}
              className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/50 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/25 sm:h-[3.5rem] sm:w-[3.5rem]"
              aria-label={language === "vi" ? "Mở trợ lý AI" : "Open AI assistant"}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow">
                <Sparkles className="h-2.5 w-2.5 text-amber-900" />
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/20">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
            </motion.button>
          )}

          {isOpen && (
            <>
              {/* Lớp nền mờ nhẹ xung quanh — bấm để đóng */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="button"
                tabIndex={0}
                onClick={closeAssistant}
                className="fixed inset-0 z-[109] bg-slate-900/25 backdrop-blur-md cursor-default"
                aria-label="Đóng chat (bấm ra ngoài)"
              />
              {/* Card toàn màn hình */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-[110] flex flex-col overflow-hidden bg-white shadow-2xl"
              >
              <div className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 px-4 py-3.5 sm:px-6 shadow-sm">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 shadow-lg ring-2 ring-white">
                    <span className="text-sm font-bold text-white drop-shadow-sm">AI</span>
                    <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 shadow">
                      <Sparkles className="h-2.5 w-2.5 text-amber-900" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold tracking-tight text-slate-800">LIKEFOOD AI</p>
                    <p className="text-[11px] text-slate-500">Trợ lý AI thông minh · Hỗ trợ 24/7</p>
                  </div>
                  <div className="flex items-center gap-1">
                    
                    <button
                      type="button"
                      onClick={closeAssistant}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label="Đóng trợ lý AI"
                    >
                      {t("chat.close")}
                    </button>
                  </div>
                </div>
              </div>

              {isMinimized ? (
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    {t("chat.conversationReady")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(false)}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    {t("chat.openAgain")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="shrink-0 border-b border-slate-100 px-3 py-2.5 sm:px-4">
                    <div className="mx-auto flex max-w-3xl flex-wrap gap-1.5">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium leading-snug text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/80 px-4 py-4 sm:px-6">
                    <div className="mx-auto max-w-3xl">
                    {messages.map((message) => {
                      const isModel = message.role === "model";
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md sm:max-w-xl ${
                              isModel
                                ? "border border-slate-200 bg-white text-slate-700 ring-1 ring-slate-100"
                                : "bg-gradient-to-br from-slate-800 to-slate-900 text-white ring-1 ring-slate-700/50"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-6">{message.content}</div>
                            <div
                              className={`mt-2 text-xs font-medium text-slate-500 ${
                                isModel ? "text-slate-400" : "text-white/60"
                              }`}
                            >
                              {isModel ? "AI" : "Bạn"} · {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-md flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {t("chat.processing")}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
                    <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-inner">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("chat.placeholder")}
                        rows={2}
                        className="min-h-[48px] max-h-32 w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={resetConversation}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                        >
                          <RotateCcw className="h-4 w-4" />
                          {t("chat.newConversation")}
                        </button>
                        <button
                          type="button"
                          onClick={() => void sendMessage()}
                          disabled={!input.trim() || isLoading}
                          className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-800 px-5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("chat.send")}
                          <ArrowUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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


