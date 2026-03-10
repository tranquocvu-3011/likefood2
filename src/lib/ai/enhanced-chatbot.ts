/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyIntent, type Intent } from "./intent-classifier";
import { addMessage, getConversationHistory, getContextSummary, isNewSession, updateEntities } from "./context-manager";
import { getActivePromotions, getCategories, getFlashSaleProducts, getShippingInfo, getTrendingProducts, searchProducts } from "./product-service";
import { assessConfidence, getFallbackResponse, getSafeResponse, shouldEscalate, validateResponse } from "./safety-guard";
import { searchKnowledge } from "./knowledge-base";

interface ChatRequest {
  message: string;
  sessionId: string;
  userId?: string;
}

interface SuggestionItem {
  id: string;
  name: string;
  price?: number;
}

interface SuggestionGroup {
  type: "product" | "category" | "action";
  items: SuggestionItem[];
}

interface ChatResponse {
  message: string;
  intent: string;
  confidence: number;
  language: "vi" | "en";
  suggestions?: SuggestionGroup[];
  shouldEscalate?: boolean;
  isNewUser?: boolean;
}

interface ContextSummary {
  messageCount: number;
  lastIntent?: string;
  language?: "vi" | "en";
  categories?: string[];
}

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens: 500,
      topP: 0.9,
      topK: 32,
    },
  });
}

function detectLanguage(text: string): "vi" | "en" {
  const lower = text.toLowerCase().trim();
  if (!lower) return "vi";
  const hasVietnameseDiacritics = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/u.test(lower);
  if (hasVietnameseDiacritics) return "vi";
  const normalized = ` ${lower.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/gi, "d")} `;
  const vietnameseMarkers = [
    " ban ", " minh ", " toi ", " muon ", " mua ", " tim ", " cho ", " voi ", " cua ",
    " giao hang", " khuyen mai", " don hang", " san pham", " gia vi", " dat hang",
    " bao nhieu", " the nao", " o dau", " khi nao", " co khong", " duoc khong",
    " nhe ", " nha ", " a ", " nhi ", " qua ", " rat ", " lam ", " very ",
    " tra ", " che ", " banh ", " mut ", " qua bieu", " an vat", " do uong",
  ];
  return vietnameseMarkers.some((marker) => normalized.includes(marker)) ? "vi" : "en";
}

