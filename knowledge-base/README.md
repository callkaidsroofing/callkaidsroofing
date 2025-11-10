# CKR Digital Engine - Knowledge Base

This directory contains the Master Knowledge Framework (MKF) and legacy knowledge files for the CKR Digital Engine.

## 🎯 Current Status

**Version**: 2.0 (Organized Structure)  
**Last Updated**: 2025-01-10  
**Structure**: ✅ Reorganized into 7 thematic categories  
**RAG Status**: 📋 Ready for vector embedding integration

---

## 📁 Directory Structure

```
knowledge-base/
├── mkf/                    # Master Knowledge Framework (ACTIVE)
│   ├── source/            # ✅ Organized MKF files (38 files, 7 categories)
│   │   ├── 01_business_core/
│   │   ├── 02_services_pricing/
│   │   ├── 03_operations/
│   │   ├── 04_geographic/
│   │   ├── 05_marketing_sales/
│   │   ├── 06_technical/
│   │   ├── 07_ai_workflows/
│   │   ├── MASTER_INDEX.json      # File relationships & metadata
│   │   └── README.md
│   └── legacy/            # 🗄️ Historical versions (READ-ONLY)
└── README.md              # This file
```

---

## 🗂️ MKF Source Categories

### 1. Business Core (`01_business_core/`)
Core business identity, brand guidelines, contact information, and governance.

**Files**:
- `MKF_00_INVARIANTS.md` - Business constants (ABN, phone, email)
- `MKF_01_BRAND_VOICE.md` - Brand mandate and communication style
- Brand assets and guidelines

### 2. Services & Pricing (`02_services_pricing/`)
Service offerings, pricing models, SOPs, and operational procedures.

**Files**:
- `MKF_02_PRICING_CATALOGUE.md` - Service pricing and rate cards
- `CKR_Services_Database.csv` - All service offerings
- `CKR_Pricing_Model_Database.csv` - Pricing logic

### 3. Operations (`03_operations/`)
Standard operating procedures, safety protocols, quality standards.

**Files**:
- `MKF_03_PRE_INSPECTION_SOP.md` - Pre-job inspection procedures
- `MKF_04_SAFETY_PPE_SOP.md` - Safety protocols and PPE requirements
- `MKF_05_POST_SERVICE_SOP.md` - Post-job completion checklist
- `CKR_SOPs_Library_Database.csv` - Complete SOP library

### 4. Geographic (`04_geographic/`)
Service areas, suburb coverage, geographic data.

**Files**:
- `CKR_Suburbs_Database.csv` - Service area coverage
- Geographic boundaries and routing data

### 5. Marketing & Sales (`05_marketing_sales/`)
Marketing copy, sales templates, customer communications.

**Files**:
- `MKF_06_MARKETING_COPY_KIT.md` - Approved messaging
- Email templates
- Sales scripts

### 6. Technical (`06_technical/`)
Technical specifications, materials, equipment, and processes.

**Files**:
- Technical manuals
- Material specifications
- Equipment guides

### 7. AI Workflows (`07_ai_workflows/`)
AI workflow definitions (GWA files) for automation.

**Files**:
- `MKF_09_MARKETING_GENERATION.md` (GWA-09)
- `MKF_10_FINANCIAL_REPORTING.md` (GWA-10)
- `MKF_11_SOP_RISK_ASSESSMENT.md` (GWA-11)
- `MKF_12_INTELLIGENT_TRIAGE.md` (GWA-12)
- `MKF_13_LEAD_NURTURE.md` (GWA-13)
- `MKF_14_SYSTEMS_ORCHESTRATOR.md` (GWA-14)
- `CKR_Workflows_GWA_Database.csv` - Workflow definitions

---

## 🤖 RAG System Integration

All files in `mkf/source/` will be:

1. **Stored** in the `knowledge_files` database table
2. **Chunked** into 200-400 word segments using Gemini Flash
3. **Embedded** using Lovable AI Gateway (`text-embedding-004` - 768 dimensions)
4. **Indexed** with pgvector for semantic search
5. **Retrieved** automatically by AI assistants for context-aware responses

### Embedding Pipeline Flow

```
File Saved → embed-knowledge function
           → Intelligent chunking (Gemini Flash)
           → Generate embeddings (text-embedding-004)
           → Store in knowledge_chunks table
           → Vector index (IVFFlat, cosine similarity)
           → Searchable via rag-search function
```

---

## 📋 Setup Instructions

### Phase 1: Extract Organized Knowledge (CURRENT)

1. **Extract ZIP**: Unzip `knowledge-base-organized.zip` to `mkf/source/`
   ```bash
   cd knowledge-base/mkf
   unzip ../../knowledge-base-organized.zip -d source/
   ```

