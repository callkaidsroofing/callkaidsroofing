# MKF_00 - System Meta & Governance Doctrine

## Business Invariants

**Business Name:** Call Kaids Roofing  
**ABN:** 39475055075  
**Primary Contact:** 0435 900 709  
**Email:** callkaidsroofing@outlook.com  
**Service Area:** South East Melbourne, Australia

## Mission Statement

Call Kaids Roofing delivers professional roofing services with an AI-native approach to business management, ensuring efficient lead-to-job workflows and exceptional customer experience.

## Core Values

1. **Quality First** - Every job meets or exceeds Australian roofing standards
2. **Customer Focus** - Responsive communication and transparent pricing
3. **Safety Excellence** - All work follows safety protocols and PPE requirements
4. **Innovation** - Leveraging AI and digital systems for operational efficiency
5. **Reliability** - On-time service delivery and warranty support

## Governance Rules

### Knowledge Framework Hierarchy
1. **MKF (Master Knowledge Framework)** - Source of truth
2. **GWA (Guided Workflow Automations)** - Process implementations
3. **Edge Functions** - System integrations
4. **Frontend Components** - User interfaces

### Update Protocol
- All business logic changes must update MKF documents first
- System prompts derive from MKF, not vice versa
- Version control required for all knowledge updates
- RAG system must be re-embedded after MKF changes

## System Architecture

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + pgvector + Edge Functions)
- AI: Lovable AI Gateway (Gemini 2.5-flash default)
- Package Manager: npm

**Data Flow:**
Lead → Inspection → Quote → Job → Completion → Warranty

## Contact Information Display Rules

Always format contact information as:
```
Call Kaids Roofing
ABN 39475055075
📞 0435 900 909
✉️ callkaidsroofing@outlook.com
📍 SE Melbourne, Australia
```

## Version

**Document ID:** MKF_00  
**Version:** 1.0.0  
**Last Updated:** 2025-11-10  
**Category:** System Governance
