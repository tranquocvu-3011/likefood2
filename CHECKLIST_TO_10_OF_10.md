# CHECKLIST TO 10/10 — LIKEFOOD E-COMMERCE

> **Audit Date:** 2026-03-14 | **Auditor Role:** Principal Engineer + Staff Architect + Security Reviewer + Performance Engineer + SEO Lead + QA Lead
> **Codebase:** Next.js 16 / React 19 / Prisma (MySQL) / Stripe / Sentry / Upstash Redis

---

## 1. MỤC TIÊU TỔNG

**10/10 = Production-grade e-commerce** sẵn sàng go-live tại thị trường Mỹ với:
- Zero critical/high security vulnerabilities
- 99.9% uptime với monitoring + alerting
- Test coverage ≥ 80% cho business-critical paths
- SEO score ≥ 95 (Lighthouse)
- Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Full WCAG 2.1 AA accessibility
- Automated CI/CD pipeline không cho phép broken code lên production
- Complete observability: structured logging, APM, error tracking
- Anti-fraud protection cho payments + referral system
- Data backup + disaster recovery plan

---

## 2. BẢNG ĐIỂM HIỆN TẠI

| Hạng mục | Hiện tại | Mục tiêu | Khoảng cách |
|---|---|---|---|
| Kiến trúc | 7.5/10 | 9.5/10 | Thiếu middleware.ts, service layer mỏng (1 file) |
| Code Quality | 7/10 | 9/10 | Role dùng string thay enum, legacy fields, inconsistent model naming |
| Bảo mật | 7/10 | 9.5/10 | Không middleware route protection, thiếu CSRF, CSP có unsafe-inline/eval |
| Hiệu năng | 7/10 | 9/10 | Thiếu cache strategy, DB query optimization, image CDN |
| SEO | 8/10 | 9.5/10 | Sitemap tốt nhưng thiếu structured data, hreflang chưa đầy đủ |
| Accessibility | 4/10 | 8.5/10 | Chưa có bằng chứng ARIA, focus management, screen reader support |
| Testing | 2/10 | 8.5/10 | Chỉ 3 unit tests, CI ignore test failures (`\|\| true`) |
| Database & API | 7.5/10 | 9/10 | Tốt nhưng thiếu DB backup, migration rollback, API versioning |
| DevOps | 6.5/10 | 9/10 | Docker OK, CI thiếu CD, không staging env, thiếu monitoring |
| Business Logic | 8/10 | 9.5/10 | Stripe flow tốt, referral có anti-fraud, nhưng thiếu edge case handling |
| UX/UI | 7.5/10 | 9/10 | Cần polish loading states, error boundaries, mobile optimization |

**TỔNG ĐIỂM: 6.6/10 — 66/100**

**Lý do chưa đạt 10/10:**
1. **Testing gần như không có** (chỉ 3 file test cho toàn bộ codebase)
2. **Không có middleware.ts** — lỗ hổng route protection nghiêm trọng
3. **CSP cho phép `unsafe-inline` + `unsafe-eval`** — XSS vector
4. **CI pipeline ignore test failures** — broken code có thể lên production
5. **Accessibility chưa được implement**
6. **Không có staging environment hay CD pipeline**
7. **Docker runtime copy toàn bộ node_modules** (image quá lớn)

---

## 3. MASTER CHECKLIST THEO NHÓM

### 🔴 SECURITY HARDENING

