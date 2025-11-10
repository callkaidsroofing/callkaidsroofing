# Admin Hub Migration Guide

## Overview
The internal/v2 system has been consolidated and rebranded as the **CKR Admin Hub** - a unified business management platform for Call Kaids Roofing.

## What Changed

### 1. Route Structure
**Old Structure** (internal/v2):
```
/internal/v2/home
/internal/v2/leads
/internal/v2/admin/users
/internal/v2/admin/storage
/internal/v2/ai-assistant
```

**New Structure** (admin):
```
/admin/home
/admin/leads
/admin/system/users
/admin/system/storage
/admin/ai-assistant
```

### 2. File Reorganization
**Deleted** (unused/redundant):
- `src/pages/KnowledgeManagement.tsx`
- `src/pages/internal/v2/DatabaseManagement.tsx`
- `src/pages/internal/v2/KnowledgeBase.tsx`

**Renamed**:
- `InternalLayoutNew.tsx` → `AdminLayout.tsx`
- `InternalHomeNew.tsx` → `AdminHome.tsx`
- Export: `InternalLayoutNew()` → `AdminLayout()`
- Export: `InternalHomeNew()` → `AdminHome()`

### 3. Navigation Structure
**Updated Sections** in AdminLayout:
- "Admin" → "System Admin" (for clarity)
- Routes updated from `/internal/v2/admin/*` to `/admin/system/*`
- Sidebar home link: "CKR Home" → "Admin Hub"

### 4. Branding Updates
- **Page Titles**: "Command Center" → "CKR Admin Hub"
- **Layout Header**: "Call Kaids Roofing" → "CKR Admin Hub"
- **Admin Dashboard**: "Admin Hub" → "System Admin Dashboard"

## New Route Map

### Main Routes
| Function | Old Route | New Route |
|----------|-----------|-----------|
| Home Dashboard | `/internal/v2/home` | `/admin/home` |
| Leads | `/internal/v2/leads` | `/admin/leads` |
| Lead Detail | `/internal/v2/leads/:id` | `/admin/leads/:id` |
| Quotes | `/internal/v2/quotes/new` | `/admin/quotes/new` |
| Inspections | `/internal/v2/inspections/new` | `/admin/inspections/new` |
| Jobs | `/internal/v2/jobs` | `/admin/jobs` |
| Intelligence | `/internal/v2/intelligence` | `/admin/intelligence` |
| Reports | `/internal/v2/reports` | `/admin/reports` |

### Configuration Routes
| Function | Old Route | New Route |
|----------|-----------|-----------|
| Data Hub | `/internal/v2/data` | `/admin/data` |
| Forms | `/internal/v2/forms` | `/admin/forms` |
| Docs | `/internal/v2/docs` | `/admin/docs` |
| Documents | `/internal/v2/quote-documents` | `/admin/quote-documents` |

### Media & Marketing Routes
| Function | Old Route | New Route |
|----------|-----------|-----------|
| Media Library | `/internal/v2/media` | `/admin/media` |
| Image Generator | `/internal/v2/media/generator` | `/admin/media/generator` |
| Marketing | `/internal/v2/marketing` | `/admin/marketing` |

### System Admin Routes
| Function | Old Route | New Route |
|----------|-----------|-----------|
| System Dashboard | `/internal/v2/admin` | `/admin/system` |
| Users | `/internal/v2/admin/users` | `/admin/system/users` |
| Storage | `/internal/v2/admin/storage` | `/admin/system/storage` |
| Upload | `/internal/v2/admin/upload` | `/admin/system/upload` |
| Embeddings | `/internal/v2/admin/embeddings` | `/admin/system/embeddings` |
| AI Assistant | `/internal/v2/ai-assistant` | `/admin/ai-assistant` |

## Legacy Redirects

All old routes automatically redirect:
```javascript
/internal/v2/* → /admin
/internal/* → /admin
```

This ensures backward compatibility with:
- Bookmarked links
- External references
- Email links
- Documentation

