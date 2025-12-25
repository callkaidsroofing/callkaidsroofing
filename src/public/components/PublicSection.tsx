import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PublicSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'gradient' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  containerWidth?: 'default' | 'wide' | 'narrow' | 'full';
}

const variantStyles = {
  default: 'bg-background',
  muted: 'bg-muted/20',
  gradient: 'bg-gradient-to-br from-primary/10 to-secondary/15',
  dark: 'bg-charcoal text-white'
};

const sizeStyles = {
  sm: 'py-8',
  md: 'py-12 lg:py-16',
  lg: 'py-16 lg:py-24'
};

const containerWidthStyles = {
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
  narrow: 'max-w-4xl',
  full: 'max-w-full'
};

export const PublicSection = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  containerWidth = 'default'
}: PublicSectionProps) => {
  return (
    <section className={cn(variantStyles[variant], sizeStyles[size], className)}>
      <div className={cn('container mx-auto px-4', containerWidthStyles[containerWidth])}>
        {children}
      </div>
    </section>
  );
};
