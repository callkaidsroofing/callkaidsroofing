import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import EnhancedImageFlow from '@/components/EnhancedImageFlow';
import SmartPageHierarchy from '@/components/SmartPageHierarchy';
import StrategicCTAManager from '@/components/StrategicCTAManager';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: 'before' | 'after' | 'progress';
  pairId?: string; // Links before/after photos
}

const Gallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [filterCategory, setFilterCategory] = useState<'all' | 'before' | 'after' | 'progress'>('all');
  
  // Organized image pairs and standalone shots
  const images: GalleryImage[] = [
    // Pair 1: Ridge Restoration
    {
      src: "/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png",
      title: "Damaged Ridge Capping",
      description: "Deteriorated ridge capping with moss growth and mortar failure compromising roof integrity.",
      category: "before",
      pairId: "ridge-1"
    },
    {
      src: "/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png",
      title: "Premium Ridge Installation",
      description: "Professional ridge capping installation with perfect alignment and weather sealing for long-term protection.",
      category: "after",
      pairId: "ridge-1"
    },
    
    // Pair 2: Roof Transformation
    {
      src: "/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png",
      title: "Weathered Roof",
      description: "Severely weathered roof tiles with moss growth and debris accumulation requiring complete restoration.",
      category: "before",
      pairId: "roof-1"
    },
    {
      src: "/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png",
      title: "Sunset Roof Restoration",
      description: "Stunning completed roof restoration with premium tiles and ridge capping, photographed at golden hour to showcase the quality finish.",
      category: "after",
      pairId: "roof-1"
    },
    
    // Pair 3: Valley Repair
    {
      src: "/lovable-uploads/0362db50-69c4-4fd7-af15-a0112e09daeb.png",
      title: "Valley Damage",
      description: "Damaged valley area with moss buildup and compromised water flow creating potential leak points.",
      category: "before",
      pairId: "valley-1"
    },
    {
      src: "/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png",
      title: "Aerial View Restoration",
      description: "Aerial perspective showing comprehensive roof restoration with consistent tile coverage and proper guttering.",
      category: "after",
      pairId: "valley-1"
    },
    
    // Standalone completed projects
    {
      src: "/lovable-uploads/f33cbcfa-005e-435c-a104-9a21d080a343.png",
      title: "Ridge Detail Work",
      description: "Close-up of precision ridge capping work showing quality materials and professional installation techniques.",
      category: "after"
    },
    {
      src: "/lovable-uploads/e90674b4-ab16-456f-9432-1dcc8363a210.png",
      title: "Professional Ridge Cap Restoration",
      description: "Completed ridge capping work with proper bedding and pointing - sealed against Melbourne weather.",
      category: "after"
    },
    {
      src: "/lovable-uploads/c4aaa0a0-d013-40e5-9aee-d7c62349f16c.png",
      title: "Solar-Ready Roof Restoration",
      description: "Professional roof work completed around existing solar installation - no panel damage, perfect finish.",
      category: "after"
    },
    {
      src: "/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png",
      title: "Vibrant Roof Painting",
      description: "Premium Premcoat paint application in classic Melbourne red - long-lasting color and protection.",
      category: "after"
    },
    {
      src: "/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png",
      title: "Modern Grey Roof Transformation",
      description: "Professional roof painting in contemporary grey - clean lines and perfect coverage.",
      category: "after"
    },
    {
      src: "/lovable-uploads/0d5c8d43-0a56-42eb-a3fd-4ce0708040ce.png",
      title: "Blue Roof Finish",
      description: "Quality roof painting showcasing our premium color range and professional application.",
      category: "after"
    },
    
    // Work in progress shots
    {
      src: "/lovable-uploads/3a5f460c-0be2-45c5-9c92-e81b3da4f442.png",
      title: "Kaidyn at Work",
      description: "Professional workmanship in action - every job gets personal attention and quality materials.",
      category: "progress"
    },
    {
      src: "/lovable-uploads/783444da-c25e-4910-89e1-1908a6296118.png",
      title: "Ridge Capping Work",
      description: "Professional ridge capping restoration in progress - fixing water entry points and securing the roof line.",
      category: "progress"
    },
    {
      src: "/lovable-uploads/f0e2051b-8a4e-4e5d-9455-bd39026e8715.png",
      title: "Valley Iron Replacement",
      description: "New valley iron installation in progress - proper materials make all the difference.",
      category: "progress"
    }
  ];

  const filteredImages = filterCategory === 'all' 
    ? images 
    : images.filter(img => img.category === filterCategory);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'before': return 'bg-destructive text-destructive-foreground';
      case 'after': return 'bg-primary text-primary-foreground';
      case 'progress': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'before': return 'Before';
      case 'after': return 'After';
      case 'progress': return 'In Progress';
      default: return category;
    }
  };

  // Find paired image for before/after comparison
  const findPairedImage = (image: GalleryImage) => {
    if (!image.pairId) return null;
    return images.find(img => 
      img.pairId === image.pairId && 
      img.category !== image.category
    );
  };

  return (
    <>
      <SEOHead 
        title="Project Gallery - Call Kaids Roofing | Before & After Transformations"
        description="View stunning before and after transformations from Call Kaids Roofing. Real projects across Melbourne's SE suburbs showcasing quality roof restorations, painting, and repairs."
        keywords="roof restoration before after, Melbourne roof transformations, roof painting gallery, ridge capping repairs, Call Kaids projects"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <div className="text-center space-y-4">
              <Badge variant="outline" className="mb-2">Project Gallery</Badge>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Real Projects, Real Results
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore our complete portfolio of roofing transformations across Melbourne's SE suburbs. 
                From weathered roofs to stunning restorations - see what's possible for your property.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Buttons */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              {(['all', 'before', 'after', 'progress'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={filterCategory === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setFilterCategory(filter);
                    setCurrentImage(0);
                  }}
                  className="capitalize"
                >
                  {filter === 'all' ? 'All Photos' : getCategoryLabel(filter)}
                  <Badge variant="secondary" className="ml-2">
                    {filter === 'all' ? images.length : images.filter(img => img.category === filter).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Large Image */}
          <div className="mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl group">
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
                    <div className="relative">
                      <AspectRatio ratio={16/9}>
                        <OptimizedImage
                          src={filteredImages[currentImage]?.src}
                          alt={filteredImages[currentImage]?.title}
                          className="transition-all duration-500 group-hover:scale-105"
                          width={1200}
                          height={675}
                          priority
                          sizes="(max-width: 768px) 100vw, 90vw"
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`${getCategoryColor(filteredImages[currentImage]?.category)} font-semibold shadow-lg`}>
                            {getCategoryLabel(filteredImages[currentImage]?.category)}
                          </Badge>
                          {filteredImages[currentImage]?.pairId && (
                            <Badge variant="outline" className="bg-background/20 text-white border-white/30">
                              Paired Photo Available
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{filteredImages[currentImage]?.title}</h3>
                        <p className="text-sm text-gray-200 leading-relaxed drop-shadow-md max-w-3xl">{filteredImages[currentImage]?.description}</p>
                      </div>
                      
                      {/* Navigation arrows */}
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  </Card>
                </button>
              </DialogTrigger>
              
              <DialogContent className="max-w-6xl">
                <AspectRatio ratio={16/9}>
                  <OptimizedImage
                    src={filteredImages[currentImage]?.src}
                    alt={filteredImages[currentImage]?.title}
                    className="rounded-lg"
                    width={1200}
                    height={675}
                    priority
                    sizes="90vw"
                  />
                </AspectRatio>
                <div className="mt-6 text-center">
                  <Badge className={`${getCategoryColor(filteredImages[currentImage]?.category)} mb-3`}>
                    {getCategoryLabel(filteredImages[currentImage]?.category)}
                  </Badge>
                  <h3 className="text-3xl font-bold mb-3">{filteredImages[currentImage]?.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{filteredImages[currentImage]?.description}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image, index) => {
              const pairedImage = findPairedImage(image);
              
              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 group overflow-hidden ${
                    index === currentImage 
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:shadow-md hover:scale-102 border-muted hover:border-primary/30'
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <CardContent className="p-3">
                    <AspectRatio ratio={16/9}>
                      <OptimizedImage
                        src={image.src}
                        alt={image.title}
                        className="rounded transition-all duration-300 group-hover:brightness-110"
                        width={400}
                        height={225}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    </AspectRatio>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(image.category)}`}
                        >
                          {getCategoryLabel(image.category)}
                        </Badge>
                        {pairedImage && (
                          <Badge variant="outline" className="text-xs">
                            Paired
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-tight line-clamp-2">{image.title}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Gallery Stats */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{images.filter(img => img.category === 'after').length}</div>
                <div className="text-sm text-muted-foreground">Completed Projects</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{images.filter(img => img.pairId).length / 2}</div>
                <div className="text-sm text-muted-foreground">Before/After Pairs</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{images.filter(img => img.category === 'progress').length}</div>
                <div className="text-sm text-muted-foreground">Work in Progress</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{images.length}</div>
                <div className="text-sm text-muted-foreground">Total Photos</div>
              </div>
            </div>
          </div>

          {/* Local Service Area Links */}
          <div className="mt-12 bg-gradient-to-r from-secondary/10 to-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">See More Local Projects</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link to="/services/roof-restoration-clyde-north" className="text-center p-4 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <h4 className="font-semibold text-primary">Clyde North</h4>
                <p className="text-sm text-muted-foreground">Home base projects</p>
              </Link>
              <Link to="/services/roof-restoration-berwick" className="text-center p-4 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <h4 className="font-semibold text-primary">Berwick</h4>
                <p className="text-sm text-muted-foreground">Family area specialist</p>
              </Link>
              <Link to="/services/roof-painting-cranbourne" className="text-center p-4 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <h4 className="font-semibold text-primary">Cranbourne</h4>
                <p className="text-sm text-muted-foreground">High-volume area</p>
              </Link>
              <Link to="/services/roof-restoration-pakenham" className="text-center p-4 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <h4 className="font-semibold text-primary">Pakenham</h4>
                <p className="text-sm text-muted-foreground">Growing community</p>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready for Your Transformation?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              These results speak for themselves. Let's discuss how we can transform your roof with the same level of quality and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button size="lg" asChild>
                <Link to="/book">Get Your Free Inspection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:0435900709">Call 0435 900 709</a>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Link to="/emergency" className="text-roofing-emergency hover:underline">🚨 Emergency Repairs Available</Link>
              <Link to="/warranty" className="text-primary hover:underline">🛡️ 10-Year Warranty Details</Link>
              <Link to="/blog" className="text-primary hover:underline">📚 Expert Roofing Tips</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;