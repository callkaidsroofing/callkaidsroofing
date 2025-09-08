import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Real project photos from Call Kaids Roofing
import ridgeCapWork from '/lovable-uploads/783444da-c25e-4910-89e1-1908a6296118.png';
import valleyIronIssues from '/lovable-uploads/e613c84a-7f19-4752-a2cb-836de3466396.png';
import roofMossLichen from '/lovable-uploads/d7578754-e51e-45b9-856d-af0355b87417.png';
import valleyReplacement from '/lovable-uploads/f0e2051b-8a4e-4e5d-9455-bd39026e8715.png';
import weatheredRoof from '/lovable-uploads/e1922069-2f8f-4a3e-988e-a8631602ed44.png';
import metalRoofWork from '/lovable-uploads/58e47c2d-3b15-4aad-ae68-f09f4d0d421e.png';
import ridgeCapDamage from '/lovable-uploads/59ae7b51-3197-43f9-9e4e-3ac96bc90d97.png';
import ridgeCapRemoval from '/lovable-uploads/55096e67-851c-49f1-8a80-3e93c487974a.png';
import gutterEdgeIssues from '/lovable-uploads/324fc2cc-cf1b-4877-801b-846379d88b45.png';
import kaidynWorking from '/lovable-uploads/3a5f460c-0be2-45c5-9c92-e81b3da4f442.png';

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
      src: ridgeCapWork,
      title: "Ridge Capping Restoration",
      description: "Professional ridge capping work in progress - fixing water entry points and securing the roof line",
      type: "action"
    },
    {
      src: valleyIronIssues,
      title: "Valley Iron Deterioration",
      description: "Rusted valley iron causing leaks - this is exactly why regular roof maintenance matters",
      type: "before-after"
    },
    {
      src: roofMossLichen,
      title: "Moss & Lichen Damage",
      description: "Extensive biological growth and weathering - time for professional restoration",
      type: "before-after"
    },
    {
      src: valleyReplacement,
      title: "Valley Iron Replacement",
      description: "New valley iron installation in progress - proper materials make all the difference",
      type: "action"
    },
    {
      src: weatheredRoof,
      title: "Severely Weathered Roof",
      description: "Years of Melbourne weather damage - but nothing we can't restore to like-new condition",
      type: "before-after"
    },
    {
      src: metalRoofWork,
      title: "Metal Roof Extension",
      description: "Quality metal roofing work - perfect weatherproofing for Melbourne conditions",
      type: "action"
    },
    {
      src: ridgeCapDamage,
      title: "Ridge Cap Deterioration",
      description: "Deteriorated ridge capping allowing water penetration - needs immediate attention",
      type: "before-after"
    },
    {
      src: ridgeCapRemoval,
      title: "Ridge Cap Replacement",
      description: "Old ridge capping removal and rebedding work in progress - meticulous attention to detail",
      type: "action"
    },
    {
      src: gutterEdgeIssues,
      title: "Gutter Edge Problems",
      description: "Gutter edge deterioration and debris buildup - part of comprehensive roof maintenance",
      type: "before-after"
    },
    {
      src: kaidynWorking,
      title: "Kaidyn at Work",
      description: "Professional workmanship in action - every job gets personal attention and quality materials",
      type: "action"
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