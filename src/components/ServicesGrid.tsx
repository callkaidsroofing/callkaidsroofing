import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesGrid = () => {
  const services = [
    {
      title: "Roof Restoration",
      description: "Complete overhaul with 10-year warranty",
      features: ["Premium membrane", "Ridge repointing", "Valley iron replacement"],
      href: "/services/roof-restoration",
      badge: "Most Popular"
    },
    {
      title: "Roof Painting", 
      description: "Transform your home's look in 3 days",
      features: ["Energy efficient coatings", "Premium paint systems", "Color consultation"],
      href: "/services/roof-painting"
    },
    {
      title: "Ridge Repointing",
      description: "Secure loose ridge caps with flexible pointing",
      features: ["Flexible bedding compound", "Weather resistant", "10-year warranty"],
      href: "/services/roof-repointing"
    },
    {
      title: "Valley Iron Replacement",
      description: "Stop valley leaks with new Colorbond valley iron",
      features: ["Colorbond valley iron", "Proper fall installation", "Leak guarantee"],
      href: "/services/valley-iron-replacement"
    },
    {
      title: "Gutter Cleaning",
      description: "Complete gutter clean and safety inspection",
      features: ["Debris removal", "Downpipe flushing", "Safety inspection"],
      href: "/services/gutter-cleaning"
    },
    {
      title: "Leak Detection",
      description: "Find and fix leaks with thermal imaging",
      features: ["Thermal imaging", "Detailed leak report", "Permanent repairs"],
      href: "/services/leak-detection"
    },
    {
      title: "Roof Repairs",
      description: "Emergency and planned roof repairs",
      features: ["Same-day response", "Insurance claims", "Storm damage"],
      href: "/services/roof-repairs",
      badge: "Emergency"
    },
    {
      title: "Reroofing",
      description: "Complete roof replacement with new tiles",
      features: ["New roof tiles", "Sarking replacement", "Full structural check"],
      href: "/services/roof-restoration"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-max mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Complete Roofing Services</h2>
          <p className="text-xl text-muted-foreground text-column mx-auto">
            From minor repairs to complete restoration, we handle all your roofing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border">
              <div className="space-y-4">
                {service.badge && (
                  <Badge 
                    className={`${
                      service.badge === 'Emergency' ? 'bg-red-100 text-red-700' :
                      service.badge === 'Most Popular' ? 'primary-gradient text-white' :
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {service.badge}
                  </Badge>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                </div>

                <ul className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Link to={service.href}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;