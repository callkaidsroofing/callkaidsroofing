# Supabase Schema Alignment Audit

## 1. Backend Entry Points Analysed
- `src/integrations/supabase/client.ts` and `src/integrations/supabase/types.ts` for Supabase client and generated types.
- React hooks and utilities that read/write Supabase tables (`src/hooks/usePricing.ts`, `src/hooks/useManualRoofMeasurement.ts`, `src/lib/knowledgeBaseLoader.ts`, etc.).
- Feature pages and admin tools that query Supabase (`src/pages/LeadIntelligence.tsx`, `src/pages/MediaLibrary.tsx`, admin CMS pages, and content management components).
- Supabase SQL reference in `schema/supabase_schema.sql` (newly added excerpt from Supabase export) plus the existing migrations in `supabase/migrations`.

## 2. Table & Column Alignment
| Area | Code Reference | Schema Definition | Status | Notes/Fix |
| --- | --- | --- | --- | --- |
| Leads intelligence scoring | `leads` selected with `ai_score` ordered in `src/pages/LeadIntelligence.tsx` | `ai_score` stored as INTEGER (0–10) with optional `ai_tags` in `schema/supabase_schema.sql` | MISMATCH_COLUMN | UI treats `ai_score` as 0–100 and expects richer fields (`ai_tags`, `stage`, `next_action`) that aren’t present; either scale the UI to 0–10 and guard optional fields, or extend schema with those attributes. 【F:schema/supabase_schema.sql†L7-L29】【F:src/pages/LeadIntelligence.tsx†L33-L74】 |
| Manual roof measurements | Insert into `roof_measurements` with `roof_segments`, `perimeter_features`, `hips`, `ridges`, `valleys`, `imagery_quality`, `imagery_date` in `src/hooks/useManualRoofMeasurement.ts` | Table permits those JSONB/text/date columns; non-null `latitude`, `longitude`, `total_area_m2` are supplied. | OK | Data types align (JSONB arrays & date), optional FK fields are omitted safely. 【F:src/hooks/useManualRoofMeasurement.ts†L21-L70】【F:schema/supabase_schema.sql†L83-L111】 |
| Media library listing | Page queries `media_gallery` but uploads insert rows into `content_gallery` (`src/pages/MediaLibrary.tsx`) | `media_gallery` and `content_gallery` are separate tables with different fields | MISMATCH_TABLE | UX mixes two galleries: listing uses `media_gallery` columns (title/category) while uploads go to `content_gallery` (category constrained to specific set). Decide on single target table or map fields correctly to avoid orphaned uploads. 【F:src/pages/MediaLibrary.tsx†L37-L99】【F:schema/supabase_schema.sql†L31-L56】【F:schema/supabase_schema.sql†L58-L81】 |
| Pricing data | Queries `pricing_items`/`pricing_constants` with `active`, `item_category`, `constant_id` filters in `src/hooks/usePricing.ts` | Tables defined with those columns and defaults in `schema/supabase_schema.sql` | OK | Code aligns with schema fields and types (DECIMAL for costs/constants). 【F:src/hooks/usePricing.ts†L20-L87】【F:schema/supabase_schema.sql†L58-L80】 |

## 3. High-Risk Mismatches (Top Priority)
1. **Lead AI scoring scale/fields** – Code orders by and filters on `ai_score` as if it were a 0–100 percentile and expects extra metadata; schema stores 0–10 integer with no stage/next_action. Adjust UI logic or extend schema to match required insights. 【F:supabase/migrations/20251020115037_4889730f-ce9a-4e53-9ac4-f80bcfbb60a0.sql†L118-L123】【F:src/pages/LeadIntelligence.tsx†L33-L74】
2. **Media gallery vs content gallery** – Uploads create records in `content_gallery` but listings read `media_gallery`, resulting in newly uploaded items not appearing. Standardize on one table or synchronize records between them. 【F:src/pages/MediaLibrary.tsx†L37-L99】【F:supabase/migrations/20251111133917_5ace669b-22e2-468f-9888-930d39cea8d3.sql†L1-L22】【F:supabase/migrations/20251110180516_8e82bd67-8832-4ccf-b075-8ac63a2334c6.sql†L1-L20】
3. **Schema excerpt now tracked** – `schema/supabase_schema.sql` is checked in as a reference excerpt; keep it synchronized with the Supabase export and regenerate types when the DB changes.

## 4. Underused / Unused Tables & Features
- **AI/automation logs**: `ai_action_log`, `ai_generation_history`, `ai_optimization_history`, `ai_analysis_cache`, `metrics_learning_log`, `system_audit`, `monitoring_logs` are defined but not referenced in the front-end. Could power AI audit trails and incident dashboards.
- **Knowledge/RAG**: `master_knowledge`, `knowledge_files`, `knowledge_chunks`, `knowledge_uploads`, `sync_rules`, `knowledge_file_versions` exist; only RAG edge functions are invoked. Consider wiring upload/status UIs to track embeddings and sync conflicts.
- **Pricing book**: `pricing_rules`, `pricing_models`, `price_book`, `pricing_constants/items` exist; UI currently only lists items/constants. Extend to manage models/rules and price books for quote builder.
- **Content marketing**: Tables such as `content_blog_posts`, `content_services`, `content_suburbs`, `content_case_studies`, `content_testimonials`, `campaigns`, `post_engagement`, `suburb_analytics`, `business_profile_data` are largely unused in the app. Integrate into CMS dashboards and marketing analytics.
- **Security/observability**: `security_logs`, `security_events`, `security_scan_results`, `monitoring_logs`, `webhook_logs` aren’t surfaced. Add admin reporting to monitor RLS/bucket activity and webhooks.

## 5. Type Safety & RLS Notes
- Generated Supabase types in `src/integrations/supabase/types.ts` cover the schema; they can be leveraged more broadly (many hooks cast to `any`). Regenerate after schema updates: `supabase gen types typescript --project-ref <ref> --linked > src/integrations/supabase/types.ts`.
- Some calls (e.g., `LeadIntelligence`) don’t constrain columns; using typed selects (e.g., `.select<'ai_score, name, ...'>()`) would prevent mismatches and surface missing fields at compile time.
- RLS-sensitive tables (leads, media, roof_measurements, pricing_*) rely on policies defined in migrations. Client-side code passes no user scoping; ensure server-side checks or edge functions enforce ownership when exposing user-modifiable views.

## 6. Recommended Next Actions
1. Align lead scoring UX with schema (0–10) or migrate `ai_score` to percentile and add required columns (`next_action`, `stage`, `ai_tags`).
2. Decide on the canonical gallery table; update Media Library to read/write the same table and honor its constraints.
3. Keep `schema/supabase_schema.sql` synchronized with the latest Supabase export and regenerate Supabase types from it.
4. Expand pricing UI to manage `pricing_models`, `pricing_rules`, and `price_book` to match schema breadth.
5. Surface AI/automation audit tables in an admin dashboard for traceability of edge function activity.
6. Build knowledge base upload/status pages wired to `knowledge_files`, `knowledge_chunks`, and `embedding_jobs` to monitor RAG ingestion.
7. Add admin observability pages for `system_audit`, `security_logs`, and `monitoring_logs` to catch policy or webhook issues.
8. Introduce typed column selections in data-fetching hooks to catch schema drift during build time.
9. Validate RLS coverage for lead/roof measurement inserts; consider moving sensitive mutations to Supabase edge functions with server-side auth checks.
