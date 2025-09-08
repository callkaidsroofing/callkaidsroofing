import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Link } from 'react-router-dom';

interface FeaturedImage {
  src: string;
  title: string;
  description: string;
  category: 'before' | 'after';
  pairId?: string;
}

const FeaturedGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Only the most impressive before/after transformations for homepage
  const featuredImages: FeaturedImage[] = [
    {
      src: "/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png",
      title: "Sunset Roof Restoration",
      description: "Stunning completed roof restoration with premium tiles and ridge capping.",
      category: "after",
      pairId: "roof-1"
    },
    {
      src: "/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png",
      title: "Premium Ridge Installation",
      description: "Professional ridge capping installation with perfect alignment and weather sealing.",
      category: "after",
      pairId: "ridge-1"
    },
    {
      src: "/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png",
      title: "Aerial View Restoration",
      description: "Comprehensive roof restoration with consistent tile coverage and proper guttering.",
      category: "after",
      pairId: "valley-1"
    },
    {
      src: "/lovable-uploads/f33cbcfa-005e-435c-a104-9a21d080a343.png",
      title: "Ridge Detail Work",
      description: "Close-up of precision ridge capping work showing quality materials and professional installation.",
      category: "after"
    }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % featuredImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-2">Featured Transformations</Badge>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            See What's Possible
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These are just a few highlights from our recent projects. Every roof tells a story of transformation.
          </p>
        </div>

        {/* Featured Large Image */}
        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl group">
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <OptimizedImage
                        src={featuredImages[currentImage].src}
                        alt={featuredImages[currentImage].title}
                        className="transition-all duration-500 group-hover:scale-105"
                        width={1200}
                        height={675}
                        priority
                        sizes="(max-width: 768px) 100vw, 85vw"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Badge className="bg-primary text-primary-foreground font-semibold shadow-lg mb-3">
                        Completed Project
                      </Badge>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">{featuredImages[currentImage].title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed drop-shadow-md">{featuredImages[currentImage].description}</p>
                    </div>
                    
                    {/* Navigation arrows */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              </button>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl">
              <AspectRatio ratio={16/9}>
                <OptimizedImage
                  src={featuredImages[currentImage].src}
                  alt={featuredImages[currentImage].title}
                  className="rounded-lg"
                  width={1200}
                  height={675}
                  priority
                  sizes="90vw"
                />
              </AspectRatio>
              <div className="mt-6 text-center">
                <Badge className="bg-primary text-primary-foreground mb-3">
                  Completed Project
                </Badge>
                <h3 className="text-2xl font-bold mb-3">{featuredImages[currentImage].title}</h3>
                <p className="text-muted-foreground text-lg">{featuredImages[currentImage].description}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {featuredImages.map((image, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-300 group overflow-hidden ${
                index === currentImage 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102 border-muted hover:border-primary/30'
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <CardContent className="p-2">
                <AspectRatio ratio={16/9}>
                  <OptimizedImage
                    src={image.src}
                    alt={image.title}
                    className="rounded transition-all duration-300 group-hover:brightness-110"
                    width={400}
                    height={225}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </AspectRatio>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium truncate">{image.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Full Gallery CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-3">Want to See More?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore our complete gallery with dozens of before/after transformations and detailed project documentation.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link to="/gallery">
                View Full Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGallery;