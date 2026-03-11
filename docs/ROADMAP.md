# Roadmap

> **LIKEFOOD** — Development roadmap and planned features.

## Current Version: v1.0.0 (Released March 2026)

Core e-commerce platform with AI features, fully deployed and operational.

---

## Short-term (v1.1 — next 3 months)

### Performance
- [ ] Implement Redis caching layer for product listing and category pages
- [ ] Add image optimization with next/image lazy loading throughout
- [ ] Implement virtual scrolling for long product lists
- [ ] Move Prisma client to connection pooling via PgBouncer / PlanetScale

### Features
- [ ] **Push notifications** — Firebase Cloud Messaging (FCM) integration for order updates
- [ ] **Wishlist sharing** — Share wishlists via unique URL
- [ ] **Product bundles** — Admin can create product bundle deals
- [ ] **Multi-currency support** — USD / VND display toggle
- [ ] **Affiliate program** — Referral link tracking and commission

### Developer Experience
- [ ] Add more unit tests — target 90%+ coverage of `lib/` business logic
- [ ] Add E2E tests with Playwright for critical checkout flow
- [ ] Add Storybook for UI component documentation

---

## Medium-term (v1.2 — 6 months)

### AI Enhancements
- [ ] **Personalized email recommendations** — Weekly AI-curated product digest
- [ ] **Visual search** — Search by uploading a food photo
- [ ] **Chatbot memory** — Persist conversation context per session
- [ ] **Sentiment analysis** — Real-time dashboard of customer sentiment trends
- [ ] **Fine-tuned model** — Train on LIKEFOOD product catalog for better recommendations

### Business Features
- [ ] **Subscription boxes** — Monthly specialty food subscription
- [ ] **B2B portal** — Wholesale ordering for restaurants and grocery stores
- [ ] **Vendor marketplace** — Multi-vendor support (sellers can list their own products)
- [ ] **Live streaming commerce** — Product showcase via live stream + instant checkout

### Infrastructure
- [ ] Migrate to Kubernetes for horizontal scaling
- [ ] Add CDN (Cloudflare) for static assets and edge caching
- [ ] Implement event-driven architecture (message queue) for order processing

---

## Long-term (v2.0 — 12+ months)

### Platform Expansion
- [ ] **Mobile app** — React Native iOS + Android
- [ ] **Partner network** — Integration with Vietnamese food importer APIs
- [ ] **Delivery tracking** — Real-time GPS delivery tracking
- [ ] **Physical store integration** — POS system bridge

### AI Vision
- [ ] **Custom AI Model** — Train proprietary model on Vietnamese food product data
- [ ] **AR food preview** — Augmented reality "see food on your table" via mobile camera
- [ ] **AI quality control** — Image recognition for product quality verification

---

## Completed (v1.0.0)

- ✅ Full e-commerce platform (products, cart, checkout, orders)
- ✅ Admin panel with 13+ management modules
- ✅ AI: chatbot, review summary, content generator, inventory forecast, business insights
- ✅ Authentication: email/password, magic link, 2FA, session management
- ✅ Payment: Stripe integration with webhook
- ✅ Loyalty system: LIKEFOOD Xu points + daily check-in
- ✅ Flash sales with countdown timers
- ✅ Coupon/voucher system
- ✅ Product comparison, wishlists, Q&A
- ✅ Bilingual UI (Vietnamese + English)
- ✅ PWA support
- ✅ Docker + Nginx + LetsEncrypt production deployment
- ✅ GitHub Actions CI/CD pipeline
- ✅ MIT License, full OSS compliance

---

## Contributing to the Roadmap

Have an idea? Open a [Feature Request](https://github.com/tranquocvu-3011/likefood/issues/new?template=feature_request.yml) on GitHub Issues.

We prioritize features based on:
1. User impact (how many users benefit)
2. Alignment with contest/academic goals
3. Complexity vs. value ratio
4. Community interest (upvotes on issues)
