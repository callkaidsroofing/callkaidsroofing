# Inspection & Quote Builder Integration Plan

## Overview
Integrating the standalone CKR Inspection & Quote Builder with the existing callkaidsroofing repository and Supabase database.

## Existing Database Schema

### `inspection_reports` Table
**Key Fields:**
- `id` (uuid, primary key)
- `clientName`, `phone`, `email`
- `siteAddress`, `suburbPostcode`
- `date`, `time`, `inspector`
- `claddingType`, `roofPitch`, `roofArea`
- `ridgeCaps`, `valleyIrons`, `gutterPerimeter`
- `beforeDefects` (json), `recommendedWorks` (json)
- `status`, `priority`
- `created_at`, `updated_at`

### `quotes` Table
**Key Fields:**
- `id` (uuid, primary key)
- `quote_number` (string, unique)
- `client_name`, `phone`, `email`
- `site_address`, `suburb_postcode`
- `inspection_report_id` (foreign key → inspection_reports)
- `line_items` (json array)
- `scope` (json)
- `pricing` (json)
- `subtotal`, `gst`, `total`
- `tier_level`, `tier_profile`
- `status`, `draft`
- `created_at`, `updated_at`, `sent_at`

## Field Mapping: Standalone App → Supabase

### Inspection Data Mapping

| Standalone App Field | Supabase Field | Type | Notes |
|---------------------|----------------|------|-------|
| `client_name` | `clientName` | string | |
| `address` | `siteAddress` | string | |
| `suburb` | `suburbPostcode` | string | |
| `roof_type` | `claddingType` | string | |
| `storey_count` | `heightStoreys` | string | |
| `access_difficulty` | `accessnotes` | string | |
| `ridge_condition` | `ridgeCaps` + `pointing` | string | Combine condition |
| `valley_condition` | `valleyIrons` | string | |
| `tile_condition` | `brokenTiles` + notes | string/number | |
| `gutter_condition` | `guttersDownpipes` | string | |
| `flashing_condition` | `flashings` | string | |
| `leak_status` | `internalLeaks` | string | |
| `inspector_notes` | `overallConditionNotes` | string | |
| `safety_notes` | `accessNotes` | string | |

### Quote Data Mapping

| Standalone App Field | Supabase Field | Type | Notes |
|---------------------|----------------|------|-------|
| `client_name` | `client_name` | string | ✓ Direct match |
| `address` | `site_address` | string | ✓ Direct match |
| `suburb` | `suburb_postcode` | string | ✓ Direct match |
| `phone` | `phone` | string | ✓ Direct match |
| `email` | `email` | string | ✓ Direct match |
| `primary_service` | `scope.services[0]` | json | Store in scope |
| `scope_items[]` | `line_items` | json array | ✓ Direct match |
| `scope_items[].category` | `line_items[].description` | string | |
| `scope_items[].labour` | `line_items[].labour_cost` | number | |
| `scope_items[].materials` | `line_items[].material_cost` | number | |
| `scope_items[].markup` | `line_items[].markup_percent` | number | |
| `subtotal_ex_gst` | `subtotal` | number | ✓ Direct match |
| `gst_amount` | `gst` | number | ✓ Direct match |
| `total_inc_gst` | `total` | number | ✓ Direct match |

## Integration Strategy

### Phase 1: Create Unified Component
1. Create `/src/components/InspectionQuoteBuilder/` directory
2. Extract and adapt the standalone app components
3. Integrate with existing Supabase client
4. Use existing UI components (shadcn/ui)

### Phase 2: Database Integration
1. Map standalone data structure to existing schema
2. Create helper functions for data transformation
3. Implement autosave with Supabase
4. Add PDF export functionality

### Phase 3: Routing Integration
1. Replace `/admin/tools/inspections` route
2. Add `/admin/tools/quotes/new` route
3. Link inspection → quote workflow
4. Maintain backward compatibility

### Phase 4: Feature Enhancements
1. Link quotes to inspection reports via `inspection_report_id`
2. Auto-populate quote from inspection data
3. Add quote versioning support
4. Implement email sending integration

## File Structure

```
src/
├── components/
│   └── InspectionQuoteBuilder/
│       ├── index.tsx                 # Main component
│       ├── InspectionStep.tsx        # Stage 1: Inspection
│       ├── QuoteStep.tsx             # Stage 2: Quote
│       ├── ExportStep.tsx            # Stage 3: Export
│       ├── types.ts                  # TypeScript interfaces
│       └── utils.ts                  # Helper functions
├── pages/
│   ├── InspectionBuilderNew.tsx      # Updated to use new component
│   └── QuoteBuilderNew.tsx           # Updated to use new component
└── lib/
    └── inspection-quote-helpers.ts   # Data transformation utilities
```

## API Integration Points

### Supabase Operations

```typescript
// Create inspection
const { data, error } = await supabase
  .from('inspection_reports')
  .insert({
    clientName: data.client_name,
    siteAddress: data.address,
    // ... mapped fields
  })
  .select()
  .single();

// Create quote linked to inspection
const { data, error } = await supabase
  .from('quotes')
  .insert({
    client_name: data.client_name,
    inspection_report_id: inspectionId,
    line_items: data.scope_items,
    subtotal: data.subtotal_ex_gst,
    gst: data.gst_amount,
    total: data.total_inc_gst,
    // ... mapped fields
  })
  .select()
  .single();
```

## Next Steps

1. ✅ Analyze existing structure
2. ⏳ Create unified component
3. ⏳ Implement Supabase integration
4. ⏳ Update routing
5. ⏳ Test and deploy
6. ⏳ Update documentation

## Benefits

- **Unified UX**: Single, streamlined workflow
- **Better Data**: Proper relationships between inspections and quotes
- **Offline Support**: PWA capabilities
- **PDF Export**: Professional reports
- **Auto-save**: Never lose work
- **Mobile-Friendly**: Responsive design
