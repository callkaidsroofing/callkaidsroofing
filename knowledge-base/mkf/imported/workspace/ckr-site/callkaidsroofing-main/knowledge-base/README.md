# Call Kaids Roofing Knowledge Base

## Overview
This directory contains all operational knowledge, workflows, and training data used by the CKR AI systems. Knowledge files are strategically distributed across different AI assistants to ensure each has the context needed for its specific role.

## Directory Structure

```
knowledge-base/
├── archives/                    # Original ZIP files (extract these first)
│   ├── KnowledgeFiles.zip
│   ├── GWA.zip
│   └── CKR_AI_HOME.zip
├── core-knowledge/              # Extract KnowledgeFiles.zip here
│   ├── KF_00_SYSTEM_META.md
│   ├── KF_01_BRAND_MANDATE.txt
│   ├── KF_02_PRICING_MODEL.json          # CRITICAL for quotes
│   ├── KF_03_05_SOP_ALL.txt
│   ├── KF_06_MARKETING_COPY_KIT.md
│   ├── KF_07_LEGAL_WARRANTY.md
│   ├── KF_08_CASE_STUDIES.json
│   ├── KF_09_VOICE_TONE.md
│   └── KF_10_OPERATIONAL_MANDATE.txt
├── gwa-workflows/               # Extract GWA.zip here
│   ├── GWA_overview.md
│   ├── GWA_01_LEAD_INTAKE.md
│   ├── GWA_02_JOB_ACTIVATION.md
│   ├── GWA_03_PROJECT_CLOSEOUT.md
│   ├── GWA_04_WARRANTY_INTAKE.md
│   ├── GWA_05_REPUTATION_ALERT.md
│   ├── GWA_06_QUOTE_FOLLOWUP.md
│   ├── GWA_07_CASE_STUDY_DRAFTING.md
│   ├── GWA_08_SUBCONTRACTOR_BRIEFING.md
│   ├── GWA_09_MARKETING_GENERATION.md
│   ├── GWA_10_FINANCIAL_REPORTING.md
│   ├── GWA_11_SOP_RISK_ASSESSMENT.md
│   ├── GWA_12_INTELLIGENT_TRIAGE.md
│   └── GWA_13_LEAD_NURTURE.md
└── gem-system/                  # Extract CKR_AI_HOME.zip here
    └── multi-agent-architecture.md
```

## Setup Instructions

1. **Extract Archives**: Unzip each file in `archives/` to its corresponding directory
   ```bash
   cd knowledge-base/archives
   unzip KnowledgeFiles.zip -d ../core-knowledge/
   unzip GWA.zip -d ../gwa-workflows/
   unzip CKR_AI_HOME.zip -d ../gem-system/
   ```

2. **Verify JSON Files**: Ensure `KF_02_PRICING_MODEL.json` and `KF_08_CASE_STUDIES.json` are valid JSON

3. **Check System Integration**: All edge functions have been updated to reference these files

## Knowledge Distribution Map

### AI System Knowledge Assignments

#### Quote-Related Functions
| Function | Knowledge Files Used |
|----------|---------------------|
| `chat-quote-assistant` | KF_02, KF_07, GWA_06 |
| `ai-quote-helper` | KF_02, KF_03_05 |
| `generate-quote` | KF_02, KF_07, KF_08 |

#### Customer-Facing Functions
| Function | Knowledge Files Used |
|----------|---------------------|
| `chat-customer-support` | KF_09, KF_06, KF_07, GWA_05 |
| `lead-capture-assistant` | GWA_01, GWA_12, KF_03_05 |

#### Internal Operations Functions
| Function | Knowledge Files Used |
|----------|---------------------|
| `internal-assistant` | KF_03_05, GWA_02, GWA_03, GWA_08, GWA_11 |
| `inspection-form-assistant` | KF_03_05, GWA_11, KF_02 |

#### Content Generation Functions
| Function | Knowledge Files Used |
|----------|---------------------|
| `docs-writer-assistant` | KF_06, KF_09, KF_08, GWA_07, GWA_09 |
| `forms-builder-assistant` | KF_03_05, KF_06_WEB_DEV |

#### Core CRM Functions
| Function | Knowledge Files Used |
|----------|---------------------|
| `ckr-gem-api` | GWA_overview, GWA_01, GWA_02, GWA_06, GWA_13, KF_02 |
| `nexus-ai-hub` | ALL GWA files, KF_02, KF_03_05 |

## Knowledge File Descriptions

### Core Knowledge Files (KF_*)

