# 🚀 LIKEFOOD — KẾ HOẠCH NÂNG CẤP LÊN 100/100

> **Điểm hiện tại:** 57/100  
> **Mục tiêu:** 100/100  
> **Thời gian ước tính:** 4–5 tuần  
> **Tổng số nhiệm vụ:** 97 items  
> **Ngày bắt đầu:** 2026-03-14

---

## 📋 TỔNG QUAN DỰ ÁN

LIKEFOOD là nền tảng thương mại điện tử đặc sản Việt Nam tại Mỹ, xây dựng trên **Next.js 16 / React 19 / Prisma (MySQL) / Stripe / Gemini AI**. Dự án có feature scope rộng nhưng bộc lộ các vấn đề nghiêm trọng ở 3 mảng chính:

| Vấn đề | Mức độ | Hậu quả |
|--------|:------:|---------|
| Bảo mật — Checkout API, middleware | 🔴 Critical | Financial fraud, unauthorized access |
| SEO — Pages client-rendered | 🔴 Critical | Google không index được sản phẩm |
| Code Quality — Duplicate, monolith | 🟡 Medium | Khó maintain, bugs tiềm ẩn |

---

## 📊 LỘ TRÌNH TỔNG THỂ

```
GĐ1 (24h)     GĐ2 (3 ngày)    GĐ3 (1 tuần)     GĐ4 (1-2 tuần)      GĐ5 (1-2 tuần)
 Bảo mật  ───▶   SEO      ───▶ Code Quality ───▶ Data & Perf    ───▶ Test & Polish
 57→65          65→78           78→87             87→94               94→100
 15 items       19 items        18 items          21 items            24 items
```

---

## 🔴 GIAI ĐOẠN 1: BẢO MẬT KHẨN CẤP

> ⏰ **Deadline:** 24 giờ | 📈 **57 → 65 điểm** | 🔢 **15 items**

Giai đoạn này xử lý các lỗ hổng bảo mật có thể gây thiệt hại tài chính hoặc lộ dữ liệu. **Phải hoàn thành trước khi làm bất cứ gì khác.**

### 1.1 Checkout API — Chặn fraud thanh toán
**File:** `src/app/api/checkout/create-session/route.ts`

- [ ] Thêm `requireAuth()` để yêu cầu đăng nhập
- [ ] Verify `order.userId === session.user.id` — user chỉ pay được order của mình
- [ ] Trả 403 Forbidden nếu user không phải chủ order
- [ ] Verify: test thủ công user A không tạo payment cho order user B

### 1.2 Middleware — Route protection tập trung
**File mới:** `src/middleware.ts`

- [ ] Tạo middleware.ts với matcher cho `/admin/*`
- [ ] Check session + role `ADMIN`/`SUPER_ADMIN` cho admin routes
- [ ] Redirect HTTP → HTTPS trong production
- [ ] Redirect unauthenticated users về `/login`

### 1.3 `.env` — Xóa credentials khỏi git
**Files:** `.env`, `.gitignore`

- [ ] Thêm `.env` vào `.gitignore`
- [ ] `git rm --cached .env` — bỏ tracking
- [ ] Purge `.env` khỏi git history
- [ ] Rotate DATABASE_URL credentials

### 1.4 Sanitize — Fix XSS vector
**File:** `src/lib/sanitize.ts`

- [ ] Xóa `"iframe"` khỏi `ALLOWED_TAGS` (line 35)
- [ ] Giữ `"iframe"` trong `FORBID_TAGS` — chặn hoàn toàn

### 1.5 Rate Limit — Đảm bảo production có protection
**File:** `src/lib/ratelimit.ts`

- [ ] Throw error khi Redis null + `NODE_ENV === "production"`
- [ ] Log warning khi fallback sang memory store trong dev

---

## 🟠 GIAI ĐOẠN 2: SEO — SERVER RENDERING

> ⏰ **Deadline:** 3 ngày | 📈 **65 → 78 điểm** | 🔢 **19 items**

Giai đoạn này chuyển các trang quan trọng từ client-rendered sang server-rendered để Google có thể crawl và index nội dung. **Đây là yếu tố quyết định thành bại của e-commerce.**

### 2.1 Product Detail — Trang quan trọng nhất
**File:** `src/app/(shop)/products/[slug]/page.tsx` (928 dòng)

