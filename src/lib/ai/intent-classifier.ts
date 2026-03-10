/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

export type Intent =
  | "PRODUCT_SEARCH"
  | "PRODUCT_DETAILS"
  | "ORDER_STATUS"
  | "SHIPPING_INQUIRY"
  | "PAYMENT_HELP"
  | "RETURN_REFUND"
  | "ACCOUNT_HELP"
  | "PROMOTION_INQUIRY"
  | "COMPLAINT"
  | "GENERAL_QUESTION"
  | "RECOMMENDATION_REQUEST"
  | "ORDER_PLACING"
  | "GREETING"
  | "THANKS"
  | "UNKNOWN";

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Record<string, string>;
  suggestedProducts?: string[];
  nextAction?: string;
}

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  PRODUCT_SEARCH: [
    "co ban",
    "muon mua",
    "mua",
    "tim",
    "can mua",
    "can tim",
    "search",
    "looking for",
    "where to buy",
    "san pham",
    "shop",
    "cho toi",
    "cho minh",
    "can mua",
    "order",
    "purchase",
    "buy",
    "find",
    "co khong",
    "ban khong",
    "có không",
    "còn không",
  ],
  PRODUCT_DETAILS: [
    "thanh phan",
    "cach dung",
    "bao nhieu",
    "xuat xu",
    "ingredients",
    "nutrition",
    "weight",
    "expiry",
    "price",
    "gia",
  ],
  ORDER_STATUS: [
    "don hang",
    "giao chua",
    "theo doi",
    "order status",
    "tracking",
    "ma don",
    "order number",
    "khi nao giao",
  ],
  SHIPPING_INQUIRY: [
    "ship",
    "giao hang",
    "bao lau",
    "shipping",
    "delivery",
    "van chuyen",
    "phi ship",
    "free ship",
    "mien phi",
  ],
  PAYMENT_HELP: [
    "thanh toan",
    "cod",
    "chuyen khoan",
    "payment",
    "visa",
    "mastercard",
    "bank transfer",
    "the",
  ],
  RETURN_REFUND: [
    "doi tra",
    "hoan tien",
    "return",
    "refund",
    "bao hanh",
    "san pham loi",
    "problem",
    "issue",
  ],
  ACCOUNT_HELP: [
    "dang nhap",
    "tai khoan",
    "password",
    "login",
    "register",
    "forgot password",
    "verify",
  ],
  PROMOTION_INQUIRY: [
    "giam gia",
    "khuyen mai",
    "coupon",
    "voucher",
    "points",
    "sale",
    "discount",
    "promo",
    "flash sale",
  ],
  COMPLAINT: [
    "khieu nai",
    "phan nan",
    "khong hai long",
    "problem",
    "issue",
    "bad",
    "poor",
    "broken",
    "wrong",
    "delay",
  ],
  GENERAL_QUESTION: [
    "cau hoi",
    "information",
    "what is",
    "how does",
    "gioi thieu",
    "about",
    "policy",
    "help",
  ],
  RECOMMENDATION_REQUEST: [
    "goi y",
    "gợi ý",
    "recommend",
    "suggestion",
    "nen mua",
    "nên mua",
    "best",
    "top",
    "popular",
    "favorite",
    "phu hop",
    "phù hợp",
    "nao ngon",
    "nào ngon",
    "dang hot",
    "ban chay",
    "bán chạy",
  ],
  ORDER_PLACING: [
    "dat hang",
    "mua ngay",
    "checkout",
    "buy now",
    "gio hang",
    "cart",
    "add to cart",
    "them vao gio",
  ],
  GREETING: [
    "xin chao",
    "hello",
    "hi",
    "good morning",
    "good afternoon",
    "hey",
    "greetings",
  ],
  THANKS: [
    "cam on",
    "thank",
    "thanks",
    "thank you",
    "appreciate",
  ],
  UNKNOWN: [],
};

const CATEGORY_KEYWORDS = [
  "ca kho",
  "tom",
  "muc",
  "bo kho",
  "gia vi",
  "tra",
  "trà",
  "che",
  "banh",
  "bánh",
  "mut",
  "mứt",
  "trai cay",
  "trái cây",
  "snack",
  "an vat",
  "do an vat",
  "do uong",
  "đồ uống",
  "qua bieu",
  "quà biếu",
  "qua tang",
  "dried",
  "seafood",
  "spice",
  "tea",
  "coffee",
  "nuoc mam",
  "nước mắm",
  "tuong",
  "tương",
  "hat",
  "hạt",
  "keo",
  "kẹo",
  "socola",
  "chocolate",
  "com",
  "cơm",
  "bun",
  "bún",
  "pho",
  "phở",
  "cha",
  "chả",
  "xoai",
  "xoài",
  "mang",
  "măng",
  "nam",
  "nấm",
  "kho",
  "khô",
  "say",
  "sấy",
  "deo",
  "dẻo",
];

