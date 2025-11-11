import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const realProjects = [
  {
    id: 'nov-02-project',
    testimonial: '/images/testimonials/review-instagram-oct24.png',
    before: '/images/projects/before-nov02-1.jpg',
    after: '/images/projects/after-nov02-1.jpg',
    location: 'SE Melbourne',
    description: 'Complete roof restoration with tile replacement and repointing'
  },
  {
    id: 'nov-01-project',
    before: '/images/projects/before-nov01-1.jpg',
    after: '/images/projects/after-nov01-1.jpg',
    location: 'SE Melbourne',
    description: 'Full roof restoration and tile refurbishment'
  },
  {
    id: 'oct-15-project',
    before: '/images/projects/before-oct15-1.jpg',
    after: '/images/projects/after-oct15.jpg',
    location: 'SE Melbourne',
    description: 'Professional roof restoration and protective coating'
  }
];

export const BeforeAfterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % realProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + realProjects.length) % realProjects.length);
  };

  const currentProject = realProjects[currentSlide];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2 border-conversion-cyan/30 shadow-2xl">
        <CardContent className="p-0">
          {/* Testimonial Image - Main Focus */}
          {currentProject.testimonial && (
            <div className="relative w-full bg-gradient-to-br from-secondary/5 to-primary/5 p-4 md:p-6">
              <img
                src={currentProject.testimonial}
                alt="Customer testimonial"
                className="w-full max-w-xl mx-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Before/After Images */}
          <div className="grid grid-cols-2 gap-1">
            <div className="relative aspect-[4/3]">
              <img
                src={currentProject.before}
                alt="Before restoration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold">
                BEFORE
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <img
                src={currentProject.after}
                alt="After restoration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-conversion-cyan/90 text-white px-3 py-1 rounded-md text-sm font-semibold">
                AFTER
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-3 md:p-6 space-y-2 bg-gradient-to-t from-background via-background to-transparent">
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm text-muted-foreground">📍 {currentProject.location}</span>
            </div>
            
            <p className="text-xs md:text-sm text-foreground/80">
              {currentProject.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      {realProjects.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-6 w-6 text-conversion-cyan" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg"
            aria-label="Next project"
          >
            <ChevronRight className="h-6 w-6 text-conversion-cyan" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {realProjects.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {realProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-conversion-cyan w-8' : 'bg-conversion-cyan/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
