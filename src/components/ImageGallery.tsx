import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beforeImage1 from '@/assets/project-before-1.jpg';
import beforeValley from '@/assets/project-before-valley.jpg';
import beforeImage3 from '@/assets/project-before-3.jpg';
import afterImage1 from '@/assets/project-after-1.jpg';
import afterImage2 from '@/assets/project-after-2.jpg';
import sunsetComplete from '@/assets/project-sunset-complete.jpg';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  type: 'before-after' | 'action' | 'completed';
}

const ImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images: GalleryImage[] = [
    {
      src: beforeImage1,
      title: "Before: Weathered & Faded",
      description: "This roof was letting the house down - faded, weathered, and ready for transformation",
      type: "before-after"
    },
    {
      src: afterImage1,
      title: "After: Like Brand New",
      description: "Complete transformation with premium paint - looks stunning and adds real value",
      type: "completed"
    },
    {
      src: beforeValley,
      title: "Valley Iron Failure",
      description: "Deteriorated valley iron causing leaks and water damage - a common Melbourne problem",
      type: "before-after"
    },
    {
      src: beforeImage3,
      title: "Moss & Lichen Damage",
      description: "Extensive biological growth eating away at the roof surface and causing long-term damage",
      type: "before-after"
    },
    {
      src: afterImage2,
      title: "Professional Restoration",
      description: "Perfect finish with premium materials - this roof will last another 15+ years",
      type: "completed"
    },
    {
      src: sunsetComplete,
      title: "Stunning Results",
      description: "Premium work that transforms your home and adds serious curb appeal",
      type: "completed"
    }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'before-after': return 'bg-orange-500 text-white';
      case 'action': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Real Projects, Real Results</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the incredible transformations we achieve. These are actual Call Kaids projects showing what's possible for your roof.
          </p>
        </div>

        {/* Featured Large Image */}
        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={images[currentImage].src} 
                      alt={images[currentImage].title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className={getTypeColor(images[currentImage].type)}>
                      {images[currentImage].type === 'before-after' && 'Before Photo'}
                      {images[currentImage].type === 'action' && 'In Progress'}
                      {images[currentImage].type === 'completed' && 'Completed Work'}
                    </Badge>
                    <h3 className="text-xl font-bold mt-2">{images[currentImage].title}</h3>
                    <p className="text-sm text-gray-200">{images[currentImage].description}</p>
                  </div>
                  
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl">
              <AspectRatio ratio={16/9}>
                <img 
                  src={images[currentImage].src} 
                  alt={images[currentImage].title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold">{images[currentImage].title}</h3>
                <p className="text-muted-foreground mt-2">{images[currentImage].description}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all ${
                index === currentImage ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <CardContent className="p-2">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover rounded"
                  />
                </AspectRatio>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium truncate">{image.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;