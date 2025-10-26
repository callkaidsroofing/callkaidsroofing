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
    const clientId = Deno.env.get('GOOGLE_MY_BUSINESS_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_MY_BUSINESS_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GOOGLE_MY_BUSINESS_REFRESH_TOKEN');
    const accountId = Deno.env.get('GOOGLE_MY_BUSINESS_ACCOUNT_ID');

    if (!clientId || !clientSecret || !refreshToken || !accountId) {
      throw new Error('Missing Google Business Profile credentials. Please add all secrets first.');
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

    // List all locations for the account using the newer API
    const locationsResponse = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title,storefrontAddress,phoneNumbers,websiteUri`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!locationsResponse.ok) {
      const error = await locationsResponse.text();
      throw new Error(`Failed to fetch locations: ${error}`);
    }

    const locationsData = await locationsResponse.json();

    // Format the response with helpful information
    const locations = locationsData.locations || [];
    const formattedLocations = locations.map((loc: any) => ({
      name: loc.title || 'N/A',
      address: loc.storefrontAddress ? 
        `${loc.storefrontAddress.addressLines?.join(', ') || ''}, ${loc.storefrontAddress.locality || ''}, ${loc.storefrontAddress.administrativeArea || ''} ${loc.storefrontAddress.postalCode || ''}`.trim() : 'N/A',
      locationId: loc.name.split('/').pop(), // Extract just the ID
      fullPath: loc.name,
      phoneNumber: loc.phoneNumbers?.primaryPhone || 'N/A',
      websiteUrl: loc.websiteUri || 'N/A'
    }));

    return new Response(
      JSON.stringify({
        success: true,
        count: formattedLocations.length,
        locations: formattedLocations,
        instructions: formattedLocations.length > 0
          ? `Copy the 'locationId' value from your desired location and add it to your Supabase secrets as GOOGLE_MY_BUSINESS_LOCATION_ID`
          : 'No locations found for this account. Make sure your Google Business Profile is set up.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching location ID:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        instructions: 'Check the error message above and verify your credentials are correct.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
