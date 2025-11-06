import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const post = await req.json();

    const clientId = Deno.env.get('GOOGLE_MY_BUSINESS_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_MY_BUSINESS_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GOOGLE_MY_BUSINESS_REFRESH_TOKEN');
    const accountId = Deno.env.get('GOOGLE_MY_BUSINESS_ACCOUNT_ID');
    const locationId = Deno.env.get('GOOGLE_MY_BUSINESS_LOCATION_ID');

    if (!clientId || !clientSecret || !refreshToken || !accountId || !locationId) {
      throw new Error('Google Business Profile credentials not configured');
    }

    // Get fresh access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const { access_token } = await tokenResponse.json();

    // Create local post
    const localPost = {
      languageCode: 'en-AU',
      summary: post.content.substring(0, 1500),
      callToAction: {
        actionType: 'CALL',
        url: 'tel:+61435900709',
      },
      topicType: 'STANDARD',
    };

    // Add media if image exists
    if (post.image_url) {
      localPost.media = [
        {
          mediaFormat: 'PHOTO',
          sourceUrl: post.image_url,
        },
      ];
    }

    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localPost),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GBP API error: ${error}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, post_id: result.name }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('GBP publish error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
