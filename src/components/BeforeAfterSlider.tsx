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
      before: "/lovable-uploads/e1922069-2f8f-4a3e-988e-a8631602ed44.png",
      after: "/lovable-uploads/50cb1bd1-1166-4391-adc1-99c419346880.png",
      suburb: "Clyde North",
      service: "Complete Roof Restoration",
      description: "Full restoration including cleaning, repointing, and premium paint coating"
    },
    {
      id: 2,
      before: "/lovable-uploads/f33cbcfa-005e-435c-a104-9a21d080a343.png",
      after: "/lovable-uploads/884e66b0-35da-491d-b03b-d980d46b3043.png",
      suburb: "Berwick",
      service: "Roof Painting & Repairs",
      description: "Tile replacement, ridge cap repointing, and professional painting"
    },
    {
      id: 3,
      before: "/lovable-uploads/58e47c2d-3b15-4aad-ae68-f09f4d0d421e.png",
      after: "/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png",
      suburb: "Frankston",
      service: "Emergency Leak Repair",
      description: "Valley iron replacement and comprehensive leak sealing"
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