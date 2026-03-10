/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";

/**
 * API Response Helpers
 * Standardizes API responses to prevent information leakage
 */

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

/**
 * Standard success response
 */
export function apiSuccess<T>(data: T, status = 200) {
    return NextResponse.json(
        { success: true, data } as ApiResponse<T>,
        { status }
    );
}

/**
 * Standard error response
 * AUTH-04: Use generic messages to prevent user enumeration
 */
export function apiError(message: string, status = 400) {
    // Log the detailed error server-side but return generic message to client
    console.error(`[API Error] ${message}`);
    
    return NextResponse.json(
        { success: false, error: message } as ApiResponse<null>,
        { status }
    );
}

/**
 * AUTH-04: Generic response for authentication endpoints
 * Always returns the same message regardless of whether user exists or not
 * This prevents user enumeration attacks
 */
export function authGenericResponse(message = "Nếu email hợp lệ, chúng tôi đã gửi hướng dẫn xác nhận.") {
    return NextResponse.json(
        { success: true, message } as ApiResponse<null>,
        { status: 200 }
    );
}

/**
 * Validation error response
 */
export function validationError(errors: unknown[]) {
    return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ", details: errors } as ApiResponse<null>,
        { status: 400 }
    );
}

/**
 * Not found response
 */
export function notFound(message = "Không tìm thấy") {
    return NextResponse.json(
        { success: false, error: message } as ApiResponse<null>,
        { status: 404 }
    );
}

/**
 * Unauthorized response
 */
export function unauthorized(message = "Vui lòng đăng nhập") {
    return NextResponse.json(
        { success: false, error: message } as ApiResponse<null>,
        { status: 401 }
    );
}

/**
 * Forbidden response
 */
export function forbidden(message = "Bạn không có quyền thực hiện hành động này") {
    return NextResponse.json(
        { success: false, error: message } as ApiResponse<null>,
        { status: 403 }
    );
}
