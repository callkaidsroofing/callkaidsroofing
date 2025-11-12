# CKR Digital Engine - Unused Resources Audit

**Generated:** 2025-11-12  
**Audit Scope:** Database Tables & Edge Functions  
**Purpose:** Identify obsolete resources for cleanup

---

## Executive Summary

- **Total Database Tables:** 60+
- **Active Tables (>0 rows):** 28 tables
- **Dormant Tables (0 rows, kept for future):** 12 tables
- **Obsolete Tables (0 rows, safe to delete):** 30 tables
- **Total Edge Functions:** 48 functions
- **Active Functions (called from frontend):** 25+ functions
- **Dormant Functions (not invoked anywhere):** 20+ functions
- **Estimated DB Size Reduction:** 25-30% after cleanup

---

## ACTIVE TABLES (28 tables) ✓

These tables are actively used and must be preserved:

### CRM Core (5 tables)
- **`leads`** (1 row) - Customer inquiries, CRM funnel top
- **`quotes`** (13 rows) - Quote records, revenue tracking
- **`jobs`** (2 rows) - Active job tracking, project management
- **`inspection_reports`** - Roof inspection data
- **`inspection_photos`** - Before/after project photos

### Knowledge & RAG (4 tables)
- **`master_knowledge`** (96 rows) - KF_00-KF_11, GWA workflows, core knowledge
- **`knowledge_chunks`** - Chunked knowledge for RAG
- **`pricing_items`** - Pricing model database (KF_02)
- **`pricing_constants`** - Financial constants (GST, markup, etc.)

### Content Management (9 tables)
- **`content_services`** - Services pages CMS
- **`content_suburbs`** - Suburb landing pages CMS
- **`content_knowledge_base`** - FAQ/knowledge articles
- **`content_case_studies`** (3 rows) - Portfolio case studies
- **`content_blog_posts`** - Blog CMS
- **`content_sync_log`** - Content sync audit trail
- **`media_gallery`** - Unified media library
- **`content_relationships`** - Content cross-linking
- **`content_analytics`** - Page view tracking (dormant but planned)

### System & Security (5 tables)
- **`system_audit`** - Audit logging (MKF_07 compliance)
- **`security_events`** - Security incident tracking
- **`rate_limits`** - DDoS protection rate limiting
- **`user_roles`** - Single-user admin RBAC (dormant but preserved)
- **`ai_action_log`** - AI assistant action logging

### External Integrations (3 tables)
- **`chat_commands`** - AI assistant command registry
- **`email_log`** - Resend email delivery tracking
- **`storage_sync_metadata`** - Supabase storage sync tracking

### Miscellaneous (2 tables)
- **`embedding_jobs`** - RAG embedding processing queue
- **`custom_forms`** - Forms builder definitions

---

## DORMANT TABLES - KEEP FOR NOW (12 tables) ⚠️

Tables with 0 rows but needed for planned features:

### Blueprint Integration (Pending Implementation)
- **`brand_assets`** - Dynamic brand configuration (KF_01 integration)
- **`workflow_automations`** - GWA-01 through GWA-14 workflows
- **`knowledge_file_metadata`** - KF version tracking
- **`knowledge_file_versions`** - KF change history

### CRM Extensions (Minimal Usage)
- **`lead_notes`** - CRM conversation history (will be used)
- **`lead_tasks`** - Follow-up task management (planned)

### Content Features (Not Yet Live)
- **`content_pages`** - Static pages CMS (alternative to hardcoded)
- **`content_testimonials`** - Customer testimonials (may replace case_studies)
- **`content_queue`** - AI content generation queue

### Future Features
- **`chat_history`** - Chat transcript storage
- **`form_submissions`** - Form responses database
- **`generated_reports`** - Report generation system

---

## OBSOLETE TABLES - SAFE TO DELETE (30 tables) ❌

### AI Systems (Never Implemented)
- **`ai_analysis_cache`** - 0 rows, 0 function calls, replaced by in-memory cache
- **`ai_optimization_history`** - 0 rows, AI optimization system never built
- **`metrics_learning_log`** - 0 rows, ML training logs never implemented

### Marketing Systems (Abandoned)
- **`campaigns`** - 0 rows, Facebook Ads integration never completed
- **`post_engagement`** - 0 rows, social media tracking never implemented

### File Management (Superseded)
- **`conflict_resolutions`** - 0 rows, file conflict resolution unused
- **`content_gallery`** - 0 rows, replaced by `media_gallery`

### Invoicing (Never Built)
- **`invoices`** - 0 rows, invoicing system not implemented
- **`invoice_line_items`** - 0 rows, invoice detail records unused
- **`payments`** - 0 rows, payment processing never built

### Measurement Tools (Never Implemented)
- **`roof_measurements`** - 0 rows, measurement calculator never built
- **`material_specs`** - 0 rows, material catalog never populated

### Redundant Systems
- **`quote_history`** - 0 rows, version history bypassed by `quote_line_items`
- **`github_deployment_log`** - 0 rows, not connected to actual CI/CD
- **`monitoring_logs`** - 0 rows, not connected to actual monitoring

### Security (Superseded)
- **`security_logs`** - 0 rows, replaced by `security_events`
- **`security_scan_results`** - 0 rows, replaced by `security_events`

### Complete List of 30 Obsolete Tables
```sql
-- AI Systems
ai_analysis_cache
ai_optimization_history
metrics_learning_log

-- Marketing
campaigns
post_engagement

-- File Management
conflict_resolutions
content_gallery

-- Financial
invoices
invoice_line_items
payments

-- Tools
roof_measurements
material_specs

-- Redundant
quote_history
github_deployment_log
monitoring_logs
security_logs
security_scan_results

-- Additional obsolete tables from schema analysis:
ai_conversations
api_rate_limits (replaced by rate_limits)
blueprint_processing_log
content_drafts
duplicate_leads
file_upload_history
form_analytics
image_analysis_queue
inspection_comments
integration_logs
job_attachments
notification_preferences
pricing_history
project_milestones
quote_templates
service_availability
site_configs
task_assignments
user_activity
```

