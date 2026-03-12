/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { getGeminiModel } from "@/lib/ai/gemini-runtime";

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
}

export async function getAIRecommendations(baseProduct: Product, allProducts: Product[]) {
    const prompt = `
    Dựa trên sản phẩm đang xem: "${baseProduct.name}" (Danh mục: ${baseProduct.category}, Mô tả: ${baseProduct.description}).
    Hãy chọn ra 3 sản phẩm liên quan nhất từ danh sách sau:
    ${allProducts.map(p => `- ID: ${p.id}, Tên: ${p.name}, Danh mục: ${p.category}`).join("\n")}
    
    Chỉ trả về danh sách ID, cách nhau bởi dấu phẩy. Không giải thích thêm.
  `;

    try {
        const model = await getGeminiModel({ model: "gemini-2.0-flash", temperature: 0.6, maxOutputTokens: 700, topP: 0.9, topK: 32 });
        if (!model) {
            return allProducts.slice(0, 3);
        }
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const ids = text.split(",").map(id => id.trim());
        return allProducts.filter(p => ids.includes(p.id));
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return allProducts.slice(0, 3); // Fallback to first 3
    }
}
