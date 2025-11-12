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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch Google Business Profile data
    const gbpData = await fetchGoogleBusinessData();
    
    // Fetch Facebook data
    const fbData = await fetchFacebookData();

    // Upsert Google data
    if (gbpData) {
      await supabase
        .from('business_profile_data')
        .upsert({
          source: 'google',
          rating: gbpData.rating,
          review_count: gbpData.reviewCount,
          operating_hours: gbpData.operatingHours,
          phone: gbpData.phone,
          address: gbpData.address,
          website: gbpData.website,
          raw_data: gbpData.raw,
          last_synced_at: new Date().toISOString()
        }, { onConflict: 'source' });
    }

    // Upsert Facebook data
    if (fbData) {
      await supabase
        .from('business_profile_data')
        .upsert({
          source: 'facebook',
          rating: fbData.rating,
          review_count: fbData.reviewCount,
          raw_data: fbData.raw,
          last_synced_at: new Date().toISOString()
        }, { onConflict: 'source' });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        google: gbpData ? 'synced' : 'failed',
        facebook: fbData ? 'synced' : 'failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function fetchGoogleBusinessData() {
  try {
    const accountId = Deno.env.get('GOOGLE_BUSINESS_ACCOUNT_ID');
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN');

    if (!accountId || !clientId || !clientSecret || !refreshToken) {
      console.log('Missing Google credentials');
      return null;
    }

    // Refresh access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch locations
    const locationsResponse = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const locationsData = await locationsResponse.json();
    const location = locationsData.locations?.[0];

    if (!location) return null;

    // Extract data
    return {
      rating: location.metadata?.averageRating || null,
      reviewCount: location.metadata?.newReviewCount || null,
      operatingHours: location.regularHours || null,
      phone: location.primaryPhone || '0435 900 709',
      address: location.address?.addressLines?.join(', ') || '8 Springleaf Ave, Clyde North, Victoria 3978',
      website: location.websiteUrl || 'https://callkaidsroofing.com.au',
      raw: location
    };

  } catch (error) {
    console.error('Google Business fetch error:', error);
    return null;
  }
}

async function fetchFacebookData() {
  try {
    const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

    if (!pageAccessToken || !pageId) {
      console.log('Missing Facebook credentials');
      return null;
    }

    // Fetch page data with ratings
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=overall_star_rating,rating_count&access_token=${pageAccessToken}`
    );

    const data = await response.json();

    return {
      rating: data.overall_star_rating || null,
      reviewCount: data.rating_count || null,
      raw: data
    };

  } catch (error) {
    console.error('Facebook fetch error:', error);
    return null;
  }
}
