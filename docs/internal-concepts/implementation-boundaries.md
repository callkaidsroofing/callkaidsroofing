# Implementation Boundaries For Future Projects

## What Was Removed From This Website

The public website should not carry the old internal/admin implementation:

- Admin routes.
- Auth and MFA pages.
- Internal redirects.
- CRM pages.
- CMS pages.
- Internal AI assistant pages.
- Inspection and quote builder pages.
- Admin shell layouts.
- Internal dashboards and data tables.

The public website should stay focused on customer-facing pages, lead capture, service pages, suburb pages, portfolio/gallery, legal pages, and conversion flows.

## What To Preserve Only As Concepts

The following ideas are worth reusing elsewhere:

- Lead pipeline.
- Inspection-to-quote workflow.
- Business knowledge source of truth.
- Quote document generation.
- Job closeout and warranty document flow.
- Media evidence management.
- Internal search over approved business knowledge.
- KPI dashboard.
- Content/SEO management control plane.

## What Not To Copy

Do not copy:

- Old route structure.
- Old admin UI composition.
- Hardcoded contact details.
- Hardcoded warranty claims.
- Hardcoded pricing presets without verification.
- Stale customer counts or review counts.
- Supabase table assumptions without a current schema review.
- Internal assistant prompts without a privacy/security pass.
- Any credentials, tokens, `.env` data, logs, or customer data.

## Future Architecture Direction

If these concepts are rebuilt, split them from the public marketing website:

- Public website: static/SSR customer-facing conversion surface.
- Business operations app: authenticated CRM, quoting, job, and document workflows.
- Knowledge service: validated business facts, SOPs, pricing, warranty, and source metadata.
- Media service: private job media plus curated public gallery assets.
- Automation layer: lead follow-up, quote follow-up, job reminders, document generation.

This separation keeps the website fast and clean while letting internal workflows evolve independently.

## Migration Notes

When resurfacing the concepts:

- Rebuild from the current business source of truth.
- Revalidate warranty terms and product warranty language.
- Revalidate pricing against current supplier/labour assumptions.
- Revalidate database schema and row-level security.
- Treat customer data as private by default.
- Add audit logs for internal actions.
- Make every AI answer cite approved sources.
