# 🍜 LIKEFOOD — Nền Tảng Thương Mại Điện Tử Đặc Sản Việt Nam

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?logo=google-gemini" alt="Gemini AI">
  <img src="https://img.shields.io/badge/Database-MySQL-00758F?logo=mysql" alt="MySQL">
</p>

> **LIKEFOOD** là nền tảng thương mại điện tử toàn diện, kết hợp sức mạnh của AI để mang những hương vị đặc sản Việt Nam tinh túy nhất đến với cộng đồng người Việt tại Hoa Kỳ.

---

## ✨ Tính Năng Chính

### 🛒 Thương Mại Điện Tử
- **Danh mục sản phẩm** — Danh mục, thương hiệu, biến thể (size/hương vị), gallery đa ảnh
- **Giỏ hàng** — Checkout cho user đăng nhập và khách, mini cart, sản phẩm đã lưu
- **Quy trình thanh toán** — 3 bước với Stripe payment, hỗ trợ COD
- **Quản lý đơn hàng** — Theo dõi trạng thái, timeline, tạo hóa đơn
- **Flash Sales** — Chiến dịch với đồng hồ đếm ngược và giới hạn tồn kho
- **Đánh giá & Hỏi đáp** — Rating sản phẩm, hình ảnh, tóm tắt AI

### 🤖 Tính Năng AI
- **Chatbot AI** — Trợ lý mua sắm Gemini (22 loại intent)
- **Gợi ý thông minh** — Cá nhân hóa, mua cùng nhau, xu hướng
- **Tạo nội dung AI** — Mô tả sản phẩm, SEO meta tags, marketing copy
- **Phân khúc người dùng** — 12 phân khúc hành vi với dự đoán churn
- **AI Business Insights** — Xu hướng doanh thu, cảnh báo tồn kho, phân tích đơn hàng

### 🔐 Xác Thực & Bảo Mật
- **Đa phương thức xác thực** — Password, Google OAuth, Magic Link, 2FA (bắt buộc cho admin)
- **Rate Limiting** — Bảo vệ Upstash Redis chống brute force
- **Bảo mật Headers** — CSP, CSRF, X-Frame-Options
- **Xác thực đầu vào** — Zod schemas, xác thực email, CAPTCHA

### 👑 Bảng Quản Trị
- **Dashboard** — Doanh thu, đơn hàng, khách hàng, AI Insights
- **Quản lý sản phẩm** — CRUD, biến thể, import/export, nội dung AI
- **Quản lý đơn hàng** — Cập nhật trạng thái, tracking, hoàn tiền
- **Công cụ Marketing** — Coupons, flash sales, banners, newsletters
- **Analytics** — Biểu đồ doanh thu, phân tích đơn hàng, insights khách hàng

### 💎 Hệ Thống Loyalty
- **Điểm thưởng (Xu)** — Tích điểm khi mua hàng, check-in hàng ngày
- **Vouchers** — Thu thập và sử dụng tại checkout
- **Chương trình giới thiệu** — Kiếm điểm qua việc chia sẻ

---

## 🛠️ Công Nghệ

| Lớp | Công nghệ |
|-----|-----------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **UI** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 + Shadcn UI |
| **Database** | MySQL + Prisma ORM v6 |
| **Auth** | NextAuth v4 (Credentials, OAuth, Magic Link, 2FA) |
| **AI** | Google Gemini 2.0 Flash |
| **Payments** | Stripe (Cards, Webhooks) |
| **Email** | Nodemailer (SMTP) |
| **Rate Limiting** | Upstash Redis |
| **Monitoring** | Sentry |
| **Validation** | Zod v4 |
| **Testing** | Vitest |

---

## 📱 Các Trang & Routes

### Trang Khách Hàng (26+)
| Đường dẫn | Mô tả |
|-----------|--------|
| `/` | Trang chủ với hero, danh mục, sản phẩm nổi bật |
| `/products` | Danh sách sản phẩm với bộ lọc & sắp xếp |
| `/products/[slug]` | Chi tiết sản phẩm, gallery, biến thể, đánh giá |
| `/cart` | Quản lý giỏ hàng |
| `/checkout` | Quy trình thanh toán 3 bước |
| `/orders` | Lịch sử đơn hàng & theo dõi |
| `/profile` | Cài đặt tài khoản |
| `/wishlist` | Sản phẩm đã lưu |
| `/vouchers` | Voucher của tôi |
| `/flash-sale` | Flash sale đang hoạt động |
| `/compare` | So sánh sản phẩm |
| `/posts` | Tin tức & Blog |

### Trang Xác Thực (10)
| Đường dẫn | Mô tả |
|-----------|--------|
| `/login` | Đăng nhập email/password |
| `/register` | Đăng ký tài khoản mới |
| `/forgot-password` | Khôi phục mật khẩu |
| `/magic-link` | Đăng nhập không cần mật khẩu |
| `/two-factor` | Xác thực 2FA |
| `/verify-email` | Xác nhận email |

### Trang Quản Trị (20+)
| Đường dẫn | Mô tả |
|-----------|--------|
| `/admin/dashboard` | Tổng quan & insights |
| `/admin/products` | Quản lý sản phẩm |
| `/admin/orders` | Quản lý đơn hàng |
| `/admin/customers` | Quản lý khách hàng |
| `/admin/coupons` | Quản lý mã giảm giá |
| `/admin/flash-sales` | Chiến dịch Flash Sale |
| `/admin/analytics` | Dashboard analytics |
| `/admin/ai` | Công cụ AI |

