/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

'use client'

import { useEffect } from 'react'

// global-error.tsx catches errors in the root layout itself.
// It must include its own <html> and <body> tags.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html lang="vi">
            <body>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px' }}>Đã có lỗi nghiêm trọng!</h2>
                    <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '400px' }}>
                        Hệ thống gặp sự cố không thể khôi phục. Vui lòng tải lại trang.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{ padding: '12px 32px', background: '#16a34a', color: 'white', fontWeight: 700, border: 'none', borderRadius: '9999px', cursor: 'pointer' }}
                    >
                        Tải lại trang
                    </button>
                </div>
            </body>
        </html>
    )
}
