# CKR Governance & System Rules

1. **Single Source of Truth**
   - Operational knowledge: `/knowledge` and `master_knowledge` table.
   - Public content: `content_*` tables via Admin CMS.

2. **Authorisation (KF_07)**
   - Permitted calls: GitHub commit/PR, Supabase CRUD, Lovable publish, Google Workspace read‑only.

3. **AI Usage**
   - RAG must cite sources. Refresh embeddings on publish/update.

4. **Brand Consistency**
   - Follow BRAND_GUIDE.md for all outputs.

5. **Data & Secrets**
   - PII in Supabase only. Secrets via Vault/Env.
