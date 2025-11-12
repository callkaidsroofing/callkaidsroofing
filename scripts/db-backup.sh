#!/bin/bash
# ============================================================================
# CKR Digital Engine - Database Backup Script
# ============================================================================
# Purpose: Create comprehensive backups of Supabase database and storage
# Usage: ./scripts/db-backup.sh [environment] [backup_name]
# Example: ./scripts/db-backup.sh production pre_migration_20251112
# ============================================================================

set -e  # Exit on any error

# Configuration
PROJECT_ID="vlnkzpyeppfdmresiaoh"
ENVIRONMENT="${1:-production}"
BACKUP_NAME="${2:-backup_$(date +%Y%m%d_%H%M%S)}"
BACKUP_DIR="backups/${BACKUP_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Pre-flight checks
log_info "Starting backup process..."
log_info "Environment: $ENVIRONMENT"
log_info "Backup name: $BACKUP_NAME"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI is not installed. Install it with: npm install -g supabase"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
log_info "Created backup directory: $BACKUP_DIR"

# 1. Export Schema (DDL)
log_info "Exporting database schema..."
supabase db dump \
    --project-id "$PROJECT_ID" \
    --schema public \
    --schema auth \
    --schema storage \
    --schema ai \
    --use-copy \
    > "$BACKUP_DIR/schema.sql" 2>/dev/null || {
    log_error "Schema export failed"
    exit 1
}
log_info "✓ Schema exported ($(wc -l < "$BACKUP_DIR/schema.sql") lines)"

# 2. Export Data (DML)
log_info "Exporting database data..."
supabase db dump \
    --project-id "$PROJECT_ID" \
    --data-only \
    --use-copy \
    > "$BACKUP_DIR/data.sql" 2>/dev/null || {
    log_error "Data export failed"
    exit 1
}
log_info "✓ Data exported ($(wc -l < "$BACKUP_DIR/data.sql") lines)"

# 3. Export Storage Buckets (if accessible via API)
log_info "Attempting to backup storage buckets..."
if [ -d ".supabase" ]; then
    # Note: This requires active Supabase connection
    # In production, consider using direct Supabase Storage API
    log_warn "Storage backup requires manual download via Supabase Dashboard"
    log_warn "Navigate to: https://supabase.com/dashboard/project/$PROJECT_ID/storage"
    echo "TODO: Implement storage API backup" > "$BACKUP_DIR/storage_backup_notes.txt"
else
    log_warn "No local Supabase connection found - skipping storage backup"
fi

# 4. Export Secrets List (names only, not values)
log_info "Exporting secrets list (names only)..."
cat > "$BACKUP_DIR/secrets_list.txt" << EOF
# CKR Secrets Configuration (Names Only - Values Not Included)
# Generated: $(date)
# 
# To restore secrets, use Supabase Dashboard or CLI:
# supabase secrets set SECRET_NAME=value

OPENAI_API_KEY
RESEND_API_KEY
BUSINESS_EMAIL
GOOGLE_BUSINESS_API_KEY
GOOGLE_BUSINESS_ACCOUNT_ID
FACEBOOK_PAGE_ACCESS_TOKEN
NOTION_TOKEN
NOTION_DATABASE_ID
# Add other secrets as discovered
EOF
log_info "✓ Secrets list exported"

# 5. Create Metadata File
log_info "Creating backup metadata..."
cat > "$BACKUP_DIR/metadata.json" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "environment": "$ENVIRONMENT",
  "project_id": "$PROJECT_ID",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "created_by": "$(whoami)",
  "backup_type": "full",
  "files": {
    "schema": "schema.sql",
    "data": "data.sql",
    "secrets": "secrets_list.txt",
    "metadata": "metadata.json"
  },
  "stats": {
    "schema_lines": $(wc -l < "$BACKUP_DIR/schema.sql"),
    "data_lines": $(wc -l < "$BACKUP_DIR/data.sql")
  }
}
EOF
log_info "✓ Metadata created"

# 6. Create Compressed Archive
log_info "Creating compressed archive..."
tar -czf "${BACKUP_DIR}.tar.gz" -C backups "$(basename "$BACKUP_DIR")"
ARCHIVE_SIZE=$(du -h "${BACKUP_DIR}.tar.gz" | cut -f1)
log_info "✓ Archive created: ${BACKUP_DIR}.tar.gz ($ARCHIVE_SIZE)"

# 7. Generate Backup Report
log_info "Generating backup report..."
cat > "$BACKUP_DIR/README.md" << EOF
# Database Backup Report

**Backup Name:** $BACKUP_NAME  
**Environment:** $ENVIRONMENT  
**Created:** $(date)  
**Project ID:** $PROJECT_ID

## Contents

- \`schema.sql\` - Complete database schema (DDL)
- \`data.sql\` - All table data (DML)
- \`secrets_list.txt\` - List of required secrets (names only)
- \`metadata.json\` - Backup metadata and statistics

## Restore Instructions

### Full Restore
\`\`\`bash
# 1. Reset database (WARNING: Destroys all data)
supabase db reset

# 2. Restore schema
psql -h db.vlnkzpyeppfdmresiaoh.supabase.co -U postgres -d postgres -f schema.sql

# 3. Restore data
psql -h db.vlnkzpyeppfdmresiaoh.supabase.co -U postgres -d postgres -f data.sql

# 4. Restore secrets via Dashboard
# Navigate to: https://supabase.com/dashboard/project/$PROJECT_ID/settings/vault
\`\`\`

### Selective Restore (Single Table)
\`\`\`bash
# Extract specific table from data.sql
pg_restore -t table_name data.sql
\`\`\`

## Verification

After restore, verify:
- [ ] All tables present: \`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';\`
- [ ] Row counts match: \`SELECT schemaname, tablename, n_live_tup FROM pg_stat_user_tables;\`
- [ ] RLS policies applied: \`SELECT * FROM pg_policies;\`
- [ ] Secrets configured: Check Supabase Dashboard
- [ ] Functions working: Test critical edge functions

## Notes

- This backup does NOT include auth.users passwords (managed by Supabase Auth)
- Storage bucket files require separate backup via Supabase Dashboard
- Edge functions are in Git - no database backup needed
- Migration history preserved in \`supabase_migrations\` table

## Rollback Procedure

If restore fails:
1. Restore from this backup
2. Check \`docs/database/MIGRATION_HISTORY.md\` for rollback SQL
3. Test in development first
4. Contact Supabase support if needed

---
*Generated by CKR Database Backup Script v1.0*
EOF

# Final Summary
log_info ""
log_info "============================================"
log_info "Backup Complete!"
log_info "============================================"
log_info "Backup location: $BACKUP_DIR/"
log_info "Compressed archive: ${BACKUP_DIR}.tar.gz ($ARCHIVE_SIZE)"
log_info ""
log_info "To restore this backup:"
log_info "  ./scripts/db-restore.sh $BACKUP_NAME"
log_info ""
log_warn "IMPORTANT NOTES:"
log_warn "- Storage buckets require manual backup via Supabase Dashboard"
log_warn "- Secrets must be manually reconfigured after restore"
log_warn "- Test restore in development before using in production"
log_info ""
log_info "Backup report: $BACKUP_DIR/README.md"

exit 0
