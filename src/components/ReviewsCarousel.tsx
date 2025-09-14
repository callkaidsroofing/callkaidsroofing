import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Review {
  name: string;
  location: string;
  rating: number;
  review: string;
  service: string;
  date: string;
}

export const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews: Review[] = [
    {
      name: "Sarah M.",
      location: "Berwick",
      rating: 5,
      review: "Kaidyn restored our 20-year-old roof and it looks brand new. Excellent workmanship and he cleaned up perfectly after himself.",
      service: "Roof Restoration",
      date: "2 weeks ago"
    },
    {
      name: "David T.", 
      location: "Cranbourne",
      rating: 5,
      review: "Had emergency repairs after storm damage. Same-day response and permanent fix. Very professional and fairly priced.",
      service: "Emergency Repairs",
      date: "1 month ago"
    },
    {
      name: "Lisa K.",
      location: "Clyde North", 
      rating: 5,
      review: "Roof painting transformed our home's appearance. Quality paint job that's held up beautifully through winter weather.",
      service: "Roof Painting",
      date: "3 months ago"
    },
    {
      name: "Michael R.",
      location: "Pakenham",
      rating: 5,
      review: "Professional valley iron replacement stopped persistent leaks. Great communication throughout the project.",
      service: "Valley Iron Replacement", 
      date: "2 months ago"
    },
    {
      name: "Jennifer L.",
      location: "Narre Warren",
      rating: 5,
      review: "Ridge repointing job was completed exactly as quoted. Honest tradesman who stands behind his work.",
      service: "Ridge Repointing",
      date: "6 weeks ago"
    },
    {
      name: "Robert S.",
      location: "Officer",
      rating: 5,
      review: "Gutter cleaning and roof inspection revealed issues I didn't know existed. Saved me from expensive water damage.",
      service: "Gutter Cleaning",
      date: "1 week ago"
    }
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  return (
    <section className="section-padding card-gradient">
      <div className="container-max mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <Badge className="primary-gradient text-white px-4 py-2 text-lg font-semibold">
              4.9/5 Rating
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground text-column mx-auto">
            Real reviews from real customers across Southeast Melbourne.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg"
            onClick={prevReview}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg"
            onClick={nextReview}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getVisibleReviews().map((review, index) => (
              <div 
                key={`${review.name}-${index}`}
                className="bg-white rounded-2xl p-6 shadow-md border transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{review.location}</div>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground leading-relaxed">
                    "{review.review}"
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {review.service}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {review.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 pt-8 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10</div>
            <div className="text-sm text-muted-foreground">Year Warranty</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">50km</div>
            <div className="text-sm text-muted-foreground">Service Radius</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;