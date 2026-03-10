/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Maximize2, Minimize2, RefreshCw, Send, Sparkles, TrendingUp, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DashboardSnapshot {
  revenue: number;
  orders: number;
  customers: number;
  topProduct?: string;
  summary?: string;
}

const QUICK_PROMPTS = [
  "What should the admin team fix first this week?",
  "Which products are most likely to need restocking next?",
  "Summarize the biggest revenue risks right now.",
  "What should we improve in the customer experience next?",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "I can help you read store signals, prioritize work, and turn admin data into clear next steps.",
  timestamp: new Date(),
};

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>({ revenue: 0, orders: 0, customers: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSnapshot = async () => {
    setIsLoadingSnapshot(true);
    try {
      const [dashboardRes, summaryRes] = await Promise.all([
        fetch("/api/analytics/dashboard"),
        fetch("/api/ai/admin?type=summary"),
      ]);

      const dashboardData = dashboardRes.ok ? await dashboardRes.json() : null;
      const summaryData = summaryRes.ok ? await summaryRes.json() : null;

      setSnapshot({
        revenue: dashboardData?.revenue?.total || 0,
        orders: dashboardData?.orders?.total || 0,
        customers: dashboardData?.customers?.total || 0,
        topProduct: dashboardData?.topProducts?.[0]?.name,
        summary: summaryData?.summary || "",
      });
    } catch (error) {
      console.error("Failed to load admin AI snapshot:", error);
      setSnapshot({ revenue: 0, orders: 0, customers: 0, summary: "" });
    } finally {
      setIsLoadingSnapshot(false);
    }
  };

  useEffect(() => {
    void loadSnapshot();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending, isOpen, isMinimized]);

  const summaryPreview = useMemo(() => {
    if (!snapshot.summary) return "No AI summary loaded yet.";
    return snapshot.summary;
  }, [snapshot.summary]);

  const sendMessage = async (prompt?: string) => {
    const message = (prompt ?? input).trim();
    if (!message || isSending) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message,
          context: {
            recentOrders: snapshot.orders,
            totalCustomers: snapshot.customers,
            totalRevenue: snapshot.revenue,
            topProducts: snapshot.topProduct ? [snapshot.topProduct] : [],
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to reach the admin AI assistant.");
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: data.response || "No answer was returned.",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-fallback`,
          role: "assistant",
          content: error instanceof Error ? error.message : "The admin AI assistant is temporarily unavailable.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[calc(100vw-2rem)] max-w-[430px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_45%,#1d4ed8_100%)] px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-white/12 ring-1 ring-white/15 backdrop-blur">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
                      <Sparkles className="h-3.5 w-3.5" />
                      Admin copilot
                    </div>
                    <h3 className="mt-1 text-xl font-black tracking-tight">AI operator panel</h3>
                    <p className="mt-1 text-sm leading-6 text-white/75">Store-aware guidance for revenue, customers, inventory, and next actions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMinimized((current) => !current)}
                    className="rounded-full border border-white/15 bg-white/10 p-2 text-white/85 transition hover:bg-white/15"
                    aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-white/15 bg-white/10 p-2 text-white/85 transition hover:bg-white/15"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {isMinimized ? (
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <p className="text-sm text-slate-600">The admin copilot is ready when you need the next decision.</p>
                <Button size="sm" onClick={() => setIsMinimized(false)}>Expand</Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Live admin context</p>
                      <p className="mt-1 text-sm text-slate-500">Pulled from dashboard and AI summary endpoints.</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => void loadSnapshot()} disabled={isLoadingSnapshot}>
                      {isLoadingSnapshot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Metric label="Revenue" value={formatPrice(snapshot.revenue)} icon={TrendingUp} />
                    <Metric label="Orders" value={`${snapshot.orders}`} icon={Sparkles} />
                    <Metric label="Customers" value={`${snapshot.customers}`} icon={Users} />
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">AI summary</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{summaryPreview}</p>
                    {snapshot.topProduct ? <p className="mt-3 text-xs font-semibold text-slate-500">Top product right now: {snapshot.topProduct}</p> : null}
                  </div>
                </div>

                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div ref={scrollRef} className="max-h-[340px] space-y-4 overflow-y-auto bg-white px-5 py-5">
                  {messages.map((message) => {
                    const isAssistant = message.role === "assistant";
                    return (
                      <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm ${isAssistant ? "border border-slate-200 bg-slate-50 text-slate-700" : "bg-slate-950 text-white"}`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`mt-2 text-[11px] font-black uppercase tracking-[0.16em] ${isAssistant ? "text-slate-400" : "text-white/55"}`}>
                            {isAssistant ? "AI" : "You"} · {message.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {isSending ? (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking through the store data...
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-slate-200 bg-white px-5 py-4">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-3">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      rows={4}
                      placeholder="Ask what to prioritize next, what is blocking growth, or which admin area needs attention."
                      className="min-h-[110px] w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">Grounded in current admin metrics when available.</p>
                      <Button onClick={() => void sendMessage()} disabled={!input.trim() || isSending} className="rounded-full">
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="pointer-events-auto overflow-hidden rounded-[1.9rem] border border-slate-200 bg-[linear-gradient(135deg,#111827_0%,#0f766e_45%,#1d4ed8_100%)] px-5 py-4 text-left text-white shadow-[0_18px_60px_rgba(15,23,42,0.24)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white/12 ring-1 ring-white/15 backdrop-blur">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">AI operator</p>
            <p className="mt-1 text-base font-black tracking-tight">Open admin copilot</p>
            <p className="mt-1 text-sm text-white/72">Revenue, customers, inventory, and action planning in one panel.</p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Sparkles }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
