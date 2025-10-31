# MKF v1.0-2 Integration Plan
**Call Kaids Roofing - Master Knowledge Framework Update**

## 📦 Package Details

**File**: `CKR_MKF_v1_0-2.zip`  
**Upload Date**: 2025-10-31  
**Location**: `knowledge-base/CKR_MKF_v1_0-2.zip`  
**Status**: Ready for extraction and integration

---

## 🎯 Integration Strategy

### Step 1: Extract & Analyze (Manual)

```bash
# Extract to temporary location for analysis
cd knowledge-base
mkdir -p extracted/mkf-v1.0-2
unzip CKR_MKF_v1_0-2.zip -d extracted/mkf-v1.0-2/

# List contents
ls -lah extracted/mkf-v1.0-2/
```

**Expected Files** (based on MKF standards):
- `KF_00_INVARIANTS.md` - Core business invariants
- `KF_02_PRICING_MODEL.json` - Service pricing (CRITICAL)
- `KF_03_05_SOP_ALL.txt` - Standard Operating Procedures
- `KF_06_MARKETING_COPY.md` - Marketing content kit
- `KF_07_LEGAL_WARRANTY.md` - Legal terms
- `KF_08_CASE_STUDIES.json` - Project case studies
- `KF_09_VOICE_TONE.md` - Brand voice guidelines
- `GWA_*.md` - Growth Workflow Automation files (13 workflows)

### Step 2: Compare with Existing Knowledge

Run diff analysis:
```bash
# Compare KF_02 pricing structure
diff extracted/mkf-v1.0-2/KF_02_PRICING_MODEL.json core-knowledge/KF_02_PRICING_MODEL.json

# Check for new GWA workflows
diff -r extracted/mkf-v1.0-2/gwa-workflows/ gwa-workflows/
```

**Critical Questions**:
1. Has KF_02 pricing structure changed? (affects quote builder)
2. Are there new GWA workflows?
3. Has brand voice (KF_09) evolved?
4. Any new legal/warranty terms (KF_07)?
5. New case studies in KF_08?

### Step 3: Sync to Supabase `knowledge_files` Table

Once analysis is complete, update database:

```sql
-- Backup existing knowledge files
CREATE TABLE knowledge_files_backup_20251031 AS 
SELECT * FROM knowledge_files;

-- Insert/update from MKF v1.0-2
-- Example for KF_02:
INSERT INTO knowledge_files (
  file_key, 
  title, 
  category, 
  content, 
  version, 
  active,
  metadata
)
VALUES (
  'KF_02_PRICING_MODEL',
  'KF_02 v7.1 - Service Pricing & Materials',
  'pricing',
  '... (content from KF_02_PRICING_MODEL.json) ...',
  2, -- Increment version
  true,
  jsonb_build_object(
    'source', 'CKR_MKF_v1_0-2.zip',
    'updated_date', '2025-10-31',
    'file_type', 'json',
    'priority', 10
  )
)
ON CONFLICT (file_key) DO UPDATE
SET 
  content = EXCLUDED.content,
  version = EXCLUDED.version,
  updated_at = now(),
  last_synced_at = now(),
  metadata = EXCLUDED.metadata;

-- Repeat for all KF_* and GWA_* files
```

### Step 4: Update Edge Functions

For each edge function using MKF files, verify it loads correctly:

#### Functions to Test:

1. **chat-quote-assistant**
   - Uses: KF_02, KF_07, KF_09, GWA_06
   - Test: Load pricing, generate quote conversation
   - Expected: Correct pricing from updated KF_02

2. **generate-quote**
   - Uses: KF_07, KF_08, KF_09
   - Test: Generate quote from inspection
   - Expected: New case studies from KF_08 referenced

3. **chat-customer-support**
   - Uses: KF_06, KF_07, KF_09, GWA_05
   - Test: Customer conversation with brand voice
   - Expected: Updated voice/tone from KF_09

4. **lead-capture-assistant**
   - Uses: KF_03_05, GWA_01, GWA_12
   - Test: Lead intake and triage
   - Expected: Updated SOPs and triage logic

5. **Quote Builder (Frontend)**
   - Uses: KF_02 via `pricingClient.ts`
   - Test: Load services in LineItemsStep
   - Expected: All services from updated KF_02

### Step 5: Update Remaining Functions (TODO)

These functions need MKF integration:

