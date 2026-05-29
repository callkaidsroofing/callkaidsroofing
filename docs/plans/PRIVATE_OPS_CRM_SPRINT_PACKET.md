# Private Operations CRM Sprint Packet

Created: 2026-05-28

Status update: 2026-05-29

This packet is now supporting context only. The current expanded architecture
source is:

```text
/root/aforge/handoff/ckr-business-operations-rebuild/README.md
```

That newer bundle treats GHL as unavailable for future operations and plans a
CKR-owned CRM/comms replacement instead of a live GHL mirror path.

## Why This Exists

The prior Pi crew run for the Call Kaids Roofing private operations system did
not complete because the Pi worker provider was not authenticated:

```text
No API key found for openrouter.
```

This packet finishes the blocked writer step without using credentials. It
turns the generated handoff artifacts into an executable, repo-grounded plan.

## Boundary Decision

Do not rebuild the old admin surface inside the public website.

Keep these as separate systems:

- Public website: customer-facing, crawlable, fast, no auth/admin/CRM surface.
- Private operations app: authenticated lead, quote, job, document, and follow-up workflows.
- CKR Inspections Mobile: field runtime and Supabase-backed operational source of truth.
- GHL/HighLevel: unavailable legacy dependency. Do not plan future operations
  around live GHL services. Replace CRM/comms with CKR-owned workflows or a
  provider-agnostic backend abstraction.

Relevant local sources:

- `docs/internal-concepts/README.md`
- `docs/internal-concepts/crm-operations-model.md`
- `docs/internal-concepts/inspection-quote-workflow.md`
- `docs/internal-concepts/implementation-boundaries.md`
- `docs/plans/NEXT_LOCAL_PUBLIC_REBUILD_PLAN.md`
- `/root/CKR-Inspections-Mobile/CKR-Inspections-Mobile_Project_Context_25/07_WORKFLOW_CONVEYOR.md`
- `/root/CKR-Inspections-Mobile/CKR-Inspections-Mobile_Project_Context_25/18_GHL_SYNC_AND_COMMS_BOUNDARIES.md`

## Master Plan

### Phase 0: Source-Of-Truth Audit

Deliverables:

- Current Supabase table inventory for leads, inspections, quotes, jobs, invoices, documents, and workflow handover events.
- Current CKR mobile service inventory for lead, inspection, quote, document, and sync paths.
- Verified list of public website data flows that must stay public-only.
- Decision record confirming whether this private app is built as a separate repo, a separate app inside an existing monorepo, or an extension of CKR mobile backend services.

Acceptance:

- No schema changes.
- No credential exposure.
- Every proposed table/API maps to a current table, a migration gap, or an explicit new migration.

### Phase 1: Private Lead Intake Core

Deliverables:

- Authenticated internal lead intake surface.
- Minimal public lead handoff endpoint or queue, if needed, that writes into the same operational lead model.
- Lead stages: new, contacted, inspection booked, quote pending, quote sent, won, lost.
- Audit event for create/update/stage change.
- Tests for lead create, duplicate-safe update, status transition, and permission boundary.

Acceptance:

- Supabase remains operational source of truth.
- Local/mobile state is cache only.
- Failed side effects do not delete or clear lead records.

### Phase 2: Inspection-To-Quote Bridge

Deliverables:

- Link lead -> inspection -> quote draft without orphan quote rows.
- Rule-based quote draft builder using inspection facts and business-managed pricing inputs.
- Quote statuses: draft, ready to send, sent, viewed, follow-up due, accepted, declined, expired.
- Workflow handover events for lead-to-inspection, inspection-to-quote, and quote-to-job transitions.

Acceptance:

- Existing CKR mobile quote and inspection services are reused or wrapped; business logic is not duplicated in screens.
- Hydration loads parent plus child records.
- Empty arrays and undefined fields cannot wipe persisted child structures.

### Phase 3: Document And Follow-Up Automation

Deliverables:

- Quote document generation path that uses verified business identity, terms, warranty, and customer/site details.
- Follow-up task/reminder creation after quote sent.
- Accepted quote -> job creation workflow.
- Inspection complete -> invoice draft trigger only after source records are persisted.

Acceptance:

- Generated documents are artifacts, not source records.
- Side-effect failures preserve business records.
- Every automation is auditable and pausable.

