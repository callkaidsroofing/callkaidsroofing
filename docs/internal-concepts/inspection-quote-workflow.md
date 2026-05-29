# Inspection And Quote Workflow Concepts

## Purpose

The internal inspection and quote system was designed as a single workflow that turns a lead or site visit into a structured inspection record, priced scope of works, and customer-ready quote document.

The useful concept is not the old UI. The useful concept is the workflow contract:

1. Capture customer and site context.
2. Record roof condition and safety notes.
3. Convert findings into scoped line items.
4. Price work with transparent labour, material, markup, GST, and total fields.
5. Save inspection and quote records together.
6. Export or send a customer-facing document with findings, quote, terms, and warranty language.

## Inspection Data Model

Core inspection fields worth preserving:

- Customer: name, phone, optional email.
- Site: address, suburb, roof type, storey count, access difficulty.
- Visit context: urgency level, photos taken, inspector, date, time.
- Conditions: ridge, valley, tile, gutter, flashing, leak status.
- Notes: inspector notes and safety notes.
- Measurements: roof area, ridge length, valley length, gutter length, tile count, roof pitch.

The model should support prefill from a lead, but the inspection record should remain editable because lead intake is often incomplete.

## Scope Item Model

Each scope item should represent one priced unit of work:

- ID.
- Category or service.
- Area/location.
- Quantity and unit.
- Priority: Must Do, Recommended, Optional.
- Labour cost.
- Material cost.
- Markup.
- Notes.
- Subtotal excluding GST.
- GST.
- Total including GST.

This makes quote tiers and customer options easier to explain without hiding how the number was produced.

## Pricing Preset Concepts

The prior system used presets for common roofing work:

- Ridge rebedding and repointing.
- Valley replacement.
- Pressure washing.
- Roof painting for tile and metal roofs.
- Gutter cleaning.
- Tile replacement.
- Flashing repair.
- Leak repair.
- Sarking installation.
- Whirlybird installation.
- Custom line item.

In a future project, presets should be stored in a business-managed pricing source, not hardcoded into a website bundle.

## Quote Flow

The quote flow had three useful stages:

- Inspection: gather facts and condition evidence.
- Quote: choose service, add scope items, set document type, include or exclude findings, warranty, and terms.
- Export: save, preview, and send the quote/report.

The workflow should prevent orphan quote rows. A quote should either be linked to an inspection or explicitly marked as a standalone quote.

## Autosave And Drafts

The old concept included autosave after a record existed. Preserve that idea, but implement carefully:

- Do not create partial customer records before required fields exist.
- Autosave only after a primary record ID exists.
- Keep draft status distinct from sent status.
- Record last saved time.
- Avoid overwriting user-entered values with stale lead prefill data.

## Validation Rules

Validation should happen before save/export:

- Required customer identity and phone.
- Required site/suburb.
- Required key condition fields for inspection reports.
- At least one scope item before customer-ready quote export.
- Valid quantities and totals.
- Clear warranty and terms selection.

## Export Document Concepts

A useful quote/export document should include:

- Company identity and verified public contact information.
- Customer and site details.
- Inspection findings.
- Photo evidence when available.
- Scope of works.
- Pricing summary.
- Optional tiers or alternatives.
- Warranty terms by scope.
- Quote validity and payment terms.
- Clear next action.

Do not reuse outdated warranty claims from the old internal implementation. Current public-facing warranty facts should come from the verified business knowledge base.