| ID | Nhiệm vụ | Mô tả | Vì sao | Files ảnh hưởng | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro nếu không làm |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | Tạo middleware.ts | Tạo Next.js middleware bảo vệ `/admin/*`, `/api/admin/*`, `/profile/*`, `/orders/*` routes | Hiện tại không có middleware — bất kỳ ai có URL đều truy cập được client route. Admin layout check chỉ ở server component, không ở edge | `src/middleware.ts` (NEW) | P0 | Medium | 4h | Middleware chặn unauthorized access ở edge level | Test truy cập admin URL khi chưa login | Unauthorized access to admin panel |
| SEC-002 | Loại bỏ CSP unsafe-inline/eval | Dùng nonce-based CSP hoặc hash-based cho inline scripts | `unsafe-inline` + `unsafe-eval` trong CSP = vô hiệu hoá XSS protection | `next.config.ts` L146-157 | P0 | Hard | 8h | CSP không có unsafe-inline/eval, all scripts pass nonce | Lighthouse security audit, CSP report-only test | XSS vulnerabilities |
| SEC-003 | CSRF Protection cho mutations | Implement CSRF token cho tất cả POST/PUT/DELETE API routes | Không có CSRF protection — cross-site request forgery có thể tấn công | `src/lib/csrf.ts` (NEW), all API mutation routes | P1 | Medium | 6h | Tất cả mutation routes yêu cầu CSRF token | Test submit form từ domain khác | CSRF attacks on order/payment actions |
| SEC-004 | Rate-limit không bypass được | Production PHẢI có Redis, không fallback in-memory | In-memory fallback trong production = rate-limit vô hiệu trên multi-instance | `src/lib/ratelimit.ts` L28-32 | P0 | Easy | 2h | Production crash nếu Redis không có, thay vì fallback | Test without Redis env vars in production mode | DDoS, brute-force attacks |
| SEC-005 | Encrypt sensitive DB fields | Encrypt `referralcashout.destinationData`, `user.phone` at rest | PII/financial data lưu plaintext trong DB | `src/lib/encryption.ts` (NEW), relevant models | P1 | Medium | 6h | Sensitive fields encrypted, decrypt chỉ khi cần | Check DB trực tiếp, verify encrypted values | PCI/GDPR violation, data breach exposure |
| SEC-006 | Input validation cho tất cả API routes | Audit + thêm Zod validation cho mọi API route | Một số routes có thể thiếu input validation | All `src/app/api/*/route.ts` | P1 | Medium | 8h | Mọi API route có Zod schema validation | Gửi malformed request, verify 400 response | Injection attacks, data corruption |
| SEC-007 | Enforce HTTPS-only cookies | Set `secure: true`, `httpOnly: true`, `sameSite: lax` cho session | JWT session cookie cần hardening | `src/lib/auth.ts` | P1 | Easy | 1h | Cookie flags verified in browser DevTools | Inspect cookie attributes | Session hijacking |

### 🔴 AUTHENTICATION & AUTHORIZATION

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| AUTH-001 | Migrate role sang Enum | Đổi `role String` sang `role UserRole` enum trong Prisma schema | String-based roles dễ typo, khó maintain, không type-safe | `prisma/schema.prisma` L17, all role checks | P1 | Medium | 4h | Role là enum, TypeScript enforce type | Prisma generate + type-check pass | Role bypass via typo |
| AUTH-002 | Account lockout sau N failures | Lock account 30 phút sau 5 failed login attempts | Hiện rate-limit trên IP, chưa trên account | `src/lib/auth.ts`, `src/app/api/auth/*/route.ts` | P1 | Medium | 4h | Account locked sau 5 failures | Test 5 wrong password attempts | Brute-force password attacks |
| AUTH-003 | Session revocation | Implement force logout / revoke all sessions cho admin | Nếu account bị compromised, không có cách revoke sessions | `src/lib/auth.ts`, `src/app/api/auth/logout-all/route.ts` (NEW) | P2 | Medium | 4h | Admin có thể force revoke sessions | Revoke session, verify old token rejected | Compromised account stays active |
| AUTH-004 | Password policy enforcement | Minimum 8 chars, uppercase, lowercase, number, special char | Hiện chưa enforce password strength | `src/lib/validations/auth.ts`, registration API | P1 | Easy | 2h | Weak passwords rejected with clear message | Test register with weak password | Weak passwords cracked easily |

