# Inspection & Quote Builder - Migration Guide

## 🎉 What's New

A **unified Inspection & Quote Builder** has been integrated into your system, replacing the previous separate inspection and quote workflows with a streamlined 3-stage process.

## ✨ Key Features

### Stage 1: Inspection
- **Client & Property Details** - All essential information in one place
- **Roof Measurements** - Ridge length, valley length, roof area, gutter length, tile count
- **Condition Assessment** - Ridge, valleys, tiles, gutters, flashing, leaks
- **Inspector Notes** - Observations and safety notes
- **Auto-save** - Never lose your work

### Stage 2: Quote
- **Pricing Presets** - 12 common roofing services with default costs
- **Auto-fill Quantities** - Measurements from inspection automatically populate
- **Real-time Calculations** - GST, subtotal, and total update instantly
- **Priority Tagging** - Must Do, Recommended, Optional
- **Line Item Management** - Add, edit, remove scope items easily

### Stage 3: Export & Send
- **PDF Generation** - Professional reports with company branding
- **Email Integration** - Send quotes directly to clients
- **Database Storage** - All data saved to Supabase
- **Document Preview** - See exactly what the client will receive

## 📊 Measurements Auto-Fill Feature

When you enter measurements in the inspection stage, they automatically populate when you select pricing presets:

| Measurement | Auto-fills for |
|------------|----------------|
| Ridge Length (lm) | Ridge Rebedding & Repointing |
| Valley Length (lm) | Valley Replacement |
| Roof Area (m²) | Roof Painting, Pressure Washing |
| Gutter Length (lm) | Gutter Cleaning |
| Tile Count | Tile Replacement |

## 🗂️ What Changed

### Archived Pages
The following pages have been moved to `/src/pages/_archived/` and `/src/components/_archived/`:

- ✅ `InspectionBuilderNew.tsx` → Archived
- ✅ `QuoteBuilderNew.tsx` → Archived
- ✅ `SimpleInspectionForm.tsx` → Archived
- ✅ `InspectionFormSection.tsx` → Archived
- ✅ `/components/inspection-builder/` → Archived
- ✅ `/components/quote-builder/` → Archived

### New Files Added
```
src/
├── components/
│   └── InspectionQuoteBuilder/
│       ├── index.tsx              # Main component
│       ├── InspectionStep.tsx     # Stage 1: Inspection
│       ├── QuoteStep.tsx          # Stage 2: Quote
│       ├── ExportStep.tsx         # Stage 3: Export
│       ├── types.ts               # TypeScript definitions
│       └── utils.ts               # Helper functions
└── pages/
    └── InspectionQuoteBuilder.tsx # Page wrapper
```

### Routing Changes

**New Primary Route:**
```
/admin/tools/inspection-quote
/admin/tools/inspection-quote/:id
```

**Legacy Redirects (for backward compatibility):**
```
/admin/tools/inspections → /admin/tools/inspection-quote
/admin/tools/inspections/:id → /admin/tools/inspection-quote/:id
/admin/inspections/new → /admin/tools/inspection-quote
/admin/inspections/:id → /admin/tools/inspection-quote/:id
```

All old URLs will automatically redirect to the new unified system.

## 🗄️ Database Compatibility

**No database changes required!** The new system uses your existing Supabase schema:

### `inspection_reports` Table
All fields are compatible. New measurements are stored in:
- `roofArea` (roof_area_m2)
- `ridgeCaps` (ridge_length_lm)
- `gutterPerimeter` (gutter_length_lm)
- `roofPitch` (roof_pitch)

### `quotes` Table
Fully compatible with existing structure:
- `line_items` stores scope items
- `inspection_report_id` links quotes to inspections
- All pricing fields preserved

## 🚀 Deployment Steps

### 1. Install Dependencies (if needed)
```bash
cd /home/ubuntu/callkaidsroofing
npm install
```

### 2. Test Locally
```bash
npm run dev
```

Navigate to: `http://localhost:5173/admin/tools/inspection-quote`

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy
Push to your GitHub repository and deploy through your hosting platform (Netlify, Vercel, etc.)

