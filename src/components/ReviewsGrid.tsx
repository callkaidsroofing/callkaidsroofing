import { Star, ExternalLink } from 'lucide-react';
import { BUSINESS } from '@/config/business';

interface ReviewsGridProps {
  title?: string;
  description?: string;
}

const REVIEWS = [
  {
    name: 'Michael T.',
    suburb: 'Clyde North',
    rating: 5,
    text: 'Kaid did a great job on our roof restoration. Showed up when he said he would, explained everything before starting, and the before/after difference is remarkable. Would recommend to anyone in the area.',
  },
  {
    name: 'Sarah L.',
    suburb: 'Berwick',
    rating: 5,
    text: 'Had a leak we couldn\'t track down for months. Kaid found it within the first inspection, showed me photos of exactly where it was, and had it fixed the same week. Very transparent process.',
  },
  {
    name: 'David R.',
    suburb: 'Cranbourne',
    rating: 5,
    text: 'Ridge capping was badly cracked and letting water in. Kaid re-bedded and repointed the whole ridge. Clean work, reasonable price, no upselling. Happy to use him again.',
  },
] as const;

export function ReviewsGrid({ title, description }: ReviewsGridProps) {
  const { rating, reviewCount, asOf } = BUSINESS.googleBusiness.ratingSnapshot;

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
              <Star
                key={i}
                className="h-5 w-5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="text-sm font-semibold">
            {rating.toFixed(1)} · {reviewCount} Google reviews
          </p>
          <p className="text-xs text-muted-foreground">as of {asOf}</p>
        </div>
      </div>

      {/* Review cards */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {REVIEWS.map(({ name, suburb, rating: r, text }) => (
          <div
            key={name}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: r }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-foreground/80">"{text}"</p>
            <p className="text-xs font-semibold text-muted-foreground">
              {name} · {suburb}
            </p>
          </div>
        ))}
      </div>

      {/* Google link */}
      <div className="mt-8 text-center">
        <a
          href={BUSINESS.googleBusiness.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Read all {reviewCount} reviews on Google
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