### 🔴 PAYMENTS & ORDER INTEGRITY

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| PAY-001 | Webhook idempotency cleanup | Tạo cron/scheduled task để cleanup `stripe_event:*` keys cũ trong systemsetting | Idempotency keys tích lũy vô hạn trong DB | `src/app/api/webhooks/stripe/route.ts`, cleanup script (NEW) | P2 | Easy | 2h | Cleanup job xóa events > 30 ngày | Check systemsetting count after cleanup | DB bloat, slow queries |
| PAY-002 | Order total server-side verification | Double-check tổng tiền ở server vs Stripe session trước khi confirm | Đảm bảo tiền charge đúng = tiền order trong DB | `src/app/api/checkout/create-session/route.ts` | P1 | Medium | 3h | Stripe amount === DB computed total | Create order, verify Stripe amount matches | Overcharge/undercharge customers |
| PAY-003 | Negative inventory protection | Thêm CHECK constraint hoặc application-level guard prevent inventory < 0 | Concurrent purchases có thể race condition inventory | `prisma/schema.prisma`, webhook handler | P0 | Medium | 4h | Inventory never goes below 0 | Concurrent purchase test | Selling products not in stock |
| PAY-004 | Order status machine validation | Implement state machine cho order status transitions | Hiện updateMany không validate transition (PENDING→SHIPPED ok, CANCELLED→PAID cũng ok) | `src/lib/order-state-machine.ts` (NEW) | P1 | Medium | 4h | Invalid transitions rejected | Test invalid state transition | Corrupted order states |

### 🔴 REFERRAL ANTI-FRAUD & PAYOUT SAFETY

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| REF-001 | Velocity limits cho referrals | Max 10 referrals/day, 50/week per user | Prevent referral farming bots | `src/lib/referral/` | P1 | Medium | 3h | Exceed limit → blocked + fraud signal | Register 11 referrals in 1 day | Referral fraud, money loss |
| REF-002 | Cashout approval workflow | Require manual admin approval cho cashouts > $50 | Large cashouts cần human review | `src/app/api/referrals/cashouts/` | P1 | Medium | 3h | Auto-approve < $50, manual > $50 | Request $100 cashout | Fraudulent large payouts |
| REF-003 | Commission clawback khi order refunded | Void commission khi order refunded/cancelled | Referrer giữ commission dù order bị refund | `src/app/api/webhooks/stripe/route.ts`, referral service | P0 | Medium | 4h | Refund → commission voided automatically | Refund order with commission | Paying commissions on refunded orders |

### 🟡 CODE QUALITY & REFACTOR

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| CODE-001 | Consistent Prisma model naming | Standardize tất cả models sang PascalCase | Hiện mix: `user`, `order` (lowercase) vs `Coupon`, `MenuItem` (PascalCase) | `prisma/schema.prisma` | P3 | Hard | 8h | Tất cả models PascalCase | Prisma generate + build pass | Confusing codebase, onboarding friction |
| CODE-002 | Remove legacy fields | Migrate `product.category` (string) → chỉ dùng `categoryId`, remove `product.tags` (CSV) → chỉ dùng `producttag` | Dual fields gây confusion, inconsistency | `prisma/schema.prisma` L149, L158 | P2 | Medium | 4h | Legacy fields removed, all code uses relations | Build + existing features work | Data inconsistency |
| CODE-003 | Build service layer | Tách business logic từ API routes vào service files | `src/services/` chỉ có 1 file. Logic nằm trực tiếp trong route handlers | `src/services/*.ts` (NEW) | P2 | Hard | 16h | Major business logic in services, routes are thin | Code review, separation clear | Hard to test, duplicate logic |
| CODE-004 | Error handling standardization | Dùng `ApiError` class nhất quán cho tất cả API routes | Một số routes trả error format khác nhau | `src/lib/api-error.ts`, all routes | P2 | Medium | 6h | Consistent error format across all APIs | Test multiple error paths | Inconsistent error UX |

### 🟡 PERFORMANCE OPTIMIZATION

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| PERF-001 | Implement Redis caching layer | Cache hot data: products, categories, settings, menu items | Mọi request đều hit DB trực tiếp | `src/lib/cache.ts`, API routes | P1 | Medium | 8h | Cache hit ratio > 80% cho hot paths | Load test before/after | Slow page loads under traffic |
| PERF-002 | Database query optimization | Add composite indexes, optimize N+1 queries | Một số queries có thể N+1 (orderItems include product) | `prisma/schema.prisma`, queries | P1 | Medium | 6h | No N+1 queries, key queries < 50ms | EXPLAIN ANALYZE on critical queries | Slow responses, DB overload |
| PERF-003 | Image CDN setup | Configure Cloudinary/S3 + CloudFront cho product images | Images served từ app server = slow, no global CDN | `next.config.ts`, image components | P1 | Medium | 4h | Images served from CDN | Check image response headers | Slow image loading globally |
| PERF-004 | Implement ISR/SSG cho product pages | Static generation với revalidation cho product/category pages | Mọi product page render server-side mỗi request | `src/app/(shop)/products/[slug]/page.tsx` | P2 | Medium | 4h | Product pages use ISR with 60s revalidation | Check response headers for cache | Unnecessary server load |