2. **Verify Structure**: Ensure all 7 category directories exist
   ```bash
   ls -la mkf/source/
   # Should show: 01_business_core, 02_services_pricing, etc.
   ```

3. **Check Master Index**: Verify `MASTER_INDEX.json` is present
   ```bash
   cat mkf/source/MASTER_INDEX.json | jq '.categories | length'
   # Should return: 7
   ```

### Phase 2: Database Migration (NEXT)

After extraction, run Phase 2 to:
- Create `knowledge_assignments` table
- Enable `pgvector` extension
- Create `knowledge_chunks` table
- Seed initial file assignments

### Phase 3: RAG Functions (AFTER DB SETUP)

Deploy edge functions:
- `embed-knowledge` - Embedding pipeline
- `rag-search` - Semantic search
- `batch-embed-all` - Mass migration tool

---

## 🎯 Knowledge Assignments (Planned)

### AI Function → Knowledge File Mapping

| Function | Assigned Files | Purpose |
|----------|---------------|---------|
| `chat-assistant` | MKF_01, MKF_02, MKF_06 | Brand-aware customer chat |
| `quote-generator` | MKF_02, MKF_03, MKF_04 | Accurate pricing + SOPs |
| `inspection-assistant` | MKF_03, MKF_04, MKF_11 | Safety + risk assessment |
| `lead-triage` | MKF_12, MKF_13 | Intelligent lead scoring |
| `marketing-content` | MKF_06, MKF_09 | On-brand content generation |

*Assignments will be seeded in `knowledge_assignments` table during Phase 2*

---

## 📊 MASTER_INDEX.json Schema

The master index contains:

```json
{
  "version": "2.0",
  "updated": "2025-01-10",
  "categories": [
    {
      "id": "01_business_core",
      "name": "Business Core",
      "file_count": 5,
      "files": [...]
    }
  ],
  "relationships": [
    {
      "source": "MKF_02_PRICING_CATALOGUE.md",
      "target": "MKF_03_PRE_INSPECTION_SOP.md",
      "type": "references"
    }
  ],
  "metadata": {
    "total_files": 38,
    "total_categories": 7,
    "schema_version": "2.0"
  }
}
```

---

## 🔧 Maintenance

### When to Update Knowledge Files

| Trigger Event | Files to Update | Affected Systems |
|--------------|----------------|------------------|
| Price changes | MKF_02 | Quote generator, inspection assistant |
| New service | MKF_02, MKF_03 | All service-related functions |
| Brand refresh | MKF_01, MKF_06 | Chat, marketing content |
| SOP update | MKF_03-05 | Inspection, operations |
| New workflow | MKF_09-14 | Automation systems |

### Update Procedure

1. **Edit File** in `mkf/source/[category]/`
2. **Save** via Knowledge Management UI (triggers auto-embedding)
3. **Verify** embedding in `knowledge_chunks` table
4. **Test** AI responses with new context
5. **Document** change in file changelog

---

## 🧪 Testing Checklist

After Phase 3 (RAG deployment):

- [ ] Files synced to `knowledge_files` table (38 total)
- [ ] Embeddings generated for all files
- [ ] `knowledge_chunks` table populated (estimated 340+ chunks)
- [ ] Semantic search returns relevant results (>80% accuracy)
- [ ] AI Assistant augments responses with context
- [ ] Source attribution working (shows which files used)
- [ ] Embedding dashboard shows health metrics

---

## 📚 Related Documentation

- **RAG System**: `docs/RAG_SYSTEM.md` (Phase 6)
- **Edge Functions**: `docs/EDGE_FUNCTIONS.md` (Phase 6)
- **Database Schema**: `docs/DATABASE_SCHEMA.md` (Phase 6)
- **Code Patterns**: `docs/CODE_PATTERNS.md` (Phase 6)

---

## 🚀 Migration Status

| Phase | Status | ETA |
|-------|--------|-----|
| Phase 1: Security & Cleanup | ✅ Complete | Done |
| Phase 2: Database Schema | 📋 Pending | Next |
| Phase 3: RAG Functions | 📋 Pending | After Phase 2 |
| Phase 4: Frontend Integration | 📋 Pending | After Phase 3 |
| Phase 5: Code Restructuring | 📋 Pending | After Phase 4 |
| Phase 6: Documentation | 📋 Pending | After Phase 5 |
| Phase 7: Testing | 📋 Pending | After Phase 6 |
| Phase 8: Deployment | 📋 Pending | After Phase 7 |

---

**Maintained by**: CKR-GEM AI System  
**Support**: See project documentation in `docs/`  
**Version**: 2.0 (Organized Structure)