- **KF_00_SYSTEM_META**: Meta-level system governance and rules
- **KF_01_BRAND_MANDATE**: Brand identity, values, and operational mandate
- **KF_02_PRICING_MODEL**: Service pricing, material costs, labor rates (JSON)
- **KF_03_05_SOP_ALL**: Complete Standard Operating Procedures
- **KF_06_MARKETING_COPY_KIT**: Approved messaging and marketing content
- **KF_07_LEGAL_WARRANTY**: Legal terms, warranty info, compliance requirements
- **KF_08_CASE_STUDIES**: Real project examples with before/after data (JSON)
- **KF_09_VOICE_TONE**: Communication style guide (down-to-earth tradie voice)
- **KF_10_OPERATIONAL_MANDATE**: Business philosophy and living entity concept

### Growth Workflow Automation Files (GWA_*)

- **GWA_overview**: High-level automation system architecture
- **GWA_01_LEAD_INTAKE**: Lead capture and initial qualification workflow
- **GWA_02_JOB_ACTIVATION**: Job scheduling and kickoff procedures
- **GWA_03_PROJECT_CLOSEOUT**: Completion checklist and handover process
- **GWA_04_WARRANTY_INTAKE**: Warranty claim handling and resolution
- **GWA_05_REPUTATION_ALERT**: Review monitoring and response protocols
- **GWA_06_QUOTE_FOLLOWUP**: Automated quote follow-up sequences
- **GWA_07_CASE_STUDY_DRAFTING**: Marketing content creation workflow
- **GWA_08_SUBCONTRACTOR_BRIEFING**: Crew coordination and job briefing
- **GWA_09_MARKETING_GENERATION**: Content automation and posting
- **GWA_10_FINANCIAL_REPORTING**: Business intelligence and metrics
- **GWA_11_SOP_RISK_ASSESSMENT**: Safety protocols and risk management
- **GWA_12_INTELLIGENT_TRIAGE**: Lead scoring and prioritization logic
- **GWA_13_LEAD_NURTURE**: Automated drip campaigns and touchpoints

## Maintenance & Updates

### When to Update Knowledge Files

| Trigger Event | Files to Update | Affected Systems |
|--------------|----------------|-----------------|
| Price changes | KF_02 | All quote functions |
| New service added | KF_02, KF_03_05 | Quote, lead capture, inspection |
| Brand voice evolves | KF_09 | All customer-facing functions |
| Legal/warranty changes | KF_07 | Quote, customer support |
| Workflow optimization | Relevant GWA file | CRM automation functions |
| New case study | KF_08 | Quote, docs writer |

### Update Procedure

1. **Edit knowledge file** in appropriate directory
2. **Update version number** (add to CHANGELOG.md)
3. **Test affected AI systems** using relevant test cases
4. **Deploy changes** (knowledge files are referenced by edge functions)
5. **Monitor AI responses** for 24-48 hours after deployment

### Version Control

- All knowledge files are tracked in Git
- Tag major knowledge releases: `knowledge-v1.0.0`
- Document changes in `CHANGELOG.md`
- Keep old versions for rollback if needed

## Token Limits & Optimization

Edge function system prompts have ~8,000-16,000 token limits:
- **Full inclusion**: Files < 2,000 tokens (KF_09, GWA_01)
- **Summary inclusion**: Files > 2,000 tokens (include key points + reference full file)
- **Reference only**: Very large files (link to knowledge-base/ path)

Example optimization:
```typescript
// Instead of including all 500 line items from KF_02:
const PRICING_LOGIC = `
Core pricing rules from KF_02:
- Base roof restoration: $35-55/sqm depending on condition
- Premium materials add 15-25% to quote
- 10% senior discount, 5% referral discount
- Full pricing model: /knowledge-base/core-knowledge/KF_02_PRICING_MODEL.json
`;
```

## Testing Checklist

After knowledge updates:
- [ ] Quote Assistant uses correct pricing from KF_02
- [ ] Customer Support uses brand voice from KF_09
- [ ] Lead Capture follows GWA_01 intake workflow
- [ ] Internal Assistant references correct SOPs from KF_03_05
- [ ] Docs Writer generates on-brand content per KF_09
- [ ] Inspection Form identifies risks per GWA_11
- [ ] Nexus AI understands all GWA workflows

## Support

For questions about knowledge management:
- Technical: See `SYSTEM_INTEGRATION.md` in project root
- Business logic: Review `KF_00_SYSTEM_META.md`
- Workflow questions: Check relevant GWA file in `gwa-workflows/`

---

**Last Updated**: 2025-10-29  
**Knowledge Version**: 1.0.0  
**Maintained by**: Kaidyn Brownlie / Call Kaids Roofing