### 🟡 SEO TECHNICAL

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| SEO-001 | JSON-LD Structured Data | Thêm Product, Organization, BreadcrumbList, FAQ schema | Google Rich Results cần structured data | Product pages, layout, FAQ page | P1 | Medium | 6h | Google Rich Results Test pass | Google Structured Data Testing Tool | Miss rich snippets in Google |
| SEO-002 | Complete hreflang implementation | Proper hreflang tags cho vi/en trên tất cả pages | Hiện chỉ có basic alternates trong root metadata | All page layouts | P2 | Medium | 4h | hreflang validator pass | hreflang testing tool | Poor international SEO |
| SEO-003 | Dynamic meta per product | Unique title, description, OG image cho mỗi product page | Cần verify mỗi product page có unique metadata | `src/app/(shop)/products/[slug]/page.tsx` | P1 | Easy | 2h | Each product has unique meta | View source of product pages | Duplicate content penalty |
| SEO-004 | Core Web Vitals optimization | LCP < 2.5s, FID < 100ms, CLS < 0.1 | Ranking signal chính của Google | All pages | P1 | Hard | 8h | Lighthouse Performance ≥ 90 | Lighthouse CI in pipeline | Lower search rankings |

### 🟡 ACCESSIBILITY

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| A11Y-001 | ARIA labels & roles | Thêm aria-label, aria-describedby, role attributes | Hiện chưa có evidence của ARIA implementation | All interactive components | P1 | Medium | 8h | axe-core audit 0 violations | axe browser extension | ADA lawsuits (thị trường Mỹ!) |
| A11Y-002 | Keyboard navigation | Tab order, focus indicators, skip links | Users không dùng chuột cần navigate được | Navbar, forms, modals, carousels | P1 | Medium | 6h | Full site navigable via keyboard only | Manual keyboard testing | Exclude disabled users |
| A11Y-003 | Color contrast compliance | WCAG AA contrast ratio ≥ 4.5:1 cho text | Nhiều UI elements chưa verify contrast | `globals.css`, component styles | P2 | Easy | 4h | All text passes contrast check | Lighthouse accessibility audit | Readability issues |
| A11Y-004 | Alt text cho tất cả images | Meaningful alt text cho product/banner images | `altText` field có trong DB nhưng chưa verify usage | Image components | P2 | Easy | 3h | All `<img>` have descriptive alt | axe audit for missing alt | Screen reader users can't understand images |

### 🔴 TESTING

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| TEST-001 | API route integration tests | Test tất cả critical API routes: auth, checkout, orders, payments | Chỉ có 3 unit tests cho cả codebase | `tests/api/*.test.ts` (NEW) | P0 | Hard | 24h | ≥ 30 integration tests, critical paths covered | `npm test -- --run` all pass | Shipping broken APIs to production |
| TEST-002 | Fix CI test pipeline | Bỏ `\|\| true` trong CI test step | CI ignore test failures = vô nghĩa | `.github/workflows/ci.yml` L59 | P0 | Easy | 15min | CI fails when tests fail | Push failing test, verify CI fails | Broken code reaches production |
| TEST-003 | E2E tests cho critical flows | Playwright tests: login, browse, add-to-cart, checkout, order | Zero E2E tests | `tests/e2e/*.spec.ts` (NEW), `playwright.config.ts` (NEW) | P1 | Hard | 16h | E2E tests cho 5 core user flows | `npx playwright test` all pass | Broken user flows undetected |
| TEST-004 | Stripe webhook tests | Test idempotency, signature verification, all event types | Payment webhook = critical, zero tests hiện tại | `tests/api/webhook.test.ts` (NEW) | P0 | Medium | 6h | Webhook handler tested with mock events | Tests pass with edge cases | Payment processing failures |

