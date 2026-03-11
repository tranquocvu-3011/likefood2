# Deployment Guide

> **LIKEFOOD** — Production deployment guide for VPS (Docker Compose) and PM2.

## Prerequisites

- A Linux VPS (Ubuntu 22.04 LTS recommended)
- Docker + Docker Compose installed
- Domain name pointed to your VPS IP
- Node.js ≥ 20 (for PM2 option)

## Option A — Docker Compose (Recommended)

### 1. Clone and configure

```bash
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood

# Copy and fill production environment
cp .env.example .env.production
nano .env.production
# Fill in all required values with production credentials
```

### 2. Set up SSL (LetsEncrypt)

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to nginx/ssl/
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem
```

### 3. Configure Nginx

Edit `nginx/nginx.conf` and replace `hoiucngocrong.shop` with your domain.

### 4. Launch

```bash
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 5. Initialize database

```bash
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed
```

### Update / Redeploy

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

---

## Option B — PM2 (Bare-metal)

### 1. Install Node.js and PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Build and start

```bash
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood
cp .env.example .env
# Fill .env with production values
npm install
npm run db:push
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Use the deploy script

```bash
# Full deploy
bash scripts/deploy.sh

# Quick redeploy (skip build)
bash scripts/deploy.sh --no-build
```

---

## Environment Variables for Production

In addition to the variables in [INSTALL.md](INSTALL.md), set these for production:

| Variable | Production Value |
|----------|-----------------|
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `STRIPE_SECRET_KEY` | Live key: `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Register your production webhook in Stripe dashboard |
| `NODE_ENV` | `production` (set automatically by Next.js) |

## Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## SSL Auto-renewal

```bash
# Add cron job for auto-renewal
echo "0 0 1 * * certbot renew --quiet && docker-compose restart nginx" | sudo crontab -
```

## Monitoring

- **Sentry:** Errors are automatically reported to your Sentry project if `SENTRY_DSN` is configured.
- **PM2 Monitor:** `pm2 monit`
- **Logs:** `docker-compose logs -f app` or `pm2 logs`

## Health Check

```bash
curl https://yourdomain.com/api/health
# Expected: {"status":"ok"}
```
