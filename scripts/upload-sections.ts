import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { parseAllMKFDocuments, DocumentSection, DocumentMetadata } from './parse-mkf-headers'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vlnkzpyeppfdmresiaoh.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(2)
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY')
  process.exit(2)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.substring(0, 8000) // Limit to ~8k chars
    })
    return response.data[0].embedding
  } catch (error: any) {
    console.error('❌ Embedding generation failed:', error.message)
    throw error
  }
}

async function uploadSection(section: DocumentSection): Promise<void> {
  const textToEmbed = `${section.heading}\n\n${section.content}`
  const embedding = await generateEmbedding(textToEmbed)
  
  const { error } = await supabase
    .from('ckr_knowledge_sections')
    .upsert({
      doc_id: section.doc_id,
      doc_title: section.doc_title,
      domain: section.domain,
      section_level: section.section_level,
      section_path: section.section_path,
      heading: section.heading,
      content: section.content,
      embedding: embedding,
      keywords: section.keywords,
      related_sections: section.related_sections,
      metadata: {
        char_count: section.content.length,
        paragraph_count: section.content.split('\n\n').length
      },
      active: true
    }, { onConflict: 'doc_id,section_path' })
  
  if (error) {
    throw new Error(`Failed to upload section: ${error.message}`)
  }
}

async function uploadDocument(doc: DocumentMetadata, sectionCount: number): Promise<void> {
  const { error } = await supabase
    .from('ckr_document_registry')
    .upsert({
      doc_id: doc.doc_id,
      title: doc.title,
      domain: doc.domain,
      file_path: doc.file_path,
      version: doc.version,
      supersedes: doc.supersedes,
      section_count: sectionCount,
      last_updated: new Date().toISOString(),
      active: true
    }, { onConflict: 'doc_id' })
  
  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`)
  }
}

async function main() {
  const knowledgeDir = process.argv[2] || './knowledge-base/mkf/source'
  
  console.log(`📚 Parsing MKF documents from: ${knowledgeDir}`)
  const { sections, documents } = parseAllMKFDocuments(knowledgeDir)
  
  console.log(`\n📊 Parsed ${documents.length} documents with ${sections.length} sections`)
  
  // Upload documents first
  console.log('\n📤 Uploading document registry...')
  for (const doc of documents) {
    const docSections = sections.filter(s => s.doc_id === doc.doc_id)
    try {
      await uploadDocument(doc, docSections.length)
      console.log(`  ✅ ${doc.doc_id}: ${doc.title}`)
    } catch (error: any) {
      console.error(`  ❌ ${doc.doc_id}: ${error.message}`)
    }
  }
  
  // Upload sections with embeddings
  console.log('\n📤 Uploading sections with embeddings...')
  let uploaded = 0
  let failed = 0
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    try {
      await uploadSection(section)
      uploaded++
      
      if (uploaded % 10 === 0) {
        console.log(`  ⏳ Progress: ${uploaded}/${sections.length} (${Math.round(uploaded/sections.length*100)}%)`)
      }
      
      // Rate limiting: 60 requests/minute for OpenAI
      if (i % 50 === 0 && i > 0) {
        console.log('  ⏸️  Pausing for rate limit...')
        await new Promise(resolve => setTimeout(resolve, 60000))
      }
    } catch (error: any) {
      failed++
      console.error(`  ❌ Failed ${section.doc_id} § ${section.heading}: ${error.message}`)
    }
  }
  
  console.log(`\n✅ Upload complete: ${uploaded} uploaded, ${failed} failed`)
  
  // Summary by domain
  console.log('\n📊 Sections by domain:')
  const domainCounts = new Map<string, number>()
  sections.forEach(s => {
    domainCounts.set(s.domain, (domainCounts.get(s.domain) || 0) + 1)
  })
  domainCounts.forEach((count, domain) => {
    console.log(`  ${domain}: ${count} sections`)
  })
}

main().catch(e => {
  console.error('❌ Script failed:', e.message)
  process.exit(1)
})
