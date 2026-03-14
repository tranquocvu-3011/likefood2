#!/bin/bash
#
# LIKEFOOD — PAY-001: Stripe Webhook Event Cleanup
# Removes idempotency keys older than 30 days from systemsetting table.
# Run via cron: 0 3 * * 0 /opt/likefood/scripts/cleanup-webhook-events.sh
#
set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-likefood}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

echo "===== LIKEFOOD: Webhook Event Cleanup ====="
echo "Date: $(date)"
echo "Retention: ${RETENTION_DAYS} days"

# Count before
BEFORE=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
    -sN -e "SELECT COUNT(*) FROM systemsetting WHERE \`key\` LIKE 'stripe_event:%';" 2>/dev/null)

echo "Events before cleanup: ${BEFORE}"

# Delete old events
DELETED=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
    -sN -e "DELETE FROM systemsetting WHERE \`key\` LIKE 'stripe_event:%' AND updatedAt < DATE_SUB(NOW(), INTERVAL ${RETENTION_DAYS} DAY); SELECT ROW_COUNT();" 2>/dev/null)

echo "Events deleted: ${DELETED}"

# Count after
AFTER=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
    -sN -e "SELECT COUNT(*) FROM systemsetting WHERE \`key\` LIKE 'stripe_event:%';" 2>/dev/null)

echo "Events remaining: ${AFTER}"
echo "===== Done ====="