function trimProductQuery(message: string): string {
  return message
    .replace(/\b(co ban|muon mua|can mua|mua|tim|can tim|san pham|product|buy|have|recommend|goi y|cho toi|cho minh)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrompt(
  message: string,
  history: string,
  language: "vi" | "en",
  intent: Intent,
  contextSummary: ContextSummary,
  knowledge: string[]
): string {
  const languageInstruction =
    language === "vi"
      ? "Trả lời bằng tiếng Việt. Luôn dùng đầy đủ dấu câu (dấu thanh, dấu hỏi, phẩy, chấm). Giọng tự nhiên như một người thật: thân thiện, ấm áp, ngắn gọn. Dùng 'mình' thay vì 'tôi', 'bạn' đúng chính tả."
      : "Respond in English. Use proper punctuation. Sound natural and warm, like a real person.";

  const contextLine = contextSummary.messageCount > 0
    ? `Conversation history:\n${history || "New conversation."}`
    : "This is the first message in the session.";

  const knowledgeBlock = knowledge.length > 0
    ? `Trusted reference notes:\n${knowledge.join("\n\n")}`
    : "No reference note matched exactly.";

  return [
    "You are LIKEFOOD's friendly shopping assistant for Vietnamese specialty food and gifts in the United States.",
    languageInstruction,
    "Answer in a helpful, modern way. Cover: product suggestions (tea, coffee, dried seafood, spices, snacks, gifts), shipping and delivery, order tracking, payment methods, returns, account help, and promotions.",
    "Rules:",
    "- Use correct punctuation. In Vietnamese always use full diacritics (dấu): á, à, ả, ã, ạ, ă, â, đ, é, è, ế, ề, ệ, í, ì, ỉ, ĩ, ị, ó, ò, ỏ, õ, ọ, ô, ơ, ú, ù, ủ, ũ, ụ, ư, ý, ỳ, ỷ, ỹ, ỵ.",
    "- Keep replies concise: 1–4 sentences. Sound like a real, warm person.",
    "- Do not invent prices, stock levels, or delivery dates. If you don't have data, say so and suggest the next step (e.g. check the website, contact support).",
    "- For product questions: suggest categories (trà, quà biếu, đồ ăn vặt, gia vị...) or how to browse. For order/shipping: direct to Account > Orders or explain general policy.",
    `Detected intent: ${intent}.`,
    contextLine,
    knowledgeBlock,
    `Current message: ${message}`,
  ].join("\n\n");
}

async function generateResponse(prompt: string): Promise<string | null> {
  const model = getGeminiModel();
  if (!model) {
    return null;
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}

async function handleIntent(
  intent: Intent,
  message: string,
  language: "vi" | "en"
): Promise<{ response: string; suggestions?: SuggestionGroup[] }> {
  try {
    return await handleIntentInternal(intent, message, language);
  } catch (error) {
    console.error("handleIntent error:", error);
    return { response: "" };
  }
}

async function handleIntentInternal(
  intent: Intent,
  message: string,
  language: "vi" | "en"
): Promise<{ response: string; suggestions?: SuggestionGroup[] }> {
  const lowerMessage = message.toLowerCase();

  if (intent === "PRODUCT_SEARCH" || intent === "RECOMMENDATION_REQUEST") {
    const keywords = trimProductQuery(message);
    const products = keywords ? await searchProducts(keywords, 8) : await getTrendingProducts(8);

    if (products.length > 0) {
      const preview = products
        .slice(0, 4)
        .map((product) => `${product.name} (${product.price.toFixed(2)} USD)`)
        .join(", ");

      return {
        response:
          language === "vi"
            ? `Mình tìm thấy vài lựa chọn phù hợp: ${preview}. Bạn có thể xem thêm trên trang hoặc nói rõ hơn (ngân sách, dịp tặng quà, độ cay/mặn) để mình gợi ý sát hơn.`
            : `Here are some matches: ${preview}. You can browse more on the site or tell me your budget or occasion so I can narrow it down.`,
        suggestions: [
          {
            type: "product",
            items: products.map((product) => ({ id: product.id, name: product.name, price: product.price })),
          },
        ],
      };
    }

    const categories = await getCategories();
    const categoryList = categories.length > 0
      ? categories.slice(0, 8).map((c) => c.name).join(", ")
      : language === "vi"
        ? "trà, cà phê, cá khô, tôm khô, gia vị, bánh kẹo, quà biếu, đồ ăn vặt"
        : "tea, coffee, dried seafood, spices, snacks, gifts";
    const searchHint = keywords
      ? (language === "vi"
          ? `Bạn vừa tìm "${keywords}". Hiện mình chưa có sản phẩm khớp đúng; bạn thử xem các nhóm như ${categoryList} hoặc gõ tên món cụ thể (ví dụ: trà sen, cá khô, nước mắm).`
          : `You searched for "${keywords}". We don't have an exact match right now; try browsing ${categoryList} or type a specific item (e.g. tea, dried fish, fish sauce).`)
      : (language === "vi"
          ? `Bạn có thể nói rõ hơn bạn muốn mua gì (ví dụ: trà, cá khô, quà biếu, đồ ăn vặt) hoặc xem nhanh các nhóm: ${categoryList}.`
          : `Tell me what you're looking for (e.g. tea, dried fish, gifts, snacks) or browse: ${categoryList}.`);
    return {
      response: searchHint,
      suggestions:
        categories.length > 0
          ? [{ type: "category" as const, items: categories.slice(0, 6).map((c) => ({ id: c.id, name: c.name })) }]
          : undefined,
    };
  }

  if (intent === "PROMOTION_INQUIRY") {
    const [promotions, flashSale] = await Promise.all([getActivePromotions(), getFlashSaleProducts(3)]);
    const couponCodes = (promotions?.coupons ?? []).map((coupon: { code?: string }) => coupon.code).filter((code): code is string => !!code).slice(0, 3);

    if (!flashSale && couponCodes.length === 0) {
      return {
        response:
          language === "vi"
            ? "Hiện tại mình chưa thấy chương trình nổi bật nào cần xác nhận ngay. Bạn có thể mở trang deals hoặc cho mình biết ngân sách để mình gợi ý cách mua tối ưu."
            : "I do not see a standout promotion to confirm right now. You can open the deals page, or tell me your budget so I can suggest a smarter basket.",
      };
    }

    const parts: string[] = [];
    if (flashSale) {
      parts.push(
        language === "vi"
          ? `Flash sale ${flashSale.name} đang chạy cho một số mặt hàng.`
          : `The ${flashSale.name} flash sale is active on selected items.`
      );
    }
    if (couponCodes.length > 0) {
      parts.push(
        language === "vi"
          ? `Coupon đang thấy: ${couponCodes.join(", ")}.`
          : `Visible coupon codes: ${couponCodes.join(", ")}.`
      );
    }

    return {
      response: parts.join(" "),
      suggestions: couponCodes.length > 0
        ? [{ type: "action", items: couponCodes.map((code) => ({ id: code, name: `Coupon ${code}` })) }]
        : undefined,
    };
  }

  if (intent === "SHIPPING_INQUIRY") {
    const shipping = await getShippingInfo();
    return {
      response:
        language === "vi"
          ? `Giao chuẩn ${shipping.standardFee.toFixed(2)} USD trong ${shipping.standardDays} ngày, giao nhanh ${shipping.expressFee.toFixed(2)} USD trong ${shipping.expressDays} ngày. Đơn từ ${shipping.freeShippingThreshold.toFixed(2)} USD được freeship chuẩn.`
          : `Standard shipping is ${shipping.standardFee.toFixed(2)} USD in about ${shipping.standardDays} days, and express is ${shipping.expressFee.toFixed(2)} USD in about ${shipping.expressDays} days. Orders above ${shipping.freeShippingThreshold.toFixed(2)} USD get free standard shipping.`,
    };
  }

  if (intent === "ORDER_STATUS") {
    return {
      response:
        language === "vi"
          ? "Nếu bạn đang muốn xem đơn, hãy vào Tài khoản > Đơn hàng hoặc gửi cho mình mã đơn hàng. Mình sẽ hướng dẫn bước tiếp theo tương ứng."
          : "If you want to check an order, open Account > Orders or send me the order number. I will guide you from there.",
    };
  }

  if (lowerMessage.includes("category") || lowerMessage.includes("danh muc") || lowerMessage.includes("co ban gi")) {
    const categories = await getCategories();
    return {
      response:
        language === "vi"
          ? `Shop hiện có các nhóm chính như ${categories.slice(0, 6).map((category) => category.name).join(", ")}. Bạn muốn mình gợi ý nhóm nào trước?`
          : `The store currently highlights categories like ${categories.slice(0, 6).map((category) => category.name).join(", ")}. Which one should I narrow down first?`,
      suggestions: [
        {
          type: "category",
          items: categories.slice(0, 6).map((category) => ({ id: category.id, name: category.name })),
        },
      ],
    };
  }

  if (intent === "GREETING") {
    return {
      response:
        language === "vi"
          ? "Xin chào! Mình là trợ lý mua hàng của LIKEFOOD. Bạn đang tìm món ăn vặt, gia vị, quà biếu hay cần giải thích về giao hàng?"
          : "Hello, I am LIKEFOOD's shopping concierge. Are you looking for snacks, pantry staples, gift ideas, or shipping guidance today?",
      suggestions: [
        {
          type: "action",
          items: language === "vi"
            ? [
                { id: "gift", name: "Goi y qua bieu" },
                { id: "shipping", name: "Phi giao hang" },
                { id: "snacks", name: "An vat de mang di" },
              ]
            : [
                { id: "gift", name: "Gift ideas" },
                { id: "shipping", name: "Shipping cost" },
                { id: "snacks", name: "Portable snacks" },
              ],
        },
      ],
    };
  }

  return { response: "" };
}

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const { message, sessionId } = request;
  const language = detectLanguage(message);

  const safeFallback = (): ChatResponse => ({
    message: getSafeResponse("general_error", language),
    intent: "UNKNOWN",
    confidence: 0,
    language,
    isNewUser: true,
  });

  try {
    const intentResult = classifyIntent(message);
    const { intent, confidence, entities } = intentResult;

    const isNew = await isNewSession(sessionId);
    await addMessage(sessionId, "user", message, intent);

    if (Object.keys(entities).length > 0) {
      await updateEntities(sessionId, entities);
    }

    const history = await getConversationHistory(sessionId, 6);
    const contextSummary = await getContextSummary(sessionId);
    const knowledgeResults = await searchKnowledge(message, language, 3);
    const knowledgeAnswers = knowledgeResults.map((item) => item.answer);

    const intentResponse = await handleIntent(intent, message, language);
    if (intentResponse.response) {
      await addMessage(sessionId, "assistant", intentResponse.response, intent);

      return {
        message: intentResponse.response,
        intent,
        confidence,
        language,
        suggestions: intentResponse.suggestions,
        isNewUser: isNew,
      };
    }

    const confidenceLevel = assessConfidence(intent, confidence, Object.keys(entities).length > 0, contextSummary.messageCount > 0);
    if (confidenceLevel === "very_low" || confidenceLevel === "low") {
      const fallbackResponse = getFallbackResponse(intent, language);
      await addMessage(sessionId, "assistant", fallbackResponse, intent);

      return {
        message: fallbackResponse,
        intent,
        confidence,
        language,
        isNewUser: isNew,
      };
    }

    const prompt = buildPrompt(message, history, language, intent, contextSummary, knowledgeAnswers);
    const aiResponse = await generateResponse(prompt);

    if (aiResponse) {
      const validation = validateResponse(aiResponse);
      if (!validation.isValid) {
        const safeResponse = getSafeResponse("general_error", language);
        await addMessage(sessionId, "assistant", safeResponse, intent);
        return {
          message: safeResponse,
          intent,
          confidence,
          language,
          shouldEscalate: true,
          isNewUser: isNew,
        };
      }

      const escalation = shouldEscalate(intent, confidenceLevel, 0);
      await addMessage(sessionId, "assistant", aiResponse, intent);

      return {
        message: aiResponse,
        intent,
        confidence,
        language,
        shouldEscalate: escalation.shouldEscalate,
        isNewUser: isNew,
      };
    }

    const safeResponse = getSafeResponse("general_error", language);
    await addMessage(sessionId, "assistant", safeResponse, "UNKNOWN");

    return {
      message: safeResponse,
      intent: "UNKNOWN",
      confidence: 0,
      language,
      isNewUser: isNew,
    };
  } catch (error) {
    console.error("AI chat error:", error);
    return safeFallback();
  }
}
