# RAG System Architecture

## Overview

The CKR Digital Engine implements a **Retrieval-Augmented Generation (RAG)** system to power intelligent chat assistants with accurate, contextual responses grounded in the Master Knowledge Framework (MKF).

## System Components

### 1. Vector Database (`knowledge_chunks`)

**Schema:**
```sql
- id: UUID (primary key)
- doc_id: TEXT (e.g., "MKF_00", "GWA-06")
- title: TEXT (document title)
- category: TEXT (system, brand, operations, marketing, etc.)
- section: TEXT (markdown section header)
- chunk_index: INTEGER (position within document)
- content: TEXT (actual chunk content)
- embedding: VECTOR(768) (text-embedding-004 vector)
- metadata: JSONB (additional context)
- version: INTEGER
- active: BOOLEAN
```

**Indexes:**
- IVFFlat index on `embedding` for fast cosine similarity search
- B-tree indexes on `doc_id`, `category`, `active`
- Composite index on `(active, category)` for filtered queries

### 2. Edge Functions

#### `rag-search`
**Purpose:** Semantic search over knowledge chunks  
**Input:**
```typescript
{
  query: string;              // User's question
  matchThreshold?: number;    // Similarity threshold (0.0-1.0, default: 0.7)
  matchCount?: number;        // Max results (default: 5)
  filterCategory?: string;    // Optional category filter
}
```

**Output:**
```typescript
{
  success: true,
  query: string,
  chunks: Array<{
    title: string,
    category: string,
    section: string,
    content: string,
    similarity: number
  }>,
  context: string,            // Formatted context for LLM
  metadata: {
    totalMatches: number,
    threshold: number,
    category: string | null
  }
}
```

**Process:**
1. Generate embedding for user query using `text-embedding-004`
2. Call `search_knowledge_chunks()` database function
3. Perform cosine similarity search with IVFFlat index
4. Return top-k chunks above threshold
5. Format as LLM-ready context string

#### `embed-knowledge-base`
**Purpose:** Batch process markdown files into vector embeddings  
**Input:**
```typescript
{
  documents: Array<{
    docId: string,
    title: string,
    category: string,
    content: string,
    metadata?: object
  }>,
  batchSize?: number          // Default: 10
}
```

**Process:**
1. Chunk each document (1200 chars, 150 char overlap)
2. Extract section headers from markdown
3. Generate embeddings via Lovable AI Gateway
4. Insert into `knowledge_chunks` table
5. Track progress and errors

**Chunking Strategy:**
- Max chunk size: 1200 characters
- Overlap: 150 characters
- Break at sentence/paragraph boundaries
- Filter chunks <50 characters
- Preserve section context from markdown headers

#### `chat-with-rag`
**Purpose:** LLM chat with RAG-augmented context  
**Input:**
```typescript
{
  messages: Array<{
    role: 'system' | 'user' | 'assistant',
    content: string
  }>,
  conversationType?: 'customer_support' | 'quote_assistant' | 'internal',
  useRag?: boolean,           // Default: true
  ragOptions?: {
    matchThreshold?: number,
    matchCount?: number,
    filterCategory?: string
  }
}
```

**Process:**
1. Extract last user message
2. Call `rag-search` to retrieve relevant chunks
3. Inject context into system message
4. Call Gemini 2.0 Flash via Lovable AI Gateway
5. Return assistant response with metadata

**System Prompt Template:**
- Business context (ABN, contact, services)
- Role-specific instructions
- Retrieved knowledge context
- Output guidelines (Australian English, citations, limitations)

### 3. Database Functions

#### `search_knowledge_chunks()`
```sql
search_knowledge_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL
)
```

**Returns:** Table of matching chunks with similarity scores

**Algorithm:**
- Cosine similarity: `1 - (embedding <=> query_embedding)`
- Filter by `active = true` and optional category
- Order by similarity (ascending distance)
- Limit to top-k matches above threshold

## Knowledge Base Structure

