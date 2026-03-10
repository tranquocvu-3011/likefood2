/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

/**
 * Kiểm tra định dạng Email bằng RegEx chuẩn
 */
export const isValidEmailFormat = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Danh sách đen các tên miền email rác/tạm thời phổ biến
 */
const DISPOSABLE_DOMAINS = [
    "10minutemail.com", "temp-mail.org", "guerrillamail.com", "mailinator.com",
    "dispostable.com", "getnada.com", "throwawaymail.com", "maildrop.cc",
    "yopmail.com", "proxystop.com", "sharklasers.com", "trashmail.com",
    "burnermp.com", "tmail.ws", "tempmail.net", "vovao.net"
];

/**
 * Kiểm tra xem email có thuộc dịch vụ email rác hay không
 */
export const isDisposableEmail = (email: string): boolean => {
    const domain = email.split("@")[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.includes(domain);
};

/**
 * Kiểm tra mật khẩu mạnh (10/10 Security)
 * - Ít nhất 8 ký tự
 * - Ít nhất 1 chữ hoa
 * - Ít nhất 1 chữ thường
 * - Ít nhất 1 chữ số
 */
export const isStrongPassword = (password: string): boolean => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
};
