import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const notionApiKey = Deno.env.get('NOTION_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: any;
  url: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  lastModified: string;
  tags: string[];
  slug: string;
  featured?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching blog posts from Notion...');
    
    const { databaseId, pageId } = await req.json().catch(() => ({}));
    
    if (pageId) {
      // Fetch specific page content
      const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      });
      
      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch page: ${pageResponse.statusText}`);
      }
      
      const pageData = await pageResponse.json();
      
      // Fetch page content blocks
      const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
        },
      });
      
      const blocksData = await blocksResponse.json();
      
      // Convert blocks to readable content
      const content = extractContentFromBlocks(blocksData.results);
      
      const post: BlogPost = {
        id: pageData.id,
        title: extractTitle(pageData.properties),
        content: content,
        excerpt: content.substring(0, 200) + '...',
        publishedDate: pageData.created_time,
        lastModified: pageData.last_edited_time,
        tags: extractTags(pageData.properties),
        slug: generateSlug(extractTitle(pageData.properties)),
        featured: extractFeatured(pageData.properties),
      };
      
      return new Response(JSON.stringify({ post }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (databaseId) {
      // Fetch all pages from database
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [
            {
              property: 'Created',
              direction: 'descending'
            }
          ],
          filter: {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Found ${data.results.length} pages`);
      
      const posts: BlogPost[] = data.results.map((page: NotionPage) => ({
        id: page.id,
        title: extractTitle(page.properties),
        content: '',
        excerpt: extractExcerpt(page.properties),
        publishedDate: page.created_time,
        lastModified: page.last_edited_time,
        tags: extractTags(page.properties),
        slug: generateSlug(extractTitle(page.properties)),
        featured: extractFeatured(page.properties),
      }));
      
      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If no specific database or page requested, try to find databases
    const searchResponse = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          value: 'database',
          property: 'object'
        }
      }),
    });
    
    const searchData = await searchResponse.json();
    
    return new Response(JSON.stringify({ 
      message: 'Please provide a databaseId to fetch posts',
      availableDatabases: searchData.results.map((db: any) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || 'Untitled',
        url: db.url
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in fetch-notion-blog function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Make sure your Notion API key has access to the database and pages'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractTitle(properties: any): string {
  // Try different property names for title
  const titleProp = properties.Title || properties.Name || properties.title || properties.name;
  if (titleProp?.title?.length > 0) {
    return titleProp.title[0].plain_text;
  }
  if (titleProp?.rich_text?.length > 0) {
    return titleProp.rich_text[0].plain_text;
  }
  return 'Untitled Post';
}

function extractExcerpt(properties: any): string {
  const excerptProp = properties.Excerpt || properties.Description || properties.excerpt;
  if (excerptProp?.rich_text?.length > 0) {
    return excerptProp.rich_text[0].plain_text;
  }
  return '';
}

function extractTags(properties: any): string[] {
  const tagsProp = properties.Tags || properties.Categories || properties.tags;
  if (tagsProp?.multi_select) {
    return tagsProp.multi_select.map((tag: any) => tag.name);
  }
  return [];
}

function extractFeatured(properties: any): boolean {
  const featuredProp = properties.Featured || properties.featured;
  return featuredProp?.checkbox || false;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractContentFromBlocks(blocks: any[]): string {
  let content = '';
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length > 0) {
          content += block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
        }
        break;
      case 'heading_1':
        if (block.heading_1.rich_text.length > 0) {
          content += '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
        }
        break;
      case 'heading_2':
        if (block.heading_2.rich_text.length > 0) {
          content += '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
        }
        break;
      case 'heading_3':
        if (block.heading_3.rich_text.length > 0) {
          content += '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
        }
        break;
      case 'bulleted_list_item':
        if (block.bulleted_list_item.rich_text.length > 0) {
          content += '• ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
        }
        break;
      case 'numbered_list_item':
        if (block.numbered_list_item.rich_text.length > 0) {
          content += '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
        }
        break;
      case 'quote':
        if (block.quote.rich_text.length > 0) {
          content += '> ' + block.quote.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
        }
        break;
    }
  }
  
  return content.trim();
}