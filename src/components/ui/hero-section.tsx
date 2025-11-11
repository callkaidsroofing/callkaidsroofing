import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MetallicShine } from '@/components/ui/metallic-shine';

interface HeroSectionProps {
  headline: string | ReactNode;
  subheadline?: string | ReactNode;
  description?: string;
  badge?: string;
  ctaPrimary?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  ctaSecondary?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  trustSignals?: string[];
  className?: string;
}

/**
 * Reusable Hero Section Component
 * Design System: Standard hero with consistent CTA patterns
 */
export const HeroSection = ({
  headline,
  subheadline,
  description,
  badge,
  ctaPrimary,
  ctaSecondary,
  trustSignals,
  className,
}: HeroSectionProps) => {
  return (
    <div className={cn('max-w-3xl', className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm md:text-base mb-6 shadow-lg">
          {badge}
        </div>
      )}

      {typeof headline === 'string' ? (
        <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-shadow-lg">
          {headline}
        </h1>
      ) : (
        headline
      )}

      {subheadline && (
        <p className="text-xl md:text-3xl mb-6 opacity-95 font-medium">
          {subheadline}
        </p>
      )}

      {trustSignals && trustSignals.length > 0 && (
        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full text-base md:text-lg mb-8 shadow-lg">
          {trustSignals.map((signal, idx) => (
            <span key={idx}>
              {idx > 0 && <span className="text-white/60 mx-2">•</span>}
              {signal}
            </span>
          ))}
        </div>
      )}

      {description && (
        <p className="text-lg md:text-2xl mb-10 italic opacity-90 font-serif">
          {description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {ctaPrimary && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="relative bg-white text-primary hover:bg-white/90 text-lg md:text-xl px-8 py-6 md:py-7 shadow-2xl hover:shadow-xl transition-all w-full sm:w-auto font-bold overflow-hidden animate-electric-pulse"
            >
              <a
                href={ctaPrimary.href}
                onClick={ctaPrimary.onClick}
                className="flex items-center justify-center gap-3"
              >
                <Phone className="h-6 w-6 relative z-10" />
                <span className="relative z-10">{ctaPrimary.text}</span>
                <MetallicShine className="absolute inset-0 opacity-30" />
              </a>
            </Button>
          </motion.div>
        )}

        {ctaSecondary && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/10 border-2 border-white/50 text-white hover:bg-white hover:text-primary text-lg px-8 py-6 md:py-7 w-full sm:w-auto font-semibold transition-all shadow-steel"
            >
              <a
                href={ctaSecondary.href}
                onClick={ctaSecondary.onClick}
                className="flex items-center justify-center gap-2"
              >
                {ctaSecondary.text}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
