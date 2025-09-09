import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Shield, Droplets, Sun, Clock } from 'lucide-react';

const MaterialsBrands = () => {
  const materials = [
    {
      name: "Premcoat",
      type: "Premium Roof Paint",
      icon: <Sun className="h-6 w-6 text-primary" />,
      benefits: ["15+ year lifespan", "UV resistant coating", "Heat reflective properties"],
      description: "Professional-grade roof paint specifically designed for Australian conditions"
    },
    {
      name: "SupaPoint",
      type: "Flexible Pointing Compound",
      icon: <Shield className="h-6 w-6 text-primary" />,
      benefits: ["Flexible formula", "Weather resistant", "10-year warranty"],
      description: "Premium pointing compound that moves with your roof, preventing cracks"
    },
    {
      name: "Stormseal",
      type: "Emergency Protection",
      icon: <Droplets className="h-6 w-6 text-primary" />,
      benefits: ["Instant waterproofing", "Self-adhering membrane", "Storm damage protection"],
      description: "Advanced temporary protection system for emergency leak repairs"
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
            Your roof is too important for cheap alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {materials.map((material, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  {material.icon}
                </div>
                
                <Badge variant="outline" className="mb-3">
                  {material.type}
                </Badge>
                
                <h3 className="text-xl font-bold mb-3">{material.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {material.description}
                </p>
                
                <ul className="space-y-2">
                  {material.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="text-sm text-primary font-medium">
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