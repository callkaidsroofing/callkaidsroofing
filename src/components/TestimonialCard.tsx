import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

const TestimonialCard = ({ quote, author, location }: TestimonialCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 space-y-4">
        <Quote className="h-8 w-8 text-primary/20" />
        <blockquote className="text-muted-foreground leading-relaxed">
          "{quote}"
        </blockquote>
        <footer className="border-t pt-4">
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{location}</div>
        </footer>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;