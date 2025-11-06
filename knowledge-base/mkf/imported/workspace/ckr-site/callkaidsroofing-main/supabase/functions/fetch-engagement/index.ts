import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get published posts from the last 7 days that don't have engagement data yet
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { data: posts, error: fetchError } = await supabase
      .from('social_posts')
      .select('id, platform, post_id, published_at')
      .eq('status', 'published')
      .not('post_id', 'is', null)
      .gte('published_at', sevenDaysAgo.toISOString());

    if (fetchError) {
      throw new Error(`Error fetching posts: ${fetchError.message}`);
    }

    const results = [];

    for (const post of posts || []) {
      try {
        let engagementData;

        if (post.platform === 'facebook') {
          engagementData = await fetchFacebookEngagement(post.post_id);
        } else if (post.platform === 'instagram') {
          engagementData = await fetchInstagramEngagement(post.post_id);
        } else {
          // Skip GBP for now (no engagement API)
          continue;
        }

        // Check if engagement record already exists for today
        const { data: existingEngagement } = await supabase
          .from('post_engagement')
          .select('id')
          .eq('post_id', post.id)
          .gte('fetched_at', new Date().toISOString().split('T')[0])
          .single();

        if (!existingEngagement) {
          // Insert new engagement data
          await supabase.from('post_engagement').insert({
            post_id: post.id,
            platform: post.platform,
            likes: engagementData.likes,
            comments: engagementData.comments,
            shares: engagementData.shares,
            reach: engagementData.reach,
            clicks: engagementData.clicks,
          });

          results.push({ post_id: post.id, success: true });
        }
      } catch (error) {
        console.error(`Failed to fetch engagement for post ${post.id}:`, error);
        results.push({ post_id: post.id, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Engagement fetch complete',
        processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Fetch engagement error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchFacebookEngagement(postId: string) {
  const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');

  if (!pageAccessToken) {
    throw new Error('Facebook access token not configured');
  }

  // Fetch post data including likes, comments, shares
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${postId}?fields=likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions,post_engaged_users,post_clicks)&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook API error: ${error}`);
  }

  const data = await response.json();

  return {
    likes: data.likes?.summary?.total_count || 0,
    comments: data.comments?.summary?.total_count || 0,
    shares: data.shares?.count || 0,
    reach: data.insights?.data?.find((m: any) => m.name === 'post_impressions')?.values?.[0]?.value || 0,
    clicks: data.insights?.data?.find((m: any) => m.name === 'post_clicks')?.values?.[0]?.value || 0,
  };
}

async function fetchInstagramEngagement(mediaId: string) {
  const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');

  if (!pageAccessToken) {
    throw new Error('Instagram access token not configured');
  }

  // Fetch Instagram media insights
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${mediaId}?fields=like_count,comments_count,insights.metric(impressions,reach,engagement)&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instagram API error: ${error}`);
  }

  const data = await response.json();

  const engagement = data.insights?.data?.find((m: any) => m.name === 'engagement')?.values?.[0]?.value || 0;

  return {
    likes: data.like_count || 0,
    comments: data.comments_count || 0,
    shares: 0, // Instagram doesn't expose share counts
    reach: data.insights?.data?.find((m: any) => m.name === 'reach')?.values?.[0]?.value || 0,
    clicks: engagement,
  };
}