```typescript
// internal-assistant/index.ts
const systemPrompt = await loadMKF('internal-assistant', supabase, {
  // Needs: KF_03_05, GWA_02, GWA_03, GWA_08, GWA_11
});

// inspection-form-assistant/index.ts
const systemPrompt = await loadMKF('inspection-form-assistant', supabase, {
  // Needs: KF_03_05, GWA_11, KF_02
});

// docs-writer-assistant/index.ts
const systemPrompt = await loadMKF('docs-writer-assistant', supabase, {
  // Needs: KF_06, KF_08, KF_09, GWA_07, GWA_09
});

// forms-builder-assistant/index.ts
const systemPrompt = await loadMKF('forms-builder-assistant', supabase, {
  // Needs: KF_03_05, KF_06_WEB_DEV
});

// nexus-ai-hub/index.ts
const systemPrompt = await loadMKF('nexus-ai-hub', supabase, {
  // Needs: ALL GWA files, KF_02, KF_03_05
});
```

---

## 🔍 Post-Integration Validation

### Testing Checklist

- [ ] **Pricing Accuracy**
  - [ ] Quote builder loads all services from KF_02
  - [ ] Tier profiles (REPAIR/RESTORE/PREMIUM) calculate correctly
  - [ ] Regional modifiers (Metro/Outer-SE/Rural) apply properly
  - [ ] Labour + materials composition matches KF_02 spec

- [ ] **Brand Voice Consistency**
  - [ ] Customer-facing messages use KF_09 voice
  - [ ] Marketing copy follows KF_06 guidelines
  - [ ] Legal disclaimers match KF_07 requirements

- [ ] **Workflow Automation**
  - [ ] Lead intake follows GWA_01
  - [ ] Quote followup uses GWA_06
  - [ ] Triage logic matches GWA_12
  - [ ] Risk assessment uses GWA_11

- [ ] **Case Studies**
  - [ ] New projects from KF_08 appear in quotes
  - [ ] Before/after data is accurate
  - [ ] Testimonials are properly attributed

### Monitoring

Watch for 48 hours after deployment:

```sql
-- Check edge function usage
SELECT 
  function_name,
  COUNT(*) as calls,
  AVG(execution_time_ms) as avg_time_ms,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as errors
FROM edge_function_logs
WHERE timestamp > NOW() - INTERVAL '48 hours'
  AND function_name IN (
    'chat-quote-assistant',
    'generate-quote',
    'chat-customer-support',
    'lead-capture-assistant'
  )
GROUP BY function_name;

-- Check for MKF loading errors
SELECT *
FROM system_audit
WHERE action LIKE '%mkf%'
  AND timestamp > NOW() - INTERVAL '48 hours'
  AND details->>'success' = 'false';
```

---

## 📊 Rollback Plan

If issues arise:

```sql
-- Restore previous knowledge files
DELETE FROM knowledge_files WHERE version = 2;

INSERT INTO knowledge_files 
SELECT * FROM knowledge_files_backup_20251031;

-- Clear pricing cache
DELETE FROM pricing_models WHERE version LIKE '%v1.0-2%';

-- Invalidate frontend cache
-- (Restart edge functions or wait for cache TTL)
```

---

## 📝 Documentation Updates

After successful integration:

1. Update `knowledge-base/README.md` with v1.0-2 file structure
2. Update `INTEGRATION_STATUS.md` with completion date
3. Tag release: `git tag knowledge-v1.0-2`
4. Update `ckr-gem-system-prompt-v4.txt` with new knowledge references
5. Update project `README.md` with knowledge version

---

## 🎓 Key Learnings

**Best Practices for Future MKF Updates**:
1. Always extract to temporary directory first
2. Run diffs before overwriting existing files
3. Backup `knowledge_files` table before sync
4. Test edge functions in staging first
5. Monitor for 48 hours post-deployment
6. Document all changes in CHANGELOG.md

**Common Issues**:
- JSON syntax errors in KF_02 or KF_08
- GWA workflow file encoding issues
- Token limit exceeded in edge function prompts
- Cache invalidation needed for frontend pricing

---

## 🚀 Next Steps

1. **[Manual]** Extract CKR_MKF_v1_0-2.zip
2. **[Manual]** Analyze contents and compare with existing
3. **[AI/Manual]** Sync to `knowledge_files` table
4. **[AI]** Update remaining 5 edge functions with MKF loader
5. **[AI]** Update CKR-GEM system prompt
6. **[Manual]** Test all affected systems
7. **[Manual]** Monitor for 48 hours
8. **[AI]** Update documentation

---

**Created**: 2025-10-31  
**Status**: Planning  
**Owner**: Kaidyn Brownlie