## 📝 Usage Guide

### Creating a New Inspection & Quote

1. **Navigate** to Tools → Inspection & Quote Builder
2. **Stage 1 - Inspection:**
   - Fill in client details
   - Enter property address and roof type
   - **Add measurements** (roof area, ridge length, etc.)
   - Assess roof condition
   - Add inspector notes
   - Click "Next" (auto-saves)

3. **Stage 2 - Quote:**
   - Select primary service
   - Click "Add Item" to add scope items
   - **Use Quick Select** buttons for common services
   - Quantities auto-fill from measurements!
   - Adjust labour/material costs if needed
   - Add multiple items as needed
   - Review totals
   - Click "Next" (auto-saves)

4. **Stage 3 - Export:**
   - Review the document preview
   - Click "Export as PDF" to download
   - Or click "Send to [email]" to email directly

### Loading Existing Inspections

Navigate to: `/admin/tools/inspection-quote/[inspection-id]`

The system will:
- Load the inspection data
- Load any linked quotes
- Allow you to continue editing

## 🎯 Best Practices

1. **Always enter measurements** in Stage 1 - they save time in Stage 2
2. **Use pricing presets** - they auto-fill quantities from measurements
3. **Add detailed notes** - they appear in the PDF export
4. **Save frequently** - auto-save runs every 30 seconds, but manual saves are instant
5. **Review before exporting** - check the preview in Stage 3

## 🔧 Customization

### Pricing Presets
Edit `/src/components/InspectionQuoteBuilder/types.ts`:

```typescript
export const PRICING_PRESETS: PricingPresets = {
  RIDGE_REBED: { 
    label: "Ridge Rebedding & Repointing", 
    unit: "lm", 
    labour: 50,  // ← Change these
    material: 10 
  },
  // Add more presets...
};
```

### Company Branding
Edit `/src/components/InspectionQuoteBuilder/types.ts`:

```typescript
export const COMPANY_CONFIG = {
  company_name: "Call Kaids Roofing",
  contact_line: "ABN 39475055075 • 0435 900 709 • callkaidsroofing@outlook.com",
  warranty_text: "All roofing works are completed to Australian Standards...",
  primary_color: "#007ACC",
  secondary_color: "#0B3B69",
};
```

## 🐛 Troubleshooting

### PDF Export Not Working
- Check browser console for errors
- Ensure html2pdf.js loaded (check Network tab)
- Try refreshing the page

### Auto-save Not Working
- Check Supabase connection
- Verify you have an inspection ID (should show after first save)
- Check browser console for errors

### Measurements Not Auto-filling
- Ensure measurements are entered in Stage 1
- Click "Save" before proceeding to Stage 2
- Select the correct pricing preset that matches the measurement

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Check that all dependencies are installed
4. Review this guide for common issues

## 🎓 Training Notes

For team members:
- The new system combines inspection and quote creation
- Measurements entered in Stage 1 auto-populate in Stage 2
- All data is saved to the same database tables
- Old inspection/quote URLs redirect automatically
- PDFs are generated client-side (no server needed)

## ✅ Migration Checklist

- [x] New component created
- [x] Supabase integration complete
- [x] Routing updated
- [x] Legacy pages archived
- [x] html2pdf.js added
- [x] Measurements auto-fill implemented
- [x] PDF export working
- [x] Documentation complete
- [ ] Team training completed
- [ ] Production deployment
- [ ] Old bookmarks updated

## 🎉 Benefits

1. **Single Workflow** - No confusion about which tool to use
2. **Time Savings** - Measurements auto-fill quantities
3. **Better UX** - Streamlined 3-stage process
4. **No Data Loss** - Auto-save every 30 seconds
5. **Professional PDFs** - Branded export with all details
6. **Mobile Friendly** - Responsive design works on tablets
7. **Offline Support** - Works without internet (PWA ready)

---

**Version:** 1.0.0  
**Date:** November 2025  
**Author:** System Integration Team
