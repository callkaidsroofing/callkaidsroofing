import { Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
                    {/* Huge Phone CTA - Orange Accent */}
                    <motion.a 
                      href="tel:0435900709"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-conversion-orange to-conversion-gold hover:from-conversion-gold hover:to-conversion-orange text-white px-8 py-5 rounded-2xl text-3xl sm:text-4xl font-black shadow-[0_10px_40px_rgba(255,107,53,0.4)] hover:shadow-[0_15px_50px_rgba(255,107,53,0.6)] transition-all duration-300 hover:scale-105"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="h-10 w-10 animate-pulse" />
                      <span>0435 900 709</span>
                    </motion.a>
                    
                    {/* Google Rating Badge */}
                    <motion.div 
                      className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl lg:ml-4 border-2 border-primary/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-3xl">⭐</span>
                      <div className="text-left">
                        <div className="font-black text-roofing-navy text-base">4.9/5 Google</div>
                        <div className="text-xs text-muted-foreground font-semibold">200+ Reviews</div>
                      </div>
                    </motion.div>
                  </div>

                  <HeroSection
                    headline={
                      <motion.h1 
                        className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        Roof Looking <span className="text-conversion-orange drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">Tired?</span> Leaking? Faded?
                      </motion.h1>
                    }
                    subheadline={
                      <motion.p 
                        className="text-xl md:text-2xl font-semibold opacity-90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        15-year warranty. Local owner. No sales teams.
                      </motion.p>
                    }
                  />
                  
                  {/* Urgency Message */}
                  <div className="mt-8 backdrop-blur-md bg-gradient-to-r from-conversion-gold/30 to-conversion-orange/30 border-2 border-conversion-gold/50 rounded-xl p-4 inline-block shadow-2xl">
                    <p className="text-white font-bold text-base flex items-center gap-2">
                      <span className="text-conversion-gold text-xl">⚡</span>
                      <span><span className="text-conversion-gold">This Week:</span> Free $250 roof assessment with every quote</span>
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

        {/* Before/After Proof Carousel */}
        <ParallaxBackground variant="testimonials" density="medium">
          <SectionWrapper background="white">
            <Container>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Real Results
                </h2>
              </div>
              <div className="backdrop-blur bg-card/50 border border-border/50 rounded-2xl p-4 shadow-lg">
                <BeforeAfterCarousel />
              </div>
            </Container>
          </SectionWrapper>
        </ParallaxBackground>

        {/* Google Business Profile */}
        <SectionWrapper variant="compact" background="muted">
          <Container size="sm">
            <div className="backdrop-blur bg-card/50 border border-primary/20 rounded-2xl p-6 shadow-lg">
              <GoogleBusinessProfile />
            </div>
          </Container>
        </SectionWrapper>

        {/* Services Section */}
        <ParallaxBackground variant="services" density="low">
          <SectionWrapper variant="compact" background="white">
            <Container>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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

        {/* Why Choose Us */}
        <SectionWrapper variant="compact" background="muted">
          <Container>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why CKR?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {whyChooseUsData.map((item, idx) => {
                const IconComponent = {
                  Shield,
                  Phone,
                  MapPin,
                }[item.icon];

                return (
                  <div
                    key={idx}
                    className="backdrop-blur bg-card/50 border border-border/50 rounded-xl p-5 hover:shadow-lg hover:border-primary/40 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        {IconComponent && (
                          <IconComponent className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-xs">
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
        <SectionWrapper variant="compact" background="white">
          <Container>
            <div className="backdrop-blur bg-card/50 border border-border/50 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SE Melbourne
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {serviceAreasData.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-background/80 border border-primary/20 rounded-full text-xs hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-center text-muted-foreground text-sm">
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

        {/* Quick Capture Form */}
        <QuickCaptureForm />
      </div>
    </div>
  );
};

export default Index;
