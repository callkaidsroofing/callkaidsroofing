import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
// Real project photos from Call Kaids Roofing - before/during work
import bannerCleaning from '/lovable-uploads/884e66b0-35da-491d-b03b-d980d46b3043.png';
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
// Premium materials and completed work
import colorChart from '/lovable-uploads/99c2917f-b2e3-44ab-ba7d-79754ca91997.png';
// Quality finished projects
import finishedRidgeCaps from '/lovable-uploads/e90674b4-ab16-456f-9432-1dcc8363a210.png';
import solarRoofComplete from '/lovable-uploads/c4aaa0a0-d013-40e5-9aee-d7c62349f16c.png';
import repointingComplete from '/lovable-uploads/359deff0-4a4b-426d-acbc-993dfb3cb510.png';
import gutterRoofComplete from '/lovable-uploads/7b53e2bb-e419-483c-b48c-ea2d1f5c139e.png';
import redRoofPainting from '/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png';
import greyRoofComplete from '/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png';
import blueRoofFinish from '/lovable-uploads/0d5c8d43-0a56-42eb-a3fd-4ce0708040ce.png';
import houseComplete from '/lovable-uploads/7c4b0aaa-18ed-4b8a-80f2-904dc4868236.png';
import commercialProject from '/lovable-uploads/50cb1bd1-1166-4391-adc1-99c419346880.png';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  type: 'before-after' | 'action' | 'completed';
}

const ImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images: GalleryImage[] = [
    // Premium "After" shots featuring stunning transformations
    {
      src: "/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png",
      title: "Sunset Roof Restoration - After",
      description: "Stunning completed roof restoration with premium tiles and ridge capping, photographed at golden hour to showcase the quality finish.",
      type: "completed"
    },
    {
      src: "/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png",
      title: "Premium Ridge Installation - After",
      description: "Professional ridge capping installation with perfect alignment and weather sealing for long-term protection.",
      type: "completed"
    },
    {
      src: "/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png",
      title: "Aerial View Restoration - After",
      description: "Aerial perspective showing comprehensive roof restoration with consistent tile coverage and proper guttering.",
      type: "completed"
    },
    {
      src: "/lovable-uploads/f33cbcfa-005e-435c-a104-9a21d080a343.png",
      title: "Ridge Detail Work - After",
      description: "Close-up of precision ridge capping work showing quality materials and professional installation techniques.",
      type: "completed"
    },
    // Powerful "Before" shots showing transformation potential
    {
      src: "/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png",
      title: "Weathered Roof - Before",
      description: "Severely weathered roof tiles with moss growth and debris accumulation requiring complete restoration.",
      type: "before-after"
    },
    {
      src: "/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png",
      title: "Damaged Ridge Capping - Before",
      description: "Deteriorated ridge capping with moss growth and mortar failure compromising roof integrity.",
      type: "before-after"
    },
    {
      src: "/lovable-uploads/0362db50-69c4-4fd7-af15-a0112e09daeb.png",
      title: "Valley Damage - Before",
      description: "Damaged valley area with moss buildup and compromised water flow creating potential leak points.",
      type: "before-after"
    },
    {
      src: "/lovable-uploads/468d2fb1-beac-44d1-a3b6-9b08217e6231.png",
      title: "Terracotta Roof Issues - Before",
      description: "Deteriorated terracotta roof with damaged ridge capping and weather-related wear requiring restoration.",
      type: "before-after"
    },
    // Keep some of the best existing completed projects
    {
      src: finishedRidgeCaps,
      title: "Professional Ridge Cap Restoration",
      description: "Completed ridge capping work with proper bedding and pointing - sealed against Melbourne weather",
      type: "completed"
    },
    {
      src: solarRoofComplete,
      title: "Solar-Ready Roof Restoration",
      description: "Professional roof work completed around existing solar installation - no panel damage, perfect finish",
      type: "completed"
    },
    {
      src: redRoofPainting,
      title: "Vibrant Roof Painting Finish",
      description: "Premium Premcoat paint application in classic Melbourne red - long-lasting color and protection",
      type: "completed"
    },
    {
      src: greyRoofComplete,
      title: "Modern Grey Roof Transformation",
      description: "Professional roof painting in contemporary grey - clean lines and perfect coverage",
      type: "completed"
    },
    // Keep key work-in-progress shots
    {
      src: kaidynWorking,
      title: "Kaidyn at Work",
      description: "Professional workmanship in action - every job gets personal attention and quality materials",
      type: "action"
    },
    {
      src: ridgeCapWork,
      title: "Ridge Capping Restoration",
      description: "Professional ridge capping work in progress - fixing water entry points and securing the roof line",
      type: "action"
    },
    {
      src: valleyReplacement,
      title: "Valley Iron Replacement",
      description: "New valley iron installation in progress - proper materials make all the difference",
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
    <section className="py-12 sm:py-16 bg-gradient-to-b from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <Badge variant="outline" className="mb-2">Project Gallery</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Real Projects, Real Results
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            See the incredible transformations we achieve. These are actual Call Kaids projects showing what's possible for your roof.
          </p>
        </div>

        {/* Featured Large Image */}
        <div className="mb-6 sm:mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl group">
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50 bg-gradient-to-br from-background to-muted/30">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <OptimizedImage
                      src={images[currentImage].src}
                      alt={images[currentImage].title}
                      className="transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 object-center"
                      width={1301}
                      height={976}
                      priority
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                    <h3 className="text-lg sm:text-xl font-bold mt-2 drop-shadow-lg">{images[currentImage].title}</h3>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed drop-shadow-md">{images[currentImage].description}</p>
                  </div>
                  
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </Card>
              </button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl">
              <AspectRatio ratio={16/9}>
                <OptimizedImage
                  src={images[currentImage].src}
                  alt={images[currentImage].title}
                  className="rounded-lg"
                  width={1301}
                  height={976}
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </AspectRatio>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold">{images[currentImage].title}</h3>
                <p className="text-muted-foreground mt-2">{images[currentImage].description}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnail Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {images.map((image, index) => (
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
                    width={406}
                    height={304}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </AspectRatio>
                <div className="mt-2 text-center">
                  <p className="text-xs sm:text-sm font-medium truncate leading-relaxed">{image.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gallery Stats */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{images.filter(img => img.type === 'completed').length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Completed Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{images.filter(img => img.type === 'action').length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{images.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Photos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;