import { ReactNode } from 'react';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';
import ParallaxBackground from '@/components/ParallaxBackground';

interface PublicPageHeroProps {
  h1: string;
  subtitle?: string;
  description?: string;
  badges?: Array<{ icon: ReactNode; text: string }>;
  cta?: ReactNode;
  useParallax?: boolean;
  parallaxVariant?: 'hero' | 'services' | 'testimonials' | 'cta';
  variant?: 'dark' | 'light'; // NEW: Light variant for high readability pages
}

/**
 * Standardized hero section for all public pages
 * Based on Home page canonical structure
 */
export const PublicPageHero = ({
  h1,
  subtitle,
  description,
  badges,
  cta,
  useParallax = false,
  parallaxVariant = 'hero',
  variant = 'dark' // Default to dark for backwards compatibility
}: PublicPageHeroProps) => {

  // Light variant for high-readability pages (Services, Contact, Booking)
  if (variant === 'light') {
    return (
      <SectionWrapper variant="hero" className="bg-gradient-to-br from-white via-muted/30 to-white border-b-4 border-primary">
        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto py-12 space-y-6">
            {subtitle && (
              <p className="text-lg italic text-primary font-semibold">{subtitle}</p>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              {h1}
            </h1>

            {description && (
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
                {description}
              </p>
            )}

            {badges && badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-foreground"
                  >
                    <span className="text-primary">{badge.icon}</span>
                    <span className="font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            )}

            {cta && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {cta}
              </div>
            )}
          </div>
        </Container>
      </SectionWrapper>
    );
  }

  // Original dark variant
  const heroContent = (
    <SectionWrapper variant="hero" background="gradient-dark" className="text-primary-foreground">
      {/* Subtle background depth */}
      <div className="absolute inset-0 bg-secondary/95" />

      {/* Subtle metallic shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />

      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto py-8 space-y-6">
          {subtitle && (
            <p className="text-lg italic text-conversion-cyan">{subtitle}</p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {h1}
          </h1>

          {description && (
            <p className="text-xl md:text-2xl text-white/90 font-semibold max-w-3xl mx-auto">
              {description}
            </p>
          )}

          {badges && badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white"
                >
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          )}

          {cta && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {cta}
            </div>
          )}
        </div>
      </Container>
    </SectionWrapper>
  );

  if (useParallax) {
    return (
      <ParallaxBackground variant={parallaxVariant} density="high">
        {heroContent}
      </ParallaxBackground>
    );
  }

  return heroContent;
};