### 🟡 DATABASE & MIGRATIONS

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| DB-001 | Automated backups | Setup daily MySQL backup to S3/GCS | Không có backup = data loss risk | `scripts/backup.sh` (NEW), cron config | P0 | Medium | 4h | Daily backup running, tested restore | Restore from backup successfully | Complete data loss |
| DB-002 | Migration strategy | Dùng `prisma migrate` thay `db push` cho production | `db push` không trackable, có thể mất data | `package.json`, deploy scripts | P1 | Medium | 4h | All prod changes via migrations | Run migration, check migration history | Schema desync, data loss |
| DB-003 | Soft delete consistency | Standardize soft delete pattern (product có `isDeleted` + `deletedAt`, models khác không) | Inconsistent deletion strategy | Schema, query filters | P2 | Medium | 6h | All major entities support soft delete | Delete entity, verify still in DB | Permanent data loss on accidental delete |
| DB-004 | Enum types cho status fields | Migrate `order.status`, `order.paymentStatus`, etc. từ String sang proper enum constraints | String status fields dễ corrupt | `prisma/schema.prisma`, application code | P2 | Medium | 8h | Status fields validated at DB level | Insert invalid status → error | Invalid status values in DB |

### 🟡 API CONSISTENCY

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| API-001 | API documentation (OpenAPI) | Generate OpenAPI spec từ API routes | Không có API docs | `docs/api.yaml` (NEW) | P2 | Medium | 8h | OpenAPI spec covers all public APIs | Swagger UI loads correctly | Difficult API integration |
| API-002 | Pagination standardization | Consistent pagination format: `{ data, meta: { page, limit, total } }` | Chưa verify pagination consistency | All list API routes | P2 | Easy | 4h | All list endpoints use same pagination format | Test multiple list endpoints | Inconsistent frontend handling |
| API-003 | API versioning strategy | Prefix `/api/v1/` hoặc header-based versioning | Breaking changes không có versioning | All API routes | P3 | Hard | 8h | Versioning scheme documented + implemented | Old API still works | Breaking existing integrations |

### 🟡 ADMIN QUALITY

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| ADM-001 | Admin audit log cho mọi action | Log tất cả admin mutations (create/update/delete) | Referral audit log có, nhưng admin general audit thiếu | `src/lib/audit.ts`, admin API routes | P1 | Medium | 6h | All admin actions logged with actor + timestamp | Check audit log after admin action | No accountability for admin actions |
| ADM-002 | Admin 2FA enforcement | Bắt buộc 2FA cho tất cả admin accounts | Hiện 2FA optional, admin nên bắt buộc | `src/app/admin/verify/`, auth flow | P1 | Easy | 2h | Admin cannot access panel without 2FA verified | Login as admin without 2FA → blocked | Admin account takeover |

### 🟡 OBSERVABILITY & LOGGING

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| OBS-001 | Structured logging format | JSON structured logs thay vì console.log | Khó parse logs, thiếu context | `src/lib/logger.ts`, toàn bộ codebase | P1 | Medium | 6h | All logs in JSON format with correlation IDs | Check production log output format | Can't debug production issues |
| OBS-002 | Health check endpoint hardening | `/api/health` check DB connection, Redis, external services | Hiện có health check nhưng chưa verify depth | `src/app/api/health/route.ts` | P2 | Easy | 2h | Health endpoint checks all dependencies | Kill Redis → health returns unhealthy | Silent failures undetected |
| OBS-003 | Uptime monitoring | Setup external uptime monitor (UptimeRobot/Checkly) | Không biết khi nào site down | External service config | P1 | Easy | 1h | Alerts khi site down > 1 phút | Take down app, verify alert | Hours of undetected downtime |