### API Endpoints (118)
- **Auth APIs**: 15 endpoints (login, register, 2FA, magic link, sessions)
- **User APIs**: 20 endpoints (profile, addresses, orders, wishlist)
- **Product APIs**: 15 endpoints (CRUD, search, recommendations)
- **Admin APIs**: 25 endpoints (full CRUD operations)
- **AI APIs**: 6 endpoints (chat, intent, knowledge base)
- **Other**: 40+ endpoints (payments, notifications, analytics)

---

## 🗄️ Mô Hình Database (35)

```
Auth & User     → user, verificationtoken, loginhistory, activesession, twofactortoken
Catalog         → product, productimage, productmedia, productvariant, productview, brand
Commerce        → cart, cartitem, order, orderitem, orderevent, address, refundrequest
Marketing       → coupon, uservoucher, notification, banner, flashsalecampaign, flashsaleproduct
Content         → post, contactmessage, systemsetting
Reviews & QA    → review, reviewmedia, productqa
Loyalty         → wishlist, pointtransaction
AI & Analytics  → behaviorEvent, userSegment, aiKnowledge, conversationHistory, emailCampaign
```

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu
- Node.js 18.17+
- MySQL 8.0+

### Cài Đặt

```bash
# 1. Clone repository
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood

# 2. Cài đặt dependencies
npm install

# 3. Cấu hình môi trường
cp .env.example .env
# Chỉnh sửa .env với cấu hình của bạn

# 4. Tạo database & migrate
npx prisma db push

# 5. Seed dữ liệu mẫu (tùy chọn)
npm run db:seed

# 6. Chạy development server
npm run dev
```

### Các Scripts Có Sẵn

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |
| `npm run type-check` | Kiểm tra TypeScript |
| `npm test` | Chạy Vitest tests |
| `npm run db:studio` | Mở Prisma Studio |
| `npm run db:push` | Sync schema lên database |
| `npm run db:seed` | Seed dữ liệu mẫu |

### Biến Môi Trường

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/likefood"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your-password"

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Security
ALLOWED_ORIGIN="http://localhost:3000"
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TURNSTILE_SECRET_KEY="..."

# Optional fallback (DB setting in admin has priority)
CAPTCHA_ENABLED="ON"
```

### CAPTCHA (Cloudflare Turnstile)

- **Frontend**: `src/components/auth/CaptchaField.tsx` (reusable field)
- **Server verify**: `src/lib/captcha.ts` (`verifyTurnstileToken`, `verifyTurnstileTokenFromHeaders`)
- **Bật/tắt CAPTCHA**: Admin → `Kiểm soát hệ thống` → tab `Bảo mật` → `CAPTCHA (Cloudflare Turnstile)`

---

## 📁 Cấu Trúc Dự Án

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Trang auth (login, register, 2FA...)
│   ├── (shop)/            # Trang shop (products, cart, checkout...)
│   ├── admin/             # Bảng quản trị
│   └── api/               # API routes (118 endpoints)
├── components/
│   ├── admin/             # Components quản trị
│   ├── auth/              # Components xác thực
│   ├── cart/              # Components giỏ hàng
│   ├── chat/              # Chatbot AI
│   ├── home/              # Sections trang chủ
│   ├── navbar/            # Điều hướng
│   ├── product/           # Components sản phẩm
│   ├── profile/           # Components profile
│   ├── shared/            # Components dùng chung
│   └── ui/                # Components UI cơ bản
├── lib/
│   ├── ai/                # Services AI (chatbot, recommendations)
│   ├── i18n/              # Quốc tế hóa (VI/EN)
│   ├── auth.ts            # Cấu hình NextAuth
│   ├── stripe.ts          # Tích hợp Stripe
│   ├── mail.ts            # Utilities email
│   ├── ratelimit.ts       # Rate limiting
│   ├── validation.ts      # Xác thực đầu vào
│   └── security.ts        # Utilities bảo mật
├── hooks/                 # Custom React hooks
└── contexts/              # React contexts
```

---

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy với coverage
npm test -- --coverage

# Chạy ở watch mode
npm test -- --watch
```

---

## 🌐 Triển Khai

### Vercel (Khuyến nghị)
```bash
# Triển khai lên Vercel
npm i -g vercel
vercel
```

### Docker
```bash
# Build và chạy với Docker
docker-compose up -d
```

### VPS với PM2
```bash
# Script deploy
bash scripts/deploy.sh
```

---

## 📋 Tiêu Chuẩn Chất Lượng

- [x] **Mã nguồn TypeScript** — 100% TypeScript với strict mode, không có `any`
- [x] **Giấy phép MIT** — Có trong từng file `.ts`/`.tsx`
- [x] **Tài liệu đầy đủ** — README, ARCHITECTURE.md, INSTALL.md, DEPLOYMENT.md
- [x] **CI/CD** — GitHub Actions (Lint, Type-check, Test, Build)
- [x] **Testing** — Vitest configured
- [x] **Cộng đồng** — Issue & PR templates, CONTRIBUTING.md, CODE_OF_CONDUCT.md

---

## 📄 Giấy Phép

Dự án được phân phối dưới giấy phép **MIT** — xem file [LICENSE](LICENSE) để biết chi tiết.

Mỗi file mã nguồn `.ts` / `.tsx` đều chứa tiêu đề giấy phép:

```typescript
/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 Trần Quốc Vũ
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */
```

---

## 🤝 Đóng Góp

Đóng góp được hoan nghênh! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước.

---

## 📞 Hỗ Trợ

- **Issues**: [GitHub Issues](https://github.com/tranquocvu-3011/likefood/issues)
- **Tài liệu**: Thư mục [docs/](docs/)

---

<p align="center">
  <strong>Làm với ❤️ cho cộng đồng người Việt toàn cầu</strong><br>
  🇻🇳 Mang hương vị Việt đến mọi nhà
</p>
