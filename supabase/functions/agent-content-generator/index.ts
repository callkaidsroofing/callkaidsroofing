import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Agent Content Generator] Starting...');

    // Analyze recent completed jobs (last 30 days)
    const { data: recentJobs, error: jobsError } = await supabase
      .from('inspection_reports')
      .select('*')
      .not('completed_at', 'is', null)
      .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('completed_at', { ascending: false });

    if (jobsError) throw jobsError;

    if (!recentJobs || recentJobs.length === 0) {
      console.log('[Agent Content Generator] No recent jobs to write about');
      return new Response(JSON.stringify({ generated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find most common issues
    const issueCount: Record<string, number> = {};
    const suburbs: Set<string> = new Set();

    recentJobs.forEach(job => {
      if (job.brokenTilesCaps === 'Yes') issueCount['ridge_caps'] = (issueCount['ridge_caps'] || 0) + 1;
      if (job.pointing === 'Poor' || job.pointing === 'Needs Attention') issueCount['pointing'] = (issueCount['pointing'] || 0) + 1;
      if (job.valleyIrons === 'Rusty' || job.valleyIrons === 'Needs Replacement') issueCount['valley_irons'] = (issueCount['valley_irons'] || 0) + 1;
      suburbs.add(job.suburbPostcode.split(' ')[0]);
    });

    const topIssue = Object.entries(issueCount).sort((a, b) => b[1] - a[1])[0];
    const topSuburbs = Array.from(suburbs).slice(0, 3);

    if (!topIssue) {
      console.log('[Agent Content Generator] No clear issue pattern');
      return new Response(JSON.stringify({ generated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate blog post using Gemini 2.5 Pro
    const blogResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are writing an SEO blog post for Call Kaids Roofing (ABN 39475055075).

Brand voice: Down-to-earth, honest, educational (not salesy)
Tone: Like a switched-on tradie explaining things clearly
Slogans: "No Leaks. No Lifting. Just Quality." | "The Best Roof Under the Sun."

SEO requirements:
- 1200-1500 words
- H1 title with main keyword
- H2 subheadings every 200-300 words
- Local suburbs naturally mentioned
- Focus on education, not selling
- Materials: Premcoat, SupaPoint, Stormseal
- 7-10 year workmanship warranty

Write in Australian English (e.g., "colour" not "color")`
          },
          {
            role: 'user',
            content: `Write a blog post about ${topIssue[0].replace('_', ' ')} repairs in ${topSuburbs.join(', ')}.
Based on ${topIssue[1]} recent jobs we completed in these areas.

Include:
- Why this issue is common in SE Melbourne
- Signs homeowners should look for
- What proper repairs involve (materials, process)
- Consequences of ignoring it
- How we fix it right

Return as JSON with keys: title, metaDescription, content (HTML)`
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    const blogData = await blogResponse.json();
    const blog = JSON.parse(blogData.choices[0].message.content);

    // Generate 3 social media variants
    const socialResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Create 3 Facebook/Instagram post variations for Call Kaids Roofing.

Format for each:
- 120-150 characters (engaging hook)
- Include CTA
- 3-5 relevant hashtags
- One casual/friendly, one educational, one promotional

Return as JSON array: [{text: "", hashtags: []}]`
          },
          {
            role: 'user',
            content: `Topic: ${blog.title}
Suburbs: ${topSuburbs.join(', ')}
Service: ${topIssue[0].replace('_', ' ')} repairs`
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    const socialData = await socialResponse.json();
    const socialPosts = JSON.parse(socialData.choices[0].message.content);

    // Save to content_queue for admin review
    const { data: savedBlog, error: blogError } = await supabase
      .from('content_queue')
      .insert({
        content_type: 'blog',
        generated_content: blog,
        ai_confidence_score: 0.85,
        status: 'pending_review',
      })
      .select()
      .single();

    if (blogError) throw blogError;

    // Save social posts
    for (const post of (socialPosts.posts || [])) {
      await supabase.from('social_posts').insert({
        platform: 'facebook',
        content: post.text + '\n\n' + post.hashtags.join(' '),
        status: 'draft',
      });
    }

    console.log(`[Agent Content Generator] Generated blog and ${socialPosts.posts?.length || 0} social posts`);

    return new Response(
      JSON.stringify({
        success: true,
        blog: { id: savedBlog.id, title: blog.title },
        socialPosts: socialPosts.posts?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('[Agent Content Generator] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
