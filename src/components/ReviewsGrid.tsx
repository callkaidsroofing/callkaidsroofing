import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { CustomerReview } from '@/data/case-studies';

interface ReviewsGridProps {
  reviews: CustomerReview[];
  title?: string;
  description?: string;
}

export function ReviewsGrid({ reviews, title, description }: ReviewsGridProps) {
  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white border-2 border-border hover:border-primary transition-all group">
            <CardContent className="p-4">
              {/* Review Screenshot */}
              <div className="mb-3 border border-border rounded-lg overflow-hidden">
                <img
                  src={review.image}
                  alt={`${review.platform} review from ${review.customerName}`}
                  className="w-full h-auto"
                />
              </div>

              {/* Review Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-bold text-foreground text-sm">
                  {review.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {review.platform} • {review.date}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Signal */}
      <div className="text-center">
        <p className="text-white/90 text-sm">
          <span className="font-semibold">Real reviews from real customers</span> • Verified on Google & Facebook
        </p>
      </div>
    </div>
  );
}
