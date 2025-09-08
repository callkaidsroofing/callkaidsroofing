import { ReactNode, useEffect, useRef, useState } from 'react';

interface OptimizedBackgroundSectionProps {
  backgroundImage: string;
  className?: string;
  children: ReactNode;
  gradient?: string;
}

export const OptimizedBackgroundSection = ({ 
  backgroundImage, 
  className = '', 
  children,
  gradient = 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))'
}: OptimizedBackgroundSectionProps) => {
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = backgroundImage;
    }
  }, [isInView, backgroundImage]);

  return (
    <section
      ref={ref}
      className={`relative ${className}`}
      style={{
        backgroundImage: imageLoaded ? `${gradient}, url(${backgroundImage})` : gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: imageLoaded ? 'transparent' : '#1a1a1a',
        transition: 'background-image 0.3s ease-in-out',
      }}
    >
      {!imageLoaded && isInView && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      )}
      {children}
    </section>
  );
};