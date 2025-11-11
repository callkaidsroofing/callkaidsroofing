import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BeforeAfterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['featured-case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading || !caseStudies || caseStudies.length === 0) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  const study = caseStudies[currentSlide];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardContent className="p-0">
          {/* Before/After Images */}
          <div className="grid grid-cols-2 gap-1">
            <div className="relative aspect-[4/3]">
              <img
                src={study.before_image || '/placeholder.svg'}
                alt="Before"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold">
                BEFORE
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <img
                src={study.after_image || '/placeholder.svg'}
                alt="After"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold">
                AFTER
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 md:p-6 space-y-2 md:space-y-4">
            <div>
              <h3 className="font-bold text-base md:text-lg mb-0.5">{study.study_id}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{study.suburb}</p>
            </div>

            {study.testimonial && (
              <div className="bg-primary/5 p-2 md:p-4 rounded-lg border-l-2 md:border-l-4 border-primary">
                <Quote className="h-3 w-3 md:h-4 md:w-4 text-primary mb-1" />
                <p className="text-xs md:text-sm italic line-clamp-2 md:line-clamp-none">"{study.testimonial}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      {caseStudies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg"
            aria-label="Previous case study"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg"
            aria-label="Next case study"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {caseStudies.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {caseStudies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-primary w-8' : 'bg-primary/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
