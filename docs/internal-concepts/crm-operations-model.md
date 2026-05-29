# CRM And Operations Concepts

## Purpose

The removed admin area attempted to combine lead intake, quote tracking, jobs, media, knowledge, and business dashboards. The concept worth preserving is an operational cockpit for a small trade business, not the old routes or page implementation.

## Core Modules

Useful modules to resurface elsewhere:

- Lead pipeline.
- Lead detail and activity timeline.
- Quote list and quote status tracking.
- Job list and job detail.
- Inspection and quote builder.
- Calendar/scheduling.
- KPI dashboard.
- AI/RAG assistant for internal search and customer context.
- Business settings and pricing settings.

## Lead Pipeline Concept

The lead pipeline should support:

- Stage-based lead movement.
- Bulk actions.
- Filters by status, source, service, suburb, urgency, and date.
- Lead detail drawer or detail page.
- Activity timeline.
- Tasks and follow-up reminders.
- Convert-to-quote action that preloads lead context into inspection/quote workflow.

Lead stages should be explicit and business-owned. A useful default:

- New.
- Contacted.
- Inspection booked.
- Quote pending.
- Quote sent.
- Won.
- Lost.

## Dashboard Concepts

The dashboard idea included:

- 30-day revenue.
- Quote conversion rate.
- Active/scheduled jobs.
- Average response time.
- New leads count.
- Pending quotes count.
- Scheduled posts count.
- Quick links to primary workflows.
- Search over internal knowledge and operational records.

In a future implementation, avoid vanity metrics unless they are backed by actual records. Keep every KPI traceable to a table, query, or integration source.

## Job And Quote Concepts

Jobs and quotes should be separate but linked:

- Lead can generate one or more inspections.
- Inspection can generate one or more quote drafts.
- Accepted quote can create a job.
- Job should track schedule, status, crew/resources, photos, invoice, and closeout.

Useful quote statuses:

- Draft.
- Ready to send.
- Sent.
- Viewed.
- Follow-up due.
- Accepted.
- Declined.
- Expired.

Useful job statuses:

- Scheduled.
- In progress.
- Waiting on weather.
- Waiting on materials.
- Complete.
- Invoiced.
- Paid.
- Warranty/closeout complete.

## Internal Search Concept

The admin concept included a search experience across business knowledge, records, and tools. Preserve the idea as:

- Search should answer operational questions.
- Results should route to the record or document that supports the answer.
- Sensitive data should be permissioned.
- Answers should cite source records or documents.
- Search should never expose secrets, raw logs, auth tokens, or customer data outside the authenticated business workspace.

## Follow-Up Automation Ideas

Useful automation ideas:

- New lead response SLA.
- Missed call or form submission follow-up.
- Quote follow-up reminders.
- Inspection reminder.
- Job prep checklist.
- Post-job review request.
- Warranty/closeout document creation.

Any future automation should be auditable and easy to pause.
