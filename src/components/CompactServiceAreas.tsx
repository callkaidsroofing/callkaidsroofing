import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CompactServiceAreas = () => {
  const [isOpen, setIsOpen] = useState(false);

  const serviceAreas = {
    "My Patch (Close to Home)": [
      "Clyde North - My home base, know every street",
      "Berwick - 10 minutes away, do heaps of work here", 
      "Officer - Growing fast, lots of new builds needing maintenance",
      "Pakenham - Young families, quality-focused homeowners"
    ],
    "Bayside & Premium Suburbs": [
      "Brighton - Heritage homes, premium materials only",
      "Toorak - High-end restoration, heritage compliance",
      "Kew - Character homes needing specialist care",
      "Canterbury - Established properties, quality expectations"
    ],
    "Renovation Hotspots": [
      "Cranbourne - Australia's #4 renovation suburb",
      "Frankston - Established homes getting makeovers", 
      "Point Cook - #2 renovation hotspot nationally",
      "Narre Warren - Family homes, practical solutions"
    ]
  };

  return (
    <section className="py-12 bg-gradient-to-tr from-secondary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold">Southeast Melbourne Coverage</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            50km radius from Clyde North - if you're close, I'll come have a look
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between text-left h-auto p-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                size="lg"
              >
                <span className="text-lg font-medium">
                  View All Service Areas & Specialties
                </span>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(serviceAreas).map(([category, areas]) => (
                  <Card key={category} className="bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
                      <ul className="space-y-2">
                        {areas.map((area, index) => (
                          <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                            {area}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Not sure if I cover your area? Give me a call - I'm pretty flexible for quality jobs.
                </p>
                <Button asChild>
                  <a href="tel:0435900709">Check My Coverage: 0435 900 709</a>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default CompactServiceAreas;