## Navigation Hierarchy

```
Admin Hub (/)
├── CRM
│   ├── Leads Pipeline
│   ├── Lead Intelligence
│   ├── Quotes
│   └── Jobs Calendar
├── Business Intelligence
│   └── Reports & Analytics
├── Tools & Utilities
│   ├── New Inspection
│   └── Image Generator
├── Marketing & Media
│   ├── Media Library
│   └── Marketing Studio
├── Configuration
│   ├── Data Hub
│   ├── Forms Studio
│   ├── Docs Hub
│   └── Quote Documents
└── System Admin (admin only)
    ├── System Dashboard
    ├── User Management
    ├── Knowledge Files
    ├── Upload Knowledge
    ├── Generate Embeddings
    └── AI Assistant
```

## Benefits

### Before
- Confusing "internal/v2" naming
- Scattered admin tools
- No clear system hierarchy
- Redundant/unused pages
- Mixed admin and operational routes

### After
- ✅ Clear "Admin Hub" branding
- ✅ Logical route structure (`/admin/system/*` for admin tools)
- ✅ Separated business operations from system admin
- ✅ Removed 3 unused pages
- ✅ Unified navigation experience
- ✅ Professional naming convention
- ✅ Future-proof structure

## Breaking Changes

### For Developers
If you have hardcoded routes in:
- Email templates
- External documentation
- Custom scripts
- Webhooks

**Update them to use new routes**:
- Replace `/internal/v2/` with `/admin/`
- Replace `/internal/v2/admin/` with `/admin/system/`

### For Users
**No action required** - all old links redirect automatically.

## Technical Details

### Component Changes
```typescript
// Old
import { InternalLayoutNew } from "@/components/InternalLayoutNew";
export default function InternalHomeNew() { ... }

// New
import { AdminLayout } from "@/components/AdminLayout";
export default function AdminHome() { ... }
```

### Route Configuration
```typescript
// Old
<Route path="/internal/v2" element={<ProtectedLayout />}>
  <Route element={<InternalLayoutNew />}>
    <Route path="admin" element={<AdminHub />} />
  </Route>
</Route>

// New
<Route path="/admin" element={<ProtectedLayout />}>
  <Route element={<AdminLayout />}>
    <Route path="system" element={<AdminHub />} />
  </Route>
</Route>
```

## Migration Checklist

- [x] Update route structure (/admin instead of /internal/v2)
- [x] Rename layout components (AdminLayout, AdminHome)
- [x] Delete unused pages (KnowledgeManagement, DatabaseManagement, KnowledgeBase)
- [x] Update navigation structure (System Admin section)
- [x] Add legacy redirects
- [x] Update branding (CKR Admin Hub)
- [x] Update internal links across all pages
- [x] Test all routes and redirects
- [x] Update documentation

## Testing Procedure

1. **Navigation Test**: Click through all sidebar links
2. **Direct Access**: Try accessing old `/internal/v2/*` URLs (should redirect)
3. **Bookmarks**: Test old bookmarked links (should redirect)
4. **Search**: Use admin search feature to find tools
5. **Mobile**: Test mobile navigation menu
6. **Permissions**: Verify non-admin users don't see System Admin section

## Support

For issues or questions:
1. Check browser console for errors
2. Clear cache and hard refresh (Ctrl+Shift+R)
3. Verify authentication (sign out and back in)
4. Check user role in `user_roles` table

## Future Improvements

Potential enhancements:
- Add breadcrumb navigation showing full path
- Implement favorites/pinned tools
- Add recent pages history
- Create dashboard customization
- Add keyboard shortcuts for common actions
- Implement quick switcher (Cmd+K)

## Summary

The migration consolidates the internal management system under a clear "Admin Hub" brand with logical route structure, removes technical jargon (v2), and creates a professional, scalable foundation for future features.

**Result**: Cleaner, more intuitive navigation with unified branding and improved user experience.
