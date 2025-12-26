# ADMIN HUB FEATURE INVENTORY

**Total Pages**: 29
**Last Updated**: 2025-12-26
**Status Legend**: ✅ Working | ⚠️ Stubbed/Incomplete | ❌ Broken | 🔍 Needs Testing

---

## STOP-THE-LINE STATUS

| Check | Status | Details |
|-------|--------|---------|
| `npm install` | ✅ PASS | 581 packages, 5 vulnerabilities (non-blocking) |
| `npm run build` | ✅ PASS | 3553 modules transformed in 27.84s |
| `npm run lint` | ⚠️ PARTIAL | TypeScript `any` violations in scripts (non-blocking) |
| `npm test` | ⚠️ NO TESTS | No test script configured yet |

---

## SECTION 1: CRM (4 pages)

### 1.1 Leads (`/admin/crm/leads`)
**File**: `src/pages/admin/crm/Leads.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 1.2 Quotes (`/admin/crm/quotes`)
**File**: `src/pages/admin/crm/Quotes.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 1.3 Jobs (`/admin/crm/jobs`)
**File**: `src/pages/admin/crm/JobsList.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| View Details button | `onClick={() => navigate(\`/admin/crm/jobs/${job.id}\`)}` | None (navigation) | Navigate to job details | ✅ FIXED |
| New Quote button | `onClick={() => navigate('/admin/tools/quick-quote')}` | None (navigation) | Navigate to quote tool | 🔍 |
| Load jobs | `loadJobs()` | `supabase.from('jobs').select('*')` | Display jobs table | 🔍 |

### 1.4 Intelligence (`/admin/crm/intelligence`)
**File**: `src/pages/LeadIntelligence.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load leads | `fetchIntelligence()` | `supabase.from('leads').select('*')` | Display lead metrics | ✅ FIXED |
| Calculate conversion rate | Real calculation from DB | None | Show real % from won leads | ✅ FIXED |
| Calculate trend | 30-day comparison | None | Show up/down trend | ✅ FIXED |
| Call lead | Phone link | None | Open phone dialer | 🔍 |
| Email lead | Email link | None | Open email client | 🔍 |

---

## SECTION 2: Tools (5 pages)

### 2.1 Inspection & Quote (`/admin/tools/inspection-quote`)
**File**: `src/pages/InspectionQuoteBuilder.tsx` → `src/components/InspectionQuoteBuilder/index.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 2.2 Measurements (`/admin/tools/measurements`)
**File**: `src/pages/admin/tools/Measurements.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Save Measurement | `handleSaveMeasurement()` | None (local state) | Add to local list | ⚠️ NO PERSIST |
| Export Measurement | `handleExport()` | None (file download) | Download .txt file | 🔍 |

### 2.3 AI Assistant (`/admin/tools/ai`)
**File**: `src/pages/admin/tools/AIAssistant.tsx` → Re-export to `src/pages/internal/v2/AIAssistant.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 2.4 Calculator (`/admin/tools/calculator`)
**File**: `src/pages/admin/tools/Calculator.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Calculate Estimate | `calculateEstimate()` | None (local calc) | Display price | 🔍 |
| Copy Estimate | `handleCopyEstimate()` | None (clipboard) | Copy to clipboard | 🔍 |
| Refresh Rates | `refreshMutation.mutate()` | `usePricingConstants()` hook | Reload pricing from DB | 🔍 |

### 2.5 Forms (`/admin/tools/forms`)
**File**: `src/pages/admin/tools/Forms.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load forms | `loadPublishedForms()` | `supabase.from('form_definitions').select()` | Display form list | 🔍 |
| Click form | `handleFormClick()` | None | Open form dialog | 🔍 |
| Submit form | `handleFormSuccess()` | Via FormRenderer component | Close dialog | 🔍 |

---

## SECTION 3: Content Engine (5 pages)

### 3.1 Generator (`/admin/content/generate`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 3.2 Media Library (`/admin/content/media`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 3.3 Marketing (`/admin/content/marketing`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 3.4 Blog (`/admin/content/blog`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 3.5 SEO (`/admin/content/seo`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

---

## SECTION 4: Content (4 pages)

### 4.1 Services (`/admin/cms/services`)
**File**: `src/pages/admin/cms/ServicesAdmin.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load services | `useQuery` | `supabase.from('content_services').select()` | Display services | 🔍 |
| Save service | `saveMutation` | `supabase.from('content_services').insert/update()` | Create/update service | 🔍 |
| Delete service | `deleteMutation` | `supabase.from('content_services').delete()` | Remove service | 🔍 |

### 4.2 Suburbs (`/admin/cms/suburbs`)
**File**: `src/pages/admin/cms/Suburbs.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load suburbs | `useQuery` | `supabase.from('content_suburbs').select()` | Display suburbs | 🔍 |
| Save suburb | `saveMutation` | `supabase.from('content_suburbs').insert/update()` | Create/update suburb | 🔍 |
| Delete suburb | `deleteMutation` | `supabase.from('content_suburbs').delete()` | Remove suburb | 🔍 |

### 4.3 Case Studies (`/admin/cms/case-studies`)
**File**: `src/pages/admin/cms/CaseStudyManager.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Upload photos | `handlePhotoUpload()` | `supabase.storage.from('media').upload()` | Upload to storage | 🔍 |
| Save case study | `handleSubmit()` | `supabase.from('case_studies').insert()` | Create case study | 🔍 |

### 4.4 Homepage Editor (`/admin/cms/homepage`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

---

## SECTION 5: Media (2 pages)

### 5.1 Media Gallery (`/admin/cms/media-gallery`)
**File**: `src/pages/admin/cms/MediaGallery.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load media | `useQuery` | `supabase.from('media_gallery').select()` | Display media | 🔍 |
| Upload media | `uploadMutation` | `supabase.from('media_gallery').insert()` | Add media item | 🔍 |
| Delete media | `deleteMutation` | `supabase.from('media_gallery').delete()` | Remove media | 🔍 |

### 5.2 Verification (`/admin/cms/media-verification`)
**File**: `src/pages/admin/cms/MediaVerification.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load queue | `useQuery` | `supabase.from('content_case_studies').select()` | Display pending items | 🔍 |
| Verify item | `handleVerify()` | `supabase.from('content_case_studies').update()` | Approve/reject | 🔍 |

---

## SECTION 6: Knowledge (5 pages)

### 6.1 Knowledge Base (`/admin/cms/knowledge`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 6.2 Knowledge System (`/admin/cms/knowledge-system`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 6.3 Data Hub (`/admin/cms/data`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 6.4 Documents (`/admin/cms/documents`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 6.5 Data Sync (`/admin/cms/sync`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

---

## SECTION 7: Settings (4 pages)

### 7.1 Business (`/admin/settings/business`)
**File**: `src/pages/admin/settings/Business.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Save Settings | `handleSave()` | None (local state only) | Show warning toast | ⚠️ NO PERSIST |

### 7.2 Pricing (`/admin/settings/pricing`)
**File**: `src/pages/admin/settings/Pricing.tsx`

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| Load constants | `usePricingConstants()` | `supabase.from('pricing_constants').select()` | Display constants | 🔍 |
| Load items | `usePricingItems()` | `supabase.from('pricing_items').select()` | Display pricing items | 🔍 |
| Refresh pricing | `refreshMutation.mutate()` | Mutation hook | Reload from DB | 🔍 |

### 7.3 Forms (`/admin/settings/forms`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

### 7.4 Integrations (`/admin/settings/integrations`)
**File**: TBD

| Control | Handler | API Call | Expected Result | Status |
|---------|---------|----------|-----------------|--------|
| TBD | TBD | TBD | TBD | 🔍 |

---

## REMOVED/DELETED PAGES

| Page | Reason | Date Removed |
|------|--------|--------------|
| Reports (`/admin/crm/reports`) | 100% hardcoded mock data - no database queries | 2025-12-26 |

---

## SUMMARY STATISTICS

- **Total Pages**: 29
- **Fully Inventoried**: 10 (34%)
- **Needs Deeper Analysis**: 19 (66%)
- **Known Working**: 5
- **Known Broken/Stubbed**: 2
- **Needs Testing**: 22+

---

## NEXT STEPS

1. ✅ Stop-the-line checks complete
2. 🔄 Complete feature inventory (IN PROGRESS)
3. ⏳ Test all features systematically
4. ⏳ Fix broken/stubbed features
5. ⏳ Add Playwright E2E tests
6. ⏳ Add error boundaries
7. ⏳ Generate verification proof pack
