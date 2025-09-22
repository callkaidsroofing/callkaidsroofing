import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { imageVariants } from '@/data/imageVariants';

interface ResponsiveSource {
  type: string;
  srcSet: string;
}

interface OptimizedBackgroundSectionProps {
  backgroundImage: string;
  className?: string;
  children: ReactNode;
  gradient?: string;
  imageAlt?: string;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedBackgroundSection = ({
  backgroundImage,
  className = '',
  children,
  gradient = 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
  imageAlt = '',
  priority = false,
  sizes,
}: OptimizedBackgroundSectionProps) => {
  const [isInView, setIsInView] = useState(priority);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const variantConfig = useMemo(() => imageVariants[backgroundImage], [backgroundImage]);
  const pictureSources: ResponsiveSource[] | undefined = variantConfig?.sources;
  const fallbackSrc = variantConfig?.fallback.src ?? backgroundImage;
  const fallbackWidth = variantConfig?.fallback.width;
  const fallbackHeight = variantConfig?.fallback.height;
  const computedSizes = sizes ?? variantConfig?.sizes ?? '100vw';

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!pictureSources && isInView) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = backgroundImage;
    }
  }, [isInView, backgroundImage, pictureSources]);

  const shouldRenderPicture = Boolean(pictureSources) && isInView;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={
        pictureSources
          ? { backgroundColor: '#0f172a' }
          : {
              backgroundImage: imageLoaded
                ? `${gradient}, url(${backgroundImage})`
                : gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: imageLoaded ? 'transparent' : '#1a1a1a',
              transition: 'background-image 0.3s ease-in-out',
            }
      }
    >
      {shouldRenderPicture && (
        <div className="absolute inset-0 -z-20">
          <picture className="block h-full w-full">
            {pictureSources?.map((source) => (
              <source
                key={`${source.type}-${source.srcSet}`}
                type={source.type}
                srcSet={source.srcSet}
                sizes={computedSizes}
              />
            ))}
            <img
              src={fallbackSrc}
              alt={imageAlt}
              width={fallbackWidth}
              height={fallbackHeight}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              fetchPriority={priority ? 'high' : 'auto'}
              sizes={computedSizes}
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </picture>
        </div>
      )}

      {pictureSources && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: gradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {!pictureSources && !imageLoaded && isInView && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      )}

      {children}
    </section>
  );
};