import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
const NOTION_VERSION = '2022-06-28';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
  parent?: any;
  url?: string;
}

interface DiscoveryResult {
  success: boolean;
  databases: NotionDatabase[];
  total_count: number;
  error?: string;
}

async function searchNotion(query = ''): Promise<any> {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'object', value: 'database' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 100,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

function extractDatabaseInfo(db: any): NotionDatabase {
  const titleProp = db.title || [];
  const title = titleProp[0]?.plain_text || 'Untitled Database';

  return {
    id: db.id.replace(/-/g, ''),
    title,
    properties: db.properties,
    parent: db.parent,
    url: db.url,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured in Supabase secrets');
    }

    console.log('🔍 Discovering Notion databases...');

    const searchResult = await searchNotion();
    const databases: NotionDatabase[] = searchResult.results.map(extractDatabaseInfo);

    const result: DiscoveryResult = {
      success: true,
      databases,
      total_count: databases.length,
    };

    console.log(`✅ Found ${databases.length} database(s):`);
    databases.forEach((db, idx) => {
      console.log(`  ${idx + 1}. ${db.title} (ID: ${db.id})`);
      console.log(`     Properties: ${Object.keys(db.properties).join(', ')}`);
    });

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Discovery error:', error);

    const errorResult: DiscoveryResult = {
      success: false,
      databases: [],
      total_count: 0,
      error: error.message,
    };

    return new Response(JSON.stringify(errorResult, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
