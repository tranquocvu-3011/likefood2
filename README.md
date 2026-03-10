<<<<<<< HEAD
# likefood
=======
# 🍜 LIKEFOOD — Vietnamese Specialty Marketplace in the USA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-brightgreen)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/tranquocvu-3011/likefood/releases/tag/v1.0.0)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Pro-4285F4?logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/tests-74%20passed-success)](https://github.com/tranquocvu-3011/likefood)
[![OLP 2025](https://img.shields.io/badge/OLP%202025-PMNM-orange)](https://vfossa.vn)

**LIKEFOOD** là nền tảng thương mại điện tử toàn diện, kết hợp sức mạnh của AI để mang những hương vị đặc sản Việt Nam tinh túy nhất đến với cộng đồng người Việt tại Hoa Kỳ. Dự án tham dự cuộc thi **Phần mềm nguồn mở — Olympic Tin học Sinh viên Việt Nam 2025** (OLP 2025).

> **Mã nguồn mở:** Toàn bộ mã nguồn được phân phối theo giấy phép [MIT](LICENSE) (OSI-approved) và có thể truy cập tự do tại [github.com/tranquocvu-3011/likefood](https://github.com/tranquocvu-3011/likefood).

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router, Route Handlers) |
| **UI Runtime** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 + Shadcn UI + Radix UI |
| **Animation** | Framer Motion 12 |
| **Database** | MySQL + Prisma ORM v6 |
| **Auth** | NextAuth v4 (credentials, magic link, 2FA) |
| **AI** | Google Gemini Pro API |
| **Payment** | Stripe |
| **Email** | Nodemailer (SMTP) |
| **Rate Limiting** | Upstash Redis |
| **Error Monitoring** | Sentry |
| **Validation** | Zod v4 |
| **Testing** | Vitest |
| **Icons** | Lucide React |
| **Deploy** | Vercel |

---

## ✨ Tính năng đã hoàn thiện

### 🏠 Trang chủ
- **Hero Carousel** — Banner slideshow được quản lý từ Admin CMS, lấy dữ liệu từ database
- **Category Showcase** — Danh mục sản phẩm nổi bật với ảnh và link điều hướng
- **Featured Products** — Sản phẩm nổi bật tải động từ API
- **Flash Sale Banner** — Đồng hồ đếm ngược Flash Sale theo chiến dịch thực
- **Stats Section** — Số liệu thực (sản phẩm, đơn hàng, khách hàng) từ database
- **Why Choose Us** — Section "Tại sao chọn LIKEFOOD" với 6 điểm mạnh
- **Vietnam Story** — Section thương hiệu full-width
- **Customer Reviews** — Đánh giá khách hàng
- **Recent Posts** — Bài viết blog mới nhất (layout bất đối xứng featured + side cards)
- **Trust Badges** — Badges uy tín (bảo mật, hoàn tiền, giao hàng, hỗ trợ)
- **Live Sales Popup** — Thông báo mua hàng live (social proof)
- **Daily Check-in** — Điểm danh hàng ngày nhận điểm thưởng
- **Home Search Bar** — Thanh tìm kiếm sản phẩm tren trang chủ

### 🛍️ Danh sách sản phẩm (`/products`)
- Lọc theo danh mục, thương hiệu, khoảng giá, Flash Sale
- Sắp xếp: mới nhất, giá tăng/giảm, bán chạy, đánh giá cao
- Grid / List view toggle
- Tìm kiếm sản phẩm inline
- Pagination
- Product Card: rating sao vàng, nút Quick View, Quick Add, Wishlist, Compare, badge Flash Sale, low-stock indicator

### 📦 Chi tiết sản phẩm (`/products/[slug]`)
- **Image Gallery** — Multi-image, zoom, thumbnail navigation, lightbox
- **Variant Selector** — Chọn trọng lượng / hương vị (ảnh hưởng giá và tồn kho)
- **Flash Sale Countdown** — Đếm ngược giảm giá theo từng sản phẩm
- **Giỏ hàng & Wishlist** — Thêm vào giỏ / lưu yêu thích
- **Reviews & Ratings** — Progress bar phân bố rating, đăng review theo đơn hàng đã mua
- **AI Review Summary** — Tóm tắt đánh giá bằng Gemini AI
- **Frequently Bought Together** — Gợi ý cross-sell
- **Shipping Calculator** — Tính phí vận chuyển theo địa chỉ
- **Product Specifications** — Bảng thông số kỹ thuật
- **Q&A** — Hỏi đáp sản phẩm
- **Recently Viewed** — Sản phẩm đã xem gần đây
- **Shop Info Card** — Thông tin cửa hàng

### 🛒 Giỏ hàng & Thanh toán
- **Mini Cart** — Sidebar giỏ hàng trượt ra từ Navbar
- **Cart Page** (`/cart`) — Quản lý số lượng, xóa sản phẩm, xem tổng
- **Checkout** (`/checkout`) — Stepper 3 bước (Thông tin → Thanh toán → Xác nhận)
  - Nhập địa chỉ giao hàng với address book
  - Áp mã giảm giá (Coupon)
  - Sử dụng điểm thưởng (LIKEFOOD Xu) trừ trực tiếp vào đơn
  - Chọn phương thức vận chuyển
  - Thanh toán qua **Stripe** (thẻ credit/debit)
- **Order Success** (`/order-success`) — Trang xác nhận đơn hàng với confetti

### 📋 Quản lý đơn hàng (`/orders`)
- Danh sách đơn hàng với trạng thái và timeline
- Chi tiết đơn hàng: sản phẩm, địa chỉ, phương thức thanh toán
- Tracking mã vận đơn + hãng vận chuyển
- **Export hóa đơn** PDF-ready (`/orders/[id]/invoice`)

### ⚡ Flash Sale (`/flash-sale`)
- Danh sách sản phẩm flash sale theo chiến dịch đang chạy
- Đồng hồ đếm ngược thời gian kết thúc
- Giá Flash Sale riêng biệt với giới hạn tồn kho

### 👤 Profile (`/profile`)
- Chỉnh sửa thông tin cá nhân, avatar upload
- Quản lý địa chỉ giao hàng (thêm/sửa/xóa)
- Tùy chọn thông báo (email, in-app)
- Xem điểm thưởng LIKEFOOD Xu + lịch sử giao dịch điểm
- Điều hướng nhanh tới: Đơn hàng, Wishlist, Voucher Wallet, Admin Panel (nếu là admin)

### 🎟️ Voucher Wallet (`/profile/vouchers`)
- Danh sách voucher đã thu thập
- Trạng thái: CLAIMED / USED / EXPIRED

### 🔔 Thông báo (`/notifications`)
- Thông báo theo tab: Tất cả, Đơn hàng, Khuyến mãi, Hệ thống
- Đánh dấu đọc từng thông báo / tất cả
- Badge số lượng chưa đọc trên Navbar

### 📝 Blog (`/posts`)
- Danh sách bài viết với search + lọc theo danh mục
- Các danh mục: Ẩm thực, Tin tức, Sức khoẻ, Mẹo hay
- Trang chi tiết bài viết với Markdown rendering

### 🔍 So sánh sản phẩm (`/compare`)
- So sánh tối đa nhiều sản phẩm song song
- Bảng so sánh giá, rating, tồn kho, thông số

### ℹ️ Trang thông tin
- `/about` — Câu chuyện thương hiệu LIKEFOOD
- `/contact` — Form liên hệ (lưu DB + gửi email thông báo)
- `/faq` — Câu hỏi thường gặp
- `/policies/terms` — Điều khoản dịch vụ
- `/policies/privacy` — Chính sách bảo mật
- `/policies/shipping` — Chính sách vận chuyển
- `/policies/return` — Chính sách đổi trả

---

### 🔐 Xác thực & Bảo mật

| Tính năng | Chi tiết |
|---|---|
| Đăng ký / Đăng nhập | Email + password, xác thực email bắt buộc |
| Magic Link | Đăng nhập không cần mật khẩu qua email |
| Two-Factor Auth | OTP 6 số qua email khi phát hiện đăng nhập đáng ngờ |
| Quên mật khẩu | Reset qua email có token hết hạn |
| Login History | Ghi lại IP, thiết bị, vị trí của mỗi lần đăng nhập |
| Active Sessions | Quản lý phiên đang đăng nhập, thu hồi từ xa |
| Rate Limiting | Upstash Redis — chống brute force cho tất cả API endpoints |
| Audit Log | Ghi lại mọi hành động quan trọng của user & admin |
| Password Hashing | bcryptjs |
| Sentry | Monitoring lỗi realtime trên production |

---

### 🤖 Tính năng AI (Gemini Pro)

- **Chatbot AI** — Widget hỗ trợ tư vấn sản phẩm đặc sản, gợi ý theo khẩu vị, trả lời câu hỏi về cửa hàng
- **AI Review Summary** — Tự động tóm tắt cảm nhận của hàng chục đánh giá sản phẩm thành đoạn nhận xét ngắn
- **AI Content Generator** — Admin tạo nội dung bài viết blog, mô tả sản phẩm bằng AI
- **AI Inventory Forecast** — Dự báo ngày hết hàng và đề xuất số lượng nhập kho theo lịch sử bán
- **AI Business Insights** — Dashboard admin hiện insight tự động: xu hướng doanh thu, cảnh báo tồn kho, phân tích đơn hàng

---

### 🎛️ Admin Panel (`/admin`)

| Module | Tính năng |
|---|---|
| **Dashboard** | Doanh thu, đơn hàng, khách hàng, tồn kho thấp; biểu đồ doanh thu; top sản phẩm; AI Insights |
| **Sản phẩm** | CRUD sản phẩm, upload ảnh, quản lý variants (trọng lượng/hương vị), thông số kỹ thuật |
| **Đơn hàng** | Danh sách, chi tiết, cập nhật trạng thái, thêm tracking, timeline sự kiện đơn hàng |
| **Khách hàng** | Danh sách user, xem lịch sử mua hàng, phân quyền |
| **Danh mục** | Quản lý categories và brands |
| **Flash Sales** | Tạo chiến dịch Flash Sale, thêm sản phẩm và giá Flash Sale |
| **Coupons** | Tạo mã giảm giá (% hoặc cố định), theo dõi số lần dùng |
| **CMS / Banners** | Quản lý banner carousel trang chủ (ảnh, link, thời hạn hiển thị) |
| **Blog / Posts** | Viết bài viết với AI Content Generator, quản lý danh mục |
| **Kho hàng** | Tổng quan tồn kho, lọc hàng sắp hết, AI Forecast nhập kho |
| **Analytics** | Biểu đồ doanh thu theo thời gian, phân tích đơn hàng theo trạng thái |
| **Cài đặt** | Cấu hình thông tin cửa hàng (tên, SĐT, địa chỉ, email hỗ trợ) — lưu DB |
| **AI Assistant** | Widget AI trực tiếp trong admin để tra cứu và phân tích |

---

### 💰 Hệ thống điểm thưởng (LIKEFOOD Xu)

- Tích điểm tự động theo mỗi đơn hàng hoàn thành
- Điểm danh hàng ngày nhận Xu
- Dùng Xu trừ trực tiếp vào tổng đơn khi checkout
- Lịch sử giao dịch điểm (EARN / SPEND / REFUND / EXPIRED)

---

### 🌐 Đa ngôn ngữ (i18n)

- **Tiếng Việt** và **English** — toggle ngay trên Navbar
- Toàn bộ UI dịch qua dictionary (`vi.ts` / `en.ts`)
- Trạng thái ngôn ngữ persist theo session

---

### 📊 Database Schema (MySQL + Prisma)

| Nhóm | Models |
|---|---|
| Auth & User | `user`, `verificationtoken`, `loginhistory`, `activesession`, `twofactortoken` |
| Catalog | `brand`, `product`, `productimage`, `productmedia`, `productvariant`, `productview` |
| Commerce | `cart`, `cartitem`, `order`, `orderitem`, `orderevent`, `address` |
| Marketing | `coupon`, `uservoucher`, `notification`, `banner`, `flashsalecampaign`, `flashsaleproduct` |
| Content | `post`, `contactmessage`, `systemsetting` |
| Product Meta | `productspecification`, `productshipping`, `productqa`, `review`, `reviewmedia` |
| Loyalty | `wishlist`, `pointtransaction` |

---

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống
- Node.js 18.17+
- MySQL 8.0+

### Cài đặt

```bash
# 1. Clone repository
git clone https://github.com/tranquocvu-3011/likefood.git
cd LIKEFOOD

# 2. Cài dependencies
npm install

# 3. Cấu hình môi trường
cp .env.example .env
# Điền DATABASE_URL, NEXTAUTH_SECRET, GEMINI_API_KEY, STRIPE_*, SMTP_* ...

# 4. Tạo database & migrate
npx prisma db push

# 5. Seed dữ liệu mẫu (sản phẩm, coupon...)
npm run db:seed

# 6. Chạy dev server
npm run dev
```

### Scripts có sẵn

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Khởi chạy dev server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |
| `npm test` | Chạy Vitest tests |
| `npm run db:studio` | Mở Prisma Studio |
| `npm run db:push` | Sync schema lên database |
| `npm run db:seed` | Seed dữ liệu mẫu |

### Biến môi trường cần thiết

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/likefood

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# AI
GEMINI_API_KEY=your-gemini-api-key

# Payment
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-password
SMTP_FROM=LIKEFOOD <noreply@likefood.com>

# Rate Limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Error Monitoring
SENTRY_DSN=...
```

---

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password, Magic Link, 2FA...
│   ├── (shop)/          # Toàn bộ trang shop (products, cart, checkout, orders...)
│   ├── admin/           # Admin Panel (dashboard, products, orders, CMS...)
│   └── api/             # 25+ API route groups
├── components/
│   ├── shared/          # Navbar, Footer, HeroCarousel, ChatbotAI, StatsSection...
│   ├── product/         # ImageGallery, VariantSelector, ReviewSummaryAI...
│   ├── admin/           # AdminSidebar, AIAssistantWidget, PostForm...
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── ai/              # Gemini chatbot, content-generator, admin-service
│   ├── i18n/            # Vietnamese & English dictionaries + context
│   ├── auth.ts          # NextAuth config với 2FA & login history
│   ├── stripe.ts        # Stripe client
│   ├── mail.ts          # Nodemailer email helpers
│   ├── ratelimit.ts     # Upstash Redis rate limiting
│   ├── audit.ts         # Audit logging
│   └── security.ts      # Security utilities
├── contexts/            # CartContext, CompareContext
├── hooks/               # useWishlist, useDebounce, useIdleDetector
├── services/            # AI recommendation service
└── types/               # TypeScript type definitions
```

---

## 🧪 Testing

```bash
npm test
```

Tests được viết với **Vitest**, bao gồm:
- `tests/ai/chatbot.test.ts` — AI Chatbot responses
- `tests/ai/content-generator.test.ts` — AI Content Generator
- `tests/lib/validation.test.ts` — Zod schema validation

---

## 🐛 Báo lỗi & Đóng góp

- **Báo lỗi:** Sử dụng [GitHub Issues](https://github.com/tranquocvu-3011/likefood/issues) của repository để gửi bug report, đề xuất tính năng hoặc gửi pull request.
- **Đóng góp mã nguồn:** Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết quy trình đóng góp.
- **Lịch sử thay đổi:** Xem [CHANGELOG.md](CHANGELOG.md) theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## 📄 Giấy phép

Dự án được phân phối dưới giấy phép **MIT** (OSI-approved). Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

Mỗi file mã nguồn `.ts` / `.tsx` đều chứa tiêu đề giấy phép:

```typescript
/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */
```

---

## 🏆 OLP 2025 — Tuân thủ tiêu chí PMNM

Dự án đáp ứng đầy đủ các tiêu chí chấm điểm **Phần mềm nguồn mở — Olympic Tin học Sinh viên Việt Nam 2025**:

| # | Tiêu chí | Trạng thái | Chi tiết |
|---|---|---|---|
| 1 | Hệ thống quản lý mã nguồn công khai | ✅ | [github.com/tranquocvu-3011/likefood](https://github.com/tranquocvu-3011/likefood) |
| 2 | Giấy phép OSI-approved | ✅ | MIT License — header trong từng file nguồn |
| 3 | Bản phát hành (release) | ✅ | [v1.0.0](https://github.com/tranquocvu-3011/likefood/releases/tag/v1.0.0) |
| 4 | Build từ mã nguồn | ✅ | `npm install && npm run build` — hướng dẫn đầy đủ ở trên |
| 5 | Thư viện & phụ thuộc | ✅ | `package.json` liệt kê tất cả — 100% open source |
| 6 | Tài liệu | ✅ | README, CHANGELOG, CONTRIBUTING, API docs, bug tracker |

---

## 🚀 Deploy lên VPS (Docker)

```bash
# 1. Clone và cấu hình môi trường
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood
cp .env.production .env.production.local
# Điền các giá trị thật vào .env.production

# 2. Lấy SSL certificate
sudo certbot certonly --standalone -d hoiucngocrong.shop -d www.hoiucngocrong.shop
sudo cp /etc/letsencrypt/live/hoiucngocrong.shop/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/hoiucngocrong.shop/privkey.pem nginx/ssl/

# 3. Khởi chạy với Docker Compose
docker-compose up -d

# 4. Hoặc dùng PM2 (bare-metal)
bash scripts/deploy.sh
```

---

*Phát triển bởi Đội ngũ LIKEFOOD — Vì hương vị quê hương tại nơi xứ người.* 🇻🇳

>>>>>>> 4254fdd (Trần Quốc Vũ)
