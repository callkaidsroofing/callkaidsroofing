# Monorepo Structure Scaffold (Public + Internal)

**Purpose**: Safely separate Google-indexed public site from the private internal system without breaking existing deployments.

## Apps
- `apps/public/` — Public marketing website (indexable; sitemap + robots).
- `apps/internal/` — Private back-office app (auth-gated; noindex).

## Knowledge
- `knowledge/` — Source-only knowledge base; never directly served.

## CI
- `.github/workflows/brand_guard.yml` — blocks wrong email/ABN/colours.
- `.github/workflows/deploy_public.yml` — deploys only on public-app changes.
- `.github/workflows/deploy_internal.yml` — deploys only on internal/knowledge changes.

## Safety
- Internal sends `X-Robots-Tag: noindex, nofollow` and disallows crawl in `robots.txt`.
- Auth middleware protects all `/apps/internal` routes.

> This is a scaffold commit adding paths and placeholders only. It **does not move** existing code or change the live deployment target.
