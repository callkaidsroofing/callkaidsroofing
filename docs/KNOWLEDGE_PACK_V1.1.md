# Knowledge Pack v1.1 Implementation

## Overview
The Knowledge Pack v1.1 provides a unified RAG (Retrieval-Augmented Generation) system for CKR Digital Engine, integrating operational knowledge with content management.

## Architecture

### Database Schema
- **ai.documents** table: Unified storage for all knowledge with vector embeddings
- **RAG Views**: Expose content tables (services, blog, case studies, pages, master_knowledge) for indexing
- **Vector Embeddings**: OpenAI text-embedding-3-small (768 dimensions)

### Knowledge Sources

#### Operational Knowledge (knowledge/ directory)
1. **MKF_00_combined.md** - Business invariants, brand mandate, voice guide
2. **Business_knowledge_full.md** - GWA workflows, CKR-GEM v3.0, SOPs
3. **BRAND_GUIDE.md** - Brand identity, visual guidelines, voice/tone
4. **GOVERNANCE.md** - Authorization rules, compliance, security
5. **WARRANTY_POLICY.md** - Warranty terms, coverage, exclusions

#### Content Tables (auto-indexed)
- content_services
- content_case_studies
- content_blog_posts
- content_pages
- master_knowledge

### Edge Functions

#### rag-indexer
**Purpose**: Auto-embed content from RAG views into ai.documents  
**Auth**: Public (no JWT required)  
**Trigger**: Manual or scheduled (daily 3am recommended)  
**Usage**:
```bash
curl -X POST https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/rag-indexer \
  -H "apikey: [anon-key]" \
  -d '{"tables": ["content_services", "content_blog_posts"]}'
```

#### embed-knowledge-docs
**Purpose**: Chunk and embed large knowledge documents  
**Auth**: Authenticated (JWT required)  
**Chunking**: 1200 chars with 150 char overlap  
**Usage**:
```bash
curl -X POST https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/embed-knowledge-docs \
  -H "Authorization: Bearer [user-token]" \
  -d '{
    "documents": [
      {
        "id": "MKF_00_COMBINED",
        "title": "MKF_00: Business Invariants",
        "content": "...",
        "category": "brand",
        "roles": ["admin", "inspector"]
      }
    ]
  }'
```

#### rag-search (Updated)
**Purpose**: Semantic search across ai.documents  
**Auth**: Public  
**Features**:
- Vector similarity search
- Role-based filtering (from assign-knowledge.json)
- Category filtering
- Maintains backward compatibility with master_knowledge

## Admin UI

### Knowledge Docs Page
**Route**: `/admin/cms/knowledge-docs`  
**Features**:
- View all knowledge documents with chunking info
- Monitor embedding coverage across tables
- Manual re-embed actions per table
- Role-based knowledge assignments

### Components
- **KnowledgeDocs.tsx**: Main knowledge management page
- **Embedding Status Dashboard**: Real-time coverage metrics
- **Re-Embed Actions**: Trigger indexing for specific tables

## Configuration Files

### knowledge/index.json
Tracks all knowledge files, versions, and metadata.

### knowledge/config/rag-config.json
RAG system configuration:
- Chunk size: 1200 chars
- Chunk overlap: 150 chars
- Similarity threshold: 0.7
- Match count: 5

### knowledge/config/assign-knowledge.json
Role-based knowledge access:
- Maps roles (admin, inspector, sales) to knowledge docs
- Used for filtering RAG results

## RAG System Prompts

### Admin Assistant
Located: `knowledge/prompts/admin-assistant.prompt.md`  
**Usage**: System prompt for internal chat assistants  
**Features**:
- Knowledge citation format: [MKF_00], [BRAND_GUIDE], [WARRANTY_POLICY]
- Brand compliance enforcement
- Role-appropriate knowledge filtering

## Maintenance

### Daily Tasks
- Auto-run rag-indexer at 3am (via cron or webhook)
- Monitor embedding coverage dashboard

### Manual Re-Embedding
When content changes significantly:
1. Go to `/admin/cms/knowledge-docs`
2. Click "Re-Embed" for affected table
3. Monitor progress in dashboard

### Knowledge Updates
When updating operational knowledge:
1. Edit files in `knowledge/` directory
2. Run `embed-knowledge-docs` with updated content
3. Verify in admin UI

## Embedding Statistics

Current deployment has:
- **96 master_knowledge records** (embedded with OpenAI)
- **5 operational knowledge docs** (to be chunked: ~575 chunks)
- **Content tables** (services, blog, case studies, pages)

### Expected Total
After full indexing: ~800-1000 embedded chunks across all sources

## Security

### RLS Policies
- ai.documents: Public read, admin/service role write
- get_knowledge_docs(): Authenticated users
- get_embedding_stats(): Authenticated users

### Function Auth
- rag-indexer: Public (for scheduled jobs)
- embed-knowledge-docs: Authenticated only
- rag-search: Public (for chat assistants)

## Integration Points

### Frontend
```typescript
import { useRagSearch } from '@/hooks/useRagSearch';

const { search, result } = useRagSearch({
  matchThreshold: 0.7,
  matchCount: 5,
  filterCategory: 'brand'
});

await search('What are our brand colors?');
console.log(result.chunks); // Returns relevant knowledge
```

### Edge Functions
```typescript
// In any edge function
const { data } = await supabase.functions.invoke('rag-search', {
  body: {
    query: userMessage,
    matchThreshold: 0.7,
    matchCount: 5
  }
});

// Use data.context in AI prompts
```

## Monitoring

### Key Metrics
- Embedding coverage % per table
- RAG search latency (<500ms target)
- Context relevance scores (>0.7 threshold)

### Debugging
```sql
-- Check embedding status
SELECT source_table, COUNT(*) as total, COUNT(embedding) as embedded
FROM ai.documents
GROUP BY source_table;

-- Test similarity search
SELECT title, 1 - (embedding <=> query_embedding) as similarity
FROM ai.documents
WHERE similarity > 0.7
ORDER BY similarity DESC
LIMIT 10;
```

## Future Enhancements
- [ ] Scheduled daily auto-indexing (cron job)
- [ ] Real-time content embedding on publish
- [ ] Multi-modal search (images + text)
- [ ] Knowledge graph visualization
- [ ] A/B testing for RAG parameters
- [ ] Embedding model upgrades (track performance)

## Version History
- **v1.1** (2025-11-10): Initial Knowledge Pack integration
  - Created ai.documents table
  - Built RAG views for 5 content tables
  - Deployed rag-indexer and embed-knowledge-docs functions
  - Added KnowledgeDocs admin UI
  - Updated chat-with-rag with enhanced prompts

## Support
For issues with Knowledge Pack integration:
1. Check edge function logs: `supabase functions logs [function-name]`
2. Verify embedding stats: `/admin/cms/knowledge-docs`
3. Test RAG search: Use RAGTestPanel component
4. Review console logs for embedding generation errors
