import { Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileHeader } from "@/components/StickyMobileHeader";
import { UtilityBar } from "@/components/UtilityBar";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import GoogleBusinessProfile from "@/components/GoogleBusinessProfile";
import ParallaxBackground from "@/components/ParallaxBackground";
import { SectionWrapper, Container } from "@/components/ui/section-wrapper";
import { HeroSection } from "@/components/ui/hero-section";
import { CTASection } from "@/components/ui/cta-section";
import { FeatureCard } from "@/components/ui/feature-card";
import { LeadCaptureForm } from "@/public/components/LeadCaptureForm";
import { TrustBar } from "@/components/TrustBar";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { FAQSection } from "@/components/FAQSection";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import {
  servicesData,
  whyChooseUsData,
  serviceAreasData,
  finalCTAContent,
} from "@/data/homepage-content";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Call Kaids Roofing - SE Melbourne's Trusted Roofing Experts"
        description="Professional roof restoration, repairs & painting in SE Melbourne. 15-year warranty, direct owner contact, 500+ roofs restored. Call 0435 900 709 for a free quote."
      />
      <SchemaMarkup />

      <UtilityBar />
      <StickyMobileHeader />
      
      <div>
        {/* Hero Section with Conversion Form */}
        <ParallaxBackground variant="hero" density="high">
          <SectionWrapper
            variant="hero"
            background="gradient-dark"
            className="text-primary-foreground relative"
          >
            {/* Subtle background depth - matches pilot pattern */}
            <div className="absolute inset-0 bg-secondary/95" />

            {/* Subtle metallic shimmer - calm professional tone */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
            
            <Container className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[600px]">
                {/* Left: Hero Content (7 columns on desktop) */}
                <div className="lg:col-span-7 py-8">
                  <div className="mb-10 space-y-5">
                    {/* Phone CTA */}
                    <Button
                      asChild
                      size="xl"
                      className="text-3xl sm:text-4xl h-auto py-5 px-8 rounded-2xl animate-fade-in"
                    >
                      <a href="tel:0435900709">
                        <Phone className="h-10 w-10" />
                        <span>0435 900 709</span>
                      </a>
                    </Button>

                    {/* Google Rating Badge */}
                    <div
                      className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl lg:ml-4 border-2 border-primary/20 animate-fade-in"
                      style={{ animationDelay: '300ms' }}
                    >
                      <span className="text-3xl">⭐</span>
                      <div className="text-left">
                        <div className="font-bold text-roofing-navy text-base">Google Reviews</div>
                        <div className="text-xs text-muted-foreground font-semibold">Verified Customers</div>
                      </div>
                    </div>
                  </div>

                  <HeroSection
                    headline={
                      <h1
                        className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in"
                      >
                        Roof Looking <span className="text-primary">Tired?</span> Leaking? Faded?
                      </h1>
                    }
                    subheadline={
                      <p
                        className="text-xl md:text-2xl font-semibold opacity-90 animate-fade-in"
                        style={{ animationDelay: '200ms' }}
                      >
                        <Link to="/warranty" className="hover:text-primary transition-colors">15-year warranty</Link>. Local owner. No sales teams.
                      </p>
                    }
                  />

                  {/* Offer Message */}
                  <div className="mt-8 backdrop-blur-md bg-white/10 border border-primary/40 rounded-xl p-5 inline-block">
                    <p className="text-white font-semibold text-base flex items-center gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <span>Free $250 roof assessment with every quote</span>
                    </p>
                  </div>
                </div>

                {/* Right: Conversion Form (5 columns on desktop) */}
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

        {/* Trust Bar - Stats Section */}
        <TrustBar />

        {/* Why Choose Us - Moved up for better conversion */}
        <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
              Why Choose CKR?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUsData.map((item, idx) => {
                const IconComponent = {
                  Shield,
                  Phone,
                  MapPin,
                }[item.icon];

                return (
                  <Card
                    key={idx}
                    className="backdrop-blur bg-white/10 border-white/20 hover:border-primary/60 transition-all group"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                          {IconComponent && (
                            <IconComponent className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Container>
        </SectionWrapper>

        {/* Services Section */}
        <ParallaxBackground variant="services" density="low">
          <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
            <Container>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Services
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {servicesData.map((service) => (
                  <FeatureCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.benefit}
                    price={service.price}
                    link={service.link}
                  />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-primary hover:text-white font-semibold text-lg transition-colors"
                >
                  View All 9 Services →
                </Link>
              </div>
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* How It Works - Process Section */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <HowItWorks />
        </SectionWrapper>

        {/* Before/After Proof Carousel */}
        <ParallaxBackground variant="testimonials" density="medium">
          <SectionWrapper background="gradient-dark" className="text-primary-foreground">
            <Container>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Real Results
                </h2>
                <p className="text-white/70 text-lg">
                  See the transformation · <Link to="/portfolio" className="text-primary hover:text-white font-semibold transition-colors">View full portfolio →</Link>
                </p>
              </div>
              <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
                {/* CMS-Managed: Edit featured projects at /admin/cms/homepage */}
                <BeforeAfterCarousel />
              </div>
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Testimonials - Customer Reviews */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <TestimonialsSection />
        </SectionWrapper>

        {/* Google Business Profile */}
        <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
          <Container size="sm">
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
              <GoogleBusinessProfile />
            </div>
          </Container>
        </SectionWrapper>

        {/* Guarantee Section */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <GuaranteeSection />
        </SectionWrapper>

        {/* FAQ Section */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <FAQSection />
        </SectionWrapper>

        {/* Service Areas */}
        <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
          <Container>
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-white">
                SE Melbourne
              </h2>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {serviceAreasData.map((area) => (
                  <Badge
                    key={area}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:border-primary/60 hover:bg-white/20"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
              <p className="text-center text-white/70 text-sm">
                <Link to="/quote" className="text-primary hover:underline font-semibold">
                  Get quote →
                </Link>
              </p>
            </div>
          </Container>
        </SectionWrapper>

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
