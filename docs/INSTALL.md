# Installation Guide

> **LIKEFOOD** — Vietnamese Specialty Marketplace  
> Full local development setup guide.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 20.0.0 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 10.0.0 | Bundled with Node.js |
| MySQL | ≥ 8.0 | Or use Docker (see below) |
| Git | any | [git-scm.com](https://git-scm.com) |

## Step 1 — Clone the Repository

```bash
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood
```

## Step 2 — Install Dependencies

```bash
npm install
```

This will also automatically run `npx prisma generate` to generate the Prisma client (via `postinstall` hook).

## Step 3 — Configure Environment Variables

```bash
cp .env.example .env
```

Then open `.env` and fill in the required values. See the table below:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | MySQL connection string, e.g. `mysql://root:password@localhost:3306/likefood` |
| `NEXTAUTH_URL` | ✅ | Base URL of the app, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅ | Random secret string (min 32 chars). Generate: `openssl rand -base64 32` |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key from [aistudio.google.com](https://aistudio.google.com) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (use test key for local: `sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Optional | For local Stripe webhook testing |
| `SMTP_HOST` | ✅ | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | ✅ | SMTP port (e.g. `587` for TLS) |
| `SMTP_USER` | ✅ | SMTP username / email address |
| `SMTP_PASS` | ✅ | SMTP password or App Password |
| `SMTP_FROM` | ✅ | Sender email, e.g. `LIKEFOOD <noreply@likefood.com>` |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis token |
| `SENTRY_DSN` | Optional | Sentry DSN for error monitoring |
| `ALLOWED_ORIGIN` | Optional | CORS allowed origin (default: `NEXTAUTH_URL`) |
| `ADMIN_2FA_SECRET` | Optional | Admin 2FA HMAC secret (min 32 chars) |

### Getting API Keys

- **Gemini:** [aistudio.google.com](https://aistudio.google.com) → Get API key (free tier available)
- **Stripe:** [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API keys
- **Upstash:** [upstash.com](https://upstash.com) → Create Redis database → REST API

## Step 4 — Set Up the Database

### Option A — Local MySQL

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE likefood CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Push schema (creates all tables)
npm run db:push

# Seed with sample data (products, coupons, admin user)
npm run db:seed
```

### Option B — MySQL via Docker

```bash
docker run -d \
  --name likefood-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=likefood \
  -p 3306:3306 \
  mysql:8.0

# Wait ~10 seconds for MySQL to start, then:
npm run db:push
npm run db:seed
```

## Step 5 — Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6 — Access Admin Panel

After seeding, the default admin account is:

```
Email:    admin@likefood.com
Password: Admin@123456
```

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Security Note:** Change the default admin password immediately after first login.

## Verify Installation

Run the quality checks to confirm everything is working:

```bash
# TypeScript — should report 0 errors
npm run type-check

# ESLint — should report 0 warnings
npm run lint

# Unit tests — should pass 74/74
npm run test:run

# Full build — should succeed
npm run build
```

## Troubleshooting

### `prisma generate` fails
```bash
npm run db:generate
```

### Database connection refused
- Ensure MySQL is running: `mysqladmin ping -u root -p`
- Check `DATABASE_URL` in `.env`

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Missing environment variable errors
- Ensure all required variables in `.env.example` are set in `.env`

---

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.
