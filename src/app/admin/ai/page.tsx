"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import { Bot, Loader2, Package, RefreshCw, Send, Sparkles, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface AIInsight {
  type: "success" | "warning" | "info" | "trend";
  title: string;
  description: string;
  metric?: string;
}

interface InventoryForecast {
  productId: string;
  productName: string;
  currentStock: number;
  daysUntilStockout: number;
  recommendedRestock: number;
  confidence: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  totalRevenue: number;
  avgOrderValue: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Cho tôi biết các rủi ro thương mại hàng đầu trong 7 ngày tới.',
  'Tóm tắt phân khúc khách hàng nào phù hợp cho chiến dịch tiếp theo.',
  'Sản phẩm nào cần nhập hàng ngay?',
  'Tôi nên cải thiện gì trên trang sản phẩm tuần này?',
];

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'customers' | 'chat'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [forecasts, setForecasts] = useState<InventoryForecast[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [summary, setSummary] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: 'Tôi có thể tóm tắt rủi ro doanh thu, hành vi khách hàng, cơ hội sản phẩm và các bước vận hành tiếp theo cho nhóm quản trị.' },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, inventoryRes, customersRes, summaryRes] = await Promise.all([
        fetch('/api/ai/admin?type=analytics'),
        fetch('/api/ai/admin?type=inventory'),
        fetch('/api/ai/admin?type=customers'),
        fetch('/api/ai/admin?type=summary'),
      ]);

      const analyticsData = analyticsRes.ok ? await analyticsRes.json() : { insights: [] };
      const inventoryData = inventoryRes.ok ? await inventoryRes.json() : { forecasts: [] };
      const customerData = customersRes.ok ? await customersRes.json() : { segments: [] };
      const summaryData = summaryRes.ok ? await summaryRes.json() : { summary: '' };

      setInsights(Array.isArray(analyticsData.insights) ? analyticsData.insights : []);
      setForecasts(Array.isArray(inventoryData.forecasts) ? inventoryData.forecasts : []);
      setSegments(Array.isArray(customerData.segments) ? customerData.segments : []);
      setSummary(summaryData.summary || '');
    } catch (error) {
      toast.error('Không thể tải tín hiệu AI.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAllData();
  }, []);

  const totals = useMemo(() => ({
    warnings: insights.filter((insight) => insight.type === 'warning').length,
    urgentRestocks: forecasts.filter((item) => item.daysUntilStockout < 7).length,
    totalSegmentRevenue: segments.reduce((sum, segment) => sum + segment.totalRevenue, 0),
  }), [forecasts, insights, segments]);

  const sendMessage = async (prompt?: string) => {
    const message = (prompt ?? input).trim();
    if (!message || isSending) return;

    const userMessage: Message = { id: `${Date.now()}-u`, role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Không thể kết nối với Trợ lý AI quản trị.');
      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, role: 'assistant', content: data.response || 'No response available.' }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể kết nối với Trợ lý AI quản trị.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-zinc-800 bg-[#111113] shadow-[0_18px_70px_rgba(0,0,0,0.5)]">
        <div className="bg-[linear-gradient(135deg,#111827_0%,#0f766e_45%,#1d4ed8_100%)] px-6 py-8 text-white lg:px-8 lg:py-9">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Phân tích AI</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-5xl">Quản lý AI như một nhà vận hành thực thụ</h1>
              <p className="mt-3 text-sm leading-6 text-white/75">Dùng một màn hình để xem AI, tín hiệu nhập hàng, phân khúc khách và trực tiếp hỏi AI quản trị.</p>
            </div>
            <Button variant="outline" size="lg" onClick={() => void loadAllData()} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4" />
              Làm mới dữ liệu AI
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-4">
        <Metric label="Phân tích" value={`${insights.length}`} icon={Sparkles} />
        <Metric label="Cảnh báo" value={`${totals.warnings}`} icon={TrendingUp} />
        <Metric label="Cần nhập hàng" value={`${totals.urgentRestocks}`} icon={Package} />
        <Metric label="Doanh thu phân khúc" value={formatPrice(totals.totalSegmentRevenue)} icon={Users} />
      </div>

      <div className="flex flex-wrap gap-2 rounded-full border border-zinc-800 bg-[#111113] p-1">
        {[
          { id: 'overview', label: 'Tổng quan' },
          { id: 'inventory', label: 'AI Kho hàng' },
          { id: 'customers', label: 'AI Khách hàng' },
          { id: 'chat', label: 'Trò chuyện AI' },
        ].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${activeTab === tab.id ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-6 lg:p-8"><h2 className="text-2xl font-black tracking-tight text-zinc-100">Tóm tắt điều hành</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">{summary || 'Chưa có tóm tắt.'}</p></CardContent></Card>
          <Card className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-6 lg:p-8"><h2 className="text-2xl font-black tracking-tight text-zinc-100">Gợi ý hành động</h2><div className="mt-6 space-y-3">{insights.length === 0 ? <p className="text-sm text-zinc-500">Chưa có phân tích AI.</p> : insights.map((insight) => <div key={insight.title} className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900/50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-zinc-100">{insight.title}</p><p className="mt-2 text-sm leading-6 text-zinc-400">{insight.description}</p></div><span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${insight.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>{insight.metric || insight.type}</span></div></div>)}</div></CardContent></Card>
        </div>
      ) : null}

      {activeTab === 'inventory' ? (
        <Card className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-6 lg:p-8"><h2 className="text-2xl font-black tracking-tight text-zinc-100">Dự báo tồn kho</h2><div className="mt-6 space-y-3">{forecasts.length === 0 ? <p className="text-sm text-zinc-500">Chưa có dữ liệu dự báo.</p> : forecasts.map((item) => <div key={item.productId} className="flex flex-col gap-3 rounded-[1.5rem] border border-zinc-800 bg-zinc-900/50 p-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-black text-zinc-100">{item.productName}</p><p className="mt-1 text-sm text-zinc-400">Tồn kho {item.currentStock} · Đề xuất nhập {item.recommendedRestock}</p></div><div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${item.daysUntilStockout < 7 ? 'bg-rose-500/20 text-rose-400' : item.daysUntilStockout < 14 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>Còn {item.daysUntilStockout} ngày</span><span className="rounded-full bg-zinc-800 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400">{Math.round(item.confidence * 100)}% độ tin cậy</span></div></div>)}</div></CardContent></Card>
      ) : null}

      {activeTab === 'customers' ? (
        <div className="grid gap-4 lg:grid-cols-4">{segments.length === 0 ? <Card className="lg:col-span-4 rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-8 text-sm text-zinc-500">Chưa có dữ liệu phân khúc khách hàng.</CardContent></Card> : segments.map((segment) => <Card key={segment.segment} className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-6"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{segment.segment}</p><p className="mt-2 text-3xl font-black text-zinc-100">{segment.count}</p><p className="mt-2 text-sm text-zinc-400">Doanh thu {formatPrice(segment.totalRevenue)}</p><p className="mt-1 text-sm text-zinc-500">Giá TB {formatPrice(segment.avgOrderValue)}</p></CardContent></Card>)}</div>
      ) : null}

      {activeTab === 'chat' ? (
        <Card className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-6 lg:p-8"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-teal-600 text-white"><Bot className="h-5 w-5" /></div><div><h2 className="text-2xl font-black tracking-tight text-zinc-100">Trợ lý AI quản trị</h2><p className="mt-1 text-sm text-zinc-400">Hỏi để đưa ra quyết định, bước tiếp theo hoặc tóm tắt dựa trên dữ liệu cửa hàng hiện tại.</p></div></div><div className="mt-6 flex flex-wrap gap-2">{QUICK_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} className="rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100">{prompt}</button>)}</div><div className="mt-6 space-y-3 rounded-[1.75rem] border border-zinc-800 bg-zinc-900/50 p-4">{messages.map((message) => <div key={message.id} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'border border-zinc-700 bg-zinc-800/50 text-zinc-200' : 'bg-teal-600 text-white'}`}>{message.content}</div></div>)}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={4} className="min-h-[120px] flex-1 rounded-[1.5rem] border border-zinc-700 bg-zinc-900 px-4 py-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500" placeholder="Hỏi AI quản trị cần ưu tiên gì tiếp theo..." /><Button size="lg" onClick={() => void sendMessage()} disabled={isSending || !input.trim()}>{isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Gửi</Button></div></CardContent></Card>
      ) : null}
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Sparkles }) {
  return <Card className="rounded-[2rem] border border-zinc-800 bg-[#111113]"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p><p className="mt-2 text-3xl font-black text-zinc-100">{value}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-zinc-800 text-zinc-400"><Icon className="h-5 w-5" /></div></div></CardContent></Card>;
}