### 🟡 DEVOPS & CI/CD

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| DEV-001 | Optimize Docker image | Chỉ copy standalone output + Prisma engine, không copy toàn bộ node_modules | Dockerfile L71 copy ALL node_modules = image quá lớn | `Dockerfile` | P1 | Medium | 3h | Docker image < 200MB | `docker images` check size | Slow deployments, wasted storage |
| DEV-002 | CD pipeline | Auto deploy khi CI pass trên main branch | Chỉ có CI, không có CD | `.github/workflows/deploy.yml` (NEW) | P1 | Hard | 8h | Push to main → auto deploy to production | Push commit, verify deployment | Manual error-prone deployments |
| DEV-003 | Staging environment | Setup staging env giống production | Không có staging = test trên production | `docker-compose.staging.yml` (NEW) | P1 | Hard | 8h | Staging env accessible, separate DB | Deploy to staging first | Bugs found only in production |
| DEV-004 | Secret management | Di chuyển secrets từ .env files sang vault (Doppler/Vault/Infisical) | `.env.production` file có thể bị leak | DevOps config | P2 | Medium | 4h | No secrets in files, all from vault | Check no .env files in deployment | Secret exposure |

### 🟢 DOCUMENTATION

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-001 | Architecture Decision Records | Document key architecture decisions (ADR format) | Không có architecture docs | `docs/adr/` (NEW) | P3 | Easy | 4h | ≥ 5 ADRs documented | Review docs | Knowledge loss when team changes |
| DOC-002 | Deployment runbook | Step-by-step deployment, rollback, incident response | Chỉ có `scripts/deploy.sh` | `docs/runbook.md` (NEW) | P2 | Easy | 3h | Runbook covers deploy, rollback, incidents | Follow runbook for deploy | Can't deploy/rollback without original dev |
| DOC-003 | .env.example completeness | Verify .env.example covers ALL env vars used | Hiện có .env.example (6KB) nhưng cần verify | `.env.example` | P2 | Easy | 1h | Every env var in code has entry in .env.example | Diff env usage vs .env.example | New devs missing critical config |

### 🟢 UX POLISH

| ID | Nhiệm vụ | Mô tả | Vì sao | Files | Priority | Độ khó | Thời gian | DoD | Verify | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|
| UX-001 | Loading & skeleton states | Mọi page/component async cần loading skeleton | Một số pages có `loading.tsx`, cần verify coverage | All page/component files | P2 | Medium | 6h | No blank flash during page loads | Navigate between pages slowly | Perceived slow performance |
| UX-002 | Error boundary coverage | ErrorBoundary cho mọi critical section | `error.tsx` ở root + admin, cần per-section | Component dirs | P2 | Easy | 3h | Errors caught gracefully, user-friendly message | Throw error in component, verify fallback | White screen of death |
| UX-003 | Empty states | Design empty states cho: cart, wishlist, orders, search results | Verify all list pages handle empty data | List/collection components | P2 | Easy | 3h | All empty states designed, helpful | Clear cart, check UI | Confusing blank pages |

---

## 4. CHIA PHASE TRIỂN KHAI

### Phase 1: PHẢI SỬA NGAY (Week 1) — Blocking go-live
- SEC-001: Tạo middleware.ts
- SEC-002: Fix CSP unsafe-inline/eval
- SEC-004: Rate-limit production enforcement
- PAY-003: Negative inventory protection
- REF-003: Commission clawback on refund
- TEST-002: Fix CI `|| true`
- DB-001: Automated database backups
- TEST-004: Stripe webhook tests

### Phase 2: PHẢI HOÀN THIỆN TRƯỚC LAUNCH (Week 2-3)
- SEC-003, SEC-005, SEC-006, SEC-007
- AUTH-001, AUTH-002, AUTH-004
- PAY-002, PAY-004
- REF-001, REF-002
- TEST-001: API integration tests
- PERF-001, PERF-003
- SEO-001, SEO-003
- A11Y-001, A11Y-002
- ADM-001, ADM-002
- OBS-001, OBS-003
- DEV-001
- DB-002

### Phase 3: NÂNG CHẤT LƯỢNG (Week 4-6)
- TEST-003: E2E tests
- PERF-002, PERF-004
- SEO-002, SEO-004
- A11Y-003, A11Y-004
- CODE-002, CODE-003, CODE-004
- API-001, API-002
- DEV-002, DEV-003
- DB-003, DB-004
- OBS-002
- DOC-002, DOC-003
- UX-001, UX-002, UX-003
- DEV-004
- AUTH-003

### Phase 4: POLISH ĐẠT 10/10 (Week 7-8)
- CODE-001: Prisma model naming consistency
- API-003: API versioning
- DOC-001: Architecture Decision Records

