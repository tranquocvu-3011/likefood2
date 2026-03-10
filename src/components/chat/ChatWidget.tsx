/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "Hướng dẫn mua hàng trên LIKEFOOD",
  "Chính sách vận chuyển đi các bang tại Mỹ",
  "Các phương thức thanh toán đang hỗ trợ",
  "Gợi ý đặc sản phù hợp làm quà biếu",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào, mình là trợ lý AI của LIKEFOOD. Mình có thể hỗ trợ bạn về sản phẩm đặc sản, cách đặt hàng, vận chuyển và thanh toán. Bạn đang quan tâm điều gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      trackEvent("view_home"); // dùng tạm event đã có cho việc mở chatbot
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setError(null);
    setInput("");

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể gửi tin nhắn. Vui lòng thử lại.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "..." },
      ]);
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
      {/* Nút floating */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-semibold">
            Hỏi LIKEFOOD AI
          </span>
        </button>
      )}

      {/* Hộp chat */}
      {open && (
        <div className="w-[320px] max-w-[90vw] h-[420px] rounded-3xl shadow-2xl bg-white border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div>
              <p className="text-xs font-bold tracking-wide uppercase">
                LIKEFOOD AI
              </p>
              <p className="text-[11px] text-slate-200">
                Trợ lý 24/7 về mua hàng & đặc sản Việt Nam
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto bg-slate-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-slate-900 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  {m.content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Đang soạn trả lời...
              </div>
            )}

            {error && (
              <p className="text-[11px] text-red-500 mt-1">{error}</p>
            )}

            {/* Quick questions */}
            <div className="pt-1 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                Gợi ý nhanh
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="px-2 py-1 rounded-full bg-white text-[11px] border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-100 bg-white px-3 py-2 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 text-[13px] px-3 py-2 rounded-full bg-slate-50 border border-transparent focus:border-slate-300 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

