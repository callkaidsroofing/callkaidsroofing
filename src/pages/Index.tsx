import { Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
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
import { HeroConversionForm } from "@/components/HeroConversionForm";
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
            {/* Multi-layer background depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-secondary to-charcoal" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-conversion-orange/10" />
            
            {/* Animated metallic shimmer */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
            
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px]" />
            </div>
            
            <Container className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[600px]">
                {/* Left: Hero Content (7 columns on desktop) */}
                <div className="lg:col-span-7 py-8">
                  <div className="mb-8 space-y-4">
                    {/* Huge Phone CTA - CSS Animation */}
                    <a 
                      href="tel:0435900709"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-conversion-blue via-conversion-cyan to-conversion-blue hover:from-conversion-cyan hover:to-conversion-deep text-white px-8 py-5 rounded-2xl text-3xl sm:text-4xl font-black shadow-[0_10px_40px_rgba(41,179,255,0.5)] hover:shadow-[0_15px_50px_rgba(0,212,255,0.7)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 border-2 border-conversion-black/20 animate-fade-in"
                    >
                      <Phone className="h-10 w-10 animate-pulse" />
                      <span>0435 900 709</span>
                    </a>
                    
                    {/* Google Rating Badge - CSS Animation */}
                    <div 
                      className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl lg:ml-4 border-2 border-primary/20 animate-fade-in"
                      style={{ animationDelay: '300ms' }}
                    >
                      <span className="text-3xl">⭐</span>
                      <div className="text-left">
                        <div className="font-black text-roofing-navy text-base">Google Reviews</div>
                        <div className="text-xs text-muted-foreground font-semibold">Verified Customers</div>
                      </div>
                    </div>
                  </div>

                  <HeroSection
                    headline={
                      <h1 
                        className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in"
                      >
                        Roof Looking <span className="text-conversion-cyan drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">Tired?</span> Leaking? Faded?
                      </h1>
                    }
                    subheadline={
                      <p 
                        className="text-xl md:text-2xl font-semibold opacity-90 animate-fade-in"
                        style={{ animationDelay: '200ms' }}
                      >
                        15-year warranty. Local owner. No sales teams.
                      </p>
                    }
                  />
                  
                  {/* Urgency Message */}
                  <div className="mt-8 backdrop-blur-md bg-gradient-to-r from-conversion-deep/40 via-conversion-blue/30 to-conversion-cyan/30 border-2 border-conversion-cyan/50 rounded-xl p-4 inline-block shadow-[0_0_30px_rgba(0,212,255,0.3)]">
                    <p className="text-white font-bold text-base flex items-center gap-2">
                      <span className="text-conversion-cyan text-xl animate-pulse">⚡</span>
                      <span><span className="text-conversion-cyan">This Week:</span> Free $250 roof assessment with every quote</span>
                    </p>
                  </div>
                </div>

                {/* Right: Conversion Form (5 columns on desktop) */}
                <div className="lg:col-span-5 py-8">
                  <div className="sticky top-24">
                    <HeroConversionForm />
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
              Why Choose CKR?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyChooseUsData.map((item, idx) => {
                const IconComponent = {
                  Shield,
                  Phone,
                  MapPin,
                }[item.icon];

                return (
                  <div
                    key={idx}
                    className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg hover:border-conversion-cyan/60 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                        {IconComponent && (
                          <IconComponent className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-conversion-cyan transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </SectionWrapper>

        {/* Services Section */}
        <ParallaxBackground variant="services" density="low">
          <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
            <Container>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Services
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  Real Results
                </h2>
                <p className="text-white/70 text-lg">See the transformation</p>
              </div>
              <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
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
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
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
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-white">
                SE Melbourne
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {serviceAreasData.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-white hover:border-conversion-cyan/60 hover:bg-white/20 transition-all"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-center text-white/70 text-sm">
                <Link to="/quote" className="text-conversion-cyan hover:underline font-semibold">
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
