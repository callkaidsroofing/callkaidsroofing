import { Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import { ReviewsGrid } from "@/components/ReviewsGrid";
import ParallaxBackground from "@/components/ParallaxBackground";
import { SectionWrapper, Container } from "@/components/ui/section-wrapper";
import { CTASection } from "@/components/ui/cta-section";
import { LeadCaptureForm } from "@/public/components/LeadCaptureForm";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { finalCTAContent } from "@/data/homepage-content";
import { BUSINESS, getPublicWarrantySummary } from "@/config/business";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Call Kaids Roofing | Roof Restorations & Repairs in SE Melbourne"
        description={`Owner-operated roof restorations, repairs, painting and gutter work across ${BUSINESS.location.region}. ${getPublicWarrantySummary()} Call ${BUSINESS.phone.display}.`}
      />
      <SchemaMarkup />

      <div>
        {/* Hero Section with Conversion Form */}
        <ParallaxBackground variant="hero" density="high">
          <SectionWrapper
            variant="hero"
            background="gradient-dark"
            className="text-primary-foreground relative"
          >
            <div className="absolute inset-0 bg-secondary/95" />

            <Container className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[600px]">
                <div className="lg:col-span-7 py-8">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] text-white">
                    Roof Looking <span className="text-primary">Tired?</span> Leaking? Faded?
                  </h1>

                  <p className="text-xl md:text-2xl font-medium mb-10 text-white/90 leading-relaxed">
                    {BUSINESS.location.region}'s owner-operator roofing specialist. No sales teams—just clear advice and photo-backed work.
                  </p>

                  <div className="mb-8">
                    <Button
                      asChild
                      size="xl"
                      className="text-2xl sm:text-3xl h-auto py-6 px-10 rounded-xl"
                    >
                      <a href={BUSINESS.phone.href} className="inline-flex items-center gap-3">
                        <Phone className="h-8 w-8" />
                        <span>Call {BUSINESS.phone.display}</span>
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-medium">Fully Insured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">10-Year Workmanship</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 py-8">
                  <div className="sticky top-24">
                    <LeadCaptureForm
                      variant="compact"
                      title="Get Your Free Quote"
                      description="Owner responds personally. No sales teams."
                      serviceName="Free Quote Request"
                      ctaText="Get My Free Quote →"
                      source="hero_conversion_form"
                      showUrgencyBadge={true}
                    />
                  </div>
                </div>
              </div>
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Before & After Photos */}
        <section className="bg-secondary py-16">
          <Container>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              Real Work, Real Results
            </h2>
            <BeforeAfterCarousel />
          </Container>
        </section>

        {/* Customer Reviews - dark bg so widget cards pop */}
        <section className="bg-gradient-to-br from-secondary via-charcoal to-secondary py-16">
          <Container>
            <ReviewsGrid
              title="What Our Customers Say"
              description="Verified reviews from Southeast Melbourne homeowners"
            />
          </Container>
        </section>

        {/* Final CTA */}
        <ParallaxBackground variant="cta" density="medium">
          <CTASection
            headline={finalCTAContent.headline}
            description={finalCTAContent.description}
          />
        </ParallaxBackground>
      </div>
    </div>
  );
};

export default Index;
