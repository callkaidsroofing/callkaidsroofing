import { Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileHeader } from "@/components/StickyMobileHeader";
import { UtilityBar } from "@/components/UtilityBar";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import GoogleBusinessProfile from "@/components/GoogleBusinessProfile";
import QuickCaptureForm from "@/components/QuickCaptureForm";
import ParallaxBackground from "@/components/ParallaxBackground";
import { SectionWrapper, Container } from "@/components/ui/section-wrapper";
import { HeroSection } from "@/components/ui/hero-section";
import { CTASection } from "@/components/ui/cta-section";
import { FeatureCard } from "@/components/ui/feature-card";
import { HeroConversionForm } from "@/components/HeroConversionForm";
import {
  heroContent,
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
        description="Professional roof restoration, repairs & painting in SE Melbourne. 15-year warranty, direct owner contact, 200+ happy customers. Call 0435 900 709 for a free quote."
      />

      <UtilityBar />
      <StickyMobileHeader />
      
      <div className="md:pt-0 pt-16">
        {/* Hero Section with Conversion Form */}
        <ParallaxBackground variant="hero" density="high">
          <SectionWrapper
            variant="hero"
            background="gradient-dark"
            className="text-primary-foreground flex items-center"
          >
            {/* Metallic shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver/5 to-transparent opacity-50 animate-pulse" />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:40px_40px]" />
            </div>
            
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left: Hero Content (7 columns on desktop) */}
                <div className="lg:col-span-7">
                  <div className="mb-6 space-y-4">
                    {/* Huge Phone CTA - Orange Accent */}
                    <a 
                      href="tel:0435900709"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-conversion-orange to-conversion-gold hover:opacity-90 text-white px-6 py-4 rounded-xl text-2xl sm:text-3xl font-bold shadow-2xl transition-all animate-pulse"
                    >
                      <Phone className="h-8 w-8" />
                      <span>0435 900 709</span>
                    </a>
                    
                    {/* Google Rating Badge */}
                    <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg lg:ml-4">
                      <span className="text-2xl">⭐</span>
                      <div className="text-left">
                        <div className="font-bold text-roofing-navy text-sm">4.9/5 Google</div>
                        <div className="text-xs text-muted-foreground">200+ Reviews</div>
                      </div>
                    </div>
                  </div>

                  <HeroSection
                    headline={
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-shadow-lg">
                        Roof Looking <span className="text-conversion-orange">Tired?</span> Leaking? Faded?
                      </h1>
                    }
                    subheadline="15-year warranty. Local owner. No sales teams."
                  />
                  
                  {/* Urgency Message */}
                  <div className="mt-6 bg-conversion-gold/20 backdrop-blur-sm border-2 border-conversion-gold rounded-lg p-3 inline-block">
                    <p className="text-white font-semibold text-sm">
                      <span className="text-conversion-gold">⚡ This Week:</span> Free $250 roof assessment
                    </p>
                  </div>
                </div>

                {/* Right: Conversion Form (5 columns on desktop) */}
                <div className="lg:col-span-5">
                  <HeroConversionForm />
                </div>
              </div>
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Before/After Proof Carousel */}
        <ParallaxBackground variant="testimonials" density="medium">
          <SectionWrapper background="gradient-primary">
            {/* Metallic accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <Container>
              <div className="text-center mb-6 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  Real Results
                </h2>
              </div>
              <BeforeAfterCarousel />
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Google Business Profile */}
        <SectionWrapper variant="compact" background="gradient-dark" className="text-primary-foreground">
          {/* Electric blue accent lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <Container size="sm">
            <GoogleBusinessProfile />
          </Container>
        </SectionWrapper>

        {/* Services Section */}
        <ParallaxBackground variant="services" density="low">
          <SectionWrapper variant="compact" background="muted">
            <Container>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Services</h2>
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

        {/* Why Choose Us */}
        <SectionWrapper variant="compact" background="white">
          <Container>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Why CKR?
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
                    className="flex items-start gap-4 md:flex-col md:items-center md:text-center group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-blue border-2 border-primary/30">
                      {IconComponent && (
                        <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white drop-shadow-lg" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base md:text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </SectionWrapper>

        {/* Service Areas */}
        <SectionWrapper variant="compact" background="muted">
          <Container>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
              SE Melbourne
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {serviceAreasData.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-background border border-primary/20 rounded-full text-xs md:text-sm hover:border-primary/40 transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm">
              <Link to="/quote" className="text-primary hover:underline">
                Get quote
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

        {/* Quick Capture Form */}
        <QuickCaptureForm />
      </div>
    </div>
  );
};

export default Index;
