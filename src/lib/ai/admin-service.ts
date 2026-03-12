"use server";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { getGeminiModel } from "@/lib/ai/gemini-runtime";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  soldCount: number;
  inventory: number;
  ratingAvg: number;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  segment: string;
}

interface AIInsight {
  type: "success" | "warning" | "info" | "trend";
  title: string;
  description: string;
  metric?: string;
  action?: string;
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function detectAdminLanguage(text: string): "vi" | "en" {
  const normalized = ` ${text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/gi, "d")} `;
  const vietnameseSignals = [" doanh thu ", " khach hang ", " san pham ", " ton kho ", " chien luoc ", " don hang "];
  return vietnameseSignals.some((signal) => normalized.includes(signal)) ? "vi" : "en";
}

function getTopicFallback(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes("revenue") || lower.includes("doanh thu")) {
    return "Revenue looks stable enough to review conversion drivers, best-selling products, and any recent pricing shifts before changing strategy.";
  }
  if (lower.includes("inventory") || lower.includes("ton kho")) {
    return "Inventory attention should go first to fast-moving products with less than two weeks of stock cover.";
  }
  if (lower.includes("customer") || lower.includes("khach hang")) {
    return "Customer analysis should focus on repeat buyers, dormant high-value users, and the segment with the best reorder potential.";
  }
  return "The current signal is usable, but the next best step is to compare revenue, inventory pressure, and customer quality before taking action.";
}

async function askGemini(prompt: string, fallback: string): Promise<string> {
  const model = await getGeminiModel({ model: "gemini-2.0-flash", temperature: 0.6, maxOutputTokens: 1600, topP: 0.9, topK: 40 });
  if (!model) return fallback;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || fallback;
  } catch (error) {
    console.error("[AI_ADMIN] Gemini error:", error);
    return fallback;
  }
}

export async function getAIAnalyticsInsights(salesData: SalesData[]): Promise<AIInsight[]> {
  if (!salesData.length) {
    return [{
      type: "info",
      title: "No analytics window yet",
      description: "The selected date range does not have enough finished orders to produce meaningful AI signals.",
    }];
  }

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recent = salesData.slice(-7);
  const previous = salesData.slice(-14, -7);
  const recentAverage = recent.reduce((sum, day) => sum + day.revenue, 0) / Math.max(recent.length, 1);
  const previousAverage = previous.reduce((sum, day) => sum + day.revenue, 0) / Math.max(previous.length, 1);
  const trend = previousAverage > 0 ? ((recentAverage - previousAverage) / previousAverage) * 100 : 0;
  const peakDay = salesData.reduce((winner, day) => (day.revenue > winner.revenue ? day : winner), salesData[0]);

  const insights: AIInsight[] = [
    {
      type: trend >= 0 ? "success" : "warning",
      title: trend >= 0 ? "Revenue trend is positive" : "Revenue trend is under pressure",
      description:
        trend >= 0
          ? `Revenue over the last 7 days is up ${trend.toFixed(1)}% versus the prior 7-day window.`
          : `Revenue over the last 7 days is down ${Math.abs(trend).toFixed(1)}% versus the prior 7-day window.`,
      metric: `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`,
    },
    {
      type: "info",
      title: "Average order value",
      description: `The current average order value sits at ${formatCurrency(averageOrderValue)}.`,
      metric: formatCurrency(averageOrderValue),
    },
    {
      type: "trend",
      title: "Strongest sales day",
      description: `${peakDay.date} produced the highest revenue in the selected range.`,
      metric: formatCurrency(peakDay.revenue),
    },
  ];

  if (recentAverage < previousAverage && averageOrderValue < 75) {
    insights.push({
      type: "warning",
      title: "Basket size needs attention",
      description: "Revenue is softening while average order value remains modest. Consider bundles or threshold-based incentives.",
      action: "Review merchandising and cart incentives",
    });
  }

  return insights;
}

