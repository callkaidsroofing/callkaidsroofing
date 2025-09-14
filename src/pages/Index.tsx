import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle, AlertTriangle, Star, Calendar } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import TrustIndicators from '@/components/TrustIndicators';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';
import FeaturedGallery from '@/components/FeaturedGallery';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import { FloatingIcons, SectionDivider, AccentPattern } from '@/components/DecorativeIcons';
import { EnhancedServiceSection } from '@/components/EnhancedServiceSection';
import QuickCaptureForm from '@/components/QuickCaptureForm';
import blueprintPattern from '/src/assets/blueprint-pattern.jpg';
import waterFlowAbstract from '/src/assets/water-flow-abstract.jpg';

const Index = () => {
  const services = [
    {
      title: "Roof Restoration",
      description: "Stop leaks before they wreck your house. Complete overhaul with 10-year warranty.",
      benefits: [
        "Complete overhaul with 10-year warranty",
        "Premium membrane that lasts 15+ years", 
        "Looks like a brand new roof"
      ],
      perfectFor: "Frankston, Narre Warren, established suburbs where roofs are 15+ years old",
      href: "/services/roof-restoration"
    },
    {
      title: "Roof Painting", 
      description: "Transform your home's look in 3 days with professional grade paints.",
      benefits: [
        "Dramatic transformation in 2-3 days",
        "Energy savings through reflective coating",
        "Premium paints designed for Melbourne weather"
      ],
      perfectFor: "Cranbourne, Point Cook, anywhere you want your house to stand out",
      href: "/services/roof-painting"
    },
    {
      title: "Emergency Repairs",
      description: "Storm damage? I'll be there same day when Melbourne weather hits hard.",
      benefits: [
        "Same-day response for urgent issues",
        "Temporary protection then permanent fix",
        "Available 24/7 for genuine emergencies"
      ],
      perfectFor: "Anyone with active leaks, storm damage, or 'oh shit' moments",
      href: "/services/roof-repairs",
      isEmergency: true
    }
  ];

  // Testimonials moved to compact component
  // Service areas moved to compact component

  return (
    <>
      <SEOHead 
        title="Professional Roofing Services Melbourne | Call Kaids Roofing | 10 Year Warranty"
        description="Expert roof restoration, painting & emergency repairs in Southeast Melbourne. 10-year warranty, premium materials, same-day quotes. Call Kaidyn: 0435 900 709"
        keywords="roof restoration Melbourne, roof painting Melbourne, emergency roof repairs, Clyde North roofer, Berwick roofing, Southeast Melbourne roofing"
        canonical="https://callkaidsroofing.com.au/"
        ogImage="https://callkaidsroofing.com.au/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
      />
      <StructuredData type="homepage" />
      <div className="page-transition">
      {/* Perfect Hero Section - Matching Reference Design */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        className="h-screen flex items-center justify-center text-white relative overflow-hidden"
        gradient="linear-gradient(135deg, rgba(0,122,204,0.95), rgba(11,59,105,0.97))"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        
        {/* Main Content Container - Centered Layout */}
        <div className="container mx-auto px-6 z-10 text-center max-w-5xl">
          
          {/* Same-Day Response Guarantee Badge */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="glass-card px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
              <span className="text-lg font-bold flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Same-Day Response Guarantee
              </span>
            </div>
          </div>

          {/* Main Headline - Clean Typography */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-wide">
            Melbourne's Premier
            <span className="block text-gradient-primary mt-2">Roofing Specialists</span>
          </h1>
          
          {/* Clean Subtext */}
          <p className="text-lg lg:text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Expert roof restoration, painting, and repairs with 10-year workmanship warranty.
            <span className="block mt-3 font-semibold text-primary">No Leaks. No Lifting. Just Quality.</span>
          </p>

          {/* Trust Indicators Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">10-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">500+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">Fully Insured</span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2 mb-10">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white/90 font-semibold">4.9/5 from 200+ reviews</span>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild
              size="lg" 
              className="premium-gradient text-white px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Link to="/contact">
                Get Your FREE Quote Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-bold transition-all duration-300"
              onClick={() => window.location.href = 'tel:0435900709'}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: 0435 900 709
            </Button>
          </div>

          {/* Service Areas - Clean */}
          <div className="text-center">
            <p className="text-white/80 text-sm">Serving South East Melbourne • 50km Radius</p>
          </div>
        </div>
      </OptimizedBackgroundSection>

      {/* Trust Indicators with Enhanced Blue Gradient */}
      <div className="section-gradient py-16">
        <TrustIndicators />
      </div>

      {/* Image Gallery with Blue Gradient Background */}
      <div className="relative py-16 overflow-hidden card-gradient">
        <OptimizedImage
          src={blueprintPattern}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-5"
          width={1600}
          height={900}
          sizes="100vw"
        />
        <div className="relative z-10">
          <FeaturedGallery />
        </div>
      </div>

      {/* Quick Capture Form with Blue Gradient */}
      <div className="section-gradient">
        <QuickCaptureForm />
      </div>

      {/* Enhanced Services Section */}
      <section className="relative py-16 overflow-hidden card-gradient">
        <AccentPattern className="opacity-3" />
        <div className="container mx-auto px-4">
          <EnhancedServiceSection services={services} />
        </div>
      </section>

      {/* Final CTA with Enhanced Blue Gradient */}
      <section className="relative py-16 overflow-hidden cta-gradient text-primary-foreground">
        <OptimizedImage
          src={waterFlowAbstract}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          width={1920}
          height={600}
          sizes="100vw"
        />
        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold">Rated #1 in Southeast Melbourne</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Get Your Roof Done Right?
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            I'm booked 2-3 weeks out because quality spreads by word of mouth. 
            Don't wait for a small leak to become a big expensive problem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">2-3 Weeks</div>
              <div className="text-sm">Next Available Slot</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">Same Day</div>
              <div className="text-sm">Emergency Response</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">This Week</div>
              <div className="text-sm">Free Inspections</div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-2xl font-semibold">
              Get your free inspection before summer storms hit
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Call Kaidyn: 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm sm:text-base">
                <Link to="/contact">Book Free Inspection</Link>
              </Button>
            </div>

            <p className="text-sm">
              Direct line to the owner • No call centers • Text or call, I'll respond within 12 hours
            </p>
            
            <div className="border-t border-white/20 pt-4 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="text-sm">
                <div className="font-semibold">10-Year</div>
                <div>Warranty</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Premium</div>
                <div>Materials</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Local</div>
                <div>Owner</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">200+</div>
                <div>Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Index;
