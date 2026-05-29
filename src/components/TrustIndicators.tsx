import { Shield, Award, MapPin, Clock } from 'lucide-react';
import { BUSINESS, getPublicWarrantySummary } from '@/config/business';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: "10-Year Workmanship",
      description: getPublicWarrantySummary()
    },
    {
      icon: MapPin,
      title: `${BUSINESS.location.hqSuburb} Based`,
      description: `${BUSINESS.location.serviceRadiusKm}km service radius across ${BUSINESS.location.region}`
    },
    {
      icon: Award,
      title: "Premium Materials Only",
      description: "Industry-leading products designed for Melbourne"
    },
    {
      icon: Clock,
      title: "High Demand Service",
      description: "Book early - usually 2-3 weeks out"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <p className="font-semibold text-lg">{indicator.title}</p>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
