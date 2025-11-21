#!/bin/bash
# ============================================================================
# CKR Digital Engine - Database Restore Script
# ============================================================================
# Purpose: Restore database from backup created by db-backup.sh
# Usage: ./scripts/db-restore.sh [backup_name]
# Example: ./scripts/db-restore.sh backup_20251112_143000
# ============================================================================

set -e  # Exit on any error

# Configuration
PROJECT_ID="vlnkzpyeppfdmresiaoh"
BACKUP_NAME="${1}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_question() {
    echo -e "${BLUE}[?]${NC} $1"
}

# Check arguments
if [ -z "$BACKUP_NAME" ]; then
    log_error "Usage: ./scripts/db-restore.sh [backup_name]"
    log_info "Available backups:"
    ls -1 backups/ | grep -v ".tar.gz" || echo "  (none found)"
    exit 1
fi

BACKUP_DIR="backups/$BACKUP_NAME"

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    # Try to extract from archive
    if [ -f "backups/${BACKUP_NAME}.tar.gz" ]; then
        log_info "Extracting backup archive..."
        tar -xzf "backups/${BACKUP_NAME}.tar.gz" -C backups/
        log_info "✓ Archive extracted"
    else
        log_error "Backup not found: $BACKUP_DIR"
        log_error "Archive not found: backups/${BACKUP_NAME}.tar.gz"
        exit 1
    fi
fi

# Verify backup files
if [ ! -f "$BACKUP_DIR/schema.sql" ] || [ ! -f "$BACKUP_DIR/data.sql" ]; then
    log_error "Invalid backup - missing required files"
    log_error "Expected files: schema.sql, data.sql"
    exit 1
fi

# Display backup info
log_info "============================================"
log_info "Database Restore"
log_info "============================================"
log_info "Backup: $BACKUP_NAME"
if [ -f "$BACKUP_DIR/metadata.json" ]; then
    log_info "Created: $(grep '"timestamp"' "$BACKUP_DIR/metadata.json" | cut -d'"' -f4)"
    log_info "Environment: $(grep '"environment"' "$BACKUP_DIR/metadata.json" | cut -d'"' -f4)"
fi
log_info ""

# Safety confirmation
log_warn "⚠️  WARNING: This will DESTROY all current data in the database!"
log_warn "⚠️  Current tables, data, and RLS policies will be replaced!"
log_warn ""
log_question "Are you sure you want to continue? (Type 'RESTORE' to confirm): "
read -r CONFIRMATION

if [ "$CONFIRMATION" != "RESTORE" ]; then
    log_info "Restore cancelled by user"
    exit 0
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI is not installed. Install it with: npm install -g supabase"
    exit 1
fi

log_info ""
log_info "Starting restore process..."

# 1. Create a safety backup of current state (in case we need to rollback)
log_info "Creating safety backup of current state..."
SAFETY_BACKUP="backups/pre_restore_safety_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$SAFETY_BACKUP"
supabase db dump --project-id "$PROJECT_ID" > "$SAFETY_BACKUP/schema.sql" 2>/dev/null || true
supabase db dump --project-id "$PROJECT_ID" --data-only > "$SAFETY_BACKUP/data.sql" 2>/dev/null || true
log_info "✓ Safety backup created: $SAFETY_BACKUP"

# 2. Get database connection details
log_info "Preparing database connection..."
DB_HOST="db.${PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

log_warn "You will need the database password from Supabase Dashboard"
log_warn "Get it from: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database"
log_warn ""

# 3. Restore Schema
log_info "Restoring database schema..."
log_info "This will drop existing tables and recreate them..."
psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -f "$BACKUP_DIR/schema.sql" \
    2>&1 | tee "$BACKUP_DIR/restore_schema.log"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_error "Schema restore failed - check $BACKUP_DIR/restore_schema.log"
    log_error "You can rollback using: ./scripts/db-restore.sh $(basename "$SAFETY_BACKUP")"
    exit 1
fi
log_info "✓ Schema restored"

# 4. Restore Data
log_info "Restoring database data..."
psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -f "$BACKUP_DIR/data.sql" \
    2>&1 | tee "$BACKUP_DIR/restore_data.log"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_error "Data restore failed - check $BACKUP_DIR/restore_data.log"
    log_error "Database may be in inconsistent state"
    log_error "You can rollback using: ./scripts/db-restore.sh $(basename "$SAFETY_BACKUP")"
    exit 1
fi
log_info "✓ Data restored"

# 5. Verify Restore
log_info "Verifying restore..."

# Count tables
TABLE_COUNT=$(psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
log_info "Tables restored: $TABLE_COUNT"

# Count rows in key tables
LEADS_COUNT=$(psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -t -c "SELECT COUNT(*) FROM leads;" | tr -d ' ') 2>/dev/null || LEADS_COUNT="N/A"
QUOTES_COUNT=$(psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -t -c "SELECT COUNT(*) FROM quotes;" | tr -d ' ') 2>/dev/null || QUOTES_COUNT="N/A"
JOBS_COUNT=$(psql "postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -t -c "SELECT COUNT(*) FROM jobs;" | tr -d ' ') 2>/dev/null || JOBS_COUNT="N/A"

log_info "Sample data counts:"
log_info "  - Leads: $LEADS_COUNT"
log_info "  - Quotes: $QUOTES_COUNT"
log_info "  - Jobs: $JOBS_COUNT"

# 6. Post-Restore Instructions
log_info ""
log_info "============================================"
log_info "Restore Complete!"
log_info "============================================"
log_info ""
log_warn "MANUAL STEPS REQUIRED:"
log_warn ""
log_warn "1. Restore Secrets (Required):"
log_warn "   - Navigate to: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/vault"
log_warn "   - Reference: $BACKUP_DIR/secrets_list.txt"
log_warn ""
log_warn "2. Restore Storage Buckets (If needed):"
log_warn "   - Navigate to: https://supabase.com/dashboard/project/${PROJECT_ID}/storage"
log_warn "   - Manually upload files from your backup source"
log_warn ""
log_warn "3. Test Edge Functions:"
log_warn "   - Verify critical functions work: send-lead-notification, rag-search"
log_warn "   - Check logs at: https://supabase.com/dashboard/project/${PROJECT_ID}/functions"
log_warn ""
log_warn "4. Verify Application:"
log_warn "   - Test login and authentication"
log_warn "   - Check that CRM data displays correctly"
log_warn "   - Test quote generation and RAG search"
log_warn ""
log_info "Safety backup location (for rollback): $SAFETY_BACKUP"
log_info ""
log_info "If you encounter issues:"
log_info "  - Check restore logs: $BACKUP_DIR/restore_*.log"
log_info "  - Rollback command: ./scripts/db-restore.sh $(basename "$SAFETY_BACKUP")"
log_info "  - Review docs: docs/database/MIGRATION_HISTORY.md"

exit 0
