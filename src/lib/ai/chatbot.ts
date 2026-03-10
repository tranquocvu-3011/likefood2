/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}

const KNOWLEDGE_BASE = `
Bạn là trợ lý mua sắm của LIKEFOOD, một cửa hàng bán đặc sản Việt Nam tại Hoa Kỳ.

Thông tin cốt lõi:
- LIKEFOOD bán các nhóm sản phẩm như cá khô, tôm mực khô, gia vị Việt, trà, bánh mứt và trái cây sấy.
- Hệ thống giao hàng trên toàn nước Mỹ.
- Miễn phí vận chuyển cho đơn hàng từ $500.
- Hỗ trợ thanh toán COD, chuyển khoản ngân hàng, thẻ và một số cổng thanh toán trực tuyến.
- Đổi trả trong trường hợp sản phẩm lỗi hoặc không đúng mô tả theo chính sách của cửa hàng.
- Khách có thể theo dõi đơn hàng trong mục Tài khoản > Đơn hàng.

Quy tắc phản hồi:
- Trả lời theo ngôn ngữ người dùng đang dùng.
- Giọng điệu thân thiện, rõ ràng, chuyên nghiệp.
- Ưu tiên câu ngắn, nhiều nhất khoảng 4 câu hoặc một danh sách ngắn.
- Không bịa đặt giá chính xác, tồn kho chính xác, hoặc trạng thái đơn hàng nếu không có dữ liệu thời gian thực.
- Nếu người dùng hỏi về trạng thái đơn hàng cá nhân, hướng họ đến trang Tài khoản > Đơn hàng.
- Nếu người dùng hỏi về sản phẩm, hãy gợi ý nhóm sản phẩm phù hợp và một bước tiếp theo cụ thể.
`.trim();

function detectEnglish(text: string) {
    return /^[\x00-\x7F\s.,!?"'():;\-/$%&]+$/.test(text) && /[a-z]/i.test(text);
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
            temperature: 0.6,
            maxOutputTokens: 700,
            topP: 0.9,
            topK: 32,
        },
    });
}

function buildPrompt(input: ChatRequest) {
    const history = (input.history || [])
        .slice(-6)
        .map((message) => `${message.role === "user" ? "Khách" : "Trợ lý"}: ${message.content}`)
        .join("\n");

    const replyLanguage = detectEnglish(input.message)
        ? "Reply in natural English."
        : "Trả lời bằng tiếng Việt tự nhiên.";

    return [
        KNOWLEDGE_BASE,
        "",
        "Lịch sử hội thoại gần nhất:",
        history || "(Hội thoại mới)",
        "",
        `Tin nhắn mới của khách: ${input.message}`,
        "",
        "Yêu cầu cho câu trả lời:",
        replyLanguage,
        "- Nêu rõ bước tiếp theo khi phù hợp.",
        "- Nếu khách hỏi chính sách giao hàng hoặc thanh toán, trả lời thật gọn và thực dụng.",
        "- Nếu khách hỏi món để mua, hãy gợi ý 2-4 lựa chọn theo nhu cầu thay vì trả lời chung chung.",
    ].join("\n");
}

function getQuickAnswer(message: string) {
    const lower = message.toLowerCase();
    const inEnglish = detectEnglish(message);

    if (lower.includes("ship") || lower.includes("giao hàng") || lower.includes("shipping")) {
        return inEnglish
            ? "We ship across the U.S. Standard delivery usually takes a few business days, and orders from $500 qualify for free shipping. You can review the exact shipping method during checkout."
            : "LIKEFOOD giao hàng trên toàn nước Mỹ. Đơn từ $500 được miễn phí vận chuyển, còn phí cụ thể của các lựa chọn giao hàng sẽ hiện rõ ở bước checkout. Bạn cũng có thể xem lại chính sách vận chuyển ngay trên website.";
    }

    if (lower.includes("order") || lower.includes("đơn hàng") || lower.includes("theo dõi")) {
        return inEnglish
            ? "To check your order, open Account > Orders after signing in. There you can see the current status, timeline, shipping method, and tracking code if one is available."
            : "Để xem đơn hàng, bạn hãy đăng nhập rồi vào Tài khoản > Đơn hàng. Ở đó bạn sẽ thấy trạng thái hiện tại, lịch sử xử lý, phương thức giao hàng và mã vận đơn nếu đã có.";
    }

    if (lower.includes("payment") || lower.includes("thanh toán") || lower.includes("paypal") || lower.includes("visa")) {
        return inEnglish
            ? "We support cash on delivery, bank transfer, card payments, and selected online payment options. The checkout page will show the methods currently available for your order."
            : "LIKEFOOD hỗ trợ COD, chuyển khoản ngân hàng, thẻ và một số cổng thanh toán trực tuyến. Ở bước checkout, hệ thống sẽ hiển thị những phương thức đang khả dụng cho đơn của bạn.";
    }

    if (lower.includes("gift") || lower.includes("quà") || lower.includes("biếu")) {
        return inEnglish
            ? "For gifting, dried fruits, premium dried seafood, tea, and curated spice sets are usually safe picks. If you want, tell me your budget or who the gift is for and I can narrow it down."
            : "Nếu mua quà biếu, bạn có thể ưu tiên trái cây sấy, hải sản khô loại đẹp, trà, hoặc set gia vị cao cấp. Nếu muốn, bạn nói rõ ngân sách hoặc người nhận là ai, tôi sẽ gợi ý sát hơn.";
    }

    if (lower.includes("snack") || lower.includes("ăn vặt")) {
        return inEnglish
            ? "If you want ready-to-eat snacks, look at dried fruits, sweets, and light savory dried items. They are easy to store and convenient for work or travel."
            : "Nếu bạn muốn đồ ăn vặt tiện dùng, hãy xem nhóm trái cây sấy, bánh mứt và các món khô vị nhẹ. Đây là nhóm dễ bảo quản, tiện mang đi làm hoặc đi đường.";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("xin chào") || lower.includes("chào")) {
        return inEnglish
            ? "Hello. I can help you choose products, explain shipping and payment, or point you to the right page on LIKEFOOD."
            : "Xin chào. Tôi có thể giúp bạn chọn sản phẩm, giải thích giao hàng, thanh toán hoặc chỉ đúng trang cần xem trên LIKEFOOD.";
    }

    return inEnglish
        ? "I can help with products, shipping, payments, and order guidance. Tell me what you need and I will keep it concise."
        : "Tôi có thể hỗ trợ về sản phẩm, giao hàng, thanh toán và cách theo dõi đơn. Bạn cứ nói rõ nhu cầu, tôi sẽ trả lời thật gọn và đúng trọng tâm.";
}

export async function handleChatRequest(input: ChatRequest): Promise<{ reply: string; sources?: string[] }> {
    const model = getGeminiModel();

    if (!model) {
        return { reply: getQuickAnswer(input.message) };
    }

    try {
        const result = await model.generateContent(buildPrompt(input));
        const response = await result.response;
        const text = response.text()?.trim();

        if (!text) {
            return { reply: getQuickAnswer(input.message) };
        }

        return { reply: text };
    } catch {
        return { reply: getQuickAnswer(input.message) };
    }
}
