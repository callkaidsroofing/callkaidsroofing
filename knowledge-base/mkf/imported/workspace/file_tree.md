# CALL KAIDS ROOFING - OPTIMIZED FILE STRUCTURE

This document outlines the complete file and folder structure for the optimized Call Kaids Roofing system.

---

## Root Directory Structure

```
/workspace/ckr-site/callkaidsroofing-main/
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies and scripts
├── bun.lockb                         # Bun lock file
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
├── vitest.config.ts                  # Vitest test configuration (NEW)
├── playwright.config.ts              # Playwright E2E config (NEW)
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # Project documentation
├── CHANGELOG.md                      # Version history
│
├── public/                           # Static assets
│   ├── knowledge-base/               # Knowledge base files (NEW)
│   │   ├── mkf/                      # MKF markdown files
│   │   │   ├── MKF_00.md
│   │   │   ├── MKF_01.md
│   │   │   ├── MKF_02.md
│   │   │   ├── MKF_03.md
│   │   │   ├── MKF_04.md
│   │   │   ├── MKF_05.md
│   │   │   ├── MKF_06.md
│   │   │   ├── MKF_07.md
│   │   │   ├── MKF_08.md
│   │   │   ├── MKF_09.md
│   │   │   ├── MKF_10.md
│   │   │   ├── MKF_11.md
│   │   │   ├── MKF_12.md
│   │   │   ├── MKF_13.md
│   │   │   └── MKF_14.md
│   │   ├── csv/                      # CSV database files
│   │   │   ├── CKR_Leads_Database.csv
│   │   │   ├── CKR_Jobs_Database.csv
│   │   │   ├── CKR_Quotes_Database.csv
│   │   │   ├── CKR_Tasks_Database.csv
│   │   │   ├── CKR_Testimonials_Database.csv
│   │   │   ├── CKR_Case_Studies_Database.csv
│   │   │   ├── CKR_Warranty_Claims_Database.csv
│   │   │   ├── CKR_Brand_Assets_Database.csv
│   │   │   ├── CKR_Templates_Hub_Database.csv
│   │   │   ├── CKR_Services_Database.csv
│   │   │   ├── CKR_Pricing_Model_Database.csv
│   │   │   ├── CKR_Suburbs_Database.csv
│   │   │   ├── CKR_Knowledge_Base_Database.csv
│   │   │   ├── CKR_SOPs_Library_Database.csv
│   │   │   ├── CKR_Workflows_GWA_Database.csv
│   │   │   ├── CKR_Agent_Configurations_Database.csv
│   │   │   └── CKR_03_SEO_KEYWORD_MATRIX.csv
│   │   ├── json/                     # JSON schema files
│   │   │   ├── mkf_index.json
│   │   │   ├── mkf_case_study_schema.json
│   │   │   ├── mkf_measurement_schema.json
│   │   │   └── mkf_quote_schema.json
│   │   └── system/                   # System configuration files
│   │       ├── CKR_System_Rules.md
│   │       └── CKR_GEM_Persona_Extract.md
│   ├── images/                       # Image assets
│   │   ├── optimized/                # Optimized WebP images (NEW)
│   │   │   ├── logo-400.webp
│   │   │   ├── logo-800.webp
│   │   │   └── logo-1200.webp
│   │   ├── logo.png
│   │   ├── hero-bg.jpg
│   │   └── ...
│   ├── fonts/                        # Custom fonts
│   └── favicon.ico                   # Favicon
│
├── src/                              # Source code
│   ├── App.tsx                       # Main app component (OPTIMIZED)
│   ├── main.tsx                      # App entry point
│   ├── index.css                     # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── ElegantLayout.tsx
│   │   │   ├── InternalLayoutNew.tsx (UPDATED)
│   │   │   ├── ProtectedLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── auth/                     # Authentication components
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── MFAStatusBanner.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── leads/                    # Lead management components
│   │   │   ├── LeadFilters.tsx (OPTIMIZED)
│   │   │   ├── LeadDetailDrawer.tsx (OPTIMIZED)
│   │   │   ├── LeadBulkActions.tsx
│   │   │   ├── LeadTaskDialog.tsx
│   │   │   └── LeadActivityTimeline.tsx
│   │   ├── quotes/                   # Quote management components
│   │   │   ├── QuotePreview.tsx
│   │   │   ├── QuoteItemsTable.tsx
│   │   │   ├── PricingCalculator.tsx (OPTIMIZED)
│   │   │   └── QuotePDFGenerator.tsx
│   │   ├── jobs/                     # Job management components
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobScheduler.tsx
│   │   │   ├── CrewAssignment.tsx
│   │   │   └── WeatherWidget.tsx
│   │   ├── ai/                       # AI module components (NEW)
│   │   │   ├── AIModuleCard.tsx
│   │   │   ├── ContentGenerator.tsx
│   │   │   ├── AdCopyGenerator.tsx
│   │   │   ├── OperationsInsights.tsx
│   │   │   └── KnowledgeSearch.tsx
│   │   ├── shared/                   # Shared/common components
│   │   │   ├── Timeline.tsx (NEW - Consolidated)
│   │   │   ├── OptimizedImage.tsx (NEW)
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── CommandPalette.tsx
│   │   └── ...                       # Other feature components
│   │
│   ├── pages/                        # Page components (ALL LAZY LOADED)
│   │   ├── public/                   # Public website pages
│   │   │   ├── Index.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   └── ...
│   │   ├── services/                 # Service detail pages
│   │   │   ├── RoofRestoration.tsx
│   │   │   ├── RoofPainting.tsx
│   │   │   ├── RoofRepairs.tsx
│   │   │   └── ...
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── Auth.tsx
│   │   │   ├── MFASetup.tsx
│   │   │   └── MFAVerify.tsx
│   │   ├── internal/                 # Internal admin pages
│   │   │   ├── InternalHomeNew.tsx
│   │   │   ├── LeadsPipeline.tsx (OPTIMIZED)
│   │   │   ├── LeadDetail.tsx
│   │   │   ├── QuoteBuilderNew.tsx (OPTIMIZED)
│   │   │   ├── InspectionBuilderNew.tsx
│   │   │   ├── JobsCalendar.tsx (UPDATED)
│   │   │   ├── MarketingStudio.tsx
│   │   │   ├── ReportsAnalytics.tsx
│   │   │   ├── AdminUserManagement.tsx
│   │   │   └── ...
│   │   └── ai/                       # AI Digital Engine pages (NEW)
│   │       ├── OperationsAI.tsx (OPTIMIZED)
│   │       ├── ContentEngine.tsx (UPDATED)
│   │       └── AdsEngine.tsx (UPDATED)
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── knowledge/                # Knowledge base system (NEW)
│   │   │   ├── knowledgeBase.ts (ENHANCED)
│   │   │   ├── knowledgeCache.ts (NEW)
│   │   │   ├── knowledgeParser.ts (NEW)
│   │   │   └── knowledgeSearch.ts (NEW)
│   │   ├── services/                 # Business logic services (NEW)
│   │   │   ├── leadService.ts
│   │   │   ├── quoteService.ts
│   │   │   ├── jobService.ts
│   │   │   ├── aiService.ts
│   │   │   └── weatherService.ts
│   │   ├── cache/                    # Caching utilities (NEW)
│   │   │   ├── indexedDBCache.ts
│   │   │   └── queryCache.ts
│   │   ├── monitoring/               # Monitoring utilities (NEW)
│   │   │   ├── performance.ts
│   │   │   ├── sentry.ts
│   │   │   └── analytics.ts
│   │   ├── utils/                    # General utilities
│   │   │   ├── cn.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── imageOptimizer.ts (NEW)
│   │   └── constants.ts              # App constants
│   │
│   ├── store/                        # State management (NEW)
│   │   ├── authStore.ts              # Zustand auth store
│   │   ├── leadsStore.ts             # Zustand leads store
│   │   ├── quotesStore.ts            # Zustand quotes store
│   │   └── jobsStore.ts              # Zustand jobs store
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLeads.ts (OPTIMIZED)
│   │   ├── useQuotes.ts (OPTIMIZED)
│   │   ├── useJobs.ts
│   │   ├── useKnowledgeBase.ts (NEW)
│   │   ├── useCache.ts (NEW)
│   │   └── usePerformance.ts (NEW)
│   │
│   ├── integrations/                 # External integrations
│   │   ├── supabase/
│   │   │   ├── client.ts (SECURED)
│   │   │   ├── types.ts
│   │   │   └── queries.ts
│   │   ├── google/                   # Google APIs
│   │   │   ├── drive.ts
│   │   │   ├── calendar.ts
│   │   │   ├── gmail.ts
│   │   │   └── maps.ts
│   │   ├── openai/                   # OpenAI integration (NEW)
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   ├── pinecone/                 # Pinecone vector DB (NEW)
│   │   │   ├── client.ts
│   │   │   └── embeddings.ts
│   │   └── meta/                     # Meta Ads API (NEW)
│   │       ├── adsClient.ts
│   │       └── campaignManager.ts
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── lead.ts
│   │   ├── quote.ts
│   │   ├── job.ts
│   │   ├── knowledge.ts (NEW)
│   │   ├── ai.ts (NEW)
│   │   └── index.ts
│   │
│   └── styles/                       # Additional styles
│       └── globals.css
│
├── tests/                            # Test files (NEW)
│   ├── setup.ts                      # Test setup
│   ├── unit/                         # Unit tests
│   │   ├── lib/
│   │   │   ├── knowledgeBase.test.ts
│   │   │   ├── knowledgeCache.test.ts
│   │   │   └── services/
│   │   │       ├── leadService.test.ts
│   │   │       ├── quoteService.test.ts
│   │   │       └── aiService.test.ts
│   │   └── utils/
│   │       ├── formatters.test.ts
│   │       └── validators.test.ts
│   ├── component/                    # Component tests
│   │   ├── LeadsPipeline.test.tsx
│   │   ├── QuoteBuilderNew.test.tsx
│   │   ├── OperationsAI.test.tsx
│   │   └── ContentEngine.test.tsx
│   ├── e2e/                          # End-to-end tests
│   │   ├── auth.spec.ts
│   │   ├── lead-to-quote.spec.ts
│   │   ├── quote-to-job.spec.ts
│   │   └── ai-content-generation.spec.ts
│   └── fixtures/                     # Test fixtures
│       ├── leads.json
│       ├── quotes.json
│       └── knowledge.json
│
├── scripts/                          # Build and utility scripts (NEW)
│   ├── convert-images.js             # Image optimization script
│   ├── extract-knowledge-files.js    # Extract uploaded archives
│   ├── seed-database.js              # Database seeding
│   └── generate-types.js             # Generate TypeScript types
│
└── docs/                             # Documentation (NEW)
    ├── architecture.md               # Architecture overview
    ├── api.md                        # API documentation
    ├── deployment.md                 # Deployment guide
    ├── testing.md                    # Testing guide
    └── contributing.md               # Contribution guidelines
```

