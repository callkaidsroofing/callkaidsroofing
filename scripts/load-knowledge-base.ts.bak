#!/usr/bin/env node

/**
 * Knowledge Base Loader Script
 * 
 * Processes MKF documents from MASTER_INDEX.json and loads them into
 * the knowledge_chunks table via the embed-knowledge-base edge function.
 * 
 * Usage:
 *   npm run load-kb              # Load all documents
 *   npm run load-kb --doc MKF_00 # Load specific document
 *   npm run load-kb --category ops # Load by category
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface KBDocument {
  id: string;
  title: string;
  path: string;
  type: string;
}

interface MasterIndex {
  version: string;
  updated: string;
  docs: KBDocument[];
  embedding: {
    chunk_size_chars: number;
    chunk_overlap_chars: number;
    metadata_fields: string[];
    stop_sections: string[];
  };
}

// Category mapping for database
const CATEGORY_MAP: Record<string, string> = {
  'policy': 'system',
  'style': 'brand',
  'dev': 'operations',
  'seo': 'marketing',
  'ops': 'operations',
  'content': 'marketing',
  'data': 'services',
  'gwa': 'workflows'
};

async function loadMasterIndex(): Promise<MasterIndex> {
  const indexPath = path.join(__dirname, '../knowledge-base/mkf/source/MASTER_INDEX.json');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error(`MASTER_INDEX.json not found at ${indexPath}`);
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  return JSON.parse(content);
}

async function readDocument(docPath: string): Promise<string> {
  const fullPath = path.join(__dirname, '../knowledge-base/mkf/source', docPath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Document not found: ${fullPath}`);
  }

  return fs.readFileSync(fullPath, 'utf-8');
}

async function embedDocument(doc: KBDocument, content: string, batchMode: boolean = false) {
  const category = CATEGORY_MAP[doc.type] || 'operations';

  console.log(`${batchMode ? '  ' : ''}📄 Processing: ${doc.id} - ${doc.title}`);
  
  const { data, error } = await supabase.functions.invoke('embed-knowledge-base', {
    body: {
      documents: [{
        docId: doc.id,
        title: doc.title,
        category,
        content,
        metadata: {
          type: doc.type,
          path: doc.path,
          source: 'MKF',
          version: '1.0.0'
        }
      }]
    }
  });

  if (error) {
    console.error(`${batchMode ? '  ' : ''}❌ Error: ${error.message}`);
    throw error;
  }

  if (!data?.success) {
    console.error(`${batchMode ? '  ' : ''}❌ Failed:`, data);
    throw new Error('Embedding failed');
  }

  console.log(`${batchMode ? '  ' : ''}✅ Success: ${data.results.totalChunks} chunks created`);
  return data;
}

async function loadAll(index: MasterIndex) {
  console.log('\n🚀 Loading All Documents\n');
  
  let successful = 0;
  let failed = 0;

  for (const doc of index.docs) {
    try {
      const content = await readDocument(doc.path);
      await embedDocument(doc, content, true);
      successful++;
    } catch (error) {
      console.error(`  ❌ Failed to load ${doc.id}:`, error instanceof Error ? error.message : error);
      failed++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📄 Total: ${index.docs.length}`);
}

async function loadById(index: MasterIndex, docId: string) {
  console.log(`\n🔍 Loading Document: ${docId}\n`);
  
  const doc = index.docs.find(d => d.id === docId);
  
  if (!doc) {
    console.error(`❌ Document not found: ${docId}`);
    console.log('\nAvailable documents:');
    index.docs.forEach(d => console.log(`   - ${d.id}: ${d.title}`));
    process.exit(1);
  }

  const content = await readDocument(doc.path);
  await embedDocument(doc, content);
}

async function loadByCategory(index: MasterIndex, categoryType: string) {
  console.log(`\n🏷️  Loading Category: ${categoryType}\n`);
  
  const docs = index.docs.filter(d => d.type === categoryType);
  
  if (docs.length === 0) {
    console.error(`❌ No documents found for category: ${categoryType}`);
    console.log('\nAvailable categories:');
    const categories = [...new Set(index.docs.map(d => d.type))];
    categories.forEach(c => console.log(`   - ${c}`));
    process.exit(1);
  }

  console.log(`Found ${docs.length} documents\n`);

  let successful = 0;
  let failed = 0;

  for (const doc of docs) {
    try {
      const content = await readDocument(doc.path);
      await embedDocument(doc, content, true);
      successful++;
    } catch (error) {
      console.error(`  ❌ Failed to load ${doc.id}:`, error instanceof Error ? error.message : error);
      failed++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
}

async function clearKnowledgeBase() {
  console.log('\n🗑️  Clearing existing knowledge base...\n');
  
  const { error } = await supabase
    .from('knowledge_chunks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }

  console.log('✅ Knowledge base cleared\n');
}

async function main() {
  const args = process.argv.slice(2);
  
  try {
    const index = await loadMasterIndex();
    
    console.log('📚 CKR Knowledge Base Loader');
    console.log(`   Version: ${index.version}`);
    console.log(`   Updated: ${index.updated}`);
    console.log(`   Documents: ${index.docs.length}`);

    // Parse command line arguments
    const docArg = args.find(arg => arg.startsWith('--doc='));
    const categoryArg = args.find(arg => arg.startsWith('--category='));
    const clearFlag = args.includes('--clear');

    if (clearFlag) {
      await clearKnowledgeBase();
    }

    if (docArg) {
      const docId = docArg.split('=')[1];
      await loadById(index, docId);
    } else if (categoryArg) {
      const category = categoryArg.split('=')[1];
      await loadByCategory(index, category);
    } else {
      await loadAll(index);
    }

    console.log('\n✨ Knowledge base loading complete!\n');

  } catch (error) {
    console.error('\n💥 Fatal Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
