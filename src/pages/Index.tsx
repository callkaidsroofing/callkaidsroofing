import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, ArrowRight, CheckCircle, AlertTriangle, Star, Calendar } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import TrustIndicators from '@/components/TrustIndicators';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';
import FeaturedGallery from '@/components/FeaturedGallery';
import { OptimizedImage } from '@/components/OptimizedImage';
import { FloatingIcons, SectionDivider, AccentPattern } from '@/components/DecorativeIcons';
import { EnhancedServiceSection } from '@/components/EnhancedServiceSection';
import QuickCaptureForm from '@/components/QuickCaptureForm';
import NavigationFlowOptimizer from '@/components/NavigationFlowOptimizer';
import StrategicCTAManager from '@/components/StrategicCTAManager';
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
        title="Call Kaids Roofing | Roof Restorations Clyde North & SE Melbourne"
        description="Local roofing experts in Clyde North. Roof restorations, painting, repairs & gutter cleaning with 10-year warranty. Call 0435 900 709 today."
        keywords="roof restorations Clyde North, roof painting southeast Melbourne, gutter cleaning Clyde North, roof repairs Berwick"
        ogImage="https://callkaidsroofing.com.au/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d-1200.jpg"
      />
      <StructuredData type="homepage" />
      <div className="page-transition">
      {/* Hero Section - Proof In Every Roof Strategy */}
      <section className="relative w-full min-h-[100vh] md:min-h-screen flex items-center justify-center text-center text-white overflow-hidden bg-roofing-navy">
        {/* 1. "Proof" Background Image with Fallback */}
        <OptimizedBackgroundSection
          backgroundImage="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png"
          className="absolute inset-0 w-full h-full"
          imageAlt="Professional roof restoration completed project"
          priority
          sizes="100vw"
        >
          {/* 2. Stronger Dark Overlay for Better Mobile Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-roofing-navy/85 via-roofing-navy/75 to-roofing-navy/85 z-10" />
        </OptimizedBackgroundSection>

        {/* 3. Content Container with Better Mobile Spacing */}
        <div className="relative z-20 flex flex-col items-center gap-y-4 md:gap-y-6 px-4 py-24 md:py-32 mt-20 md:mt-0">
          
          {/* 4. Upgraded Guarantee Badge */}
          <Badge variant="secondary" className="border-none bg-white/20 backdrop-blur-sm text-xs md:text-sm font-medium px-4 md:px-6 py-2 md:py-3 shadow-lg">
            Guaranteed Same-Day Response
          </Badge>
          
          {/* 5. Refined Headline Typography with Better Contrast */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            SE Melbourne's Most Trusted <br />
            Roof Restoration Experts
          </h1>
          
          <p className="max-w-2xl text-base md:text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium px-2">
            We transform and protect your home with superior craftsmanship, backed by an iron-clad <strong>15-year warranty</strong> and photo-backed proof.
          </p>

          {/* 6. Upgraded Call-to-Action Button - Mobile Optimized */}
          <Button 
            size="lg" 
            className="bg-roofing-blue hover:bg-roofing-blue/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-2xl w-full sm:w-auto max-w-sm"
            onClick={() => window.location.href = 'tel:0435900709'}
          >
            <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Call Now for a Free Quote
          </Button>
          <p className="text-sm md:text-base font-bold drop-shadow-md">0435 900 709</p>

          {/* Trust Indicators Row - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-6 md:mt-8 w-full max-w-lg">
            <div className="flex items-center justify-center gap-2 text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-roofing-blue flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base">15-Year Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-roofing-blue flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base">500+ Happy Customers</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-roofing-blue flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base">Fully Insured</span>
            </div>
          </div>

          {/* Star Rating - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 md:h-6 md:w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white font-semibold text-sm md:text-base">4.9/5 from 200+ reviews</span>
          </div>

          {/* Service Areas */}
          <div className="text-center mt-4">
            <p className="text-white/90 text-xs md:text-sm font-medium drop-shadow-md">Serving South East Melbourne • 50km Radius</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators with Enhanced Blue Gradient */}
      <div className="section-gradient py-16">
        <TrustIndicators />
      </div>

      {/* Strategic Navigation Flow */}
      <div className="container mx-auto px-4 py-8">
        <NavigationFlowOptimizer showLocalNavigation={true} />
      </div>

      {/* Image Gallery with Blue Gradient Background */}
      <div className="relative py-16 overflow-hidden card-gradient">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 55%),' +
              'radial-gradient(circle at 80% 5%, rgba(14,116,144,0.3), transparent 50%),' +
              'radial-gradient(circle at 50% 85%, rgba(37,99,235,0.25), transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px),' +
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '120px 120px',
          }}
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
          
          {/* Strategic Links to Hidden Pages - Local SEO Optimized */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 text-primary">Complete Roofing Solutions for Southeast Melbourne</h3>
            
            {/* Suburb-Specific Service Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                <h4 className="text-lg font-semibold mb-4 text-primary">Popular Service Areas</h4>
                <div className="space-y-2 text-left">
                  <Link to="/services/roof-restoration-clyde-north" className="block text-sm hover:text-primary transition-colors">
                    🏠 Roof Restoration Clyde North
                  </Link>
                  <Link to="/services/roof-restoration-berwick" className="block text-sm hover:text-primary transition-colors">
                    🏠 Professional Roofing Berwick
                  </Link>
                  <Link to="/services/roof-painting-cranbourne" className="block text-sm hover:text-primary transition-colors">
                    🎨 Roof Painting Cranbourne
                  </Link>
                  <Link to="/services/roof-restoration-pakenham" className="block text-sm hover:text-primary transition-colors">
                    ⭐ Trusted Roofer Pakenham
                  </Link>
                  <Link to="/services/roof-painting-pakenham" className="block text-sm hover:text-primary transition-colors">
                    🎨 Quality Roof Painting Pakenham
                  </Link>
                </div>
              </div>
              
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                <h4 className="text-lg font-semibold mb-4 text-primary">Specialist Services</h4>
                <div className="space-y-2 text-left">
                  <Link to="/services/leak-detection" className="block text-sm hover:text-primary transition-colors">
                    🔍 Emergency Leak Detection
                  </Link>
                  <Link to="/services/valley-iron-replacement" className="block text-sm hover:text-primary transition-colors">
                    🔧 Valley Iron Replacement
                  </Link>
                  <Link to="/services/tile-replacement" className="block text-sm hover:text-primary transition-colors">
                    🧱 Broken Tile Replacement
                  </Link>
                  <Link to="/services/roof-repointing" className="block text-sm hover:text-primary transition-colors">
                    🛠️ Ridge Cap Repointing
                  </Link>
                  <Link to="/services/gutter-cleaning" className="block text-sm hover:text-primary transition-colors">
                    💧 Professional Gutter Cleaning
                  </Link>
                </div>
              </div>
              
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                <h4 className="text-lg font-semibold mb-4 text-primary">Customer Resources</h4>
                <div className="space-y-2 text-left">
                  <Link to="/warranty" className="block text-sm hover:text-primary transition-colors">
                    🛡️ 10-Year Workmanship Warranty
                  </Link>
                  <Link to="/gallery" className="block text-sm hover:text-primary transition-colors">
                    📸 Before & After Gallery
                  </Link>
                  <Link to="/blog" className="block text-sm hover:text-primary transition-colors">
                    📚 Expert Roofing Guides
                  </Link>
                  <Link to="/emergency" className="block text-sm hover:text-primary transition-colors">
                    🚨 Same-Day Emergency Repairs
                  </Link>
                  <Link to="/about" className="block text-sm hover:text-primary transition-colors">
                    👨‍💼 Meet Kaidyn - Local Owner
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/book">Book Free Roof Health Check</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/gallery">View Our Work Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic CTA Management */}
      <div className="container mx-auto px-4">
        <StrategicCTAManager />
      </div>

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
                <Link to="/book">Book Free Inspection</Link>
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
