import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beforeImage1 from '@/assets/before-1.jpg';
import beforeImage2 from '@/assets/before-2.jpg';
import beforeImage3 from '@/assets/before-3.jpg';
import beforeImage4 from '@/assets/before-4.jpg';
import beforeImage5 from '@/assets/before-5.jpg';
import afterImage1 from '@/assets/after-1.jpg';
import afterImage2 from '@/assets/after-2.jpg';
import afterImage3 from '@/assets/after-3.jpg';
import afterImage4 from '@/assets/after-4.jpg';
import afterImage5 from '@/assets/after-5.jpg';

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
      title: "Before: Weathered & Worn",
      description: "Tired old roof desperately needing attention - faded tiles and damaged surfaces",
      type: "before-after"
    },
    {
      src: afterImage1,
      title: "After: Complete Transformation",
      description: "Stunning restoration bringing this home back to life with premium finishes",
      type: "completed"
    },
    {
      src: beforeImage2,
      title: "Before: Moss & Lichen Damage",
      description: "Biological growth destroying the roof surface - classic Melbourne weather damage",
      type: "before-after"
    },
    {
      src: afterImage2,
      title: "After: Like Brand New",
      description: "Professional restoration with protective coating - will look this good for years",
      type: "completed"
    },
    {
      src: beforeImage3,
      title: "Before: Faded & Deteriorating",
      description: "Sun damage and weather taking its toll on this once-beautiful roof",
      type: "before-after"
    },
    {
      src: afterImage3,
      title: "After: Premium Finish",
      description: "High-end restoration work that adds serious value and curb appeal",
      type: "completed"
    },
    {
      src: beforeImage4,
      title: "Before: Water Damage Evident",
      description: "Multiple issues causing ongoing problems - needed complete overhaul",
      type: "before-after"
    },
    {
      src: afterImage4,
      title: "After: Perfect Protection",
      description: "Superior materials and workmanship ensuring long-lasting results",
      type: "completed"
    },
    {
      src: beforeImage5,
      title: "Before: Neglected & Failing",
      description: "Years of neglect finally catching up - time for professional intervention",
      type: "before-after"
    },
    {
      src: afterImage5,
      title: "After: Exceptional Results",
      description: "Outstanding transformation showcasing the quality that sets Call Kaids apart",
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