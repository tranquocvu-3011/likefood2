# Changelog

All notable changes to the LIKEFOOD project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Tính năng mới (nếu có) được thêm vào đây.

---

## [1.0.0] - 2026-03-10

### Added

- **Guest Checkout**: Trang thanh toán tự động chuyển sang `/api/orders/guest` khi khách chưa đăng nhập; banner thông báo màu vàng ở bước 1 với nút đăng nhập nhanh.
- **Personalized Recommendations**: Component `PersonalizedRecommendationsSection` hiển thị gợi ý AI cho người dùng đã đăng nhập; trending products làm fallback cho khách vãng lai.
- **Bundle Analyzer**: Tích hợp `@next/bundle-analyzer` — chạy `ANALYZE=true npm run build` để xem bản đồ bundle tương tác.
- **API Documentation**: `docs/API.md` mô tả đầy đủ 116 API endpoints, ví dụ request/response, xác thực, rate limit và mã lỗi.
- **Empty States CTA**: Trang thông báo hiển thị nút "Khám phá sản phẩm" khi không có thông báo nào.
- **Admin Error Boundary**: `src/app/admin/error.tsx` + `loading.tsx` mới — hiển thị lỗi có digest code, nút retry và link về Dashboard.
- **Deployment Config**: `Dockerfile` multi-stage, `docker-compose.yml`, `nginx/nginx.conf` (SSL + rate limiting), `ecosystem.config.js` (PM2), `scripts/deploy.sh`.
- **License Headers**: Thêm tiêu đề MIT License vào toàn bộ file mã nguồn `.ts` / `.tsx` theo yêu cầu OSI.
- **CONTRIBUTING.md**: Hướng dẫn đóng góp, quy trình pull request, coding style.

### Fixed

- **Encoding**: Sửa lỗi encode UTF-8 trong xử lý văn bản tiếng Việt.
- **User Enumeration**: Luồng đăng ký trả về phản hồi đồng nhất để ngăn liệt kê người dùng.
- **TypeScript**: 0 lỗi TypeScript trên toàn bộ codebase.
- **ISR Revalidation**: Trang chủ revalidate mỗi 5 phút (`export const revalidate = 300`).
- **Audit Log**: Ghi đầy đủ metadata sự kiện vào audit log.
- **Cache Fallback**: Cache layer tự động fallback về database khi Redis gặp sự cố.
- **Root Error Boundary**: `src/app/error.tsx` dùng `logger.error` thay vì `console.error`.

### Security

- Giới hạn toàn bộ 100+ API routes với xác thực (auth/admin) — audit hoàn chỉnh.
- `ADMIN_2FA_SECRET` bổ sung vào `.env.example` (thiếu trước đó).
- Xóa Gemini API key cứng khỏi `.env.example`.
- Nâng cấp vitest 2.x → 4.x — 0 npm vulnerabilities.

---

## [0.1.0] - 2026-03-09

### Added

- Nền tảng thương mại điện tử LIKEFOOD (Next.js 16, React 19, Prisma, MySQL).
- Trang chủ: Hero carousel, danh mục, sản phẩm nổi bật, Flash Sale, đánh giá, blog, điểm danh hàng ngày.
- Danh sách & chi tiết sản phẩm: lọc, sắp xếp, variant, đánh giá, Q&A, gợi ý mua kèm.
- Giỏ hàng, checkout 3 bước, thanh toán Stripe, áp mã giảm giá và LIKEFOOD Xu.
- Quản lý đơn hàng: trạng thái, tracking, xuất hóa đơn.
- Xác thực: đăng ký/đăng nhập, Magic Link, 2FA, quên mật khẩu, lịch sử đăng nhập, quản lý phiên.
- Admin panel: dashboard, sản phẩm, đơn hàng, khách hàng, Flash Sale, coupon, CMS, blog, kho hàng, analytics, cài đặt.
- Tích hợp AI (Google Gemini 2.0 Flash): Chatbot tư vấn, tóm tắt đánh giá, tạo nội dung, dự báo tồn kho, insight kinh doanh.
- Đa ngôn ngữ (Việt / English), rate limiting (Upstash Redis), audit log, bảo mật (CORS, CSP, env validation).
- Tài liệu: README, CHANGELOG, hướng dẫn cài đặt, thể lệ OLP 2025 PMNM.

### Security

- Chống thao tác giá đơn hàng (SEC-01).
- CORS với ALLOWED_ORIGIN (SEC-02).
- Bảo vệ admin bằng server-side auth (SEC-03).
- Giao dịch giỏ hàng tránh race condition tồn kho (SEC-04).
- Cookie phiên admin ký HMAC (SEC-05).
- Giới hạn remotePatterns ảnh (SEC-06).
- Kiểm tra env khi khởi động (SEC-07).
- CSP headers (SEC-08).

---

[Unreleased]: https://github.com/tranquocvu-3011/likefood/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tranquocvu-3011/likefood/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/tranquocvu-3011/likefood/releases/tag/v0.1.0


### Added

- Nền tảng thương mại điện tử LIKEFOOD (Next.js 16, React 19, Prisma, MySQL).
- Trang chủ: Hero carousel, danh mục, sản phẩm nổi bật, Flash Sale, đánh giá, blog, điểm danh hàng ngày.
- Danh sách & chi tiết sản phẩm: lọc, sắp xếp, variant, đánh giá, Q&A, gợi ý mua kèm.
- Giỏ hàng, checkout 3 bước, thanh toán Stripe, áp mã giảm giá và LIKEFOOD Xu.
- Quản lý đơn hàng: trạng thái, tracking, xuất hóa đơn.
- Xác thực: đăng ký/đăng nhập, Magic Link, 2FA, quên mật khẩu, lịch sử đăng nhập, quản lý phiên.
- Admin panel: dashboard, sản phẩm, đơn hàng, khách hàng, Flash Sale, coupon, CMS, blog, kho hàng, analytics, cài đặt.
- Tích hợp AI (Google Gemini 2.0 Flash): Chatbot tư vấn, tóm tắt đánh giá, tạo nội dung, dự báo tồn kho, insight kinh doanh.
- Đa ngôn ngữ (Việt / English), rate limiting (Upstash Redis), audit log, bảo mật (CORS, CSP, env validation).
- Tài liệu: README, checklist đồng bộ & nâng cấp, thể lệ OLP 2025 PMNM.

### Security

- Chống thao tác giá đơn hàng (SEC-01).
- CORS với ALLOWED_ORIGIN (SEC-02).
- Bảo vệ admin bằng server-side auth (SEC-03).
- Giao dịch giỏ hàng tránh race condition tồn kho (SEC-04).
- Cookie phiên admin ký HMAC (SEC-05).
- Giới hạn remotePatterns ảnh (SEC-06).
- Kiểm tra env khi khởi động (SEC-07).
- CSP headers (SEC-08).

[0.1.0]: https://github.com/tranquocvu-3011/likefood/releases/tag/v0.1.0
