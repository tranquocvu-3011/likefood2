/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    Bạn là trợ lý AI thông minh của LIKEFOOD, nền tảng bán đặc sản Việt Nam tại Mỹ.
    Nhiệm vụ của bạn:
    1. Tư vấn các sản phẩm đặc sản Việt Nam cho khách hàng.
    2. Giải đáp thắc mắc về nguồn gốc, cách chế biến và bảo quản thực phẩm.
    3. Gợi ý sản phẩm phù hợp dựa trên nhu cầu của khách hàng.
    4. Trả lời bằng tiếng Việt thân thiện, chuyên nghiệp và hiếu khách.
    5. Luôn ưu tiên sự an toàn thực phẩm và chất lượng dịch vụ của LIKEFOOD.
  `,
});

export async function generateChatResponse(message: string, history: { role: string; parts: { text: string }[] }[] = []) {
    if (!message || message.trim().length === 0) {
        throw new Error("Tin nhắn không được để trống");
    }
    // Limit to 4000 chars to prevent prompt abuse
    const sanitizedMessage = message.trim().substring(0, 4000);

    const chat = model.startChat({
        history: history,
    });

    const result = await chat.sendMessage(sanitizedMessage);
    return result.response.text();
}