- [ ] Xóa `"use client"` — chuyển sang Server Component
- [ ] Fetch product data server-side (direct Prisma query)
- [ ] Tách `ProductImageGalleryClient` — client component cho zoom/swipe
- [ ] Tách `ProductActionsClient` — client component cho add cart, buy, quantity
- [ ] Tách `ProductVariantClient` — client component cho chọn variant
- [ ] Đảm bảo JSON-LD `ProductStructuredData` render server-side
- [ ] Verify: `curl` phải trả về HTML có đầy đủ tên + giá sản phẩm

### 2.2 Product Listing — Trang catalog
**File:** `src/app/(shop)/products/page.tsx`

- [ ] Xóa `"use client"` — chuyển sang Server Component
- [ ] Fetch products server-side với `searchParams`
- [ ] Tách filter/sort UI sang `ProductFilterClient` component
- [ ] URL-based pagination: `/products?page=2` thay vì useState

### 2.3 Blog & Flash Sale
**Files:** `src/app/(shop)/posts/page.tsx`, `src/app/(shop)/flash-sale/page.tsx`

- [ ] Convert `posts/page.tsx` sang Server Component
- [ ] Convert `flash-sale/page.tsx` sang Server Component + countdown client

### 2.4 Fix SEO Meta & Structured Data

- [ ] Thống nhất OG URL: dùng `NEXT_PUBLIC_BASE_URL` khắp nơi
- [ ] Xóa hardcoded `google: "google-site-verification-code"` trong `(shop)/page.tsx`
- [ ] Thêm `BreadcrumbList` schema markup cho product detail
- [ ] Thêm `FAQPage` schema cho trang FAQ
- [ ] Fix hreflang: proper locale routing thay `?lang=en`
- [ ] Sitemap: filter `isVisible: true` + `isDeleted: false`

---

## 🟡 GIAI ĐOẠN 3: CODE QUALITY & KIẾN TRÚC

> ⏰ **Deadline:** 1 tuần | 📈 **78 → 87 điểm** | 🔢 **18 items**

Giai đoạn này clean up code, xóa duplicate, nâng type safety.

### 3.1 Xóa Duplicate

| Xóa | Giữ | Lý do |
|-----|-----|-------|
| `src/lib/env.ts` | `src/env.ts` (t3-oss) | t3-oss là chuẩn industry |
| `src/lib/security.ts` | `src/lib/api-auth.ts` | api-auth có response handling tốt hơn |

- [ ] Xóa `src/lib/env.ts`
- [ ] Update imports: `@/lib/env` → `@/env`
- [ ] Xóa `src/lib/security.ts`
- [ ] Update imports: `@/lib/security` → `@/lib/api-auth`
- [ ] Grep codebase xác nhận không còn import cũ

### 3.2 Tách Product Detail Page
Mục tiêu: `page.tsx` giảm từ **928 dòng → ~100 dòng**

- [ ] `ProductImageSection.tsx` (~150 dòng) — gallery, badges, overlays
- [ ] `ProductInfoSection.tsx` (~200 dòng) — title, rating, description
- [ ] `ProductPriceCard.tsx` (~100 dòng) — price, sale, free shipping
- [ ] `ProductActionsBar.tsx` (~100 dòng) — quantity, buttons, wishlist
- [ ] `ProductReviewsSection.tsx` (~200 dòng) — reviews, distribution
- [ ] Custom hook `useProductActions()` — shared add/buy logic (DRY)

### 3.3 TypeScript & Lint

- [ ] Bật `noImplicitAny: true` trong `tsconfig.json`
- [ ] Fix tất cả TypeScript errors phát sinh
- [ ] Xóa tất cả `eslint-disable @typescript-eslint/no-explicit-any`
- [ ] Define proper types cho `(product as any).ratingAvg`

### 3.4 Fix Code Smells

- [ ] Xóa `font-family: Arial` trong `globals.css` (xung đột Google Fonts)
- [ ] Xóa dead comment codes: `// N-02:`, `// AUTH-04:`, `// SEC-06:`
- [ ] CSP: implement nonce-based thay `'unsafe-inline'` + `'unsafe-eval'`

---

## 🟢 GIAI ĐOẠN 4: DATA INTEGRITY & PERFORMANCE

> ⏰ **Deadline:** 1–2 tuần | 📈 **87 → 94 điểm** | 🔢 **21 items**

Giai đoạn này đảm bảo tính toàn vẹn dữ liệu và tối ưu hiệu năng.

### 4.1 Database Transactions

- [ ] Order creation: `prisma.$transaction()` cho create + deduct inventory
- [ ] Optimistic locking tránh race condition (2 user mua cùng sản phẩm cuối)
- [ ] Refund: restore inventory inside transaction
- [ ] Double-check inventory INSIDE transaction scope

### 4.2 Prisma Schema — Enum Types

