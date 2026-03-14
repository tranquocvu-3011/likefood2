# LIKEFOOD Architecture Documentation

## 1. Overview

LIKEFOOD is a Vietnamese specialty e-commerce platform built with modern web technologies, serving customers in the United States.

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL (PlanetScale)
- **Authentication**: NextAuth.js v4
- **Payments**: Stripe
- **AI**: Google Gemini API
- **Infrastructure**: Vercel, Upstash Redis

---

## 2. Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (shop)/            # Public shop routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
│       ├── admin/         # Admin APIs
│       ├── ai/            # AI APIs
│       ├── products/       # Product APIs
│       ├── orders/         # Order APIs
│       └── user/           # User APIs
├── components/             # React components
│   ├── admin/             # Admin components
│   ├── cart/              # Cart components
│   ├── checkout/          # Checkout components
│   ├── product/            # Product components
│   ├── shared/             # Shared components
│   └── ui/                 # UI primitives
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities
│   ├── ai/                # AI utilities
│   ├── i18n/              # Internationalization
│   └── validations/       # Zod schemas
└── types/                 # TypeScript types
```

---

## 3. Authentication & Authorization

### Authentication Flow

1. **Registration**: Email/password with verification
2. **Login**: Credentials or OAuth (Google)
3. **Session**: JWT stored in HTTP-only cookies
4. **2FA**: TOTP-based two-factor authentication

### Authorization

- **Roles**: ADMIN, SUPER_ADMIN, USER
- **Middleware**: Route protection via session checks
- **API**: requireAdmin() wrapper for admin routes

---

## 4. Data Models

### Core Entities

- **User**: Authentication, profile, addresses
- **Product**: Items with variants, inventory
- **Order**: Customer purchases with status
- **Category**: Product categorization
- **Coupon**: Discount codes
- **Post**: Blog content
- **DynamicPage**: CMS pages

### Database Features

- Soft deletes (isDeleted field)
- Timestamps (createdAt, updatedAt)
- Indexes for query optimization
- Transactions for atomic operations

---

## 5. API Architecture

### RESTful Design

```
GET    /api/products          # List products
POST   /api/products          # Create product (admin)
GET    /api/products/[slug]  # Get product
PUT    /api/products/[id]     # Update product (admin)
DELETE /api/products/[id]     # Delete product (admin)
```

### Error Handling

- Standardized error responses via `api-error.ts`
- Zod validation for all inputs
- Rate limiting via Upstash Redis

---

## 6. Security

### Implemented Measures

- Rate limiting (100 requests/10 seconds)
- CSP headers
- CSRF protection
- XSS protection (DOMPurify)
- SQL injection prevention (Prisma)
- Secure cookies (httpOnly, secure, sameSite)
- Password hashing (bcrypt 12 rounds)

---

## 7. Performance

### Optimizations

- Server-side rendering (SSR)
- Static generation (SSG) for static pages
- Image optimization (next/image)
- Code splitting (dynamic imports)
- Tree-shaking (optimizePackageImports)
- Redis caching (Upstash)
- Database connection pooling

---

## 8. SEO

### Implementation

- Dynamic metadata (generateMetadata)
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt
- Semantic HTML
- OpenGraph tags

---

## 9. AI Features

### Gemini Integration

- **Admin Service**: Product insights, analytics
- **Recommendation Engine**: Personalized products
- **Chatbot**: Customer support
- **Content Generation**: Product descriptions

---

## 10. Deployment

### CI/CD

- GitHub Actions workflow
- Linting & type checking
- Unit tests
- Build verification
- Vercel deployment

### Environment Variables

See `.env.example` for required variables.

---

*Last Updated: 2026-03-14*
