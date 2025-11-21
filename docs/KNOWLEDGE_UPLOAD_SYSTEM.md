# Knowledge Upload System

## Overview
Dynamic, AI-powered system for uploading and processing knowledge files into `master_knowledge`. Designed to be flexible and future-proof - automatically detects categories, doc types, and generates embeddings without code changes.

## Access
**Admin UI**: `/internal/v2/admin/upload`

## Supported File Types
- **Markdown** (.md) - Recommended
- **Plain Text** (.txt)
- **PDF** (.pdf) - Parsed via OCR
- **Word Documents** (.docx)

**File Size Limit**: 50MB per file

## Upload Process Flow

```
1. User uploads file → Storage (knowledge-uploads bucket)
2. System creates tracking record → knowledge_uploads table
3. Edge function processes file:
   ├─ Downloads from storage
   ├─ AI-powered categorization (if not specified)
   ├─ Content parsing and splitting
   ├─ Vector embedding generation (optional)
   └─ Inserts into master_knowledge
4. Updates tracking record with results
```

## Dynamic Features

### 1. AI Auto-Categorization
If category/doc_type not specified, system analyzes content to detect:
- **Category**: 12 options (system, brand, operations, etc.)
- **Doc Type**: 11 options (mkf, gwa, sop, faq, etc.)
- **Priority**: 65-100 based on content importance

**Detection Rules**:
```typescript
// Category detection
if (content.includes('MKF_')) → 'system'
if (content.includes('GWA_')) → 'workflows'
if (content.includes('suburb')) → 'service_areas'
if (content.includes('service')) → 'operations'
if (content.includes('FAQ')) → 'support'
// ... plus 7 more categories

// Doc type detection
if (content.includes('MKF_')) → 'mkf'
if (content.includes('GWA_')) → 'gwa'
if (content.includes('FAQ')) → 'faq'
// ... plus 8 more types

// Priority calculation
'system' → 100 (critical)
'brand' → 90
'service' → 85 (featured)
'operations', 'service_areas' → 80
default → 75
```

### 2. Multi-Document Parsing
Files with multiple H1 headers (`# Title`) are automatically split:
```markdown
# Service 1
Content for service 1...

# Service 2
Content for service 2...
```
**Result**: Creates 2 separate documents in `master_knowledge`

Single H1 or no H1 → Single document

### 3. Automatic Embedding Generation
When `autoEmbed` enabled (default):
- Uses OpenAI `text-embedding-3-small` (768 dimensions)
- Embeds: `${title}\n\n${content}`
- Makes documents immediately RAG-searchable
- Gracefully fails if OpenAI key unavailable

### 4. Flexible Metadata Tracking
Every upload stores:
```jsonb
{
  "original_filename": "service_guide.md",
  "upload_id": "uuid",
  "uploaded_at": "2025-01-10T16:00:00Z"
}
```

## Categories (12)
| Category | Use Case | Priority Default |
|----------|----------|------------------|
| `system` | Core governance, MKF rules | 100 |
| `brand` | Brand identity, voice guidelines | 90 |
| `web_design` | Design system, UI patterns | 85 |
| `marketing` | SEO, sales templates, content | 80 |
| `operations` | Services, pricing, SOPs | 80 |
| `compliance` | Warranty, legal documents | 75 |
| `service_areas` | Suburbs, coverage zones | 80 |
| `integration` | System maps, API docs | 75 |
| `case_studies` | Client stories, before/after | 75 |
| `proof` | Testimonials, reviews | 70 |
| `workflows` | GWA automations | 70 |
| `support` | FAQs, knowledge base | 70 |

## Doc Types (11)
| Type | Description | Example |
|------|-------------|---------|
| `mkf` | Master Knowledge Framework | MKF_00, MKF_01 |
| `gwa` | Guided Workflow Automation | GWA_01, GWA_02 |
| `sop` | Standard Operating Procedure | Inspection SOP |
| `faq` | Frequently Asked Questions | "How to..." |
| `service` | Service catalog entries | Roof Restoration |
| `suburb` | Coverage area details | Berwick, Cranbourne |
| `case_study` | Client case studies | Project success stories |
| `testimonial` | Client testimonials | 5-star reviews |
| `blog` | Blog posts | SEO content |
| `knowledge` | General knowledge | Catch-all |
| `template` | Email/quote templates | Response templates |

## Storage Architecture

### Buckets
- **`knowledge-uploads`**: Temporary storage for incoming files
  - Private bucket (authenticated access only)
  - 50MB file size limit
  - Auto-cleanup possible via cron

### Tables
- **`knowledge_uploads`**: Tracks all uploads
  ```sql
  id, file_path, original_filename, file_size, 
  status (pending|processing|completed|failed),
  detected_category, detected_doc_type, detected_priority,
  doc_count, generated_doc_ids[], error_message
  ```

- **`master_knowledge`**: Final destination for processed docs
  ```sql
  doc_id, title, category, subcategory, doc_type,
  content, embedding (vector 768), priority, version,
  source='upload', metadata, active=true
  ```

## Edge Functions

### `process-knowledge-upload`
**Purpose**: Parse, categorize, and insert uploaded files into master_knowledge

**Input**:
```json
{
  "uploadId": "uuid",
  "category": "operations", // optional
  "docType": "service",     // optional
  "priority": 85,           // optional
  "autoEmbed": true         // default true
}
```