const LOCATION_KEYWORDS = [
  "california",
  "new york",
  "texas",
  "florida",
  "washington",
  "usa",
  "us",
  "my",
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

function detectIntentByRules(message: string): { intent: Intent; confidence: number } {
  const normalizedMessage = normalizeText(message);
  let bestIntent: Intent = "UNKNOWN";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [Intent, string[]][]) {
    if (intent === "UNKNOWN") continue;

    let score = 0;
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword)) {
        score += 1;
      }
      if (normalizedMessage === keyword) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  const entities = extractEntities(message);
  if (bestIntent === "UNKNOWN" && entities.category && normalizedMessage.length <= 50) {
    bestIntent = "PRODUCT_SEARCH";
    bestScore = Math.max(bestScore, 2);
  }

  return {
    intent: bestIntent,
    confidence: bestScore > 0 ? Math.min(bestScore / 3, 1) : 0,
  };
}

function extractEntities(message: string): Record<string, string> {
  const entities: Record<string, string> = {};
  const normalizedMessage = normalizeText(message);

  for (const category of CATEGORY_KEYWORDS) {
    if (normalizedMessage.includes(category)) {
      entities.category = category;
      break;
    }
  }

  if (
    normalizedMessage.includes("gia") ||
    normalizedMessage.includes("price") ||
    normalizedMessage.includes("bao nhieu") ||
    normalizedMessage.includes("cost")
  ) {
    entities.priceInquiry = "true";
  }

  for (const location of LOCATION_KEYWORDS) {
    if (normalizedMessage.includes(location)) {
      entities.location = location;
      break;
    }
  }

  if (
    normalizedMessage.includes("bao lau") ||
    normalizedMessage.includes("how long") ||
    normalizedMessage.includes("khi nao")
  ) {
    entities.timeInquiry = "true";
  }

  const orderMatch = message.match(/(?:don|order|ma|#)\s*[:.]?\s*([A-Z0-9-]+)/i);
  if (orderMatch?.[1]) {
    entities.orderNumber = orderMatch[1];
  }

  return entities;
}

function getNextAction(intent: Intent): string | undefined {
  const actions: Record<Intent, string> = {
    PRODUCT_SEARCH: "Recommend matching products",
    PRODUCT_DETAILS: "Share product details and usage guidance",
    ORDER_STATUS: "Help the shopper review order status",
    SHIPPING_INQUIRY: "Explain shipping speed and cost",
    PAYMENT_HELP: "Explain available payment options",
    RETURN_REFUND: "Explain return and refund steps",
    ACCOUNT_HELP: "Help with account access or reset",
    PROMOTION_INQUIRY: "Highlight active deals and coupons",
    COMPLAINT: "Collect context and route to support",
    GENERAL_QUESTION: "Answer or redirect to the relevant policy",
    RECOMMENDATION_REQUEST: "Suggest products based on needs",
    ORDER_PLACING: "Guide the shopper toward checkout",
    GREETING: "Welcome the shopper and surface common intents",
    THANKS: "Acknowledge and keep the conversation open",
    UNKNOWN: "Ask a clarifying follow-up question",
  };

  return actions[intent];
}

export function classifyIntent(message: string): IntentResult {
  const { intent, confidence } = detectIntentByRules(message);
  const entities = extractEntities(message);

  return {
    intent: confidence > 0.2 ? intent : "UNKNOWN",
    confidence,
    entities,
    nextAction: getNextAction(intent),
  };
}

export function getIntentDisplayName(intent: Intent, lang: "vi" | "en"): string {
  const names: Record<Intent, { vi: string; en: string }> = {
    PRODUCT_SEARCH: { vi: "Tim san pham", en: "Product search" },
    PRODUCT_DETAILS: { vi: "Chi tiet san pham", en: "Product details" },
    ORDER_STATUS: { vi: "Trang thai don hang", en: "Order status" },
    SHIPPING_INQUIRY: { vi: "Van chuyen", en: "Shipping inquiry" },
    PAYMENT_HELP: { vi: "Thanh toan", en: "Payment help" },
    RETURN_REFUND: { vi: "Doi tra hoan tien", en: "Return or refund" },
    ACCOUNT_HELP: { vi: "Tai khoan", en: "Account help" },
    PROMOTION_INQUIRY: { vi: "Khuyen mai", en: "Promotion inquiry" },
    COMPLAINT: { vi: "Khieu nai", en: "Complaint" },
    GENERAL_QUESTION: { vi: "Cau hoi chung", en: "General question" },
    RECOMMENDATION_REQUEST: { vi: "Yeu cau goi y", en: "Recommendation request" },
    ORDER_PLACING: { vi: "Dat hang", en: "Order placing" },
    GREETING: { vi: "Chao hoi", en: "Greeting" },
    THANKS: { vi: "Cam on", en: "Thanks" },
    UNKNOWN: { vi: "Chua ro", en: "Unknown" },
  };

  return names[intent][lang];
}
