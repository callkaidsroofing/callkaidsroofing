import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import TestimonialCard from '@/components/TestimonialCard';

const CompactTestimonials = () => {
  const [isOpen, setIsOpen] = useState(false);

  const testimonials = [
    {
      quote: "Kaidyn's a straight shooter. Told me exactly what needed doing, did it properly, cleaned up after himself. Roof looks brand new and hasn't leaked since. Worth every dollar.",
      author: "Dave M.",
      location: "Clyde North"
    },
    {
      quote: "Had three quotes—Kaidyn wasn't the cheapest but he was the most honest. Explained everything, showed up when he said he would, and the work's still perfect two years later.",
      author: "Sarah K.", 
      location: "Berwick"
    },
    {
      quote: "Emergency call on a Sunday night after a storm. Kaidyn picked up, came out first thing Monday, had it fixed by lunch. That's service.",
      author: "Mike T.",
      location: "Frankston"
    },
    {
      quote: "Best roof restoration in Southeast Melbourne. The team's experience really shows - they knew exactly what my old tiles needed.",
      author: "Jenny L.",
      location: "Officer"
    },
    {
      quote: "15-year warranty gives you confidence. Two years in and the roof still looks like the day they finished. Quality work.",
      author: "Tom R.",
      location: "Cranbourne"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-secondary/20 to-primary/15">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Customer Reviews</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Quality spreads by word of mouth - that's why I'm booked solid
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Show first testimonial always */}
          <div className="mb-6">
            <TestimonialCard {...testimonials[0]} />
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between text-left h-auto p-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                size="lg"
              >
                <span className="text-lg font-medium flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Read More Customer Stories ({testimonials.length - 1} more)
                </span>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.slice(1).map((testimonial, index) => (
                  <TestimonialCard key={index + 1} {...testimonial} />
                ))}
              </div>
              
              <div className="text-center bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Ready to Join Our Happy Customers?</h3>
                <p className="text-muted-foreground mb-4">
                  Get your free inspection and honest advice - no pressure, just facts
                </p>
                <Button asChild size="lg">
                  <a href="tel:0435900709">Call Kaidyn: 0435 900 709</a>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default CompactTestimonials;