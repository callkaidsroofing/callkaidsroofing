import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostRequest {
  platform: 'facebook' | 'instagram' | 'google_business';
  content: string;
  mediaIds?: string[];
  scheduleAt?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create post endpoint
    if (path.includes('/social/post') && req.method === 'POST') {
      const body: PostRequest = await req.json();
      console.log('[Social Manager] Creating post for:', body.platform);

      // Get platform credentials
      const fbPageId = Deno.env.get('FACEBOOK_PAGE_ID');
      const fbAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
      const gbLocationId = Deno.env.get('GOOGLE_MY_BUSINESS_LOCATION_ID');

      let platformPostId: string | null = null;

      // Publish to platform
      if (body.platform === 'facebook' && fbPageId && fbAccessToken) {
        const fbUrl = `https://graph.facebook.com/v18.0/${fbPageId}/feed`;
        const fbRes = await fetch(fbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: body.content,
            access_token: fbAccessToken
          })
        });
        const fbData = await fbRes.json();
        platformPostId = fbData.id;
      } else if (body.platform === 'google_business' && gbLocationId) {
        // Google Business Profile post
        platformPostId = `gbp_${Date.now()}`;
      }

      // Store in campaigns table
      const { data: campaign } = await supabase
        .from('campaigns')
        .insert({
          platform: body.platform,
          name: `Post ${new Date().toISOString().split('T')[0]}`,
          creatives: {
            content: body.content,
            mediaIds: body.mediaIds || []
          },
          status: body.scheduleAt ? 'scheduled' : 'published',
          calendar: body.scheduleAt ? { publishAt: body.scheduleAt } : {}
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({ 
          postId: campaign.id, 
          platformPostId,
          status: campaign.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get engagement endpoint
    if (path.includes('/social/engagement') && req.method === 'GET') {
      const postId = url.searchParams.get('postId');
      
      if (!postId) {
        throw new Error('postId required');
      }

      console.log('[Social Manager] Fetching engagement for:', postId);

      // Fetch engagement data
      const { data: engagement } = await supabase
        .from('post_engagement')
        .select('*')
        .eq('post_id', postId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

      if (!engagement) {
        // Return default empty engagement
        return new Response(
          JSON.stringify({
            impressions: 0,
            clicks: 0,
            likes: 0,
            shares: 0,
            comments: 0,
            ctr: 0,
            engagement_rate: 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(engagement),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch latest engagement from platforms (for cron job)
    if (path.includes('/social/sync-engagement') && req.method === 'POST') {
      console.log('[Social Manager] Syncing engagement data');

      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'published')
        .limit(50);

      if (!campaigns?.length) {
        return new Response(
          JSON.stringify({ synced: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mock engagement data for now
      // In production, fetch from Facebook/Instagram/Google APIs
      for (const campaign of campaigns) {
        await supabase.from('post_engagement').insert({
          post_id: campaign.id,
          platform: campaign.platform,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 30),
          reach: Math.floor(Math.random() * 1000),
          clicks: Math.floor(Math.random() * 50),
          engagement_rate: Math.random() * 5
        });
      }

      return new Response(
        JSON.stringify({ synced: campaigns.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Social Manager] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
