import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';

interface BeforeAfterItem {
  before: string;
  after: string;
  caption: string;
  location: string;
}

export const BeforeAfterLightbox = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const beforeAfterItems: BeforeAfterItem[] = [
    {
      before: "/lovable-uploads/project-before-1.jpg",
      after: "/lovable-uploads/project-after-1.jpg", 
      caption: "Complete roof restoration with ridge repointing",
      location: "Berwick"
    },
    {
      before: "/lovable-uploads/project-before-3.jpg",
      after: "/lovable-uploads/project-after-2.jpg",
      caption: "Roof painting and gutter replacement", 
      location: "Cranbourne"
    },
    {
      before: "/lovable-uploads/project-before-valley.jpg",
      after: "/lovable-uploads/project-sunset-complete.jpg",
      caption: "Valley iron replacement and full restoration",
      location: "Clyde North"
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % beforeAfterItems.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? beforeAfterItems.length - 1 : selectedIndex - 1);
    }
  };

  return (
    <>
      <section className="section-padding bg-muted/10">
        <div className="container-max mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Before & After Gallery</h2>
            <p className="text-xl text-muted-foreground text-column mx-auto">
              See the dramatic transformations we deliver across Southeast Melbourne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beforeAfterItems.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {/* Before Image */}
                  <div className="space-y-2">
                    <div 
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(index)}
                    >
                      <OptimizedImage
                        src={item.before}
                        alt={`Before: ${item.caption} - ${item.location}`}
                        className="w-full h-full object-cover"
                        width={300}
                        height={225}
                      />
                    </div>
                    <div className="text-center text-sm font-semibold text-muted-foreground">Before</div>
                  </div>

                  {/* After Image */}
                  <div className="space-y-2">
                    <div 
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(index)}
                    >
                      <OptimizedImage
                        src={item.after}
                        alt={`After: ${item.caption} - ${item.location}`}
                        className="w-full h-full object-cover"
                        width={300}
                        height={225}
                      />
                    </div>
                    <div className="text-center text-sm font-semibold text-primary">After</div>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="font-semibold">{item.caption}</div>
                  <div className="text-sm text-muted-foreground">{item.location}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost" 
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="sm" 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image Content */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Before Image */}
                <div className="relative">
                  <OptimizedImage
                    src={beforeAfterItems[selectedIndex].before}
                    alt={`Before: ${beforeAfterItems[selectedIndex].caption}`}
                    className="w-full aspect-[4/3] object-cover"
                    width={600}
                    height={450}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    Before
                  </div>
                </div>

                {/* After Image */}
                <div className="relative">
                  <OptimizedImage
                    src={beforeAfterItems[selectedIndex].after}
                    alt={`After: ${beforeAfterItems[selectedIndex].caption}`}
                    className="w-full aspect-[4/3] object-cover"
                    width={600}
                    height={450}
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-semibold">
                    After
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{beforeAfterItems[selectedIndex].caption}</h3>
                <p className="text-muted-foreground">{beforeAfterItems[selectedIndex].location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeforeAfterLightbox;