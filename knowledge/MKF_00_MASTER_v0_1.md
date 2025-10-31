# CKR — Master Knowledge File (MKF) v0.1

**Organisation**: Call Kaids Roofing (CKR) — ABN 39475055075 — 0435 900 709 — info@callkaidsroofing.com.au

**Purpose**: Single source of truth that unifies brand, services, pricing constants, SOPs, systems, and automations across CKR. All agents (CKR‑GEM, CKR‑Bolt, Lovable AI, Supabase functions) must resolve facts first from MKF before external queries.

---

## 0. Canonical Pointers
0.1 Timezone: Australia/Melbourne (AEST/AEDT).
0.2 Date format: DD MMM YYYY.
0.3 Colours: #007ACC, #0B3B69, #111827, #6B7280, #F7F8FA, #FFFFFF.
0.4 Slogan: "Proof In Every Roof".
0.5 Service Area: South‑East Melbourne; base Clyde North (50 km radius).
0.6 Contact Injection: phone 0435 900 709; email info@callkaidsroofing.com.au.
0.7 Image Rules: real jobsite photos only; before/after emphasis; no stock.

---

## 1. Brand & Voice
1.1 Tone: Intelligent, relaxed, direct; local Aussie plain‑speak.
1.2 Copy Defaults: benefit‑first; avoid "cheapest"; promise quality & long‑term value.
1.3 Visuals: dark neutral base with #007ACC accents; warranty badges 7–10 yrs.

---

## 2. Services & Scopes (Headlines)
- Roof Restorations (wash, repairs, prime + 2 coats; valleys & pointing as required).
- Roof Painting (concrete/terracotta) with Industrial Roof Coatings system.
- Ridge Re‑bed & Re‑point (SupaPoint flexible pointing).
- Valley Iron Replacement & Apron/Flashing Repairs.
- Gutter Cleaning & Minor Repairs.
- Leak Investigation & Preventative Maintenance.

> Detailed SOP references: `KF_03‑05_SOP_ALL` (uploaded).

---

## 3. Pricing Constants (Pointers)
- See `KF_02_PRICING_MODEL.json` — labour rates, material constants, mark‑ups, warranty tiers.
- Quote Options pattern: A) Essentials, B) Full Restoration, C) Premium.
- Adjustments via unit rates (LM ridges/valleys; m² clean/paint; per‑tile replace).

---

## 4. Operations & Automations
4.1 Systems: GitHub (code), Lovable (site), Supabase (DB), Google Workspace (email/calendar/contacts).
4.2 Authorisation: KF_07 policy — only allowed actions per matrix; audit log to `metrics.system_audit`.
4.3 Mandates (automations):
- A — Daily 08:00 AEST: weather + SOP risk.
- B — Weekly: performance audit.
- C — Monthly: financial report.
- D — Fortnightly: marketing content.

---

## 5. Marketing Rules (Condensed)
- Localise to SE Melbourne suburbs; show transformation.
- CTA (pick 1): "Get Your Free Roof Health Check", "Secure Your Investment. Call Us Today.", "Book Your Roof Assessment".
- Google Ads pack and Meta specs per Knowledge File `GWA_09`.

---

## 6. Legal / Compliance Lines
- Fully insured.
- Weather caveat: dates may shift due to weather; we communicate early.
- Warranty wording: 7–10‑year workmanship/materials where applicable; do not over‑promise.

---

## 7. File Map (this repository)
- `/knowledge/MKF_00_MASTER_v0_1.md` (this file).
- `/knowledge/MKF_00_INDEX.json` (lightweight map for agents).
- `/knowledge/BRAND/` → colours, logos, badges.
- `/knowledge/SOPS/` → extracted SOP snippets aligned to services.
- `/knowledge/PRICING/` → parsed constants from KF_02.

---

## 8. Agent Contract
All CKR agents must:
- Resolve facts from MKF first; fall back to KF/GWA files; then web if needed.
- Output in Australian English; inject phone/email in client‑facing docs; show ABN on print/PDF.
- Respect KF_07 authorisation for any external calls.
- Log critical actions to Supabase metrics.

---

## 9. Changelog
- v0.1 (31 Oct 2025): Initial MKF compile for repo sync.
