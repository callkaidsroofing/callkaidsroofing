import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Quote, Loader2 } from 'lucide-react';
import { useFeaturedCaseStudy, CaseStudy } from '@/hooks/use-case-studies';

interface FeaturedCaseStudyProps {
  caseStudy?: CaseStudy | null; // Optional: defaults to fetching from database
}

export function FeaturedCaseStudy({ caseStudy: propCaseStudy }: FeaturedCaseStudyProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBefore, setShowBefore] = useState(true);

  // Fetch from database if no prop provided
  const { data: dbCaseStudy, isLoading, error } = useFeaturedCaseStudy();
  const caseStudy = propCaseStudy ?? dbCaseStudy;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20 text-white/70">
        <p>Unable to load case study. Please try again later.</p>
      </div>
    );
  }

  // No case study found
  if (!caseStudy || !caseStudy.images || caseStudy.images.length === 0) {
    return (
      <div className="text-center py-20 text-white/70">
        <p>No featured case study available yet.</p>
        <p className="text-sm mt-2">Check back soon for real project stories!</p>
      </div>
    );
  }

  const currentImage = caseStudy.images[selectedImage];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left: Before/After Image Viewer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {caseStudy.title}
            </h3>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{caseStudy.location}</span>
              <span className="text-white/60">•</span>
              <span className="text-sm">{caseStudy.service}</span>
            </div>
          </div>
        </div>

        {/* Main Image Display */}
        <div className="relative bg-secondary rounded-xl overflow-hidden aspect-[4/3]">
          <img
            src={showBefore ? currentImage.before : currentImage.after}
            alt={currentImage.alt}
            className="w-full h-full object-cover"
          />

          {/* Before/After Toggle Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="primary" className="text-sm font-bold shadow-lg">
              {showBefore ? 'BEFORE' : 'AFTER'}
            </Badge>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setShowBefore(!showBefore)}
            className="absolute inset-0 bg-transparent hover:bg-white/5 transition-colors cursor-pointer group"
            aria-label={`Show ${showBefore ? 'after' : 'before'} image`}
          >
            <div className="absolute bottom-4 right-4 bg-white text-foreground px-4 py-2 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              Click to see {showBefore ? 'AFTER' : 'BEFORE'}
            </div>
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-5 gap-2">
          {caseStudy.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-primary scale-105'
                  : 'border-white/20 hover:border-white/40 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={showBefore ? image.before : image.after}
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed">
          {caseStudy.description}
        </p>
      </div>

      {/* Right: Customer Review */}
      <div className="lg:sticky lg:top-24">
        <Card className="bg-white border-2 border-border">
          <CardContent className="p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-bold text-foreground text-lg">
                  {caseStudy.customerReview.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {caseStudy.customerReview.platform} Review • {caseStudy.customerReview.date}
                </p>
              </div>
              <Quote className="h-8 w-8 text-primary/20" />
            </div>

            {/* Review Text */}
            <blockquote className="text-foreground leading-relaxed mb-6">
              "{caseStudy.customerReview.text}"
            </blockquote>

            {/* Review Screenshot */}
            <div className="border border-border rounded-lg overflow-hidden">
              <img
                src={caseStudy.customerReview.image}
                alt={`${caseStudy.customerReview.platform} review from ${caseStudy.customerReview.customerName}`}
                className="w-full h-auto"
              />
            </div>

            {/* Proof Badge */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Verified customer • Real project photos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
