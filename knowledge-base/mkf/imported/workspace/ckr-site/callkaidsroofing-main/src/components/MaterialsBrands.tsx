import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Shield, Droplets, Sun, Clock } from 'lucide-react';

const MaterialsBrands = () => {
  const materials = [
    {
      name: "PREMCOAT",
      type: "100% Acrylic Roof Coating",
      image: "/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png",
      benefits: ["Suitable for potable water collection", "UV resistant for Colorbond & concrete tiles", "10-year warranty protection"],
      description: "Professional-grade acrylic coating designed specifically for Australian roofing conditions"
    },
    {
      name: "SUPA POINT",
      type: "Flexible Pointing Compound", 
      image: "/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png",
      benefits: ["No cracking formula", "Fade resistant", "Rain tolerant after 90 minutes"],
      description: "Premium flexible compound that moves with your roof, preventing cracks and failures"
    },
    {
      name: "STORMSEAL",
      type: "Emergency Protection System",
      image: "/lovable-uploads/99c2917f-b2e3-44ab-ba7d-79754ca91997.png",
      benefits: ["Seals roof valleys instantly", "Bitumen-impregnated foam", "7-year warranty coverage"],
      description: "Advanced emergency protection system for critical roof valley repairs and leak sealing"
    },
    {
      name: "PREMLER COLORS",
      type: "Professional Color Selection",
      image: "/lovable-uploads/d7578754-e51e-45b9-856d-af0355b87417.png",
      benefits: ["Wide range of colors", "Professional consultation", "Perfect color matching"],
      description: "Comprehensive color chart for perfect roof restoration and painting projects"
    }
  ];

  const features = [
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      text: "Proven longevity in Melbourne conditions"
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      text: "All materials backed by manufacturer warranties"
    },
    {
      icon: <Sun className="h-5 w-5 text-primary" />,
      text: "UV and heat resistant formulations"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Materials Only</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I only use proven materials from trusted Australian suppliers. 
            Your roof is too important for low-cost alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {materials.map((material, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-4 rounded-lg overflow-hidden bg-muted/30">
                  <OptimizedImage
                    src={material.image}
                    alt={`${material.name} - ${material.type}`}
                    className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                    width={300}
                    height={128}
                  />
                </div>
                
                <Badge variant="outline" className="mb-2 text-xs">
                  {material.type}
                </Badge>
                
                <h3 className="text-lg font-bold mb-2">{material.name}</h3>
                <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                  {material.description}
                </p>
                
                <ul className="space-y-1">
                  {material.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="text-xs text-primary font-medium">
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Strip */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-center md:text-left">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialsBrands;