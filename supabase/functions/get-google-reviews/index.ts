import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Cache duration: 1 hour (reviews don't change that often)
const CACHE_SECONDS = 3600;
const cache = new Map<string, { data: unknown; expires: number }>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    const placeId = Deno.env.get("GOOGLE_PLACE_ID");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_MAPS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!placeId) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_PLACE_ID not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Serve from cache if fresh
    const cached = cache.get(placeId);
    if (cached && Date.now() < cached.expires) {
      return new Response(
        JSON.stringify(cached.data),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
            "X-Cache": "HIT",
          },
        }
      );
    }

    // Fetch from Google Places API
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.status !== "OK") {
      throw new Error(`Google Places API status: ${json.status}`);
    }

    const result = json.result;

    const payload = {
      name: result.name,
      rating: result.rating,
      total: result.user_ratings_total,
      reviews: (result.reviews ?? [])
        .filter((r: { rating: number }) => r.rating >= 4)
        .slice(0, 5)
        .map((r: {
          author_name: string;
          rating: number;
          text: string;
          relative_time_description: string;
        }) => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          when: r.relative_time_description,
        })),
      fetched_at: new Date().toISOString(),
    };

    // Store in memory cache
    cache.set(placeId, { data: payload, expires: Date.now() + CACHE_SECONDS * 1000 });

    return new Response(JSON.stringify(payload), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("get-google-reviews error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
