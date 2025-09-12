import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const BeforeAfterSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [
    {
      id: 1,
      before: "/lovable-uploads/b583ddb3-be15-4d62-b3fe-1d5a4ed4cd2a.png",
      after: "/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png",
      suburb: "Bunyip",
      service: "Ridge Restoration & Cleaning",
      description: "Complete ridge capping restoration removing lichen buildup and professional repointing"
    },
    {
      id: 2,
      before: "/lovable-uploads/c4aaa0a0-d013-40e5-9aee-d7c62349f16c.png",
      after: "/lovable-uploads/e613c84a-7f19-4752-a2cb-836de3466396.png",
      suburb: "Clyde North",
      service: "Professional Repointing & Maintenance",
      description: "Weathered pointing restored with premium flexible compound for long-lasting protection"
    },
    {
      id: 3,
      before: "/lovable-uploads/783444da-c25e-4910-89e1-1908a6296118.png",
      after: "/lovable-uploads/7c4b0aaa-18ed-4b8a-80f2-904dc4868236.png",
      suburb: "Berwick",
      service: "Complete Roof Restoration with Guttering",
      description: "Full transformation including gutter replacement, cleaning, and comprehensive restoration"
    },
    {
      id: 4,
      before: "/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png",
      after: "/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png",
      suburb: "Officer",
      service: "Emergency Valley Iron Replacement",
      description: "Critical valley damage repaired with new iron and comprehensive sealing system"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real Results from Real Customers</h2>
          <p className="text-xl text-muted-foreground">
            See the transformation. Every job documented with before and after photos.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Before Image */}
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 bg-destructive text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BEFORE
                  </div>
                  <OptimizedImage
                    src={projects[currentSlide].before}
                    alt={`Before roof restoration in ${projects[currentSlide].suburb}`}
                    className="w-full h-64 lg:h-96 object-cover"
                    width={600}
                    height={400}
                  />
                </div>

                {/* After Image */}
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    AFTER
                  </div>
                  <OptimizedImage
                    src={projects[currentSlide].after}
                    alt={`After roof restoration in ${projects[currentSlide].suburb}`}
                    className="w-full h-64 lg:h-96 object-cover"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{projects[currentSlide].suburb}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{projects[currentSlide].service}</h3>
                <p className="text-muted-foreground">{projects[currentSlide].description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;