---

## Key Changes from Current Structure

### NEW Directories
1. **`public/knowledge-base/`** - Organized knowledge base files
2. **`src/lib/knowledge/`** - Knowledge base system
3. **`src/lib/services/`** - Business logic services
4. **`src/lib/cache/`** - Caching utilities
5. **`src/lib/monitoring/`** - Performance monitoring
6. **`src/store/`** - Zustand state management
7. **`src/integrations/openai/`** - OpenAI integration
8. **`src/integrations/pinecone/`** - Vector database
9. **`src/integrations/meta/`** - Meta Ads API
10. **`tests/`** - Comprehensive test suite
11. **`scripts/`** - Build and utility scripts
12. **`docs/`** - Project documentation

### UPDATED Files
1. **`src/App.tsx`** - Lazy loading implementation
2. **`src/integrations/supabase/client.ts`** - Environment variables
3. **`src/lib/knowledgeBase.ts`** - Real data loaders
4. **`src/pages/LeadsPipeline.tsx`** - Performance optimization
5. **`src/pages/QuoteBuilderNew.tsx`** - Performance optimization
6. **`src/pages/OperationsAI.tsx`** - Real data integration
7. **`src/pages/ContentEngine.tsx`** - Real data integration
8. **`src/pages/AdsEngine.tsx`** - Real data integration
9. **`vite.config.ts`** - Code splitting and compression

### NEW Configuration Files
1. **`.env`** - Environment variables (gitignored)
2. **`.env.example`** - Environment variables template
3. **`vitest.config.ts`** - Test configuration
4. **`playwright.config.ts`** - E2E test configuration

---

## File Count Summary

| Category | Count |
|----------|-------|
| **Total Files** | 150+ |
| **React Components** | 90+ |
| **Pages** | 42 |
| **Utility Libraries** | 25+ |
| **Test Files** | 20+ |
| **Configuration Files** | 10 |
| **Knowledge Base Files** | 33 |

---

## Dependencies Summary

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@supabase/supabase-js": "^2.38.0",
  "@tanstack/react-query": "^5.8.0",
  "zustand": "^4.4.7",
  "openai": "^4.20.0",
  "@pinecone-database/pinecone": "^1.1.0",
  "sharp": "^0.33.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react-swc": "^3.5.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.1.0",
  "@playwright/test": "^1.40.0",
  "vite-plugin-compression": "^0.5.1"
}
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-05  
**Prepared By:** Bob (Architect)