### Phase 4: Media, Ads, SEO, And Content Control Plane

Deliverables:

- Private media asset registry for job proof and ad assets.
- Tagging for asset type, service, suburb, approval state, and performance metadata.
- Public-gallery promotion path that only exposes approved assets.
- SEO/content planning board kept separate from the public website source until publishing.

Acceptance:

- Private job media is private by default.
- Public assets require explicit approval state.
- Public website remains free of internal customer/job data.

### Phase 5: Legacy GHL Removal And CRM/Comms Replacement

Deliverables:

- Inventory of every current code path, record field, and workflow assumption
  that depends on GHL.
- Replacement map for comms, lead stages, tasks, pipeline reporting, and
  follow-up automation.
- Historical data salvage plan if export/access exists later.
- Primary workflow cleanup so GHL actions are no longer front-and-center.

Acceptance:

- Future workflow acceptance does not require GHL access.
- No raw GHL credentials are stored in source or docs.
- Migration preserves source records and audit history.

## First Implementation Sprint

Do this before broad CRM build-out:

1. Audit current CKR mobile Supabase schema and service boundaries.
2. Write the private app architecture decision record.
3. Create the lead/inspection/quote data-contract map.
4. Add or update tests around the existing lead -> inspection -> quote handoff.
5. Only then implement the smallest private lead intake surface.

## Source Diff Summary To Expect

Likely future files, subject to Phase 0 audit:

- `docs/plans/private-ops-architecture.md`
- `docs/plans/private-ops-data-contract.md`
- `supabase/migrations/<timestamp>_private_ops_audit_events.sql`
- `src/services/privateLeadIntakeService.ts`
- `src/services/privateQuoteWorkflowService.ts`
- `src/services/privateFollowUpService.ts`
- `src/types/privateOps.ts`
- `tests/privateLeadIntake*.test.ts`
- `tests/privateQuoteWorkflow*.test.ts`

Do not copy the removed public-site admin routes back into `src/pages/admin` or
`src/components/admin`.

## Final Meta-Prompt

```text
You are continuing the Call Kaids Roofing private operations CRM build.

Read first:
- /root/callkaidsroofing/docs/plans/PRIVATE_OPS_CRM_SPRINT_PACKET.md
- /root/callkaidsroofing/docs/internal-concepts/implementation-boundaries.md
- /root/callkaidsroofing/docs/internal-concepts/crm-operations-model.md
- /root/callkaidsroofing/docs/internal-concepts/inspection-quote-workflow.md
- /root/CKR-Inspections-Mobile/AGENTS.md
- /root/CKR-Inspections-Mobile/CKR-Inspections-Mobile_Project_Context_25/07_WORKFLOW_CONVEYOR.md
- /root/CKR-Inspections-Mobile/CKR-Inspections-Mobile_Project_Context_25/18_GHL_SYNC_AND_COMMS_BOUNDARIES.md

Task:
Execute Phase 0 only. Audit current CKR mobile schema and service boundaries for
lead, inspection, quote, job, invoice, document, and workflow handover records.
Produce a data-contract map and architecture decision record for a separate
private operations app that replaces GHL assumptions without moving source of
truth out of Supabase.

Rules:
- Do not rebuild old website admin routes.
- Do not expose credentials, env values, raw logs, or customer data.
- Do not run destructive database commands.
- Supabase remains operational source of truth.
- Treat GHL as unavailable. Do not require GHL for future workflow acceptance.
- Build toward CKR-owned CRM/comms or a provider-agnostic backend abstraction.
- Keep edits to docs and tests unless the audit proves a small code change is required.

Verification:
- Report exact files read.
- Report exact commands run.
- If tests are added or changed, run targeted tests with --runInBand in CKR mobile.
- Only claim live behavior when verified.
```

## Open Questions

- Should the private operations app be a new repo, a package/app in an existing workspace, or a backend-first extension of CKR Inspections Mobile?
- Which GHL-linked records need historical salvage if exports or old IDs are
  available later?
- Which auth boundary should own internal users: existing CKR user management, Supabase Auth directly, or a new role layer on top of Supabase Auth?
- Are quote pricing presets currently business-approved, or should Phase 1 include a pricing validation pass before any quote automation?
- Which media assets are approved for public use versus private job evidence?
