# Knowledge Unification Structure

## Overview
Unified schema consolidating all knowledge sources (MKF, GWA, legacy KF) into a single source of truth per MKF_00 precedence rules.

## Unified Taxonomy

### 01. System Governance (`system`)
- **MKF_00**: System Meta & Governance Doctrine
- **CKR_GEM_PERSONA**: AI agent persona definition
- **CKR_SYSTEM_RULES**: Operating rules for Agentic Workers

### 02. Brand Identity (`brand`)
- **MKF_01**: Brand & Voice Mandate (primary)
- **KF_01**: Legacy brand identity (merged)
- Conflict resolution: MKF_01 takes precedence

### 03. Web Design System (`web_design`)
- **MKF_02**: Lovable-native design system

### 04. Marketing & SEO (`marketing`)
- **MKF_03**: SEO Keyword Matrix
- **MKF_06**: Sales Templates & Email Scripts

### 05. Operations (`operations`)
- **MKF_04**: Service Catalog & SOPs (primary)
- **MKF_05**: Pricing Rate Cards & Formulas (primary)
- **KF_02**: Legacy service pricing (merged)
- Conflict resolution: MKF pricing formulas override KF flat rates

### 06. Compliance & Warranty (`compliance`)
- **KF_03**: Warranty Information
- Note: No MKF equivalent yet, KF_03 remains authoritative until MKF created

### 07. Service Areas (`service_areas`)
- **MKF_08**: Suburb Coverage Areas (primary)
- **KF_04**: Legacy service areas (merged)
- Conflict resolution: MKF_08 includes expanded suburb data

### 08. System Integration (`integration`)
- **MKF_07**: System Integration Map

### 09. Workflows (`workflows`)
- **GWA_01-14**: 14 Generative Workflow Automations
  - Lead Intake, Job Activation, Project Closeout
  - Warranty Intake, Reputation Alert, Quote Followup
  - Case Study Drafting, Subcontractor Briefing
  - Marketing Generation, Financial Reporting
  - SOP Risk Assessment, Intelligent Triage
  - Lead Nurture, Systems Orchestrator

## Unified Schema

```sql
CREATE TABLE master_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT NOT NULL UNIQUE,          -- MKF_01, GWA_03, etc.
  title TEXT NOT NULL,
  category TEXT NOT NULL,               -- system, brand, operations, etc.
  subcategory TEXT,                     -- workflows/lead, operations/sop
  doc_type TEXT NOT NULL,               -- policy, style, ops, gwa, data
  
  -- Content
  content TEXT NOT NULL,
  embedding VECTOR(768),
  
  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  supersedes TEXT[],                    -- [KF_01] if MKF_01 merged it
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  priority INTEGER DEFAULT 50,         -- 100=critical, 1=low
  
  -- Status
  active BOOLEAN DEFAULT true,
  source TEXT NOT NULL,                -- 'mkf', 'gwa', 'legacy_kf'
  migration_notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_synced_at TIMESTAMPTZ DEFAULT now()
);
```

## Migration Logic

### Phase 1: Direct Migration
- All 25 `knowledge_chunks` docs → `master_knowledge` (already vectorized)
- Preserve doc_id, embeddings, category

### Phase 2: Legacy KF Merge
- **KF_01** → Merge into MKF_01 (brand)
- **KF_02** → Merge into MKF_05 (pricing)
- **KF_03** → Standalone (no MKF conflict)
- **KF_04** → Merge into MKF_08 (suburbs)

### Phase 3: Conflict Resolution
- Mark superseded docs in `supersedes` array
- Flag semantic conflicts for manual review
- Maintain audit trail in `migration_notes`

## Access Patterns

### Unified Query
```sql
SELECT * FROM master_knowledge 
WHERE active = true 
ORDER BY priority DESC, category, doc_id;
```

### RAG Search
```sql
SELECT *, embedding <=> query_embedding AS distance
FROM master_knowledge
WHERE active = true
ORDER BY distance
LIMIT 5;
```

### By Category
```sql
SELECT category, COUNT(*) as doc_count, 
       SUM(CASE WHEN source = 'mkf' THEN 1 ELSE 0 END) as mkf_docs,
       SUM(CASE WHEN source = 'legacy_kf' THEN 1 ELSE 0 END) as legacy_docs
FROM master_knowledge
WHERE active = true
GROUP BY category;
```

## Precedence Rules (per MKF_00)

1. **MKF > Legacy KF**: Master Knowledge Framework always wins
2. **Version Priority**: Higher version numbers supersede lower
3. **Explicit Supersession**: `supersedes` array defines replacements
4. **Conflict Flagging**: Semantic conflicts marked for admin review

## Implementation Timeline

- ✅ Structure designed
- ⏳ Migration script (next)
- ⏳ Edge function update
- ⏳ UI consolidation
- ⏳ Phase 4: Bulk import remaining MKF files
