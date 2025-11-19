# Feature Consolidation Plan

## Existing Systems Analysis

### Current Inspection Builder (`InspectionBuilderNew.tsx`)
**Components:**
- `ClientSiteStep` - Client and site details
- `RoofDetailsStep` - Roof identification
- `MeasurementsStep` - Dimensions
- `ConditionChecklistStep` - Inspect elements
- `PhotoEvidenceStep` - Photo uploads
- `RecommendedWorksStep` - Repair recommendations
- `MaterialsSafetyStep` - Specs and safety
- `ReviewSubmitStep` - Final review

**Features to Preserve:**
- ✅ Auto-save functionality
- ✅ Progress indicator
- ✅ Photo upload capability
- ✅ Supabase integration
- ✅ Multi-step wizard
- ✅ Validation

### Current Quote Builder (`QuoteBuilderNew.tsx`)
**Components:**
- `ClientStep` - Select/add client
- `ScopeStep` - Define work scope
- `LineItemsStep` - Add line items
- `PhotosStep` - Attach photos
- `PricingStep` - Set pricing
- `TermsStep` - Payment terms
- `PreviewStep` - Review quote
- `SendStep` - Send to client

**Features to Preserve:**
- ✅ Line item management
- ✅ Pricing calculations (GST, subtotal, total)
- ✅ Quote preview
- ✅ Email sending
- ✅ PDF generation
- ✅ Quote versioning
- ✅ Link to inspection reports

### Standalone App Features
**New Features to Add:**
- ✅ Simplified 3-stage workflow
- ✅ Live preview panel
- ✅ Pricing presets (11 common services)
- ✅ Offline support (PWA)
- ✅ localStorage backup
- ✅ Better mobile UX
- ✅ Integrated inspection → quote flow

## Unified System Design

### New Component: `InspectionQuoteBuilder`

**Stage 1: Inspection**
- Merge: ClientSiteStep + RoofDetailsStep + ConditionChecklistStep
- Add: Live preview panel
- Keep: Photo uploads, auto-save
- Simplify: Reduce fields to essentials

**Stage 2: Quote**
- Merge: ScopeStep + LineItemsStep + PricingStep
- Add: Pricing presets from standalone app
- Keep: Line item management, GST calculations
- Improve: Better UX for adding scope items

**Stage 3: Export & Send**
- Merge: ReviewSubmitStep + PreviewStep + SendStep
- Add: PDF export with html2pdf.js
- Keep: Email sending, quote versioning
- Add: localStorage save option

## Files to Archive

### Move to `/src/pages/_archived/`
1. `InspectionBuilderNew.tsx` → `_archived/InspectionBuilderOld.tsx`
2. `QuoteBuilderNew.tsx` → `_archived/QuoteBuilderOld.tsx`
3. `SimpleInspectionForm.tsx` → `_archived/SimpleInspectionForm.tsx`
4. `InspectionFormSection.tsx` → `_archived/InspectionFormSection.tsx`

### Move to `/src/components/_archived/`
1. `/src/components/inspection-builder/` → `_archived/inspection-builder/`
2. `/src/components/quote-builder/` → `_archived/quote-builder/`

## Routing Changes

### Old Routes (to redirect)
```typescript
// OLD - Remove these
<Route path="tools/inspections" element={<InspectionBuilderNew />} />
<Route path="tools/inspections/:id" element={<InspectionBuilderNew />} />
<Route path="crm/quotes" element={<QuoteBuilderNew />} />
<Route path="crm/quotes/:id" element={<QuoteBuilderNew />} />
```

### New Routes (unified)
```typescript
// NEW - Single unified system
<Route path="tools/inspection-quote" element={<InspectionQuoteBuilder />} />
<Route path="tools/inspection-quote/:id" element={<InspectionQuoteBuilder />} />

// Redirects for backward compatibility
<Route path="tools/inspections" element={<Navigate to="/admin/tools/inspection-quote" />} />
<Route path="tools/inspections/:id" element={<Navigate to="/admin/tools/inspection-quote/:id" />} />
<Route path="crm/quotes" element={<Navigate to="/admin/tools/inspection-quote" />} />
<Route path="crm/quotes/:id" element={<Navigate to="/admin/tools/inspection-quote/:id" />} />
```

## Navigation Menu Updates

### Remove Duplicate Items
**Before:**
- Tools → Inspections
- Tools → Quick Quote
- CRM → Quotes

**After:**
- Tools → Inspection & Quote Builder (unified)

## Data Migration

### No database changes required!
- Existing `inspection_reports` table: ✅ Compatible
- Existing `quotes` table: ✅ Compatible
- Relationships: ✅ Maintained
- All existing data: ✅ Preserved

## Benefits of Consolidation

1. **Single Source of Truth** - One tool for inspection and quote workflows
2. **No Confusion** - No duplicate or similar pages
3. **Better UX** - Streamlined 3-stage process
4. **Easier Maintenance** - One codebase to update
5. **Mobile-Friendly** - Responsive design
6. **Offline Support** - PWA capabilities
7. **Better Integration** - Inspection → Quote flow built-in

## Implementation Checklist

- [ ] Create new unified component
- [ ] Integrate with Supabase
- [ ] Add pricing presets
- [ ] Implement PDF export
- [ ] Archive old pages
- [ ] Update routing
- [ ] Update navigation menu
- [ ] Test all workflows
- [ ] Document changes
- [ ] Push to GitHub
