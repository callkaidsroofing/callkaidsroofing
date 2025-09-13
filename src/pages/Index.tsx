import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
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
        title="Melbourne's Best Roofing Team | Call Kaids Roofing | 25+ Years Experience"
        description="Professional roof restoration, painting & emergency repairs across Melbourne. 10-year warranty, premium materials, honest service. Call Kaidyn: 0435 900 709"
        keywords="roof restoration Melbourne, roof painting Melbourne, emergency roof repairs, Clyde North roofer, Berwick roofing, Southeast Melbourne roofing, professional roofer"
        canonical="https://callkaidsroofing-com-au.lovable.app/"
        ogImage="https://callkaidsroofing-com-au.lovable.app/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      {/* Hero Section with Background Image */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        className="py-20 text-white"
        gradient="linear-gradient(rgba(0,122,204,0.8), rgba(11,59,105,0.9))"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Floating decorative icons */}
          <FloatingIcons />
          
          {/* Social Proof Banner */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4">
            <Badge variant="secondary" className="bg-primary/20 text-white border-white/20 text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 fill-current" />
              200+ Happy Customers
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-white border-white/20 text-xs sm:text-sm">
              10-Year Warranty
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-white border-white/20 text-xs sm:text-sm">
              Emergency Response
            </Badge>
          </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-shadow-lg">
              Melbourne's Best Roofing
            </h1>
           <p className="text-xl sm:text-2xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 font-medium">
              Stop leaks. Transform your roof. Emergency repairs. 10-year warranty.
            </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/20">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-white text-sm">Free inspection</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/20">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-white text-sm">10-year warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/20">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-white text-sm">Same-day quotes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/20">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-white text-sm">Emergency response</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild variant="secondary" size="xl">
              <Link to="/contact">Book Me Now—Slots Are Limited</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
          </div>

          <p className="text-sm text-white/80 text-center">
            Serving: Clyde North • Berwick • Cranbourne • Frankston • Brighton • Toorak<br />
            <span className="block">50km radius—if you're close, I'll come have a look</span>
          </p>
        </div>
      </OptimizedBackgroundSection>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Image Gallery */}
      <div className="relative bg-gradient-to-br from-secondary/5 to-primary/10 py-16 overflow-hidden">
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

      {/* Quick Capture Form */}
      <QuickCaptureForm />

      <section className="relative py-16 bg-gradient-to-br from-primary/5 to-secondary/10 overflow-hidden">
        <AccentPattern className="opacity-3" />
        <div className="container mx-auto px-4">
          <EnhancedServiceSection services={services} />
        </div>
      </section>

      {/* Final CTA with flowing water background */}
      <section className="relative py-16 cta-gradient text-primary-foreground overflow-hidden">
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
