# Content And Knowledge System Concepts

## Purpose

The removed admin surface had CMS, content, media, SEO, knowledge-base, and document-management pages. The useful idea is a business-owned content and knowledge control plane that can feed a website, quoting tool, assistant, and marketing workflows.

## Content Modules

Useful modules to preserve conceptually:

- Blog/content editor.
- Case study manager.
- Gallery/media manager.
- Testimonial manager.
- Service page manager.
- Suburb page manager.
- Homepage editor.
- SEO analysis and metadata manager.
- Marketing/campaign studio.
- Image generation or asset creation workflow.

These modules should not live inside the public website bundle unless the site is deliberately built as a CMS app.

## Knowledge Base Concepts

The knowledge system attempted to separate business facts and operational knowledge:

- Brand and identity.
- Services.
- Suburbs and service areas.
- Pricing.
- Warranty information.
- SOPs.
- Email templates.
- Uploaded reference documents.
- Embeddings/search index.

Future projects should keep a clear source-of-truth hierarchy. For CKR-style work, verified owner documents and business-domain docs should outrank generated website content.

## Document Concepts

Useful document types:

- Quote documents.
- Inspection reports.
- Warranty certificates.
- Invoices.
- Job closeout packs.
- Safety notes.
- SOPs.
- Email templates.

Documents should have owner, version, status, and source metadata.

## Media Concepts

Media should be treated as business evidence, not decoration:

- Before photos.
- During/process photos.
- After photos.
- Roof condition evidence.
- Job-specific folders.
- Public gallery selection.
- Private customer/job media.
- Alt text and caption metadata.

Public media should be reviewed before website use. Private job photos should not automatically become public marketing assets.

## SEO Concepts

Useful SEO ideas from the removed admin tools:

- Page metadata review.
- Structured data review.
- Service/suburb coverage matrix.
- Internal link suggestions.
- Content gap list.
- Search snippet preview.
- Canonical URL checks.
- Sitemap/robots checks.

SEO claims should be fact-checked against current business docs. Do not let SEO tooling invent unverifiable customer counts, review counts, warranty terms, or service promises.

## AI Assistant Concepts

The internal AI/RAG assistant concept should be resurfaced as a guarded business tool:

- It should answer from approved business knowledge and records.
- It should cite sources.
- It should refuse unsupported claims.
- It should distinguish public website facts from private operational notes.
- It should avoid exposing credentials, tokens, raw logs, or private customer data.

## Sync And Import Concepts

Useful sync/import ideas:

- Upload business docs.
- Parse and classify content.
- Detect conflicts between old and new facts.
- Suggest updates without automatically publishing.
- Rebuild embeddings after approved changes.
- Keep a visible import audit trail.
