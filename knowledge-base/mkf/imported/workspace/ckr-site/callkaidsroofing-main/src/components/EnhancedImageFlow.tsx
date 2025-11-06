import { useState, useRef, useEffect } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Eye, Maximize2, X } from 'lucide-react';

interface ImageFlowItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  isHero?: boolean;
  focusPoint?: {
    x: number; // 0-100 percentage
    y: number; // 0-100 percentage
  };
}

interface EnhancedImageFlowProps {
  images: ImageFlowItem[];
  layout?: 'grid' | 'masonry' | 'slider';
  priority?: number; // Number of images to load with priority
  className?: string;
}

const EnhancedImageFlow = ({ 
  images, 
  layout = 'grid', 
  priority = 3,
  className = '' 
}: EnhancedImageFlowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced focus point styling
  const getFocusPointStyle = (focusPoint?: { x: number; y: number }) => {
    if (!focusPoint) return 'object-center';
    
    const xPos = focusPoint.x <= 33 ? 'left' : focusPoint.x >= 67 ? 'right' : 'center';
    const yPos = focusPoint.y <= 33 ? 'top' : focusPoint.y >= 67 ? 'bottom' : 'center';
    
    return `object-${yPos} object-${xPos}`;
  };

  // Lightbox functionality
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  if (!isIntersecting) {
    return <div ref={containerRef} className={`min-h-[400px] ${className}`} />;
  }

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <div 
          key={index}
          className="group relative overflow-hidden rounded-lg bg-muted aspect-[4/3] hover:shadow-xl transition-all duration-300"
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${getFocusPointStyle(image.focusPoint)}`}
            priority={index < priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Category badge */}
          {image.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-black/60 text-white border-white/20">
                {image.category}
              </Badge>
            </div>
          )}
          
          {/* View button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openLightbox(index)}
              className="bg-white/90 text-black hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
          
          {/* Image info */}
          {(image.title || image.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {image.title && (
                <h4 className="font-semibold text-sm mb-1">{image.title}</h4>
              )}
              {image.description && (
                <p className="text-xs text-white/90">{image.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSliderLayout = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 aspect-[16/9] relative">
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                className={`w-full h-full ${getFocusPointStyle(image.focusPoint)}`}
                priority={index < priority}
                sizes="100vw"
              />
              
              {/* Slide content */}
              {(image.title || image.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  {image.title && (
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-white/90">{image.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Slider controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
          disabled={currentIndex === images.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderMasonryLayout = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {images.map((image, index) => (
        <div 
          key={index}
          className="group relative overflow-hidden rounded-lg bg-muted break-inside-avoid cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => openLightbox(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className={`w-full transition-transform duration-300 group-hover:scale-105 ${getFocusPointStyle(image.focusPoint)}`}
            priority={index < priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Expand icon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 text-white p-2 rounded-full">
              <Maximize2 className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      {layout === 'grid' && renderGridLayout()}
      {layout === 'slider' && renderSliderLayout()}
      {layout === 'masonry' && renderMasonryLayout()}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </Button>
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {/* Lightbox image */}
            <div className="max-w-full max-h-full">
              <OptimizedImage
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                className="max-w-full max-h-[90vh] object-contain"
                priority={true}
                sizes="100vw"
              />
            </div>
            
            {/* Image info */}
            {(images[lightboxIndex].title || images[lightboxIndex].description) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                {images[lightboxIndex].title && (
                  <h3 className="text-lg font-bold mb-1">{images[lightboxIndex].title}</h3>
                )}
                {images[lightboxIndex].description && (
                  <p className="text-white/90">{images[lightboxIndex].description}</p>
                )}
              </div>
            )}
            
            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageFlow;