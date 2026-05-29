# Call Kaids Roofing Website Refactor Plan

Created: 2026-05-18  
Repo: `callkaidsroofing/callkaidsroofing`  
Working tree path: `/root/callkaidsroofing`  
Planning mode: strategic refactor of existing Vite/React/Supabase CMS site, not a ground-up rewrite.

## Executive Decision

Keep the current Vite + React + React Router + Supabase CMS architecture for the first rebuild pass.

The repo already has the main pieces the Obsidian notes asked for:

- dynamic service routes at `/services/:slug`
- dynamic suburb routes at `/suburbs/:slug`
- `react-helmet-async` SEO metadata
- `content_services`, `content_suburbs`, `content_case_studies`, and RAG/knowledge infrastructure
- public quote/lead forms with image upload capability
- components for trust, reviews, schema, before/after proof, and optimized images

The highest-value work is to unify the existing surfaces, correct business invariants, improve crawlable public content, tighten conversion UX, and scale service/suburb content through the CMS.

## Inputs Reviewed

### Obsidian Planning Files

- `/sdcard/Documents/AgentVault/06-Workspace/2026-05-18.md`
- `/sdcard/Documents/AgentVault/Hardened_Rebuild_Plan__Call_Kaids_Roofing.md`
- `/sdcard/Documents/AgentVault/06-Workspace/pasted_content.txt`
- `/sdcard/Documents/AgentVault/06-Workspace/pasted_content_2.txt`
- `/sdcard/Documents/AgentVault/06-Workspace/pasted_content_3.txt`

### Website Repo

- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/pages/Services.tsx`
- `src/pages/ServiceDetail.tsx`
- `src/pages/SuburbPage.tsx`
- `src/components/SEOHead.tsx`
- `src/components/StructuredData.tsx`
- `src/components/SchemaMarkup.tsx`
- `src/components/LocalBusinessSchema.tsx`
- `src/public/components/LeadCaptureForm.tsx`
- `public/robots.txt`
- `public/sitemap.xml`
- `docs/DESIGN_SYSTEM.md`
- `docs/KNOWLEDGE_PACK_V1.1.md`
- `knowledge-base/README.md`
- `knowledge/brand/BRAND_GUIDE.md`
- `knowledge/mkf/MKF_00_combined.md`
- `knowledge/warranty/WARRANTY_POLICY.md`
- `knowledge-base/mkf/source/02_Brand_Voice/CKR_03_SEO_KEYWORD_MATRIX.csv`
- `knowledge-base/mkf/source/03_Operations_SOPs/CKR_Services_Database.csv`
- `knowledge-base/mkf/source/03_Operations_SOPs/CKR_Suburbs_Database.csv`
- `knowledge-base/mkf/source/04_Marketing_Content/MKF_06.md`
- `/root/AgentVault/ckr-questionnaire.html`
- `/root/AgentVault/05-Domain/README.md`
- `/root/AgentVault/05-Domain/CKR-Identity.md`
- `/root/AgentVault/05-Domain/CKR-Legal-Terms.md`
- `/root/AgentVault/05-Domain/CKR-Service-Area.md`
- `/root/AgentVault/05-Domain/CKR-Warranties.md`

### External SEO References

- Google Search Central SEO Starter Guide
- Google Search Central JavaScript SEO basics
- Google Search Central title links guidance
- Google Search Central URL structure guidance
- Google Search Central structured data gallery
- Google Search Central LocalBusiness structured data

## Key Findings

### 1. Business Invariants Are Mostly Resolved By The Questionnaire

The vault contains an owner verification questionnaire and generated domain notes. Treat the owner-verified files under `/root/AgentVault/05-Domain/` as the highest-confidence business source for public identity, legal, service-area, and warranty claims.

Verified values from owner-questionnaire-v2:

| Field | Verified value |
| --- | --- |
| Trading name | Call Kaids Roofing |
| ABN | `39 475 055 075` |
| Structure | Sole Trader |
| Owner/operator | Kaidyn Brownlie |
| Phone | `0435 900 709` |
| Primary customer email | `info@callkaidsroofing.com.au` |
| Secondary/business email | `callkaidsroofing@outlook.com` |
| HQ | Clyde North, VIC |
| Service area | 50 km radius from Clyde North, South-East Melbourne corridor |
| Insurance | Bizcover public liability, `$20,000,000 AUD`, policy `BZ21061CMB` |
| Licence | `CDB-U 66867` |
| Google rating snapshot | 5.0 from 21 reviews as of Mar 2026 |
| Standard workmanship warranty | 10 years for standard work |
| Minor isolated repair warranty | 5-7 years |
| Patch/emergency make-safe warranty | none |
| Product warranties | IRC Roof Refresh 10 years, IRC Roof Protect 15 years, IRC Platinum Protect 20 years |
| Warranty certificates | on request |
| Quote validity | 30 days |
| Deposit | 20% before commencement |

Still open or implementation-sensitive:

- warranty transferability is not confirmed
- payment methods should verify whether PayID is public-facing
- website pages currently contain stale or conflicting warranty/review/job-count claims
- an older AgentVault hub note still contains stale ABN/base values and should not override the questionnaire-verified domain notes

Phase 0 should now implement the verified values and remove stale claims, not pause for every invariant.

### 2. Current Site Is Overbuilt Internally, Under-Unified Publicly

The admin/CMS/RAG engine is advanced, but the public site still mixes:

- static service pages
- dynamic CMS pages
- hardcoded suburb/service landing pages
- repeated metadata
- static sitemap entries with stale dates
- trust claims that are not consistently tied to verified knowledge records

The plan should reduce duplicated page logic and make CMS content the public source of truth.

### 3. SPA SEO Is Manageable, But Needs Guardrails

Google can render JavaScript, but the current SPA needs stronger technical SEO controls:

- stable canonical URLs without query leakage where not intended
- generated sitemap from CMS data
- server/prerender option for high-value landing pages if Search Console shows rendering or indexing issues
- correct HTTP behavior for missing service/suburb pages where hosting allows it
- page-specific metadata visible in rendered HTML and validated with URL Inspection/Rich Results Test

### 4. The Brand Strategy Is Clear

Use these as non-negotiable content rules:

- voice: intelligent, relaxed, direct, warm, proof-driven
- posture: expert consultant, not pushy salesperson
- slogan: `Proof In Every Roof`
- core proof: real job photos, before/after, photo documentation, insurance, warranty, owner contact
- avoid: cheapest claims, stock images, overhyped promises, unsupported review counts, unsupported job counts, legal ambiguity
- primary persona: risk-averse homeowner, value-conscious, time-poor, wants proof and clear communication

## North Star

Build a public website that turns high-intent SE Melbourne homeowners into qualified quote requests by proving three things quickly:

1. CKR understands the roof problem.
2. CKR can show real proof of similar work.
3. The next step is easy: call Kaidyn or request a free roof health check.

## Target Architecture

### Keep

- Vite
- React
- React Router
- Supabase
- Tailwind + shadcn/ui patterns
- existing admin/CMS tools
- RAG/knowledge architecture
- `LeadCaptureForm`
- `SEOHead`, schema components, optimized image pipeline

### Refactor

- public route strategy
- sitemap generation
- SEO metadata source model
- public page templates
- CMS-first content model
- trust proof components
- lead form field taxonomy

### Avoid For Phase 1

- migrating to Next.js/Astro before proving it is necessary
- rewriting the admin system
- copying static content into code when CMS tables already exist
- creating thin suburb pages
- expanding unsupported claims beyond the questionnaire-verified domain notes

## Public Sitemap Target

### Core

- `/`
- `/about`
- `/services`
- `/quote`
- `/contact`
- `/gallery`
- `/portfolio`
- `/reviews`
- `/faq`
- `/warranty`
- `/service-areas`
- `/blog`

### Dynamic Service Pages

Canonical pattern:

- `/services/:slug`

Initial priority services:

- `/services/roof-restoration`
- `/services/roof-repairs`
- `/services/roof-painting`
- `/services/roof-cleaning`
- `/services/gutter-cleaning`
- `/services/roof-repointing`
- `/services/tile-replacement`
- `/services/valley-iron-replacement`
- `/services/leak-detection`
- `/services/roof-inspection`

### Dynamic Suburb Pages

Canonical pattern:

- `/suburbs/:slug`

Initial priority suburbs:

- Berwick
- Clyde North
- Clyde
- Cranbourne
- Narre Warren
- Pakenham
- Officer
- Beaconsfield
- Hallam
- Dandenong
- Hampton Park
- Rowville
- Keysborough

### Service + Suburb Landing Pages

Use selectively for Tier 1 commercial intent. Do not generate every combination at once.

Preferred canonical pattern:

- `/services/:serviceSlug/:suburbSlug`

Launch first:

- `roof-restoration-berwick`
- `roof-restoration-clyde-north`
- `roof-restoration-cranbourne`
- `roof-restoration-pakenham`
- `roof-repairs-berwick`
- `roof-leak-repair-berwick`
- `roof-painting-clyde-north`
- `rebedding-repointing-narre-warren`
- `gutter-cleaning-clyde`

## Phase 0: Business Invariants And Governance

Goal: apply questionnaire-verified facts and prevent public-facing legal/trust inconsistencies.

Tasks:

1. Create a single business invariant module for the public website.
2. Seed it from `/root/AgentVault/05-Domain/CKR-Identity.md`, `CKR-Legal-Terms.md`, `CKR-Service-Area.md`, and `CKR-Warranties.md`.
3. Replace hardcoded public claims with invariant references.
4. Add a content governance note: owner-questionnaire-v2 domain notes outrank older hub notes and stale repo marketing copy for business facts.
5. Add a website claims audit checklist: review count, job count, warranty years, insurance, license, service area.
6. Mark only warranty transferability and PayID public display as unresolved.

Acceptance:

- one source file controls all public identity claims
- no page hardcodes conflicting ABN/email/warranty/base suburb
- schema uses the same values as visible page content
- unsupported claims are either removed or marked as requiring proof

Suggested files:

- `src/config/business.ts`
- `src/config/claims.ts`
- `docs/plans/CALL_KAIDS_WEBSITE_REBUILD_PLAN.md`
- `docs/plans/call-kaids-website-rebuild-plan.json`

## Phase 1: Public Route And CMS Unification

Goal: make the CMS the public content engine.

Tasks:

1. Keep `/services/:slug` as canonical for service pages.
2. Keep `/suburbs/:slug` as canonical for suburb pages.
3. Replace hardcoded duplicate service landing routes with redirects or CMS-backed records.
4. Add a `ServiceSuburbPage` template only for selected high-intent pages.
5. Add 404 handling that is crawl-safe and user-useful.
6. Ensure route order does not let static pages shadow dynamic CMS pages unintentionally.

Acceptance:

- each public service has one canonical URL
- hardcoded and CMS versions do not compete
- old URLs redirect to canonical equivalents
- sitemap includes only canonical public URLs

## Phase 2: SEO Foundation

Goal: make Google and users understand each page.

Tasks:

1. Generate page titles from page intent:
   - home: brand + broad service area
   - service: service + SE Melbourne
   - suburb: roofing + suburb
   - service-suburb: service + suburb
   - blog: question/problem intent
2. Write unique meta descriptions for every core page.
3. Remove placeholder verification tags from `SEOHead`.
4. Remove low-value legacy meta tags such as `revisit-after`, `coverage=Worldwide`, and generic keyword stuffing.
5. Ensure canonical URLs exclude tracking query params.
6. Generate `public/sitemap.xml` from route/CMS data at build time.
7. Update `robots.txt` to block admin/private areas while allowing public assets.
8. Add breadcrumb UI and Breadcrumb JSON-LD for service, suburb, and blog pages.
9. Validate LocalBusiness, Service, FAQ, Article, and Breadcrumb schema with Rich Results Test.

Acceptance:

- no repeated homepage snippet across core pages
- no placeholder GSC/Bing verification codes
- sitemap `lastmod` reflects real content update date
- each indexable page has unique title, description, canonical, and visible H1
- structured data matches visible content

Google-aligned constraints:

- use descriptive, concise titles
- use readable hyphenated URLs
- make page relationships clear through site structure and internal links
- validate structured data before release
- test rendered SPA pages in Search Console URL Inspection

## Phase 3: Homepage Conversion Rebuild

Goal: turn the homepage into a proof-led quote path.

Recommended structure:

1. Hero
   - H1: `Roof Restorations & Repairs in Southeast Melbourne`
   - supporting copy: direct-to-owner, proof-backed, warranty-backed with questionnaire-verified wording
   - primary CTA: `Get Your Free Roof Health Check`
   - secondary CTA: `Call 0435 900 709`
   - real roof/jobsite image, not abstract background
2. Trust bar
   - Direct to owner
   - Fully insured
   - Photo-backed reports
   - Warranty-backed work
   - Local to SE Melbourne
3. Problem routing
   - Leaking roof
   - Faded roof
   - Cracked tiles
   - Moss/lichen
   - Failing ridge capping
   - Overflowing gutters
4. Services preview
   - link to CMS service pages
5. Proof section
   - before/after carousel from `content_case_studies`
6. Reviews/testimonials
   - only verified counts/quotes
7. Process
   - request
   - inspect
   - explain options
   - complete and document
8. Service areas
   - priority suburb links
9. FAQ
10. Final CTA

Acceptance:

- above the fold answers what, where, why trust, and next step
- mobile has call and quote affordances without layout shift
- no unsupported review/job/warranty claims
- real imagery is prioritized over decorative visuals

## Phase 4: Service Hub And Service Pages

Goal: make services useful for both high-intent searchers and uncertain homeowners.

Services hub:

- intro to roofing services in SE Melbourne
- service cards with problem-solution framing
- signs your roof may need attention
- links to service pages
- service area links
- quote CTA

Service page template:

1. H1: service + SE Melbourne
2. who this service is for
3. common signs/problems
4. what is included
5. CKR process
6. materials/standards where relevant
7. related case studies
8. related suburbs
9. FAQs
10. lead form with photo upload

Priority pages:

- Roof Restoration
- Roof Repairs
- Roof Painting
- Roof Cleaning
- Gutter Cleaning
- Roof Repointing
- Tile Replacement
- Valley Iron Replacement
- Leak Detection
- Roof Inspection

Acceptance:

- service content comes from `content_services`
- each service has unique metadata and FAQs
- related case studies are pulled from CMS
- each page has a clear quote path

## Phase 5: Local SEO And Suburb Engine

Goal: rank and convert for suburb-specific demand without thin pages.

Suburb page template:

1. H1: `Roofing Services in {Suburb}`
2. local intro
3. common roofing issues in that area
4. services available
5. relevant case studies or proof
6. nearby suburbs/internal links
7. FAQs
8. CTA

Service-suburb page template:

1. H1: `{Service} in {Suburb}`
2. problem-specific intro
3. why that service matters for that suburb/home type
4. process
5. proof/case study
6. quote CTA

Acceptance:

- no copy-paste suburb pages
- each local page has a unique H1, title, description, intro, and FAQ set
- pages link back to relevant service and service-area hub pages
- launch only highest-value pages first

## Phase 6: Trust And Proof System

Goal: make proof visible and verifiable everywhere.

Tasks:

1. Connect before/after sections to `content_case_studies`.
2. Standardize proof cards:
   - suburb
   - service
   - problem
   - work completed
   - before/after images
   - warranty applied
3. Add a review/testimonial source model.
4. Add owner-led proof blocks where appropriate.
5. Add warranty explainer blocks based on questionnaire-verified policy.

Acceptance:

- no fabricated review counts
- proof blocks are backed by CMS records or approved knowledge
- each high-value service page has at least one related proof element

## Phase 7: Lead Capture And CRM Fit

Goal: make every public conversion path map cleanly into the CKR sales pipeline.

Quote form fields:

- name
- phone
- email
- suburb
- service needed
- urgency
- problem description
- photo upload
- preferred contact method
- source page / campaign

CRM requirements:

- store source route
- store service intent
- store suburb intent
- store urgency
- attach photos
- tag lead as homeowner/property manager/commercial when known
- support GHL/Supabase sync without duplicating lead identity

Acceptance:

- every CTA path records source context
- photos are optional but encouraged
- form copy is low-pressure and proof-led
- quote submission lands in the correct lead pipeline stage

## Phase 8: Performance, Accessibility, And UX Polish

Goal: make the site fast, readable, and usable on phones.

Tasks:

1. Audit mobile layout at 360px, 390px, 768px, and desktop.
2. Use `OptimizedImage` and existing image variant generation for all public hero/proof images.
3. Reduce nested card-heavy layouts.
4. Keep UI consistent with `docs/DESIGN_SYSTEM.md`.
5. Ensure buttons do not overflow on mobile.
6. Add meaningful alt text for real job photos.
7. Use semantic headings and landmark structure.
8. Minimize decorative animation on high-intent conversion pages.

Acceptance:

- no mobile text/button overflow
- hero LCP image is real and optimized
- Core Web Vitals checked after implementation
- public pages pass basic keyboard and screen-reader checks

## Phase 9: Measurement And Release

Goal: prove the rebuild works.

Tasks:

1. Set up GA4 events:
   - phone click
   - quote form start
   - quote form submit
   - photo upload
   - service page CTA
   - suburb page CTA
2. Connect Search Console verification with real token.
3. Submit sitemap.
4. Validate top pages with URL Inspection.
5. Run Rich Results Test for schema pages.
6. Run Lighthouse/PageSpeed checks.
7. Track first 30 days:
   - clicks
   - impressions
   - CTR
   - calls
   - quote submissions
   - service/suburb pages indexed

Acceptance:

- analytics events fire in preview/production
- sitemap accepted
- no critical structured data errors
- lead source attribution works

## Implementation Order

1. Phase 0: Invariants and claims audit
2. Phase 1: Route/CMS canonical model
3. Phase 2: SEO metadata, sitemap, schema cleanup
4. Phase 3: Homepage conversion rebuild
5. Phase 4: Service templates and content
6. Phase 5: Suburb/local SEO rollout
7. Phase 6: Proof/trust data integration
8. Phase 7: Lead capture and CRM attribution
9. Phase 8: UX/performance/accessibility
10. Phase 9: measurement and release

## Review Checklist

Before implementation starts:

- [x] Confirm ABN: `39 475 055 075`
- [x] Confirm license number: `CDB-U 66867`
- [x] Confirm insurance wording: Bizcover public liability, `$20M AUD`, policy `BZ21061CMB`, certificate available on request
- [x] Confirm public email: `info@callkaidsroofing.com.au`
- [x] Confirm base suburb and service radius: Clyde North, 50 km radius, SE Melbourne corridor
- [x] Confirm warranty wording by service type: standard workmanship 10 years; minor repairs 5-7 years; temporary patch/make-safe none; product warranties 10/15/20 years by IRC product tier
- [ ] Confirm warranty transferability
- [ ] Confirm whether PayID should be advertised publicly
- [ ] Confirm approved claims for review count and jobs completed
- [ ] Confirm priority services
- [ ] Confirm first 10 priority suburbs
- [ ] Confirm preferred canonical URL pattern for service-suburb pages

Before release:

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Playwright smoke for home, services, service detail, suburb detail, quote form
- [ ] Mobile screenshot review
- [ ] sitemap generated and inspected
- [ ] robots inspected
- [ ] Rich Results Test for schema pages
- [ ] Search Console URL Inspection for representative SPA pages

## Source-Aligned Notes

- The Obsidian rebuild docs correctly identify conversion, trust proof, service pages, suburb pages, and metadata uniqueness as the main business opportunity.
- The hardened plan is correct to avoid a full framework rewrite in the first pass because the repo already has Supabase CMS and dynamic page infrastructure.
- The AgentVault/CKR knowledge base adds stronger business rules than the website currently enforces: proof-led voice, photo documentation, expert-consultant posture, and no unsupported claims.
- Current Google Search Central guidance supports readable URL structure, unique descriptive titles, structured data validation, sitemap use, and rendered-page testing for JavaScript sites.
