# Next.js Local Public Website Rebuild Plan

Date: 2026-05-18

## Decision

Rebuild the public Call Kaids Roofing website locally as a clean Next.js App Router site before changing the production domain source.

This supersedes the earlier Vite-first hardening assumption because the internal/admin website surface is being removed. The public site no longer needs to carry CRM, CMS, auth, MFA, or internal quoting tools.

## Tooling Notes

Routing pass used:

- `meta-skill-router` for skill/tool routing.
- Context7 for current Next.js App Router documentation.
- GitHub MCP/source search for repository discovery.
- Agensi marketplace search; no useful matching rebuild/SEO skill was found.

Next.js documentation confirms the intended approach:

- App Router can render page content as server/static HTML by default.
- `generateMetadata` supports route-specific metadata.
- `app/sitemap.ts` and `app/robots.ts` conventions support machine-readable discovery files.
- JSON-LD should be rendered as `application/ld+json` script tags in page/layout components, with JSON string escaping.

## Non-Negotiables

- Public website only.
- No `/admin`.
- No `/internal`.
- No auth/MFA.
- No embedded CRM/CMS/quoting dashboard.
- Internal/admin ideas stay only in `docs/internal-concepts/`.
- No hardcoded phone, ABN, warranty, review count, or business identity inside page components.
- All public claims must come from verified local content/config.

## Local Target

Create a separate local app:

```txt
/root/callkaidsroofing-next
```

Do not switch the production domain or current repo source until the local Next build is verified.

## Recommended Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Server components by default.
- Client components only for forms, menus, galleries, and small interactions.
- Local typed content files first.
- No CMS in the first rebuild pass.
- Optional Supabase/function form endpoint later, after the static public pages are proven.

## Source Inputs

Use these as source material:

- Current Vite public pages in `/root/callkaidsroofing/src/pages`.
- Current verified business config in `/root/callkaidsroofing/src/config/business.ts`.
- Planning docs from AgentVault:
  - `Hardened_Rebuild_Plan__Call_Kaids_Roofing.md`
  - `pasted_content.txt`
  - `pasted_content_2.txt`
  - `pasted_content_3.txt`
- Verified AgentVault domain docs and questionnaire.
- Preserved internal concepts in `docs/internal-concepts/` only as future-project reference, not website scope.

## App Shape

```txt
src/
  app/
    layout.tsx
    page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    service-areas/page.tsx
    service-areas/[slug]/page.tsx
    gallery/page.tsx
    portfolio/page.tsx
    about/page.tsx
    contact/page.tsx
    quote/page.tsx
    warranty/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    privacy-policy/page.tsx
    terms-of-service/page.tsx
    thank-you/page.tsx
    sitemap.ts
    robots.ts
  components/
    layout/
    sections/
    forms/
    seo/
    ui/
  content/
    business.ts
    services.ts
    service-areas.ts
    faqs.ts
    reviews.ts
    projects.ts
    blog.ts
  lib/
    seo.ts
    schema.ts
    urls.ts
```

## Core Content Model

### Business

Single verified source for:

- Trading name.
- Owner/operator.
- ABN.
- Licence.
- Insurance.
- Phone.
- Email.
- Website.
- Headquarters.
- Service radius.
- Review snapshot.
- Warranty terms.
- Social/profile URLs.

### Services

Each service should include:

- Slug.
- Name.
- Short summary.
- Customer problem.
- Outcome.
- Inclusions.
- Exclusions or caveats.
- Process steps.
- FAQs.
- Related services.
- Suggested suburb pairings.
- Metadata.
- JSON-LD service fields.

### Service Areas

Each suburb should include:

- Slug.
- Name.
- Region.
- Intro copy.
- Common roof issues.
- Services offered.
- Nearby suburbs.
- CTA copy.
- Metadata.

### Projects/Gallery

Each project should include:

- Slug.
- Suburb.
- Service.
- Before image.
- After image.
- Short scope.
- Outcome.
- Whether it is public-approved.

## Page Strategy

### Homepage

Sections:

1. Hero: roof restorations and repairs in South-East Melbourne.
2. Trust bar: direct owner, fully insured, 10-year workmanship on standard work, photo-backed work.
3. Core services.
4. Problem-solution chooser.
5. Why Call Kaids Roofing.
6. Before/after proof.
7. Reviews/testimonials.
8. Process.
9. Service areas preview.
10. FAQ.
11. Final CTA.