- [ ] `order.status` String → Enum
- [ ] `order.paymentStatus` String → Enum
- [ ] `review.status` String → Enum
- [ ] `refundrequest.status` String → Enum
- [ ] Migration: `prisma migrate dev` + verify production data

### 4.3 Server-Side Cart

- [ ] API: `POST /api/cart/add`, `PATCH /api/cart/update`, `DELETE /api/cart/remove`
- [ ] Sync: logged-in user → database cart; guest → localStorage
- [ ] Merge: guest cart → user cart khi login
- [ ] Cross-device: user thấy cùng cart trên mọi thiết bị

### 4.4 Performance

- [ ] Giảm framer-motion: chỉ hero + CTA, bỏ khỏi breadcrumb/buttons
- [ ] Bundle analyzer: `ANALYZE=true npm run build`
- [ ] Lazy load below-fold images
- [ ] Sitemap pagination: 1000 URLs/file

### 4.5 Accessibility

- [ ] `aria-label` cho mọi icon buttons
- [ ] `type="button"` cho non-submit buttons
- [ ] Keyboard tab order test toàn site
- [ ] Color contrast WCAG AA check
- [ ] Focus indicators visible

---

## 🔵 GIAI ĐOẠN 5: TESTING & HOÀN THIỆN

> ⏰ **Deadline:** 1–2 tuần | 📈 **94 → 100 điểm** | 🔢 **24 items**

Giai đoạn cuối — test coverage, validation, production deployment.

### 5.1 Unit Tests (Vitest)

- [ ] `sanitizeHtml()` — XSS vectors
- [ ] `applyRateLimit()` — rate limiting logic
- [ ] `requireAuth()`, `requireRole()` — auth helpers
- [ ] `validateEnv()` — env validation
- [ ] `formatPrice()` — currency formatting

### 5.2 API Integration Tests

- [ ] `POST /api/auth/register` — validation, duplicate, success
- [ ] `POST /api/checkout/create-session` — auth, ownership, paid order
- [ ] `POST /api/upload` — admin only, type check, magic bytes
- [ ] `GET /api/products` — pagination, filter, sort
- [ ] `PATCH /api/admin/orders/[id]/status` — role check

### 5.3 E2E Flows

- [ ] Registration → Verify email → Login
- [ ] Browse → Cart → Checkout → Payment success
- [ ] Admin login → 2FA → Manage products
- [ ] Search → Filter → Product detail → Add cart
- [ ] Referral link → Register → Order → Commission

### 5.4 SEO Validation

- [ ] Lighthouse SEO ≥ 95 (homepage + product detail)
- [ ] Google Rich Results Test pass
- [ ] Mobile-Friendly Test pass
- [ ] Sitemap — tất cả URLs trả về 200

### 5.5 Production Readiness

- [ ] `.env.production` — tất cả secrets set
- [ ] `npm run build` — 0 errors, 0 warnings
- [ ] `npm run type-check` — pass
- [ ] `npm run lint` — pass
- [ ] Docker build + run test
- [ ] Load test: 100 users, response < 500ms
- [ ] Sentry alerts configured
- [ ] SSL + CDN configured

### 5.6 Final Clean-up

- [ ] Xóa `build_output.txt`, `weblikefood.sql` khỏi repo
- [ ] Xóa tất cả `TODO`, `FIXME` comments
- [ ] Update `README.md` — deployment guide
- [ ] Performance budget: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## 📈 BẢNG TỔNG HỢP

| Giai đoạn | Thời gian | Trước | Sau | Items | Trọng tâm |
|-----------|-----------|:-----:|:---:|:-----:|-----------|
| 🔴 GĐ1 | 24 giờ | 57 | 65 | 15 | Bảo mật: auth, middleware, .env |
| 🟠 GĐ2 | 3 ngày | 65 | 78 | 19 | SEO: SSR cho products, posts, meta |
| 🟡 GĐ3 | 1 tuần | 78 | 87 | 18 | Code: xóa duplicate, tách component |
| 🟢 GĐ4 | 1–2 tuần | 87 | 94 | 21 | Data: transaction, cart, performance |
| 🔵 GĐ5 | 1–2 tuần | 94 | 100 | 24 | Test: unit, E2E, Lighthouse, deploy |
| **Tổng** | **~4–5 tuần** | **57** | **100** | **97** | |

---

> 💡 **Nguyên tắc:** Hoàn thành từng giai đoạn **tuần tự** — không nhảy sang giai đoạn sau khi giai đoạn trước chưa xong. Bảo mật luôn là ưu tiên số 1.
