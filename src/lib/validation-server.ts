/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { resolveMx } from "dns/promises";
import { logger } from "./logger";

/**
 * Kiểm tra bản ghi DNS MX (Mail Exchange) để xác nhận Domain có Mail Server thật
 * (Chỉ chạy ở Server Side - API Routes)
 */
export const hasMXRecord = async (email: string): Promise<boolean> => {
    const domain = email.split("@")[1];
    if (!domain) return false;

    try {
        const records = await resolveMx(domain);
        return records && records.length > 0;
    } catch {
        logger.warn(`[DNS] Không tìm thấy bản ghi MX cho domain: ${domain}`);
        return false;
    }
};