```
knowledge-base/mkf/source/
├── 01_System_Governance/   # MKF_00, GWA workflows
├── 02_Brand_Voice/          # MKF_01, brand guidelines
├── 03_Operations_SOPs/      # MKF_05, service procedures
├── 04_Marketing_Content/    # MKF_06, copy templates
├── 05_Pricing_Rates/        # MKF_02, rate cards
├── 06_Workflows_GWA/        # GWA-01 through GWA-14
└── 07_Schemas_Config/       # mkf_index.json, metadata
```

## Embedding Pipeline

### Initial Load
1. Read `mkf_index.json` for document manifest
2. Load markdown files from organized directory structure
3. Call `embed-knowledge-base` with document array
4. Track progress in `embedding_jobs` table

### Incremental Updates
1. Detect file changes via git hooks or manual trigger
2. Set `active = false` for outdated chunks
3. Generate new embeddings for updated documents
4. Insert with incremented version number

### Re-indexing
1. Mark all chunks as `active = false`
2. Regenerate embeddings from scratch
3. Useful after model upgrades or schema changes

## Performance Characteristics

**Query Speed:**
- IVFFlat index: ~10-50ms for 100K vectors
- Full table scan: ~500ms+ (avoid)
- Optimal `lists` parameter: `sqrt(row_count)`

**Embedding Generation:**
- `text-embedding-004`: ~200ms per request
- Batch size: 10 documents (rate limit safety)
- Chunking overhead: ~50ms per document

**Storage:**
- Vector size: 768 dimensions × 4 bytes = 3KB per embedding
- Average chunks per document: 8-12
- Total storage estimate: 5-10MB for 300-page knowledge base

## Security & RLS Policies

```sql
-- Public read access (customer support chat)
SELECT: active = true

-- Authenticated read access (internal users)
SELECT: active = true AND auth.role() = 'authenticated'

-- Admin full access
ALL: is_admin_user(auth.uid())
```

## Integration Points

### Frontend
```typescript
import { supabase } from "@/integrations/supabase/client";

// Perform RAG search
const { data } = await supabase.functions.invoke('rag-search', {
  body: { 
    query: userMessage,
    matchCount: 3,
    filterCategory: 'operations'
  }
});

// Chat with RAG
const { data } = await supabase.functions.invoke('chat-with-rag', {
  body: {
    messages: conversationHistory,
    conversationType: 'customer_support',
    useRag: true
  }
});
```

### Admin Tools
- Knowledge base sync UI
- Embedding job monitor
- Vector search debugger
- Context preview panel

## Monitoring & Debugging

**Key Metrics:**
- RAG search latency (p50, p95, p99)
- Embedding job success rate
- Context relevance scores
- Cache hit rates

**Logs:**
- Edge function logs: Supabase Dashboard → Functions
- Database logs: Postgres logs → search for `search_knowledge_chunks`
- Network logs: Browser DevTools → Network tab

**Debug Queries:**
```sql
-- Check chunk distribution
SELECT category, COUNT(*), AVG(length(content)) 
FROM knowledge_chunks 
WHERE active = true 
GROUP BY category;

-- Find chunks without embeddings
SELECT doc_id, title FROM knowledge_chunks WHERE embedding IS NULL;

-- Test similarity search
SELECT doc_id, title, section, 1 - (embedding <=> (SELECT embedding FROM knowledge_chunks LIMIT 1)) AS sim
FROM knowledge_chunks
ORDER BY sim DESC
LIMIT 10;
```

## Future Enhancements

- [ ] Hybrid search (vector + keyword BM25)
- [ ] Multi-query retrieval (generate variations)
- [ ] Re-ranking with cross-encoder
- [ ] Automatic chunk evaluation (LLM-as-judge)
- [ ] Context caching for repeat queries
- [ ] Streaming responses with incremental context

---

**Last Updated:** 2025-11-10  
**Version:** 2.0 (Phase 2 Complete)