export async function getAIInventoryForecast(products: ProductData[]): Promise<InventoryForecast[]> {
  return products
    .map((product) => {
      const dailySalesRate = product.soldCount > 0 ? product.soldCount / 30 : 0;
      const daysUntilStockout = dailySalesRate > 0 ? Math.max(Math.floor(product.inventory / dailySalesRate), 0) : 999;
      const recommendedRestock = dailySalesRate > 0 ? Math.ceil(dailySalesRate * 45) : Math.max(product.inventory, 10);

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.inventory,
        daysUntilStockout,
        recommendedRestock,
        confidence: dailySalesRate > 0 ? 0.82 : 0.45,
      };
    })
    .sort((left, right) => left.daysUntilStockout - right.daysUntilStockout);
}

export async function getAICustomerInsights(customers: CustomerData[]): Promise<CustomerSegment[]> {
  const segments = new Map<string, CustomerSegment>();

  for (const customer of customers) {
    const segment = customer.totalSpent >= 500
      ? "VIP"
      : customer.totalSpent >= 200
        ? "Premium"
        : customer.totalSpent >= 100
          ? "Regular"
          : "New";

    const current = segments.get(segment) ?? {
      segment,
      count: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    };

    current.count += 1;
    current.totalRevenue += customer.totalSpent;
    current.avgOrderValue = current.count > 0 ? current.totalRevenue / current.count : 0;
    segments.set(segment, current);
  }

  return Array.from(segments.values()).sort((left, right) => right.totalRevenue - left.totalRevenue);
}