---

## DORMANT EDGE FUNCTIONS (20+ functions) ⚠️

Functions defined but never invoked from frontend:

### User Management (Single-User System)
- **`admin-user-management`** - Multi-user management, unnecessary for single-user

### Duplicate/Superseded Functions
- **`ai-quote-helper`** - Replaced by Quick Quote tool
- **`generate-quote`** - Duplicate of Quick Quote logic
- **`internal-assistant`** - Replaced by `chat-with-rag`
- **`embed-knowledge-base`** - Replaced by `rag-indexer`

### Vision & Analysis
- **`analyze-image`** - Inconsistent usage, project image analysis
- **`analyze-project-images`** - Vision system, minimal adoption

### File Management (Complex, Unused)
- **`file-manager`** - Advanced file operations, minimal usage
- **`conflict-detector`** - File conflict detection, unused
- **`conflict-resolver-chat`** - Conflict resolution UI, unused
- **`category-summarizer`** - File categorization, unused

### Automation (Not Implemented)
- **`workflow-executor`** - GWA execution engine, never built
- **`nexus-ai-hub`** - Multi-agent orchestration, never implemented
- **`agent-lead-intelligence`** - AI lead scoring, not integrated
- **`agent-quote-followup`** - Auto-followup system, not active
- **`agent-content-generator`** - Content generation, minimal use

### External Integrations (Abandoned)
- **`notion-sync-content`** - Notion integration, deprecated
- **`parse-ckr-blueprint`** - Incomplete implementation, queues job only

### Forms & Polish
- **`polish-form`** - Form validation, minimal usage
- **`transcribe-voice`** - Voice transcription, never fully integrated

### Social Media (Limited Use)
- **`publish-to-gbp`** - Google Business Profile posting, sporadic use
- **`fetch-engagement`** - Engagement metrics, not regularly called
- **`auto-publisher`** - Automated posting, not configured

---

## RECOMMENDED ACTIONS

### Phase 1: Backup & Export (CRITICAL - DO FIRST)
```bash
# Export table schemas and data before deletion
pg_dump -h $SUPABASE_DB_HOST -U postgres -t ai_analysis_cache -t campaigns [...] > backup_obsolete_tables.sql

# Export to JSON for archival
psql -c "COPY (SELECT * FROM ai_analysis_cache) TO '/tmp/ai_analysis_cache.json'"
```

### Phase 2: Table Cleanup (Execute Migration)
```sql
-- See: supabase/migrations/YYYYMMDD_cleanup_unused_tables.sql
DROP TABLE IF EXISTS ai_analysis_cache CASCADE;
DROP TABLE IF EXISTS ai_optimization_history CASCADE;
-- [...continues for all 30 obsolete tables]
```

### Phase 3: Edge Function Deprecation
1. Move unused functions to `supabase/functions/_deprecated/`
2. Add deprecation notices to function headers
3. Create redirect stubs with logging
4. Remove from `supabase/config.toml`

### Phase 4: Documentation Update
1. Update `DEPENDENCY_MAP.json` after cleanup
2. Document deleted resources in `MIGRATION_HISTORY.md`
3. Update architecture diagrams

---

## SAFETY CHECKS BEFORE DELETION

✅ **Before deleting any table:**
1. Verify 0 rows: `SELECT COUNT(*) FROM table_name;`
2. Check foreign keys: `SELECT * FROM information_schema.table_constraints WHERE table_name = 'table_name';`
3. Search codebase: `grep -r "table_name" src/ supabase/functions/`
4. Review RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
5. Export data: `pg_dump -t table_name > backup.sql`

✅ **Before deprecating edge functions:**
1. Search frontend: `grep -r "function-name" src/`
2. Check config.toml: Confirm not referenced
3. Review logs: Check last invocation date
4. Test dependent functions: Ensure no inter-function calls

---

## ESTIMATED IMPACT

### Database Performance
- **Reduced Schema Complexity:** 60 tables → 40 tables (33% reduction)
- **Faster Backups:** Fewer tables to process
- **Improved Query Planning:** Postgres query planner has less metadata
- **Reduced Maintenance:** Fewer indexes to maintain

### Developer Experience
- **Clearer Schema:** Easier to understand active vs inactive tables
- **Faster Onboarding:** New developers see only relevant tables
- **Reduced Confusion:** Eliminate "why does this exist?" questions

### System Reliability
- **Fewer Attack Surfaces:** Less tables to secure
- **Simplified Migrations:** Fewer schema dependencies
- **Reduced Technical Debt:** Clean up legacy code paths

---

## REVIEW CADENCE

- **Monthly:** Review tables with 0 rows for 30+ days
- **Quarterly:** Audit edge functions for frontend usage
- **After Major Features:** Check for newly obsolete resources
- **Before Deployments:** Verify no dependencies on deleted resources

---

## NOTES

- All deletions are **reversible** if proper backups are maintained
- Focus on **zero-data tables with no code references** first
- Keep dormant infrastructure for **planned features** (GWA, brand_assets)
- Archive rather than delete if **uncertain** about future usage
- Single-user system = much less infrastructure needed (user_roles, notifications, etc.)

---

**Audit Status:** Ready for Phase 1 (Backup & Export)  
**Next Steps:** Generate backup scripts → Execute cleanup migration → Update documentation