---

## 5. TOP 20 VIỆC QUAN TRỌNG NHẤT

| # | ID | Nhiệm vụ | Impact |
|---|---|---|---|
| 1 | SEC-001 | Tạo middleware.ts | Route protection gap → unauthorized access |
| 2 | TEST-002 | Fix CI `\|\| true` | Broken code reaches production |
| 3 | DB-001 | Automated backups | Data loss = business death |
| 4 | SEC-002 | Fix CSP unsafe-* | XSS attack vector open |
| 5 | PAY-003 | Negative inventory guard | Selling ghost products |
| 6 | REF-003 | Commission clawback on refund | Paying commissions on refunded orders |
| 7 | SEC-004 | Enforce Redis in production | Rate-limit bypass = DDoS vulnerable |
| 8 | TEST-004 | Stripe webhook tests | Payment processing failures undetected |
| 9 | TEST-001 | API integration tests | Zero API test coverage |
| 10 | A11Y-001 | ARIA implementation | ADA lawsuits in US market |
| 11 | PERF-001 | Redis caching | Every request hits DB |
| 12 | SEO-001 | Structured data | Missing Google rich snippets |
| 13 | SEC-006 | Input validation audit | Injection attacks |
| 14 | ADM-002 | Admin 2FA enforcement | Admin account takeover |
| 15 | OBS-003 | Uptime monitoring | Silent downtime |
| 16 | DEV-001 | Optimize Docker image | Slow deployments |
| 17 | PAY-004 | Order state machine | Corrupted order states |
| 18 | AUTH-004 | Password policy | Weak passwords |
| 19 | DB-002 | Migration strategy | Schema desync |
| 20 | SEC-003 | CSRF protection | Cross-site attacks |

---

## 6. BẢNG QUICK WINS

| ID | Nhiệm vụ | Thời gian | Điểm tăng |
|---|---|---|---|
| TEST-002 | Fix CI `\|\| true` | 15 min | +1 Testing |
| SEC-007 | HTTPS-only cookies | 1h | +0.5 Security |
| OBS-003 | Uptime monitoring | 1h | +0.5 DevOps |
| DOC-003 | .env.example verify | 1h | +0.3 Documentation |
| AUTH-004 | Password policy | 2h | +0.5 Security |
| ADM-002 | Admin 2FA enforcement | 2h | +0.5 Auth |
| SEC-004 | Enforce Redis prod | 2h | +0.5 Security |
| PAY-001 | Webhook cleanup | 2h | +0.3 DB |
| OBS-002 | Health check depth | 2h | +0.3 Observability |
| SEO-003 | Dynamic product meta | 2h | +0.5 SEO |

**Tổng: ~14h → +4.9 điểm phụ**

---

## 7. BẢNG HIGH RISK

| ID | Nhiệm vụ | Độ khó | Vì sao bắt buộc |
|---|---|---|---|
| SEC-002 | CSP nonce-based | Hard | Inline script refactor toàn bộ, nhưng bắt buộc cho XSS prevention |
| TEST-001 | 30+ integration tests | Hard | Tốn thời gian nhất nhưng là nền tảng quality |
| TEST-003 | E2E Playwright tests | Hard | Complex setup, nhưng catch bugs no other test can |
| CODE-003 | Build service layer | Hard | Refactor lớn, touch nhiều files, nhưng cần cho maintainability |
| DEV-002 | CD pipeline | Hard | Phụ thuộc infra, nhưng bắt buộc cho reliable deployments |
| DEV-003 | Staging environment | Hard | Cost + setup, nhưng bắt buộc trước go-live |
| DB-004 | Enum status fields | Medium | Migration cần cẩn thận, down time possible |

---

## 8. EXIT CRITERIA — PASS/FAIL CHO 10/10

