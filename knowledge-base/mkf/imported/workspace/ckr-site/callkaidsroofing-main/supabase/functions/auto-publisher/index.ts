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

    // Get all posts scheduled for now (±5 minutes window)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_for', fiveMinutesAgo.toISOString())
      .lte('scheduled_for', fiveMinutesLater.toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const post of scheduledPosts || []) {
      try {
        let publishResult;

        if (post.platform === 'facebook') {
          publishResult = await publishToFacebook(post);
        } else if (post.platform === 'instagram') {
          publishResult = await publishToInstagram(post);
        } else if (post.platform === 'google_business_profile') {
          publishResult = await publishToGBP(post);
        }

        // Update post status to published
        await supabase
          .from('social_posts')
          .update({
            status: 'published',
            published_at: now.toISOString(),
            post_id: publishResult?.id || publishResult?.post_id,
          })
          .eq('id', post.id);

        results.push({ post_id: post.id, success: true, platform: post.platform });
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);

        // Update post status to failed
        await supabase
          .from('social_posts')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', post.id);

        results.push({ post_id: post.id, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Publishing complete',
        processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Auto-publisher error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function publishToFacebook(post: any) {
  const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
  const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
  const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

  if (!pageAccessToken || !pageId) {
    throw new Error('Facebook credentials not configured');
  }

  const params = new URLSearchParams({
    message: post.content,
    access_token: pageAccessToken,
  });

  if (post.image_url) {
    params.append('url', post.image_url);
  }

  const endpoint = post.image_url
    ? `https://graph.facebook.com/v18.0/${pageId}/photos`
    : `https://graph.facebook.com/v18.0/${pageId}/feed`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook API error: ${error}`);
  }

  return response.json();
}

async function publishToInstagram(post: any) {
  const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
  const instagramAccountId = Deno.env.get('INSTAGRAM_ACCOUNT_ID');

  if (!pageAccessToken || !instagramAccountId) {
    throw new Error('Instagram credentials not configured');
  }

  if (!post.image_url) {
    throw new Error('Instagram posts require an image');
  }

  // Step 1: Create media container
  const containerParams = new URLSearchParams({
    image_url: post.image_url,
    caption: post.content,
    access_token: pageAccessToken,
  });

  const containerResponse = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media?${containerParams}`,
    { method: 'POST' }
  );

  if (!containerResponse.ok) {
    const error = await containerResponse.text();
    throw new Error(`Instagram container creation error: ${error}`);
  }

  const { id: creationId } = await containerResponse.json();

  // Step 2: Publish container
  const publishParams = new URLSearchParams({
    creation_id: creationId,
    access_token: pageAccessToken,
  });

  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish?${publishParams}`,
    { method: 'POST' }
  );

  if (!publishResponse.ok) {
    const error = await publishResponse.text();
    throw new Error(`Instagram publish error: ${error}`);
  }

  return publishResponse.json();
}

async function publishToGBP(post: any) {
  // Invoke the separate GBP function
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const response = await fetch(`${supabaseUrl}/functions/v1/publish-to-gbp`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GBP publish error: ${error}`);
  }

  return response.json();
}
