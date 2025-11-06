# CKR AI Digital Engine - Implementation Plan

## Project Overview
Enhance the existing CKR internal system with three new AI-powered modules that integrate seamlessly with the current architecture at `/internal/v2/`.

## Implementation Strategy (8 files max)
1. **src/pages/OperationsAI.tsx** - Operations AI Dashboard (job scheduling, sync status, insights)
2. **src/pages/ContentEngine.tsx** - Content Engine Studio (case studies, blog posts, testimonials)
3. **src/pages/AdsEngine.tsx** - Meta Ads Command Center (campaigns, targeting, performance)
4. **src/lib/knowledgeBase.ts** - Knowledge base loader and parser utility
5. **src/components/AIModuleCard.tsx** - Reusable card component for AI modules
6. **src/App.tsx** - Update routes to include new pages
7. **src/components/InternalLayoutNew.tsx** - Update navigation to include new AI modules
8. **src/data/aiEngineData.ts** - Structured data for AI engine configurations

## Key Features Per Module

### Operations AI Dashboard
- Job scheduling overview with weather integration status
- Google Drive ↔ Supabase sync monitor
- Operational insights: overdue quotes, long-running jobs, crew optimization
- Workflow automation status from GWA files

### Content Engine Studio
- Auto-generate case studies from KF_08_CASE_STUDIES.json
- SEO blog post creator using KF_03-05 SOPs and KF_06 marketing copy
- Testimonial carousel builder from proof points
- Publishing scheduler with output format selection (MD/HTML/JSON)

### Meta Ads Command Center
- Campaign creative builder using proof points and brand guidelines
- Audience targeting configurator (location-aware, retargeting)
- Performance dashboard with optimization suggestions
- Ad set launcher with Meta API integration status

## Design Principles
- Use CKR brand colors: #007ACC (primary), #0B3B69 (secondary), #111827 (dark)
- Follow existing internal system design patterns
- Mobile-first responsive design
- Integration with existing Supabase backend
- Leverage knowledge base files as data source

## Integration Points
- Existing Supabase client at `@/integrations/supabase/client`
- Knowledge base files in `./knowledge-base/`
- Current navigation structure in `InternalLayoutNew.tsx`
- Existing UI components from shadcn/ui

## Implementation Order
1. Create knowledge base utility to load and parse KB files
2. Create reusable AI module card component
3. Build Operations AI Dashboard page
4. Build Content Engine Studio page
5. Build Meta Ads Command Center page
6. Update navigation in InternalLayoutNew
7. Update App.tsx routes
8. Test all integrations