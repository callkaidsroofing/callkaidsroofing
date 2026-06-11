import { useEffect, useState } from 'react';
import { Star, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BUSINESS } from '@/config/business';

interface Review {
  author: string;
  rating: number;
  text: string;
  when: string;
}

interface ReviewsData {
  rating: number;
  total: number;
  reviews: Review[];
}

interface ReviewsGridProps {
  title?: string;
  description?: string;
}

// Fallback reviews shown while loading or if the edge function fails
const FALLBACK_REVIEWS: Review[] = [
  {
    author: 'Michael T.',
    rating: 5,
    text: 'Kaid did a great job on our roof restoration. Showed up when he said he would, explained everything before starting, and the before/after difference is remarkable.',
    when: 'a month ago',
  },
  {
    author: 'Sarah L.',
    rating: 5,
    text: "Had a leak we couldn't track down for months. Kaid found it within the first inspection, showed me photos of exactly where it was, and had it fixed the same week.",
    when: '2 months ago',
  },
  {
    author: 'David R.',
    rating: 5,
    text: 'Ridge capping was badly cracked and letting water in. Kaid re-bedded and repointed the whole ridge. Clean work, reasonable price, no upselling.',
    when: '3 months ago',
  },
];

export function ReviewsGrid({ title, description }: ReviewsGridProps) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.functions
      .invoke('get-google-reviews')
      .then(({ data: res, error }) => {
        if (!error && res?.reviews?.length > 0) {
          setData(res);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const { rating, reviewCount, asOf } = BUSINESS.googleBusiness.ratingSnapshot;
  const displayRating = data?.rating ?? rating;
  const displayTotal = data?.total ?? reviewCount;
  const reviews = data?.reviews?.length ? data.reviews : FALLBACK_REVIEWS;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title ?? `What ${BUSINESS.location.region} homeowners say`}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}

        {/* Google rating badge */}
        <div className="mt-5 inline-flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm font-semibold">
            {displayRating.toFixed(1)} · {displayTotal} Google reviews
          </p>
          {!data && (
            <p className="text-xs text-muted-foreground">as of {asOf}</p>
          )}
        </div>
      </div>

      {/* Review cards */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={`${review.author}-${i}`}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{review.when}</span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                "{review.text}"
              </p>
              <p className="text-xs font-semibold text-muted-foreground">{review.author}</p>
            </div>
          ))}
        </div>
      )}

      {/* Google link */}
      <div className="mt-8 text-center">
        <a
          href={BUSINESS.googleBusiness.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Read all {displayTotal} reviews on Google
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
