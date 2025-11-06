import { Badge } from '@/components/ui/badge';
import { Wrench, Shield, Zap, Star, CheckCircle, ArrowRight } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

interface ServiceSectionProps {
  services: Array<{
    title: string;
    description: string;
    benefits: string[];
    perfectFor: string;
    href: string;
    isEmergency?: boolean;
  }>;
}

export const EnhancedServiceSection = ({ services }: ServiceSectionProps) => {
  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-roofing-blue/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="glass-effect border-primary/30 text-primary font-semibold px-6 py-2">
              <Wrench className="h-4 w-4 mr-2" />
              Premium Roofing Services
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            What I Do Best
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three main services that repair problems permanently and add real value to your home
          </p>

          {/* Service quality indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Shield className="h-4 w-4" />
              15-Year Warranty
            </div>
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Star className="h-4 w-4 fill-current" />
              Premium Materials
            </div>
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Zap className="h-4 w-4" />
              Same-Day Quotes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="floating-animation" style={{ animationDelay: `${index * 0.2}s` }}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};