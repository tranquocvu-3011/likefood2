/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { model } from "@/lib/gemini";

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
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const ids = text.split(",").map(id => id.trim());
        return allProducts.filter(p => ids.includes(p.id));
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return allProducts.slice(0, 3); // Fallback to first 3
    }
}
