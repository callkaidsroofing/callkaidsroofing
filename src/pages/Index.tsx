import { Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileHeader } from "@/components/StickyMobileHeader";
import { UtilityBar } from "@/components/UtilityBar";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import { FeaturedCaseStudy } from "@/components/FeaturedCaseStudy";
import { ReviewsGrid } from "@/components/ReviewsGrid";
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
            {/* Clean dark background */}
            <div className="absolute inset-0 bg-secondary/95" />

            <Container className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[600px]">
                {/* Left: Hero Content (7 columns on desktop) */}
                <div className="lg:col-span-7 py-8">
                  {/* Headline First - Clear Hierarchy */}
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] text-white">
                    Roof Looking <span className="text-primary">Tired?</span> Leaking? Faded?
                  </h1>

                  <p className="text-xl md:text-2xl font-medium mb-10 text-white/90 leading-relaxed">
                    SE Melbourne's owner-operator roofing specialist. No sales teams—just honest work.
                  </p>

                  {/* Single Primary CTA */}
                  <div className="mb-8">
                    <Button
                      asChild
                      size="xl"
                      className="text-2xl sm:text-3xl h-auto py-6 px-10 rounded-xl"
                    >
                      <a href="tel:0435900709" className="inline-flex items-center gap-3">
                        <Phone className="h-8 w-8" />
                        <span>Call 0435 900 709</span>
                      </a>
                    </Button>
                  </div>

                  {/* Tight Trust Row - Directly Under CTA */}
                  <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-medium">Fully Insured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">Photo-Backed Roof Report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">15–20 Year Warranty</span>
                    </div>
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
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                      {IconComponent && (
                        <IconComponent className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </SectionWrapper>

        {/* Services Section */}
        <SectionWrapper variant="default" className="bg-background py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Services
              </h2>
              <p className="text-muted-foreground text-lg">
                Professional roofing solutions for Southeast Melbourne homes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base transition-colors"
              >
                View All 9 Services →
              </Link>
            </div>
          </Container>
        </SectionWrapper>

        {/* How It Works - Process Section */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <HowItWorks />
        </SectionWrapper>

        {/* Featured Case Study - Berwick Restoration */}
        <ParallaxBackground variant="testimonials" density="medium">
          <SectionWrapper background="gradient-dark" className="text-primary-foreground">
            <Container>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  Real Work, Real Results
                </h2>
                <p className="text-white/90 text-lg">
                  Complete project story: Before & after photos + customer review from the same job
                </p>
              </div>
              <FeaturedCaseStudy />
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Testimonials - Customer Reviews */}
        <SectionWrapper className="bg-background py-20">
          <TestimonialsSection />
        </SectionWrapper>

        {/* Additional Customer Reviews - Screenshots */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <Container>
            <ReviewsGrid
              title="More Happy Customers"
              description="Real reviews from Southeast Melbourne homeowners"
            />
          </Container>
        </SectionWrapper>

        {/* Google Business Profile */}
        <SectionWrapper variant="compact" className="bg-muted/30 py-16">
          <Container size="sm">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <GoogleBusinessProfile />
              </CardContent>
            </Card>
          </Container>
        </SectionWrapper>

        {/* Guarantee Section */}
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <GuaranteeSection />
        </SectionWrapper>

        {/* FAQ Section */}
        <SectionWrapper className="bg-background py-20">
          <FAQSection />
        </SectionWrapper>

        {/* Service Areas */}
        <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
          <Container>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-white">
              Servicing Southeast Melbourne
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-3xl mx-auto">
              {serviceAreasData.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 text-sm text-white/90 hover:text-white transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-center text-white/90 text-sm">
              <Link to="/quote" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Get your free quote →
              </Link>
            </p>
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
