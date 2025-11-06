# CKR Master Knowledge Framework (MKF) — v1.0

**Updated:** 31 Oct 2025

This package contains:
- `/mkf/mkf_index.json` — machine-readable index & invariants
- `/mkf/*.md` — human-readable Knowledge pages (each with full *Unabridged Source* appendices)
- `/mkf/schemas/*.json` — JSON schemas for quotes, case studies, measurements
- `/code_snippets/*` — drop-in components/hooks (ProtectedLayout, useQuerySafe, etc.)
- `/source/*` — your original uploaded files (verbatim)

## How to install in your Lovable project
1. Create a folder `src/mkf/` in your repo and add **all** files from `/mkf/` here.
2. Commit `/code_snippets/` files into your project (place them as desired and wire routes).
3. In Lovable **Settings → Knowledge**, paste **MKF_00.md** and **MKF_01.md** first (highest leverage). Then add others as needed.
4. Use this anchor prompt before edits:
   > Read the MKF Knowledge (MKF_00 invariants first). Summarise the constraints you'll obey. Then implement the change. Return: files changed, test steps, rollback note, robots/auth check.

## Router guard (quick start)
- Wrap all `/internal/v2/*` routes with `ProtectedLayout` from `/code_snippets/ProtectedLayout.tsx`.
- Add redirects from legacy `/internal/home` and `/internal/dashboard` to `/internal/v2/home`.

## Embedding guidance
If you embed these pages for RAG:
- Chunk size ~1200 chars, overlap ~150; keep section headers within chunks.
- Re-rank MKF_00 > MKF_01 > MKF_05 > MKF_04 > MKF_03 > others.

## Contact constants (never drift)
ABN **39475055075** · Phone **0435 900 709** · Email **info@callkaidsroofing.com.au**
