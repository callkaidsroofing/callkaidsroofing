import { useState, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RoofSilhouette, TilePattern, GeometricGrid, FloatingShapes } from '@/lib/parallax-graphics';

interface ParallaxBackgroundProps {
  variant: 'hero' | 'services' | 'cta' | 'testimonials';
  density?: 'low' | 'medium' | 'high';
  children?: ReactNode;
}

const ParallaxBackground = ({ variant, density = 'medium', children }: ParallaxBackgroundProps) => {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Calculate transforms for each layer at different speeds
  const layer1Transform = `translateY(${scrollY * 0.3}px)`;
  const layer2Transform = `translateY(${scrollY * 0.6}px)`;
  const layer3Transform = `translateY(${scrollY * 0.9}px)`;

  // Density settings
  const opacityMap = {
    low: 0.05,
    medium: 0.10,
    high: 0.15,
  };

  const baseOpacity = opacityMap[density];

  // Mobile: Static background pattern
  if (isMobile) {
    return (
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          {variant === 'hero' && (
            <div className="absolute top-20 right-0 w-64 h-64 opacity-5">
              <RoofSilhouette color="hsl(var(--primary))" />
            </div>
          )}
          {variant === 'services' && (
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5">
              <TilePattern color="hsl(var(--silver))" />
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }

  // Desktop: Full parallax layers
  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Slowest (Background) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: layer1Transform, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {variant === 'hero' && (
            <>
              <div className="absolute -top-40 -right-20 w-[600px] h-[600px]" style={{ opacity: baseOpacity }}>
                <RoofSilhouette color="hsl(var(--primary))" />
              </div>
              <div className="absolute top-1/3 -left-32 w-[500px] h-[500px]" style={{ opacity: baseOpacity * 0.7 }}>
                <GeometricGrid color="hsl(var(--secondary))" />
              </div>
            </>
          )}
          {variant === 'services' && (
            <>
              <div className="absolute -top-20 left-1/4 w-[400px] h-[400px]" style={{ opacity: baseOpacity }}>
                <TilePattern color="hsl(var(--silver))" />
              </div>
              <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px]" style={{ opacity: baseOpacity * 0.8 }}>
                <RoofSilhouette color="hsl(var(--primary))" />
              </div>
            </>
          )}
          {variant === 'cta' && (
            <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px]" style={{ opacity: baseOpacity * 1.2 }}>
              <GeometricGrid color="hsl(var(--primary))" />
            </div>
          )}
          {variant === 'testimonials' && (
            <div className="absolute top-0 left-1/4 w-[350px] h-[350px]" style={{ opacity: baseOpacity }}>
              <FloatingShapes color="hsl(var(--silver))" />
            </div>
          )}
        </div>

        {/* Layer 2: Medium speed (Midground) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: layer2Transform, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {variant === 'hero' && (
            <>
              <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px]" style={{ opacity: baseOpacity * 1.3 }}>
                <FloatingShapes color="hsl(var(--primary))" />
              </div>
              <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px]" style={{ opacity: baseOpacity * 1.1 }}>
                <TilePattern color="hsl(var(--silver))" />
              </div>
            </>
          )}
          {variant === 'services' && (
            <>
              <div className="absolute top-40 right-1/3 w-[280px] h-[280px]" style={{ opacity: baseOpacity * 1.2 }}>
                <FloatingShapes color="hsl(var(--primary))" />
              </div>
              <div className="absolute bottom-1/3 left-20 w-[320px] h-[320px]" style={{ opacity: baseOpacity }}>
                <GeometricGrid color="hsl(var(--secondary))" />
              </div>
            </>
          )}
          {variant === 'cta' && (
            <>
              <div className="absolute top-10 left-1/4 w-[400px] h-[400px]" style={{ opacity: baseOpacity * 1.1 }}>
                <TilePattern color="hsl(var(--silver))" />
              </div>
              <div className="absolute bottom-1/4 right-20 w-[350px] h-[350px]" style={{ opacity: baseOpacity * 1.3 }}>
                <FloatingShapes color="hsl(var(--primary))" />
              </div>
            </>
          )}
          {variant === 'testimonials' && (
            <div className="absolute bottom-20 right-1/3 w-[300px] h-[300px]" style={{ opacity: baseOpacity * 1.2 }}>
              <TilePattern color="hsl(var(--primary))" />
            </div>
          )}
        </div>

        {/* Layer 3: Fastest (Foreground) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: layer3Transform, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {variant === 'hero' && (
            <>
              <div className="absolute top-1/2 left-10 w-[180px] h-[180px]" style={{ opacity: baseOpacity * 1.5 }}>
                <GeometricGrid color="hsl(var(--primary))" />
              </div>
              <div className="absolute top-20 right-1/4 w-[200px] h-[200px]" style={{ opacity: baseOpacity * 1.4 }}>
                <FloatingShapes color="hsl(var(--silver))" />
              </div>
            </>
          )}
          {variant === 'services' && (
            <>
              <div className="absolute top-10 left-1/3 w-[150px] h-[150px]" style={{ opacity: baseOpacity * 1.6 }}>
                <RoofSilhouette color="hsl(var(--primary))" />
              </div>
              <div className="absolute bottom-10 right-1/4 w-[180px] h-[180px]" style={{ opacity: baseOpacity * 1.4 }}>
                <FloatingShapes color="hsl(var(--silver))" />
              </div>
            </>
          )}
          {variant === 'cta' && (
            <div className="absolute bottom-10 left-1/3 w-[200px] h-[200px]" style={{ opacity: baseOpacity * 1.6 }}>
              <RoofSilhouette color="hsl(var(--secondary))" />
            </div>
          )}
          {variant === 'testimonials' && (
            <div className="absolute top-1/3 right-20 w-[160px] h-[160px]" style={{ opacity: baseOpacity * 1.5 }}>
              <GeometricGrid color="hsl(var(--primary))" />
            </div>
          )}
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/0 pointer-events-none" />
      </div>
      {children}
    </div>
  );
};

export default ParallaxBackground;
