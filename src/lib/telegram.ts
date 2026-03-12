/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Telegram Bot Notification Utility
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 */

import { getSystemSettingTrimmed } from "@/lib/system-settings";

interface TelegramConfig {
    botToken: string;
    chatId: string;
}

interface TelegramMessage {
    text: string;
    parseMode?: "Markdown" | "HTML";
    disableWebPagePreview?: boolean;
}

interface OrderNotificationData {
    orderId: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    totalAmount: number;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

/**
 * Get Telegram configuration from environment or settings
 */
export async function getTelegramConfig(): Promise<TelegramConfig | null> {
    const botToken = (await getSystemSettingTrimmed("telegram_bot_token")) || process.env.TELEGRAM_BOT_TOKEN || "";
    const chatId = (await getSystemSettingTrimmed("telegram_chat_id")) || process.env.TELEGRAM_CHAT_ID || "";

    if (!botToken || !chatId) return null;
    return { botToken, chatId };
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
    const config = await getTelegramConfig();
    if (!config) {
        console.log("[TELEGRAM] Bot not configured, skipping notification");
        return false;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: config.chatId,
                text: message.text,
                parse_mode: message.parseMode || "Markdown",
                disable_web_page_preview: message.disableWebPagePreview || true,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("[TELEGRAM] Send message error:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("[TELEGRAM] Exception:", error);
        return false;
    }
}

/**
 * Format order notification message
 */
export function formatOrderNotification(data: OrderNotificationData): string {
    const itemsList = data.items
        .map((item) => `• ${item.name} x${item.quantity} - $${item.price.toFixed(2)}`)
        .join("\n");

    const paymentMethodNames: Record<string, string> = {
        COD: "Tiền mặt khi nhận hàng (COD)",
        BANK: "Chuyển khoản ngân hàng",
        MOMO: "Ví MoMo",
        PAYPAL: "PayPal",
        STRIPE: "Thẻ tín dụng",
        ZALOPAY: "ZaloPay",
    };

    return `
🛒 *ĐƠN HÀNG MỚI #${data.orderId.slice(-8).toUpperCase()}*

👤 *Thông tin khách hàng:*
• Tên: ${data.customerName}
• Điện thoại: ${data.customerPhone}
• Địa chỉ: ${data.shippingAddress}

💳 *Phương thức thanh toán:*
${paymentMethodNames[data.paymentMethod] || data.paymentMethod}

📦 *Sản phẩm:*
${itemsList}

💰 *Tổng tiền:* $${data.totalAmount.toFixed(2)}

---
🔗 Xem chi tiết: https://likefood.com/admin/orders/${data.orderId}
`.trim();
}

/**
 * Send order notification to Telegram
 */
export async function sendOrderNotification(data: OrderNotificationData): Promise<boolean> {
    const message = formatOrderNotification(data);
    return sendTelegramMessage({ text: message });
}

/**
 * Test Telegram connection
 */
export async function testTelegramConnection(): Promise<{ success: boolean; message: string }> {
    const config = await getTelegramConfig();
    if (!config) {
        return {
            success: false,
            message: "Telegram Bot chưa được cấu hình. Vui lòng thêm TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID vào .env",
        };
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getMe`);
        if (!response.ok) {
            return { success: false, message: "Token Bot không hợp lệ" };
        }

        const botInfo = await response.json();
        return {
            success: true,
            message: `✅ Kết nối thành công! Bot: @${botInfo.result.username}`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Lỗi kết nối: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}
