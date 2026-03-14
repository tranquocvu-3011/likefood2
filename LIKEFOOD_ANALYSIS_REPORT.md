# LIKEFOOD - Báo Cáo Phân Tích Toàn Bộ Dự Án

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Cấu Trúc Database](#3-cấu-trúc-database)
4. [Cấu Trúc Routes & Pages](#4-cấu-trúc-routes--pages)
5. [API Routes](#5-api-routes)
6. [State Management & Context](#6-state-management--context)
7. [Components](#7-components)
8. [Tính Năng Chính](#8-tính-năng-chính)
9. [AI & Machine Learning](#9-ai--machine-learning)
10. [Bảo Mật & Xác Thực](#10-bảo-mật--xác-thực)
11. [Analytics & Tracking](#11-analytics--tracking)
12. [Integrations](#12-integrations)
13. [Utils & Helpers](#13-utils--helpers)

---

## 1. Tổng Quan Dự Án

### 1.1. Thông Tin Cơ Bản

| Thông tin | Giá trị |
|-----------|---------|
| **Tên dự án** | LIKEFOOD - Đặc sản Việt Nam tại Mỹ |
| **Mô tả** | Nền tảng thương mại điện tử đặc sản Việt Nam tại Hoa Kỳ |
| **Framework** | Next.js 16.1.6 |
| **React** | 19.2.3 |
| **Database** | MySQL với Prisma ORM |
| **Ngôn ngữ** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **License** | MIT |

### 1.2. Mục Tiêu Dự Án

- Cung cấp nền tảng thương mại điện tử chuyên nghiệp cho đặc sản Việt Nam tại thị trường Mỹ
- Tích hợp AI (Google Gemini) để hỗ trợ khách hàng và quản lý
- Đa ngôn ngữ (Tiếng Việt & Tiếng Anh)
- Tích hợp thanh toán Stripe
- Hỗ trợ đầy đủ tính năng e-commerce từ user đến admin

---

## 2. Công Nghệ Sử Dụng

### 2.1. Core Dependencies

```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@prisma/client": "^6.4.0",
    "next-auth": "^4.24.13",
    "stripe": "^17.7.0",
    "@google/generative-ai": "^0.24.1",
    "zod": "^4.3.6",
    "framer-motion": "^12.33.0",
    "lucide-react": "^0.563.0",
    "tailwind-merge": "^3.4.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "bcryptjs": "^3.0.3",
    "nodemailer": "^7.0.13",
    "qrcode": "^1.5.4",
    "canvas-confetti": "^1.9.4"
  }
}
```

### 2.2. Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5",
    "prisma": "^6.4.0",
    "tailwindcss": "^4",
    "eslint": "^8.57.0",
    "vitest": "^4.0.18",
    "tsx": "^4.21.0"
  }
}
```

### 2.3. Infrastructure

| Service | Purpose |
|---------|---------|
| **Upstash Redis** | Rate limiting |
| **Stripe** | Payment processing |
| **Google Gemini** | AI features |
| **Sentry** | Error tracking |
| **Google Analytics 4** | Analytics |
| **Facebook Pixel** | Marketing tracking |

---

## 3. Cấu Trúc Database

### 3.1. Database Schema Overview

Dự án sử dụng **40+ bảng database** với Prisma ORM, lưu trữ trong MySQL. Các bảng được thiết kế với mối quan hệ phức tạp và tối ưu cho hiệu năng.

### 3.2. Các Model Chính

#### 3.2.1. User Model (`user`)

```prisma
model user {
  id                      String    @id @default(cuid())
  email                   String    @unique
  password                String?
  name                    String?
  role                    String    @default("USER")  // USER, ADMIN, SUPER_ADMIN
  phone                   String?
  points                  Int       @default(0)       // Loyalty points
  twoFactorEnabled        Boolean   @default(false)
  emailVerified           DateTime?
  avatarUrl               String?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}
```

**Các trường quan trọng:**
- `email`: Email đăng nhập (unique)
- `password`: Mật khẩu đã hash (bcrypt)
- `role`: Phân quyền người dùng
- `points`: Điểm tích lũy loyalty
- `twoFactorEnabled`: Bật/tắt 2FA

#### 3.2.2. Product Model (`product`)

```prisma
model product {
  id                String   @id @default(cuid())
  name              String
  slug              String?  @unique
  description       String   @db.Text
  price             Float
  salePrice         Float?
  saleStartAt       DateTime?
  saleEndAt         DateTime?
  isOnSale          Boolean  @default(false)
  inventory         Int      @default(0)
  ratingAvg         Float    @default(0)
  ratingCount       Int      @default(0)
  soldCount         Int      @default(0)
  image             String?
  category          String
  featured          Boolean  @default(false)
  isVisible         Boolean  @default(true)
  code              String?  @unique  // SKU
  weight            String?
  deletedAt         DateTime?
  isDeleted         Boolean  @default(false)
}
```

#### 3.2.3. Order Model (`order`)

```prisma
model order {
  id              String   @id @default(cuid())
  userId          String
  status          String   @default("PENDING")
  // PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, COMPLETED, CANCELLED, REFUNDED
  subtotal        Float    @default(0)
  shippingFee     Float    @default(0)
  discount        Float    @default(0)
  total           Float
  couponCode      String?
  paymentMethod   String?
  paymentStatus   String   @default("UNPAID")
  paymentIntentId String?
  trackingCode    String?
  carrier         String?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  createdAt       DateTime @default(now())
}
```

#### 3.2.4. Cart Model (`cart`)

```prisma
model cart {
  id         String     @id @default(cuid())
  userId     String?    @unique      // For logged-in users
  guestToken String?    @unique      // For guest users
  createdAt  DateTime   @default(now())
  items      cartitem[]
}

model cartitem {
  id        String   @id @default(cuid())
  cartId    String
  productId String
  variantId String?           // Product variant (weight, flavor)
  quantity  Int      @default(1)
}
```

### 3.3. Các Bảng Bổ Sung

| Model | Mô tả |
|-------|-------|
| `category` | Danh mục sản phẩm (hỗ trợ đa cấp) |
| `brand` | Thương hiệu sản phẩm |
| `productvariant` | Biến thể sản phẩm (weight, flavor, stock) |
| `productimage` | Hình ảnh sản phẩm |
| `review` | Đánh giá sản phẩm |
| `coupon` | Mã giảm giá |
| `uservoucher` | Voucher của người dùng |
| `wishlist` | Danh sách yêu thích |
| `address` | Địa chỉ giao hàng |
| `notification` | Thông báo |
| `flashsalecampaign` | Chiến dịch flash sale |
| `flashsaleproduct` | Sản phẩm flash sale |
| `pointtransaction` | Lịch sử điểm tích lũy |
| `AiKnowledge` | Kiến thức AI cho chatbot |
| `BehaviorEvent` | Sự kiện hành vi người dùng |
| `ConversationHistory` | Lịch sử chat |
| `DynamicPage` | Trang động |
| `HomepageSection` | Sections trang chủ |
| `MenuItem` | Menu items |
| `banner` | Banners quảng cáo |
| `post` | Bài viết blog |
| `contactmessage` | Tin nhắn liên hệ |

---

## 4. Cấu Trúc Routes & Pages

### 4.1. Shop Routes (Người Dùng)

```
src/app/(shop)/
├── page.tsx                          # Trang chủ
├── products/
│   ├── page.tsx                      # Danh sách sản phẩm
│   ├── [slug]/page.tsx               # Chi tiết sản phẩm
│   └── layout.tsx                    # Layout riêng
├── cart/page.tsx                     # Giỏ hàng
├── checkout/
│   ├── page.tsx                      # Thanh toán
│   └── return/page.tsx               # Return từ Stripe
├── order-success/page.tsx            # Đặt hàng thành công
├── orders/
│   ├── page.tsx                      # Danh sách đơn hàng
│   ├── [id]/
│   │   ├── page.tsx                  # Chi tiết đơn
│   │   └── invoice/page.tsx          # Hóa đơn
├── profile/
│   ├── page.tsx                      # Hồ sơ
│   ├── orders/page.tsx               # Lịch sử đơn
│   ├── wishlist/page.tsx             # Wishlist
│   ├── vouchers/page.tsx             # Voucher
│   ├── points/page.tsx               # Điểm tích lũy
│   └── refunds/page.tsx              # Yêu cầu hoàn tiền
├── flash-sale/page.tsx               # Trang flash sale
├── compare/page.tsx                  # So sánh sản phẩm
├── vouchers/page.tsx                 # Kho voucher
├── posts/
│   ├── page.tsx                      # Danh sách bài viết
│   └── [slug]/page.tsx               # Chi tiết bài viết
├── about/page.tsx                    # Về chúng tôi
├── faq/page.tsx                      # FAQ
├── contact/page.tsx                  # Liên hệ
├── notifications/page.tsx            # Thông báo
└── policies/
    ├── privacy/page.tsx              # Chính sách bảo mật
    ├── terms/page.tsx                # Điều khoản
    ├── shipping/page.tsx             # Chính sách vận chuyển
    └── return/page.tsx               # Chính sách đổi trả
```

### 4.2. Auth Routes

```
src/app/(auth)/
├── layout.tsx                        # Auth layout
├── login/page.tsx                     # Đăng nhập
├── register/page.tsx                 # Đăng ký
├── forgot-password/page.tsx          # Quên mật khẩu
├── reset-password/page.tsx           # Đặt lại mật khẩu
├── verify-email/page.tsx             # Xác thực email
├── verify-pending/page.tsx          # Chờ xác thực
├── resend-verify/page.tsx           # Gửi lại email xác thực
├── magic-link/page.tsx               # Đăng nhập magic link
├── magic-login-success/page.tsx      # Thành công
├── two-factor/page.tsx               # Xác thực 2FA
```

### 4.3. Admin Routes

```
src/app/admin/
├── layout.tsx                        # Admin layout với sidebar
├── page.tsx                          # Dashboard
├── dashboard/page.tsx                # Dashboard chi tiết
├── products/
│   ├── page.tsx                      # Quản lý sản phẩm
│   ├── new/page.tsx                  # Thêm mới
│   └── [id]/edit/page.tsx            # Sửa sản phẩm
├── orders/
│   ├── page.tsx                      # Quản lý đơn hàng
│   └── [id]/page.tsx                 # Chi tiết đơn
├── customers/page.tsx                # Quản lý khách hàng
├── categories/page.tsx               # Quản lý danh mục
├── brands/page.tsx                  # Quản lý thương hiệu
├── coupons/page.tsx                 # Quản lý coupon
├── inventory/page.tsx               # Quản lý tồn kho
├── flash-sales/page.tsx             # Quản lý flash sale
├── posts/
│   ├── page.tsx                      # Quản lý bài viết
│   ├── new/page.tsx                  # Viết bài mới
│   └── [id]/edit/page.tsx            # Sửa bài viết
├── pages/page.tsx                    # Quản lý trang động
├── homepage/page.tsx                 # Quản lý trang chủ
├── menu/page.tsx                     # Quản lý menu
├── analytics/page.tsx                # Thống kê & báo cáo
├── ai/page.tsx                       # AI Assistant
├── cms/page.tsx                      # CMS Dashboard
├── users/page.tsx                    # Quản lý users
└── settings/page.tsx                 # Cài đặt hệ thống
```

### 4.4. Root Routes

```
src/app/
├── layout.tsx                        # Root layout
├── sitemap.ts                        # Sitemap XML
├── robots.ts                         # Robots.txt
├── terms/page.tsx                    # Điều khoản (public)
├── privacy/page.tsx                 # Privacy (public)
├── wishlist/page.tsx                # Wishlist (public)
└── [...slug]/page.tsx               # Dynamic catch-all
```

---

## 5. API Routes

### 5.1. Tổng Quan

Dự án có **136+ API endpoints** được tổ chức theo chức năng.

### 5.2. Core Commerce APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/cart` | GET, POST, DELETE | Giỏ hàng |
| `/api/cart/items/[id]` | PUT, DELETE | Item trong giỏ |
| `/api/orders` | GET, POST | Tạo/lấy đơn hàng |
| `/api/orders/guest` | POST | Đặt hàng (khách) |
| `/api/orders/[id]` | GET | Chi tiết đơn |
| `/api/orders/[id]/cancel` | POST | Hủy đơn |
| `/api/orders/[id]/reorder` | POST | Đặt lại |
| `/api/products` | GET, POST | Danh sách/tạo SP |
| `/api/products/[slug]` | GET, PUT, DELETE | Chi tiết SP |
| `/api/products/search-hints` | GET | Gợi ý tìm kiếm |
| `/api/products/flash-sale` | GET | Flash sale |
| `/api/products/recommendations/fbt` | GET | Mua cùng nhau |
| `/api/products/check-stock` | POST | Kiểm tra tồn kho |
| `/api/categories` | GET, POST | Danh mục |
| `/api/categories/menu` | GET | Menu danh mục |
| `/api/brands` | GET | Thương hiệu |
| `/api/search/suggestions` | GET | Gợi ý tìm kiếm |

### 5.3. Checkout & Payment APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/checkout/create-session` | POST | Tạo Stripe session |
| `/api/checkout/session-status` | GET | Trạng thái thanh toán |
| `/api/payments/create-intent` | POST | Payment intent |
| `/api/payments/qr` | GET | QR thanh toán |
| `/api/payments/public/methods` | GET | Phương thức thanh toán |
| `/api/coupons/validate` | POST | Kiểm tra coupon |
| `/api/coupons/seed` | POST | Seed coupons |
| `/api/vouchers` | GET | Danh sách voucher |
| `/api/vouchers/checkout` | POST | Áp dụng voucher |

### 5.4. User Management APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/user/profile` | GET, PUT | Hồ sơ |
| `/api/user/account` | DELETE | Xóa tài khoản |
| `/api/user/addresses` | GET, POST | Địa chỉ |
| `/api/user/addresses/[id]` | PUT, DELETE | Quản lý địa chỉ |
| `/api/user/orders` | GET | Đơn hàng |
| `/api/user/orders/[id]` | GET | Chi tiết đơn |
| `/api/user/orders/[id]/cancel` | POST | Hủy đơn |
| `/api/user/wishlist` | GET, POST, DELETE | Wishlist |
| `/api/user/vouchers` | GET | Voucher |
| `/api/user/points` | GET | Điểm |
| `/api/user/notifications` | GET, PUT | Thông báo |
| `/api/user/checkin` | POST | Check-in hàng ngày |
| `/api/user/avatar` | POST | Upload avatar |
| `/api/user/stats` | GET | Thống kê user |
| `/api/user/price-alerts` | GET, POST | Báo giá |

### 5.5. Auth APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/auth/register` | POST | Đăng ký |
| `/api/auth/forgot-password` | POST | Quên mật khẩu |
| `/api/auth/reset-password` | POST | Đặt lại mật khẩu |
| `/api/auth/verify-email` | POST | Xác thực email |
| `/api/auth/verify-otp` | POST | Xác thực OTP |
| `/api/auth/resend-verify` | POST | Gửi lại email |
| `/api/auth/magic-link` | POST | Gửi magic link |
| `/api/auth/magic-link/confirm` | POST | Xác nhận magic link |
| `/api/auth/change-password` | POST | Đổi mật khẩu |
| `/api/auth/login-history` | GET | Lịch sử đăng nhập |
| `/api/auth/sessions` | GET, DELETE | Quản lý sessions |
| `/api/auth/2fa/toggle` | POST | Bật/tắt 2FA |
| `/api/auth/2fa/send` | POST | Gửi mã 2FA |
| `/api/auth/2fa/verify` | POST | Xác thực 2FA |

### 5.6. Admin APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/admin/products` | GET, POST | CRUD sản phẩm |
| `/api/admin/products/[id]` | GET, PUT, DELETE | Chi tiết SP |
| `/api/admin/orders` | GET | Danh sách đơn |
| `/api/admin/orders/[id]` | GET, PUT | Chi tiết đơn |
| `/api/admin/orders/[id]/status` | PUT | Cập nhật trạng thái |
| `/api/admin/orders/export` | GET | Export đơn hàng |
| `/api/admin/orders/cleanup` | POST | Cleanup đơn |
| `/api/admin/users` | GET, POST | Users |
| `/api/admin/categories` | GET, POST | Danh mục |
| `/api/admin/site-config` | GET, PUT | Cấu hình |
| `/api/admin/homepage-sections` | GET, PUT | Sections |
| `/api/admin/menu` | GET, PUT | Menu |
| `/api/admin/telegram` | POST | Telegram bot |
| `/api/stats` | GET | Thống kê |
| `/api/admin/analytics/*` | * | Analytics |

### 5.7. AI & Smart Features APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/ai/admin` | POST | AI Admin Assistant |
| `/api/ai/chat` | POST | AI Chatbot |
| `/api/ai/summarize` | POST | Tóm tắt nội dung |
| `/api/recommendations/products` | GET | Gợi ý sản phẩm |
| `/api/recommendations/personalized` | GET | Gợi ý cá nhân |
| `/api/recommendations/related/[id]` | GET | Sản phẩm liên quan |
| `/api/behavior/track` | POST | Theo dõi hành vi |
| `/api/behavior/segments` | GET | Phân khúc user |

### 5.8. Other APIs

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/reviews` | GET, POST | Reviews |
| `/api/reviews/[productId]` | GET | Reviews SP |
| `/api/reviews/featured` | GET | Reviews nổi bật |
| `/api/reviews/check` | GET | Kiểm tra đánh giá |
| `/api/posts` | GET, POST | Blog posts |
| `/api/posts/[slug]` | GET, PUT | Chi tiết post |
| `/api/pages` | GET | Dynamic pages |
| `/api/banners` | GET | Banners |
| `/api/menu` | GET | Menu items |
| `/api/settings` | GET, PUT | Settings |
| `/api/flash-sales` | GET | Flash sales |
| `/api/upload` | POST | Upload file |
| `/api/contact` | POST | Liên hệ |
| `/api/newsletter/subscribe` | POST | Newsletter |
| `/api/feedback` | POST | Feedback |
| `/api/health` | GET | Health check |

---

## 6. State Management & Context

### 6.1. React Context Providers

Dự án sử dụng React Context API để quản lý state toàn cục.

#### 6.1.1. CartContext (`src/contexts/CartContext.tsx`)

```typescript
interface CartItem {
    id: string;           // productId_variantId
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    inventory?: number;
}
```

**Tính năng:**
- Quản lý giỏ hàng với localStorage persistence
- Kiểm tra tồn kho trước khi thêm
- Tự động mở mini cart khi thêm sản phẩm
- Undo khi xóa sản phẩm
- Yêu cầu đăng nhập để thêm vào giỏ
- Tracking events cho GA4

#### 6.1.2. CompareContext (`src/contexts/CompareContext.tsx`)

```typescript
interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image?: string;
    // ...
}
```

**Tính năng:**
- So sánh tối đa 4 sản phẩm
- Lưu vào localStorage
- Kiểm tra trùng lặp

#### 6.1.3. WishlistContext

- Quản lý wishlist
- Sync với database khi đăng nhập
- localStorage cho guest

#### 6.1.4. ChatOpenContext

- Quản lý trạng thái chat AI
- Toggle chat widget

### 6.2. AuthProvider

```typescript
// src/components/shared/AuthProvider.tsx
// - NextAuth session management
// - User role checking
// - Protected routes
```

### 6.3. LanguageProvider

```typescript
// src/lib/i18n/context.tsx
// - i18n support (vi/en)
// - LocalStorage persistence
// - Dictionary loading
```

### 6.4. ThemeProvider

```typescript
// src/lib/theme/ThemeContext.tsx
// - Dark/Light mode
// - LocalStorage persistence
// - System preference detection
```

---

## 7. Components

### 7.1. Component Organization

```
src/components/
├── admin/                    # Admin components
│   ├── ProductEditor.tsx
│   ├── ProductTable.tsx
│   ├── ProductQuickEdit.tsx
│   ├── ProductImport.tsx
│   ├── ImageUpload.tsx
│   ├── PostForm.tsx
│   ├── AdminTopbar.tsx
│   ├── AdminSidebar.tsx
│   └── ...
├── product/                 # Product components
│   ├── ProductCard.tsx
│   ├── ProductCardImage.tsx
│   ├── ProductCardInfo.tsx
│   ├── ProductCardPrice.tsx
│   ├── VariantSelector.tsx
│   ├── WishlistButton.tsx
│   ├── ImageGallery.tsx
│   ├── FrequentlyBoughtTogether.tsx
│   ├── QuickViewModal.tsx
│   ├── StickyBuyBar.tsx
│   ├── RecentlyViewed.tsx
│   └── ...
├── cart/                    # Cart components
│   ├── MiniCart.tsx
│   ├── CartItemList.tsx
│   ├── CartSummary.tsx
│   └── SavedItemsList.tsx
├── checkout/                # Checkout components
│   ├── CheckoutFormSaaS.tsx
│   ├── ShippingForm.tsx
│   ├── OrderSummarySaaS.tsx
│   └── VoucherAndPoints.tsx
├── shared/                  # Shared components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroCarousel.tsx
│   ├── FlashSaleBanner.tsx
│   ├── ChatbotAI.tsx
│   ├── AuthProvider.tsx
│   ├── LiveSalesPopup.tsx
│   ├── FeaturedStickyShowcase.tsx
│   └── ...
├── navbar/                  # Navbar sub-components
│   ├── MegaMenu.tsx
│   ├── LanguageToggle.tsx
│   ├── UserDropdown.tsx
│   ├── SearchSuggestions.tsx
│   └── MobileBottomNav.tsx
├── ui/                      # UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dialog.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Skeleton.tsx
│   ├── PriceDisplay.tsx
│   └── ...
└── ...
```

### 7.2. Key Components Chi Tiết

#### 7.2.1. ProductCard

Thẻ sản phẩm hiển thị:
- Hình ảnh với lazy loading
- Tên sản phẩm
- Giá (gốc + khuyến mãi)
- Badge (hot, new, sale)
- Nút thêm vào giỏ
- Nút yêu thích
- Rating stars

#### 7.2.2. Navbar

- Logo
- Mega menu danh mục
- Search bar với autocomplete
- Language toggle (VI/EN)
- User dropdown
- Cart icon với badge count
- Wishlist icon

#### 7.2.3. CheckoutForm

- Shipping address form
- Shipping method selection
- Payment method selection (Stripe)
- Voucher/points application
- Order summary
- Place order button

#### 7.2.4. AdminSidebar

- Dashboard
- Products
- Orders
- Customers
- Categories
- Brands
- Coupons
- Inventory
- Flash Sales
- Posts
- Pages
- Homepage
- Menu
- Analytics
- AI
- Settings

---

## 8. Tính Năng Chính

### 8.1. E-commerce Core

#### 8.1.1. Quản Lý Sản Phẩm

- **Sản phẩm đơn:** Tên, mô tả, giá, tồn kho
- **Biến thể:** Weight, flavor, SKU, stock riêng
- **Giảm giá:** Giá khuyến mãi với thời hạn
- **Flash Sale:** Giới hạn mua per user
- **Danh mục:** Đa cấp (parent/child)
- **Tags:** Phân loại sản phẩm
- **Hình ảnh:** Multiple images, media
- **Specifications:** Thông số kỹ thuật
- **Shipping:** Thông tin vận chuyển
- **SEO:** Structured data, meta tags

#### 8.1.2. Giỏ Hàng & Checkout

- **Guest Cart:** Cookie-based, 30 days
- **User Cart:** Database persistent
- **Stock Check:** Real-time validation
- **Quantity Limits:** Max per product
- **Price Calculation:** Server-side, secure
- **Coupon:** Percentage/Fixed, validation
- **Points Redemption:** 100 points = $1
- **Shipping Methods:**
  - Standard: $5.99
  - Express: $12.99
  - Overnight: $24.99
- **Free Shipping:** $500+

#### 8.1.3. Quản Lý Đơn Hàng

**Trạng thái đơn:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED → COMPLETED
                                   ↓
                              CANCELLED
                                   ↓
                                REFUNDED
```

**Tính năng:**
- Order timeline/events
- Cancel with time limit
- Refund requests
- Invoice generation
- Tracking code
- Order events log

### 8.2. Authentication & Security

#### 8.2.1. Đăng Nhập/Đăng Ký

- **Email/Password:** Traditional login
- **Google OAuth:** NextAuth Google provider
- **Magic Link:** Passwordless login
- **2FA:** Time-based OTP

#### 8.2.2. User Roles

| Role | Description |
|------|-------------|
| `USER` | Regular customer |
| `ADMIN` | Site administrator |
| `SUPER_ADMIN` | Super administrator |

#### 8.2.3. Security Features

- Rate limiting (Upstash Redis)
- Input validation (Zod)
- Password hashing (bcrypt, 12 rounds)
- Email verification
- 2FA support
- Session management
- Login history
- Suspicious login detection
- Captcha (Turnstile)

### 8.3. Marketing Features

#### 8.3.1. Voucher System

```typescript
interface Coupon {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number;
    startDate: DateTime;
    endDate: DateTime;
    usageLimit?: number;
    usedCount: number;
}
```

- Percentage hoặc fixed discount
- Minimum order value
- Maximum discount cap
- Usage limits
- User-specific vouchers

#### 8.3.2. Loyalty Points

- **Earn:** 1 point per $1 spent
- **Daily Check-in:** Bonus points
- **Redeem:** 100 points = $1 at checkout
- **History:** Full transaction log

#### 8.3.3. Flash Sale

- Campaign management
- Time-based pricing
- Per-user limits (default: 5)
- Stock limits

### 8.4. User Features

| Feature | Description |
|---------|-------------|
| Profile | Update name, phone, avatar |
| Addresses | Multiple shipping addresses |
| Orders | Order history & tracking |
| Wishlist | Save products |
| Vouchers | Collected vouchers |
| Points | Loyalty points |
| Notifications | In-app notifications |
| Check-in | Daily check-in rewards |

---

## 9. AI & Machine Learning

### 9.1. AI Services Architecture

```
src/lib/ai/
├── admin-service.ts         # Admin AI assistant
├── chatbot.ts               # Customer chat
├── enhanced-chatbot.ts      # Enhanced chatbot
├── recommendation-engine.ts # Product recommendations
├── gemini-runtime.ts        # Gemini API wrapper
├── content-generator.ts      # Content generation
├── knowledge-base.ts        # Knowledge management
├── knowledge-base-generator.ts
├── product-analysis.ts      # Product analysis
├── product-service.ts       # AI product services
├── intent-classifier.ts    # User intent classification
├── user-segmentation.ts    # User segmentation
├── safety-guard.ts         # Content safety
└── context-manager.ts      # Chat context
```

### 9.2. Admin AI Service (`admin-service.ts`)

```typescript
// AI Analytics Insights
export async function getAIAnalyticsInsights(salesData: SalesData[])

// AI Inventory Forecast  
export async function getAIInventoryForecast(products: ProductData[])

// AI Customer Insights
export async function getAICustomerInsights(customers: CustomerData[])

// AI Product Recommendations
export async function getAIProductRecommendations(products: ProductData[])

// AI Content Analysis
export async function getAIContentAnalysis(content: string)

// AI Marketing Email
export async function generateMarketingEmail(type, context)

// AI SEO Suggestions
export async function getAISEOSuggestions(productName, category, description)

// AI Pricing Strategy
export async function getAIPricingStrategy(product, competitors)

// AI Summary
export async function getAISummary(data)

// AI Chat Response
export async function getAIChatResponse(message, context)
```

### 9.3. Recommendation Engine (`recommendation-engine.ts`)

```typescript
type RecommendationType =
  | "frequently_bought_together"  // Mua cùng nhau
  | "similar"                      // Sản phẩm tương tự
  | "personalized"                 // Cá nhân hóa
  | "trending"                     // Đang hot
  | "cross_sell"                   // Bán chéo
  | "up_sell"                      // Bán nâng cấp
  | "new_arrivals"                 // Hàng mới
  | "based_on_history";            // Dựa trên lịch sử
```

**Algorithms:**
- **Frequently Bought Together:** Market basket analysis
- **Similar:** Category + price + brand matching
- **Personalized:** User behavior + preferences
- **Trending:** Sales velocity ranking
- **Cross-sell:** Category complementarity
- **Up-sell:** Higher-tier alternatives

### 9.4. Chatbot (`chatbot.ts`)

```typescript
interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

// Features:
// - Product recommendations
// - Shipping/payment info
// - Order tracking guidance
// - FAQ responses
// - Quick fallback answers
```

**Knowledge Base:**
- Shipping policies
- Payment methods
- Return policies
- Product categories
- Order tracking

### 9.5. Google Gemini Integration

```typescript
// src/lib/ai/gemini-runtime.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function getGeminiModel(config) {
    const model = genAI.getModel(config.model || "gemini-2.0-flash");
    return model;
}
```

---

## 10. Bảo Mật & Xác Thực

### 10.1. Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌────────────────┐   │
│  │  User    │───▶│  Login Form  │───▶│  NextAuth      │   │
│  │          │    │  (email/pass │    │  Credentials   │   │
│  │          │    │   or OAuth)  │    │  Provider      │   │
│  └──────────┘    └──────────────┘    └───────┬────────┘   │
│                                              │             │
│                                              ▼             │
│                                    ┌───────────────────┐   │
│                                    │  Validate         │   │
│                                    │  credentials      │   │
│                                    └───────┬───────────┘   │
│                                            │             │
│                                            ▼             │
│                              ┌─────────────────────────┐   │
│                              │  Check 2FA (if enabled)│   │
│                              └───────────┬─────────────┘   │
│                                          │                 │
│                                          ▼                 │
│                              ┌─────────────────────────┐   │
│                              │  Create JWT Session    │   │
│                              │  (7 days default,      │   │
│                              │   30 days if remember) │   │
│                              └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.2. Security Measures

| Measure | Implementation |
|---------|----------------|
| **Password** | bcrypt hashing, 12 rounds |
| **Session** | JWT, 7-30 days |
| **Rate Limiting** | Upstash Redis |
| **Input Validation** | Zod schemas |
| **SQL Injection** | Prisma parameterized queries |
| **XSS** | React escaping, sanitization |
| **CSRF** | Next.js built-in |
| **2FA** | TOTP-based OTP |
| **Captcha** | Cloudflare Turnstile |
| **Email Validation** | MX record check |
| **Disposable Email** | Block list check |

### 10.3. Rate Limiting Config

```typescript
// src/lib/ratelimit.ts
export const loginRateLimit =     // 5 attempts/15 min
export const registerRateLimit =   // 3 attempts/hour
export const checkoutRateLimit =  // 10 orders/hour
export const apiRateLimit =       // 100 requests/min
export const otpRateLimit =       // 5 attempts/15 min
export const admin2FARateLimit =  // 3 attempts/10 min
```

---

## 11. Analytics & Tracking

### 11.1. Tracking Events (`src/lib/tracking.ts`)

```typescript
// GA4 eCommerce Events
const TRACKING_EVENTS = [
    'view_home',
    'view_item_list', 
    'view_item',
    'search',
    'add_to_cart',
    'remove_from_cart',
    'view_cart',
    'begin_checkout',
    'add_shipping_info',
    'add_payment_info',
    'purchase',
    'select_item',
    'select_promotion',
    'filter_apply',
    'sort_apply'
];

// Helper functions
export const tracking = {
    viewHome: () => ...,
    viewItemList: (category, searchTerm) => ...,
    viewItem: (productId, name, price, category) => ...,
    search: (term, resultsCount) => ...,
    addToCart: (productId, name, price, quantity) => ...,
    removeFromCart: ...,
    viewCart: ...,
    beginCheckout: ...,
    purchase: (orderId, value, items) => ...,
    // ...
};
```

### 11.2. Behavior Tracking

```typescript
// src/lib/analytics/behavior.ts
// Track user sessions, page views, clicks
// Store in BehaviorEvent table
// Used for personalization
```

### 11.3. Integrations

| Service | Purpose |
|---------|---------|
| GA4 | Web analytics |
| GTM | Tag management |
| Facebook Pixel | Ad tracking |
| Sentry | Error tracking |

---

## 12. Integrations

### 12.1. Stripe Integration

```typescript
// src/lib/stripe.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Checkout Session
const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [...],
    success_url: "...",
    cancel_url: "...",
    customer_email: user.email,
    metadata: { orderId, userId }
});
```

**Features:**
- Embedded checkout
- Payment intent
- Webhook handling
- Refund processing

### 12.2. Email Integration

```typescript
// src/lib/mail.ts
// Uses nodemailer with SMTP
// Email types:
// - Verification
// - Order confirmation
// - Password reset
// - Suspicious login warning
```

### 12.3. Telegram Integration

```typescript
// src/lib/telegram.ts
// Send order notifications to admin
// Order alerts
// Daily reports
```

---

## 13. Utils & Helpers

### 13.1. Validation (`src/lib/validations/`)

```typescript
// Zod schemas for input validation
import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().cuid(),
    variantId: z.string().cuid().optional(),
    quantity: z.number().int().min(1).max(99)
});

export const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number()
    })),
    shippingAddress: z.string(),
    // ...
});
```

### 13.2. Commerce Utils (`src/lib/commerce.ts`)

```typescript
export const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PROCESSING: "PROCESSING",
    SHIPPING: "SHIPPING",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED"
};

export const DEFAULT_SHIPPING_FEE_USD = 5.99;
export const EXPRESS_SHIPPING_FEE_USD = 12.99;
export const OVERNIGHT_SHIPPING_FEE_USD = 24.99;
export const FREE_SHIPPING_THRESHOLD_USD = 500;

export function getShippingFeeUsd(subtotal, method) { ... }
export function normalizeOrderStatus(status) { ... }
```

### 13.3. i18n (`src/lib/i18n/`)

```typescript
// src/lib/i18n/dictionaries/vi.ts
export const vi = {
    common: {
        search: "Tìm kiếm...",
        cart: "Giỏ hàng",
        login: "Đăng nhập",
        // ...
    },
    navbar: { ... },
    product: { ... },
    cart: { ... },
    checkout: { ... },
    // ... 800+ lines
};

// src/lib/i18n/dictionaries/en.ts
export const en = { ... };
```

### 13.4. Other Utils

| File | Purpose |
|------|---------|
| `lib/utils.ts` | Common utilities |
| `lib/slug.ts` | Slug generation |
| `lib/currency.ts` | Currency formatting |
| `lib/rating.ts` | Rating calculations |
| `lib/sanitize.ts` | HTML sanitization |
| `lib/cache.ts` | Caching utilities |
| `lib/logger.ts` | Logging |
| `lib/env.ts` | Environment variables |

---

## 14. npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "lint": "eslint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "db:studio": "npx prisma studio",
    "db:push": "npx prisma db push",
    "db:migrate": "npx prisma migrate deploy",
    "db:generate": "npx prisma generate",
    "db:seed": "npx prisma db seed",
    "postinstall": "npx prisma generate"
  }
}
```

---

## 15. Environment Variables

```env
# Database
DATABASE_URL=mysql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI
GOOGLE_API_KEY=...

# Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-...
NEXT_PUBLIC_GTM_ID=GTM-...
NEXT_PUBLIC_FB_PIXEL_ID=...

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 16. Kết Luận

### 16.1. Tổng Kết

LIKEFOOD là một **e-commerce platform hoàn chỉnh** với đầy đủ tính năng:

✅ **Core Commerce:** Sản phẩm, giỏ hàng, checkout, đơn hàng, voucher  
✅ **User Management:** Auth đa dạng, profile, addresses, wishlist, points  
✅ **Admin Panel:** Full CRUD, analytics, AI assistant  
✅ **AI Features:** Chatbot, recommendations, analytics, SEO, pricing  
✅ **Multi-language:** Vietnamese + English  
✅ **Payment:** Stripe integration  
✅ **Marketing:** Flash sale, coupons, loyalty, email campaigns  
✅ **SEO:** Full optimization  
✅ **Performance:** Next.js App Router, ISR, caching  
✅ **Security:** Auth, 2FA, rate limiting, validation  

### 16.2. Ưu Điểm

1. **Kiến trúc hiện đại:** Next.js 16, React 19, TypeScript
2. **Type-safe:** Prisma + TypeScript
3. **Bảo mật cao:** 2FA, rate limiting, validation
4. **AI-powered:** Gemini integration
5. **Multi-channel:** Web, mobile-friendly
6. **i18n:** Vietnamese + English
7. **Analytics:** Full tracking

### 16.3. Có Thể Cải Thiện

1. **Testing:** Thêm unit/integration tests
2. **Performance:** Image optimization, CDN
3. **Mobile:** PWA implementation
4. **Notifications:** Push notifications
5. **Multi-vendor:** Seller marketplace

---

**Báo cáo được tạo:** 2026-03-14  
**Dự án:** LIKEFOOD - Vietnamese Specialty Marketplace  
**Phiên bản:** 1.0.0