export async function getAIProductRecommendations(products: ProductData[], limit = 5): Promise<ProductData[]> {
  return products
    .map((product) => ({
      ...product,
      score: product.soldCount * 0.35 + product.ratingAvg * 18 + (product.inventory > 10 ? 10 : 0),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export async function getAIContentAnalysis(content: string): Promise<string> {
  const prompt = [
    "You are reviewing ecommerce copy for LIKEFOOD.",
    "Give a concise review with three parts: strengths, weaknesses, and next edit.",
    "Keep it under 120 words.",
    "Content:",
    content,
  ].join("\n\n");

  return askGemini(prompt, getTopicFallback("content"));
}

export async function generateMarketingEmail(
  type: "welcome" | "promotion" | "abandoned_cart" | "order_confirm",
  context?: Record<string, string>
): Promise<string> {
  const promptMap: Record<string, string> = {
    welcome: "Write a warm welcome email for a new LIKEFOOD customer.",
    promotion: `Write a promotional email for LIKEFOOD. Include the offer ${context?.discount || "only if it is confirmed"}.`,
    abandoned_cart: "Write a calm abandoned cart email for LIKEFOOD that reminds the shopper of value without sounding pushy.",
    order_confirm: `Write an order confirmation email for LIKEFOOD using order reference ${context?.orderId || "the customer's order number"}.`,
  };

  const prompt = [
    promptMap[type] || promptMap.welcome,
    "Use a structured ecommerce email with subject line, preview text, body, and one main CTA.",
    "Keep details factual and do not invent discounts or shipping promises.",
  ].join("\n\n");

  return askGemini(prompt, "Subject: LIKEFOOD update\n\nPreview: Your latest update from LIKEFOOD.\n\nBody: Thank you for shopping with LIKEFOOD. We are sharing the next step for your account or order.\n\nCTA: Open LIKEFOOD");
}

export async function getAISEOSuggestions(
  productName: string,
  category: string,
  currentDescription: string
): Promise<{ title: string; description: string; keywords: string[] }> {
  const fallback = {
    title: `${productName} | Vietnamese Specialty Food`,
    description: `Shop ${productName} from LIKEFOOD with clear pricing, fast delivery details, and a focused specialty food experience.`,
    keywords: [productName, category, "Vietnamese specialty food", "LIKEFOOD", "shop online"],
  };

  const prompt = [
    "You are an SEO strategist for an ecommerce product page.",
    `Product: ${productName}`,
    `Category: ${category}`,
    `Current description: ${currentDescription}`,
    "Return exactly three lines:",
    "TITLE: ...",
    "DESCRIPTION: ...",
    "KEYWORDS: keyword 1, keyword 2, keyword 3, keyword 4, keyword 5",
  ].join("\n");

  const text = await askGemini(prompt, `TITLE: ${fallback.title}\nDESCRIPTION: ${fallback.description}\nKEYWORDS: ${fallback.keywords.join(", ")}`);
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const descriptionMatch = text.match(/DESCRIPTION:\s*(.+)/i);
  const keywordsMatch = text.match(/KEYWORDS:\s*(.+)/i);

  return {
    title: titleMatch?.[1]?.trim() || fallback.title,
    description: descriptionMatch?.[1]?.trim() || fallback.description,
    keywords: keywordsMatch?.[1]?.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 5) || fallback.keywords,
  };
}

export async function getAIPricingStrategy(
  product: ProductData,
  competitors: { name: string; price: number }[]
): Promise<{ recommendedPrice: number; strategy: string; reasoning: string }> {
  const averageCompetitorPrice = competitors.reduce((sum, competitor) => sum + competitor.price, 0) / Math.max(competitors.length, 1);

  if (product.price > averageCompetitorPrice * 1.2) {
    return {
      recommendedPrice: Math.round(averageCompetitorPrice * 0.95 * 100) / 100,
      strategy: "Reduce price",
      reasoning: "The current price sits materially above the competitive set. A moderate reduction should improve conversion without forcing a discount war.",
    };
  }

  if (product.price < averageCompetitorPrice * 0.8) {
    return {
      recommendedPrice: Math.round(product.price * 1.08 * 100) / 100,
      strategy: "Lift price slightly",
      reasoning: "The product is priced well below the market. A modest increase can protect margin while remaining competitive.",
    };
  }

  return {
    recommendedPrice: Math.round(product.price * 100) / 100,
    strategy: "Hold current price",
    reasoning: "The product is already positioned close to the market average. Focus on merchandising and review quality before repricing.",
  };
}

export async function getAISummary(data: {
  revenue?: number;
  orders?: number;
  customers?: number;
  period?: string;
}): Promise<string> {
  const fallback = [
    `- Revenue snapshot: ${formatCurrency(data.revenue || 0)}`,
    `- Order volume: ${data.orders || 0}`,
    `- Customer count: ${data.customers || 0}`,
  ].join("\n");

  const prompt = [
    "Summarize store performance for an admin operator.",
    `Period: ${data.period || "current period"}`,
    `Revenue: ${formatCurrency(data.revenue || 0)}`,
    `Orders: ${data.orders || 0}`,
    `Customers: ${data.customers || 0}`,
    "Return exactly three bullet points with practical takeaways.",
  ].join("\n");

  return askGemini(prompt, fallback);
}

export async function getAIChatResponse(
  message: string,
  context?: {
    recentOrders?: number;
    totalCustomers?: number;
    totalRevenue?: number;
    topProducts?: string[];
  }
): Promise<string> {
  const language = detectAdminLanguage(message);
  const contextLines = [
    context?.recentOrders !== undefined ? `Recent orders (7d): ${context.recentOrders}` : "",
    context?.totalCustomers !== undefined ? `Total customers: ${context.totalCustomers}` : "",
    context?.totalRevenue !== undefined ? `Total revenue: ${formatCurrency(context.totalRevenue)}` : "",
    context?.topProducts?.length ? `Top products:\n- ${context.topProducts.join("\n- ")}` : "",
  ].filter(Boolean).join("\n");

  const prompt = [
    "You are the admin operations copilot for LIKEFOOD.",
    language === "vi"
      ? "Tra loi bang tieng Viet, ro rang, ngan gon, va thuc te."
      : "Reply in English, clearly, briefly, and practically.",
    "Your job is to help the admin prioritize actions, interpret signals, and decide what to do next.",
    "Do not invent data. If information is missing, say what is missing and suggest the next check.",
    "Use short sections or bullets when useful.",
    contextLines ? `Current store context:\n${contextLines}` : "Current store context: no live metrics attached.",
    `Admin request: ${message}`,
  ].join("\n\n");

  return askGemini(prompt, getTopicFallback(message));
}
