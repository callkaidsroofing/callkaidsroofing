import { useMemo, useState } from 'react';
import { imageVariants } from '@/data/imageVariants';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

const resolveObjectFitClass = (className: string) => {
  if (className.includes('object-contain')) return 'object-contain';
  if (className.includes('object-fill')) return 'object-fill';
  if (className.includes('object-none')) return 'object-none';
  if (className.includes('object-scale-down')) return 'object-scale-down';
  return 'object-cover';
};

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const variantConfig = useMemo(() => imageVariants[src], [src]);

  const computedSizes = sizes ?? variantConfig?.sizes ?? DEFAULT_SIZES;
  const fallbackSrc = variantConfig?.fallback.src ?? src;
  const fallbackWidth = variantConfig?.fallback.width ?? width;
  const fallbackHeight = variantConfig?.fallback.height ?? height;
  const objectFitClass = resolveObjectFitClass(className);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio:
          (fallbackWidth && fallbackHeight)
            ? `${fallbackWidth}/${fallbackHeight}`
            : width && height
              ? `${width}/${height}`
              : undefined,
      }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden="true" />
      )}
      <picture className="block h-full w-full">
        {variantConfig?.sources.map((source) => (
          <source
            key={`${source.type}-${source.srcSet}`}
            type={source.type}
            srcSet={source.srcSet}
            sizes={computedSizes}
          />
        ))}
        <img
          src={fallbackSrc}
          alt={alt}
          width={fallbackWidth ?? width}
          height={fallbackHeight ?? height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={computedSizes}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`h-full w-full transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${objectFitClass}`}
        />
      </picture>
    </div>
  );
};