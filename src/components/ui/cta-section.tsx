import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  headline: string;
  description?: string;
  ctaPrimary?: {
    text: string;
    href: string;
    icon?: ReactNode;
  };
  ctaSecondary?: {
    text: string;
    href: string;
    icon?: ReactNode;
  };
  variant?: 'gradient' | 'solid';
  size?: 'default' | 'compact';
  className?: string;
}

/**
 * Reusable CTA Section Component
 * Design System: Consistent call-to-action patterns
 */
export const CTASection = ({
  headline,
  description,
  ctaPrimary = {
    text: '0435 900 709',
    href: 'tel:0435900709',
    icon: <Phone className="h-5 w-5" />,
  },
  ctaSecondary = {
    text: 'Request Quote Online',
    href: '/quote',
    icon: <ArrowRight className="h-5 w-5" />,
  },
  variant = 'gradient',
  size = 'default',
  className,
}: CTASectionProps) => {
  const variantClasses = {
    gradient:
      'bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground',
    solid: 'bg-secondary text-secondary-foreground',
  };

  const sizeClasses = {
    default: 'py-16 md:py-24',
    compact: 'py-12 md:py-16',
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px] opacity-30" />

      <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{headline}</h2>

        {description && (
          <p className="text-lg md:text-xl mb-8 opacity-90">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className={cn(
              variant === 'gradient'
                ? 'bg-background text-primary hover:bg-background/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            <a
              href={ctaPrimary.href}
              className="flex items-center justify-center gap-2"
            >
              {ctaPrimary.icon}
              {ctaPrimary.text}
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className={cn(
              variant === 'gradient'
                ? 'bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-background hover:text-primary'
                : 'bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background'
            )}
          >
            <Link to={ctaSecondary.href} className="flex items-center justify-center gap-2">
              {ctaSecondary.text}
              {ctaSecondary.icon}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
