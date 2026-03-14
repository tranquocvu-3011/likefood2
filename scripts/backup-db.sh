#!/bin/bash
#
# LIKEFOOD — DB-001: Automated MySQL Backup Script
# Tạo backup MySQL database hàng ngày, giữ các bản gần nhất.
#
# Usage:
#   bash scripts/backup-db.sh
#
# Crontab (daily at 3 AM):
#   0 3 * * * /path/to/likefood/scripts/backup-db.sh >> /var/log/likefood-backup.log 2>&1
#
# Environment Variables Required:
#   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
#   BACKUP_DIR (optional, default: ./backups)
#   BACKUP_RETENTION_DAYS (optional, default: 30)
#

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-likefood}"
BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# ─── Derived variables ───────────────────────────────────────
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# ─── Create backup directory ─────────────────────────────────
mkdir -p "${BACKUP_DIR}"

echo "===== LIKEFOOD DB Backup ====="
echo "Time:     $(date -Iseconds)"
echo "Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "Target:   ${BACKUP_FILE}"
echo ""

# ─── Run mysqldump ────────────────────────────────────────────
echo "[1/3] Creating database backup..."
mysqldump \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USER}" \
    --password="${DB_PASSWORD}" \
    --single-transaction \
    --routines \
    --triggers \
    --set-gtid-purged=OFF \
    --no-tablespaces \
    "${DB_NAME}" | gzip > "${BACKUP_FILE}"

# ─── Verify backup ───────────────────────────────────────────
FILESIZE=$(stat -f%z "${BACKUP_FILE}" 2>/dev/null || stat --format=%s "${BACKUP_FILE}" 2>/dev/null || echo 0)
if [ "${FILESIZE}" -lt 1000 ]; then
    echo "⚠️ WARNING: Backup file is suspiciously small (${FILESIZE} bytes)!"
    echo "Check database connection and credentials."
    exit 1
fi

echo "[2/3] Backup completed: ${FILESIZE} bytes"

# ─── Clean up old backups ────────────────────────────────────
echo "[3/3] Cleaning up backups older than ${RETENTION_DAYS} days..."
DELETED=$(find "${BACKUP_DIR}" -name "${DB_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -print -delete | wc -l)
echo "Deleted ${DELETED} old backup(s)"

echo ""
echo "✅ Backup successful: ${BACKUP_FILE}"
echo "===== Done ====="