### Services Hub

Purpose: help visitors choose the right service.

Structure:

- Hero.
- Service cards framed by customer problem.
- "Not sure what you need?" inspection CTA.
- Trust/proof block.
- Service FAQs.

### Service Pages

Each service page:

- Service-specific hero.
- Symptoms/problems.
- What the service includes.
- Process.
- Materials/quality notes when relevant.
- Proof/gallery examples.
- FAQs.
- Related services and suburbs.
- CTA.

### Service Area Pages

Each suburb page:

- Local intro.
- Services in that suburb.
- Local proof when available.
- Nearby suburbs.
- CTA.
- Breadcrumbs and LocalBusiness/Service schema.

### Quote/Contact

Keep short and conversion-focused:

- Name.
- Phone.
- Email optional.
- Suburb.
- Service type.
- Urgency.
- Message.
- Photo upload later, not required for MVP.

### Warranty

Use verified warranty language only:

- Patch/emergency make-safe: none unless confirmed in writing.
- Minor isolated repairs: 5-7 years where applicable.
- Standard workmanship: 10 years.
- Product warranties: by specified coating system.
- Certificates: on request.
- Transferability: unconfirmed unless verified later.

## SEO And Machine Readability

Every indexable route must provide:

- Static/server-rendered content.
- `generateMetadata`.
- Canonical URL.
- Open Graph metadata.
- Breadcrumbs.
- JSON-LD where useful.
- Internal links.

Schema targets:

- LocalBusiness/RoofingContractor.
- Service.
- FAQPage.
- BreadcrumbList.
- BlogPosting.
- Review only when source and policy compliance are confirmed.

Discovery:

- `app/sitemap.ts`.
- `app/robots.ts`.
- No admin/internal URLs.

## Implementation Phases

### Phase 0: Local Scaffold

- Create `/root/callkaidsroofing-next`.
- Scaffold Next.js with TypeScript and Tailwind.
- Add lint/typecheck/build scripts.
- Add base layout, global styles, and brand tokens.

Acceptance:

- `npm run typecheck` passes.
- `npm run build` passes.
- No production/domain change.

### Phase 1: Content Foundation

- Port verified business facts.
- Create services and service area content models.
- Create SEO/schema helpers.
- Add sitemap/robots.

Acceptance:

- No hardcoded public business facts in pages.
- Generated sitemap includes only public pages.

### Phase 2: Core Public Shell

- Header.
- Footer.
- Mobile call/quote sticky action.
- CTA section.
- Trust bar.
- Form shell.

Acceptance:

- No internal/admin links.
- Mobile navigation has stable layout.

### Phase 3: Core Pages

- Homepage.
- Services hub.
- Contact.
- Quote.
- About.
- Warranty.
- Legal pages.

Acceptance:

- Each page has metadata, canonical, and visible CTA.

### Phase 4: Service And Suburb Pages

- Dynamic service pages.
- Dynamic suburb pages.
- Internal linking between services and suburbs.

Acceptance:

- Static params generated.
- No missing slugs.
- Service/suburb pages render full HTML.

### Phase 5: Proof Content

- Gallery.
- Portfolio/projects.
- Reviews/testimonials.
- Before/after components.

Acceptance:

- Only public-approved assets included.
- Image alt text present.

### Phase 6: Verification

- Typecheck.
- Lint.
- Build.
- Local crawl.
- Broken link scan.
- HTML inspection for key pages.
- JSON-LD validation pass.
- Lighthouse check on homepage, service page, suburb page.

Acceptance:

- No admin/internal routes.
- No stale claims.
- No client-only primary content.

## Domain Switch Gate

Do not point the domain/build source to the Next app until:

- Current Vite public URL inventory is mapped.
- Redirect plan is written.
- Local Next build passes.
- Sitemap/robots are reviewed.
- Key page rendered HTML is inspected.
- Contact/quote flow is verified.
- Existing high-value URLs are preserved or redirected.

## First Execution Step

Scaffold the local Next.js app in `/root/callkaidsroofing-next`, then port only:

1. Business facts.
2. SEO/schema helpers.
3. Services content skeleton.
4. Service area content skeleton.
5. Basic layout.

No visual polish until the data and route contract is stable.
