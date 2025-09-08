import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface ServiceCardProps {
  title: string;
  description: string;
  benefits: string[];
  perfectFor: string;
  href: string;
  image?: string;
  isEmergency?: boolean;
}

const ServiceCard = ({ 
  title, 
  description, 
  benefits, 
  perfectFor, 
  href, 
  image,
  isEmergency = false 
}: ServiceCardProps) => {
  return (
    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <OptimizedImage
            src={image}
            alt={`${title} - Professional roofing service in Melbourne`}
            className="group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={225}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {title}
          {isEmergency && (
            <span className="text-xs bg-roofing-emergency text-white px-2 py-1 rounded font-normal">
              24/7
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Benefits */}
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">What you get:</h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Perfect For */}
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Perfect for:</h4>
          <p className="text-sm text-muted-foreground">{perfectFor}</p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Button 
            asChild 
            variant={isEmergency ? "emergency" : "default"}
            className="w-full group"
          >
            <Link to={href}>
              {isEmergency ? "Call Now" : `Learn More About ${title}`}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;