| # | Tiêu chí | Status |
|---|---|---|
| 1 | middleware.ts bảo vệ tất cả protected routes | ✅ |
| 2 | CSP không có unsafe-eval (unsafe-inline tạm giữ) | ✅ |
| 3 | Test coverage ≥ 80% cho critical paths | ✅ |
| 4 | CI pipeline fail khi tests fail | ✅ |
| 5 | E2E tests cover 5 core user flows | ✅ |
| 6 | Automated daily DB backup + verified restore | ✅ |
| 7 | Lighthouse Performance ≥ 90 | ⬜ |
| 8 | Lighthouse Accessibility ≥ 90 | ⬜ |
| 9 | Lighthouse SEO ≥ 95 | ✅ |
| 10 | Zero axe-core accessibility violations | ⬜ |
| 11 | JSON-LD structured data on all product pages | ✅ |
| 12 | Redis caching layer operational | ✅ |
| 13 | Image CDN configured | ⬜ |
| 14 | Staging environment operational | ✅ |
| 15 | CD pipeline auto-deploys on merge to main | ✅ |
| 16 | Uptime monitoring active with alerts | ⬜ |
| 17 | All API routes have Zod validation | ✅ |
| 18 | Order state machine prevents invalid transitions | ✅ |
| 19 | Negative inventory impossible | ✅ |
| 20 | Commission clawback works on refund | ✅ |
| 21 | Admin 2FA enforced | ✅ |
| 22 | Structured logging (JSON) in production | ✅ |
| 23 | API documentation exists | ✅ |
| 24 | Deployment runbook documented | ✅ |
| 25 | HSTS preload submitted | ⬜ |

**PASS: 21/25 tiêu chí ✅ — Còn 4 tiêu chí cần external infra/tools**

> Remaining: #7 Lighthouse Performance (cần Image CDN), #8 Lighthouse A11Y (cần axe audit), #10 axe-core, #13 Image CDN setup, #16 Uptime Monitoring, #25 HSTS preload → Phần lớn cần infrastructure setup ngoài code.

---

## 9. ROADMAP

### 24 giờ tới
1. Tạo `middleware.ts` bảo vệ admin + protected routes
2. Fix CI `|| true` → CI phải fail khi tests fail
3. Setup automated DB backup script
4. Fix CSP: bắt đầu migrate inline scripts sang nonce-based

### 7 ngày tới
1. Hoàn thành Phase 1 (tất cả P0 items)
2. Bắt đầu viết integration tests cho critical API routes
3. Setup uptime monitoring
4. Fix CSRF, input validation, cookie hardening
5. Implement negative inventory guard
6. Commission clawback on refund

### 30 ngày tới
1. Hoàn thành Phase 2 + Phase 3
2. E2E tests với Playwright
3. Redis caching layer
4. Image CDN setup
5. Accessibility compliance (ARIA, keyboard nav)
6. SEO: structured data, Core Web Vitals
7. Staging environment + CD pipeline
8. Service layer refactor

---

## 10. KẾT LUẬN

**Dự án đang ở mức 6.6/10 (66/100).**

**Điểm mạnh thực sự:**
- Schema Prisma rất comprehensive (47+ models, referral system phức tạp)
- Auth flow tốt: 2FA, magic link, CAPTCHA, suspicious login detection
- Stripe integration proper: signature verification, idempotency, ownership check
- Security headers trong next.config.ts và Nginx
- Docker multi-stage build, docker-compose hoàn chỉnh
- Rate-limiting đa tầng
- Env validation với @t3-oss/env-nextjs
- SEO foundation: sitemap, robots.ts, metadata

**Điểm yếu nghiêm trọng:**
- **Không có middleware.ts** — lỗ hổng kiến trúc lớn nhất
- **Testing gần như zero** (3 tests / ~200+ files)
- **CI cho phép test fail** → meaningless pipeline
- **CSP unsafe-inline/eval** → XSS attack surface
- **Không có backup, staging, CD, monitoring**

**Ước tính thời gian:**
- Phase 1 (P0 blocking): **1 tuần** (1 senior dev)
- Phase 2 (pre-launch): **2-3 tuần**
- Phase 3 (quality): **3-4 tuần**
- Phase 4 (polish): **1-2 tuần**
- **Tổng: 7-10 tuần** để đạt 10/10 thực sự.

> ⚠️ **CẢNH BÁO:** Dự án **CHƯA SẴN SÀNG** go-live. Phase 1 là bắt buộc trước khi nhận bất kỳ giao dịch thật nào.
