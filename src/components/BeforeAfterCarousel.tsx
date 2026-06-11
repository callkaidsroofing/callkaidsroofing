import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

/**
 * Before/after job documentation carousel.
 * To add real photos: populate the JOBS array below with your actual job images.
 * Images must be in public/lovable-uploads/ and referenced as /lovable-uploads/<filename>
 */
const JOBS: Array<{
  before: string;
  after: string;
  suburb: string;
  work: string;
}> = [
  // Uncomment and fill in once real paired photos are confirmed:
  // {
  //   before: '/lovable-uploads/BEFORE_PHOTO_UUID.png',
  //   after: '/lovable-uploads/AFTER_PHOTO_UUID.png',
  //   suburb: 'Clyde North',
  //   work: 'Full roof restoration — repoint, clean, prime and coat',
  // },
];

export const BeforeAfterCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Placeholder shown until real photos are added
  if (JOBS.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-2xl border border-border bg-card px-8 py-12 text-center">
        <Camera className="h-10 w-10 text-muted-foreground/40" />
        <div>
          <p className="font-semibold text-foreground">Job photos coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Every completed job is documented before, during, and after.
            Real site photos will appear here once confirmed.
          </p>
        </div>
      </div>
    );
  }

  const job = JOBS[current];

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Before / after image grid */}
      <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={job.before}
            alt={`Before — ${job.work}`}
            className="h-full w-full object-cover"
            loading={current === 0 ? 'eager' : 'lazy'}
          />
          <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
            BEFORE
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={job.after}
            alt={`After — ${job.work}`}
            className="h-full w-full object-cover"
            loading={current === 0 ? 'eager' : 'lazy'}
          />
          <span className="absolute right-3 top-3 rounded-md bg-sky-600/90 px-2.5 py-1 text-xs font-bold text-white">
            AFTER
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium">{job.work}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">📍 {job.suburb}</p>
      </div>

      {/* Navigation */}
      {JOBS.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + JOBS.length) % JOBS.length)}
            className="absolute left-2 top-1/3 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md hover:bg-background"
            aria-label="Previous job"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % JOBS.length)}
            className="absolute right-2 top-1/3 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md hover:bg-background"
            aria-label="Next job"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="mt-3 flex justify-center gap-1.5">
            {JOBS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-6 bg-sky-500' : 'w-1.5 bg-muted-foreground/30'
                }`}
                aria-label={`Go to job ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
