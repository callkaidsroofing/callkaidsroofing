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
      {/* Ultra-Premium Hero Section - Full viewport height minus header */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        className="h-screen flex items-center justify-center text-white relative overflow-hidden"
        gradient="linear-gradient(135deg, rgba(0,122,204,0.95), rgba(11,59,105,0.97))"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10 max-w-6xl">
          {/* Floating decorative icons */}
          <FloatingIcons />
          
          {/* Premium Badge Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            {[
              { icon: Star, text: "200+ Happy Customers", color: "text-yellow-300" },
              { text: "10-Year Warranty", color: "text-blue-300" },
              { text: "Emergency Response 24/7", color: "text-green-300" }
            ].map((badge, index) => (
              <div key={index} className="glass-card backdrop-blur-md px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center space-x-2">
                  {badge.icon && <badge.icon className={`h-5 w-5 ${badge.color} fill-current`} />}
                  <span className="text-white font-medium">{badge.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revolutionary Typography */}
          <div className="space-y-8 mb-16">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight text-shadow-lg text-glow">
              <span className="block">Melbourne's</span>
              <span className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent gradient-move">
                Premium Roofing
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl">
                Specialists
              </span>
            </h1>
            
            <div className="w-32 h-2 bg-gradient-to-r from-primary via-secondary to-primary mx-auto rounded-full gradient-move"></div>
            
            <p className="text-2xl sm:text-3xl lg:text-4xl text-white/95 max-w-5xl mx-auto font-light leading-relaxed">
              <span className="block">Professional Roof Restoration, Painting & Emergency Repairs</span>
              <span className="block text-xl sm:text-2xl lg:text-3xl mt-4 text-white/80">
                Serving Southeast Melbourne with 10-Year Warranty
              </span>
            </p>
          </div>

          {/* Enterprise Feature Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {[
              { icon: CheckCircle, text: "Free Inspection", gradient: "from-green-400 to-emerald-500" },
              { icon: CheckCircle, text: "10-Year Warranty", gradient: "from-blue-400 to-cyan-500" },
              { icon: CheckCircle, text: "Same-Day Quotes", gradient: "from-purple-400 to-pink-500" },
              { icon: CheckCircle, text: "24/7 Emergency", gradient: "from-red-400 to-orange-500" }
            ].map((feature, index) => (
              <div key={index} className="group hover-lift">
                <div className="glass-card backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-lg font-semibold block">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Button asChild size="xl" className="btn-premium bg-primary hover:bg-primary/90 text-white border-none shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:scale-110 text-lg px-12 py-6">
              <Link to="/book">
                <Calendar className="mr-4 h-6 w-6" />
                Book Free Quote
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="btn-premium glass-card border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-md transition-all duration-500 transform hover:scale-110 text-lg px-12 py-6">
              <a href="tel:0435900709">
                <Phone className="mr-4 h-6 w-6" />
                Call 0435 900 709
              </a>
            </Button>
          </div>

          {/* Premium Service Areas */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <p className="text-2xl text-white/95 font-semibold mb-4">
              Serving Southeast Melbourne
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              <span className="block">Clyde North • Berwick • Cranbourne • Frankston • Brighton • Toorak • Pakenham</span>
              <span className="block mt-2 text-base text-white/70">
                50km radius—if you're close, we'll come have a look
              </span>
            </p>
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
