import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  variant?: 'default' | 'compact' | 'spacious' | 'hero';
  background?: 'white' | 'muted' | 'gradient-primary' | 'gradient-dark' | 'metallic-steel' | 'chrome-blue' | 'black-depth' | 'electric-glow' | 'transparent';
  className?: string;
  id?: string;
}

/**
 * Standard section wrapper with consistent spacing and backgrounds
 * Design System Default: py-16 md:py-24 with max-w-6xl container
 */
export const SectionWrapper = ({
  children,
  variant = 'default',
  background = 'transparent',
  className,
  id,
}: SectionWrapperProps) => {
  const spacingClasses = {
    compact: 'py-12 md:py-16',
    default: 'py-16 md:py-24',
    spacious: 'py-24 md:py-32',
    hero: 'py-16 md:py-24 min-h-[60vh] md:min-h-[70vh]',
  };

  const backgroundClasses = {
    white: 'bg-background',
    muted: 'bg-muted/50',
    'gradient-primary': 'bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10',
    'gradient-dark': 'bg-gradient-to-br from-secondary via-charcoal to-secondary',
    'metallic-steel': 'metallic-steel',
    'chrome-blue': 'chrome-blue',
    'black-depth': 'black-depth',
    'electric-glow': 'electric-glow',
    transparent: 'bg-transparent',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden',
        spacingClasses[variant],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};

/**
 * Container with max-width and consistent padding
 * Design System Default: max-w-6xl mx-auto px-4
 */
export const Container = ({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'full';
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 relative z-10', sizeClasses[size], className)}>
      {children}
    </div>
  );
};
