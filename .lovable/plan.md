# Plan: Ship SEO fixes + GSC + dynamic blog sitemap

Three asks, plus a blocker that must be cleared first.

## 0. Clear the blocker (TypeScript build errors)

The build is currently failing with ~hundreds of TS errors in files that reference Supabase tables (`content_blog_posts`, `content_case_studies`, `content_gallery`, `content_services`, `user_roles`, `business_profile_data`, `conflict_resolutions`, etc.) plus a missing module `./ImageUploadField`.

Root cause: `src/integrations/supabase/types.ts` is out of date — it only contains a tiny set of gem/* tables and views, so every real table is unknown. The previous chat created `src/integrations/supabase/types.ts.bak` which is likely the full generated types.

Fix:
1. Restore the full Supabase types: replace `src/integrations/supabase/types.ts` with the `.bak` contents (or regenerate from the live schema).
2. Investigate the missing `src/components/ImageUploadField` import in `ManualRoofMeasurementForm.tsx` — either restore the file or remove the unused import.
3. Run the build to confirm 0 errors.

Without this, publish will refuse and any sitemap script won't run either.

## 1. Generate blog sitemap entries dynamically

The `http:sitemap` finding still flags `/blog/:slug`. The current `public/sitemap.xml` is hand-edited. Switching to a generator keeps blog posts in sync automatically.

Approach:
- Add `scripts/generate-sitemap.ts` that:
  - keeps the existing static routes (services, suburbs, public pages),
  - queries Supabase (`content_blog_posts`, filtered to published) using the public anon key from `.env`,
  - writes one `<url>` entry per slug to `public/sitemap.xml`.
- Wire it into `package.json` via `predev` and `prebuild` so it runs automatically.
- Falls back gracefully if Supabase is unreachable (keeps last known file).

## 2. Connect Google Search Console

Steps:
1. Trigger the connector picker (`standard_connectors--connect` with `google_search_console`) so you authorize OAuth.
2. Request a META verification token for `https://callkaidsroofing.com.au/`.
3. Add `<meta name="google-site-verification" content="…">` to `index.html` `<head>`.
4. After publish, call the verify endpoint, then PUT the site into the Search Console property list.
5. Submit `https://callkaidsroofing.com.au/sitemap.xml` as the sitemap.

Step 1 requires you to click through the connector dialog — I can't authorize on your behalf.

## 3. Publish

Once steps 0 and 1 land and the verification meta tag is in place, call `preview_ui--publish`. Steps 2 (verify + sitemap submission to GSC) complete after the deploy is live, because Google fetches the meta tag from the production URL.

## Order of operations

```text
0. Restore supabase types  →  build passes
1. Add sitemap generator   →  /blog/:slug entries present
2a. Connect GSC + add meta tag
3.  Publish
2b. Verify ownership in GSC + submit sitemap
```

## Technical details

- `src/integrations/supabase/types.ts.bak` exists from a prior session; diff before swapping in case it's stale.
- Sitemap generator uses `import { createClient } from '@supabase/supabase-js'` with `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env`.
- After GSC connect, mark `gsc:gsc` and `http:sitemap` findings fixed via `seo_chat--update_findings`.
- No new dependencies needed — `@supabase/supabase-js` is already installed.

Confirm and I'll execute in build mode.