**Output**:
```json
{
  "success": true,
  "uploadId": "uuid",
  "documentsCreated": 2,
  "docIds": ["service_roof_restoration_123", "service_gutter_cleaning_123"],
  "category": "operations",
  "docType": "service",
  "embeddingsGenerated": true
}
```

**Processing Steps**:
1. Download file from storage
2. Read content (text extraction)
3. AI categorization (if needed)
4. Parse into documents (split by H1)
5. Generate embeddings (if autoEmbed=true)
6. Insert into master_knowledge
7. Update tracking record

## Admin UI Features

### Upload Form
- File picker (drag-drop ready)
- Optional category override
- Optional doc type override
- Priority slider (65-100)
- Auto-embed checkbox
- Real-time progress bar

### Recent Uploads View
- Last 10 uploads
- Status indicators (pending, processing, completed, failed)
- Document count
- Timestamp
- Error messages (if failed)

## Future Enhancements

### Planned Features
1. **Bulk Upload**: Multiple files at once
2. **ZIP Support**: Extract and process .zip archives
3. **Version Control**: Track changes to re-uploaded files
4. **Conflict Detection**: Warn if doc_id already exists
5. **Scheduled Processing**: Queue large files for off-peak processing
6. **Custom Parsers**: Plugin system for specialized file formats
7. **AI Summarization**: Auto-generate summaries for long docs
8. **Duplicate Detection**: Semantic search to find similar existing docs

### Extensibility
System designed for zero-code expansion:
- Add new categories → Just use them in uploads
- Add new doc types → System accepts any string
- New file formats → Update mime_types in storage bucket
- Custom processing → Extend edge function logic

## Security

### Access Control
- **Upload**: Authenticated users only
- **Storage Bucket**: Private (no public access)
- **Processing**: Service role with full access
- **RLS Policies**: Users see their uploads, admins see all

### Data Validation
- File size limits enforced (50MB)
- MIME type restrictions
- Content sanitization during parsing
- XSS protection via markdown rendering

## Monitoring

### Key Metrics
```sql
-- Total uploads by status
SELECT status, COUNT(*) FROM knowledge_uploads GROUP BY status;

-- Recent failures
SELECT original_filename, error_message, created_at 
FROM knowledge_uploads 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- Documents per upload
SELECT AVG(doc_count) as avg_docs_per_upload 
FROM knowledge_uploads 
WHERE status = 'completed';

-- Processing time
SELECT AVG(EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at))) as avg_seconds
FROM knowledge_uploads
WHERE status = 'completed';
```

### Logs
- **Edge Function**: Check `process-knowledge-upload` logs for detailed processing steps
- **Storage**: Monitor bucket size and file count
- **Database**: Track `knowledge_uploads` table growth

## Example Usage

### Scenario 1: Upload Service Document
```markdown
# Roof Restoration Service

Full roof restoration including tile replacement, repointing, and valley iron.

Price: $8,000-$15,000
Duration: 3-5 days
Warranty: 15 years
```

**Upload with**:
- Category: `operations`
- Doc Type: `service`
- Priority: `85`
- Auto-embed: `true`

**Result**:
- 1 document created
- `doc_id`: `service_roof_restoration_1736524800_0`
- Immediately searchable via RAG
- Shows in quote assistant context

### Scenario 2: Upload Multi-Suburb Guide
```markdown
# Berwick
Coverage area description...

# Cranbourne
Coverage area description...

# Officer
Coverage area description...
```

**Upload with**:
- Category: `service_areas`
- Doc Type: `suburb`
- Auto-embed: `true`

**Result**:
- 3 documents created (one per suburb)
- All tagged `service_areas`
- Priority auto-set to 80
- RAG-searchable for location queries

### Scenario 3: Auto-Detection
Upload a file without specifying category/type:

**System detects**:
- Contains "MKF_" → category=`system`, doc_type=`mkf`, priority=100
- Contains "GWA_" → category=`workflows`, doc_type=`gwa`, priority=70
- Contains "FAQ" → category=`support`, doc_type=`faq`, priority=70

## Best Practices

1. **Use Markdown**: Best format for structured knowledge
2. **Clear H1 Headers**: For multi-document files, use distinct H1 titles
3. **Enable Auto-Embed**: Unless batch processing later
4. **Specify Category**: When AI might misclassify
5. **Set Appropriate Priority**: Higher = shows up first in RAG results
6. **Use Descriptive Filenames**: Helps with tracking and audit trails
7. **Test Small First**: Upload sample before bulk processing

## API Integration

For programmatic uploads (future):
```typescript
// 1. Upload file
const { data: uploadData } = await supabase.storage
  .from('knowledge-uploads')
  .upload(filePath, file);

// 2. Create tracking record
const { data: trackingRecord } = await supabase
  .from('knowledge_uploads')
  .insert({...})
  .select()
  .single();

// 3. Trigger processing
const { data: result } = await supabase.functions.invoke(
  'process-knowledge-upload',
  { body: { uploadId: trackingRecord.id } }
);
```

## Success Metrics
- ✅ Dynamic categorization (no code changes needed)
- ✅ Multi-format support (.md, .txt, .pdf, .docx)
- ✅ Auto-embedding for immediate RAG access
- ✅ Multi-document parsing from single file
- ✅ Complete audit trail in `knowledge_uploads`
- ✅ Extensible for future file types and categories
- ✅ Zero-config AI detection when metadata not provided

**Result**: Future-proof upload system ready for CKR's growing knowledge base. 🚀
