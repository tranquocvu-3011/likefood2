# LIKEFOOD — Architecture Overview

> **Contest:** Website & AI Innovation Contest 2026 — HUTECH x AZDIGI | OLP 2025 — VFOSSA

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                           │
│           React 19 / Next.js App Router (SSR + ISR)            │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                        │
│              Rate Limiting + SSL Termination                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Node.js)                     │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  App Router │  │ Route Handler│  │   Middleware (Auth,    │ │
│  │  Pages/RSC  │  │   /api/*     │  │   Rate Limit, i18n)   │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Business Logic Layer                │   │
│  │  lib/auth.ts │ lib/stripe.ts │ lib/mail.ts │ lib/ai/*   │   │
│  │  lib/ratelimit.ts │ lib/audit.ts │ lib/security.ts      │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────┬───────────────────────┘
               │                          │
       ┌───────▼──────┐          ┌────────▼───────┐
       │   MySQL 8.0   │          │  Upstash Redis │
       │  (Prisma ORM) │          │ (Rate Limiting)│
       └───────────────┘          └────────────────┘

External Services:
  - Stripe (Payment Processing)
  - Google Gemini API (AI Features)
  - Nodemailer / SMTP (Email)
  - Sentry (Error Monitoring)
```

## Module Structure

```
src/
├── app/                   # Next.js App Router
│   ├── (auth)/            # Authentication routes (login, register, 2FA, magic-link)
│   ├── (shop)/            # Customer-facing storefront
│   │   ├── products/      # Product listing + detail
│   │   ├── cart/          # Cart management
│   │   ├── checkout/      # 3-step checkout flow
│   │   ├── orders/        # Order management + invoices
│   │   ├── flash-sale/    # Flash sale campaigns
│   │   ├── profile/       # User profile + vouchers
│   │   ├── notifications/ # Notification center
│   │   ├── compare/       # Product comparison
│   │   └── posts/         # Blog
│   ├── admin/             # Admin panel (protected by server-side auth)
│   │   ├── dashboard/     # KPIs, charts, AI Insights
│   │   ├── products/      # Product CRUD + variants
│   │   ├── orders/        # Order management + tracking
│   │   ├── customers/     # User management
│   │   ├── flash-sales/   # Flash sale management
│   │   ├── coupons/       # Coupon management
│   │   ├── banners/       # CMS for hero carousel
│   │   ├── blog/          # Blog post editor + AI generator
│   │   ├── inventory/     # Stock overview + AI forecast
│   │   ├── analytics/     # Revenue & order analytics
│   │   └── settings/      # Store configuration
│   └── api/               # REST API Route Handlers (100+ endpoints)
│       ├── auth/          # NextAuth.js endpoints
│       ├── products/      # Products CRUD
│       ├── orders/        # Order processing + guest checkout
│       ├── cart/          # Cart operations
│       ├── stripe/        # Stripe payment + webhook
│       ├── ai/            # AI endpoints (chat, review summary, forecast)
│       └── admin/         # Admin-only endpoints
│
├── components/            # Reusable UI components
│   ├── ui/                # Shadcn UI primitives (button, card, dialog...)
│   ├── shared/            # Navbar, Footer, ChatbotAI, HeroCarousel...
│   ├── product/           # ImageGallery, VariantSelector, ReviewSummaryAI...
│   ├── admin/             # AdminSidebar, AIAssistantWidget, Charts...
│   └── checkout/          # CheckoutStepper, PaymentForm...
│
├── lib/                   # Core business logic
│   ├── ai/                # Gemini AI integration
│   │   ├── chatbot.ts     # Customer chatbot
│   │   ├── content-generator.ts  # Blog/product content
│   │   └── admin-service.ts      # Inventory forecast + insights
│   ├── i18n/              # Internationalization (vi/en)
│   ├── auth.ts            # NextAuth config + 2FA
│   ├── prisma.ts          # Prisma client singleton
│   ├── stripe.ts          # Stripe client
│   ├── mail.ts            # Email sending (Nodemailer)
│   ├── ratelimit.ts       # Upstash Redis rate limiting
│   ├── audit.ts           # Audit log
│   ├── security.ts        # CORS, token helpers
│   └── validation.ts      # Zod schemas
│
├── contexts/              # React Client contexts
│   ├── CartContext.tsx    # Global cart state
│   └── CompareContext.tsx # Product comparison state
│
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type declarations
```

## Key Technical Decisions

### 1. Next.js App Router (RSC + SSR)
- **Why:** Server Components reduce client JavaScript bundle. Route Handlers replace API routes for full control.
- **ISR:** Home page revalidates every 5 minutes (`revalidate = 300`) for fresh data without rebuild.

### 2. Prisma ORM + MySQL
- **Why:** Type-safe database access, automated migrations, schema-as-code.
- **Connection pooling:** Prisma client singleton pattern to avoid connection leaks in serverless.
- **Full-text search:** MySQL's `@@fulltext` + Prisma's `fullTextSearch` preview feature for product search.

### 3. NextAuth.js v4
- **Why:** Production-ready auth with session management out of the box.
- **Customizations:** 2FA OTP, magic link, login history recording, active session management, HMAC-signed admin cookies.

### 4. Upstash Redis Rate Limiting
- **Why:** Serverless-compatible, HTTP-based Redis. No persistent connection required.
- **Implementation:** Per-IP + per-user sliding window on all sensitive endpoints.

### 5. Google Gemini Pro API
- **Why:** Best-in-class multilingual support (Vietnamese), free tier available.
- **Use cases:** Customer chatbot, review summarization, admin content generation, inventory forecasting.

### 6. Stripe Payment
- **Why:** PCI-compliant, webhook support, strong TypeScript SDK.
- **Flow:** Server-side PaymentIntent creation → client-side Stripe Elements → webhook confirmation.

## Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS via Nginx + LetsEncrypt |
| Auth | JWT sessions (NextAuth), bcrypt password hashing |
| 2FA | TOTP OTP sent via email |
| API Protection | Server-side auth check on every route handler |
| Rate Limiting | Upstash Redis sliding window |
| Input Validation | Zod schema on all API inputs |
| SQL Injection | Prisma parameterized queries |
| XSS | Next.js escaping + CSP headers |
| Audit | All admin actions logged to `AuditLog` table |

## Database Schema (Overview)

Managed by **Prisma** with MySQL backend. See `prisma/schema.prisma` for complete schema.

| Group | Models |
|-------|--------|
| Auth & User | `User`, `VerificationToken`, `LoginHistory`, `ActiveSession`, `TwoFactorToken` |
| Catalog | `Brand`, `Product`, `ProductImage`, `ProductVariant`, `ProductView` |
| Commerce | `Cart`, `CartItem`, `Order`, `OrderItem`, `OrderEvent`, `Address` |
| Marketing | `Coupon`, `UserVoucher`, `Notification`, `Banner`, `FlashSaleCampaign` |
| Content | `Post`, `ContactMessage`, `SystemSetting` |
| Loyalty | `Wishlist`, `PointTransaction` |

## Deployment Architecture (Production)

```
Internet
    │
    ▼ :80 / :443
[Nginx] ──────── LetsEncrypt SSL
    │
    ▼ :3000
[Next.js / PM2 or Docker]
    │
    ├── [MySQL 8.0]  (localhost or Docker container)
    └── [Upstash Redis]  (cloud, HTTP-based)

External:
  - Stripe API
  - Google Gemini API
  - SMTP relay (Gmail / SendGrid)
  - Sentry
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.
