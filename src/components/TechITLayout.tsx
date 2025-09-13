import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, ArrowRight, Star, Award, Shield, Clock, Zap } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import skyBackground from '@/assets/sky-background.jpg';

interface TechITLayoutProps {
  children?: ReactNode;
}

export const TechITLayout = ({ children }: TechITLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Top Utility Bar - Sky Blue */}
      <header className="sky-gradient text-white py-2 px-4" role="banner">
        <div className="container-max mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <Badge className="trust-badge text-white border-white/30">
              <Award className="h-3 w-3 mr-1" />
              25+ Years Experience
            </Badge>
            <Badge className="trust-badge text-white border-white/30">
              <Shield className="h-3 w-3 mr-1" />
              10-Year Warranty
            </Badge>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="font-semibold highlight-yellow">0435 900 709</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Rounded Hero Section with Sky Background */}
        <section className="relative overflow-hidden">
          <OptimizedImage
            src={skyBackground}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
          
          <div className="container-max mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px]">
              
              {/* Left: Copy */}
              <div className="space-y-6 text-center lg:text-left">
                {/* Same-Day Response Badge */}
                <div className="flex justify-center lg:justify-start">
                  <Badge className="trust-badge text-white px-4 py-2 text-sm font-semibold">
                    <Zap className="h-4 w-4 mr-2" />
                    Same-Day Response Guarantee
                  </Badge>
                </div>

                {/* H1 with Metallic CALLKAIDS */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  <span className="metallic-text text-5xl md:text-6xl lg:text-7xl block mb-2">CALLKAIDS</span>
                  <span className="block">ROOFING</span>
                </h1>

                {/* Personal intro like reference */}
                <div className="glass-overlay p-6 text-white">
                  <p className="text-lg leading-relaxed">
                    I'm <strong>Kaidyn Brownlie</strong>, and I run the roofing team with 25+ years of 
                    combined experience in Southeast Melbourne. No call centre, no sales team—when you call{' '}
                    <span className="highlight-yellow font-bold">0435 900 709</span>, you're talking directly to me, the owner.
                  </p>
                </div>

                {/* Trust Indicators with Green Checkmarks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 trust-green flex-shrink-0" />
                    <span className="text-lg">Free inspection with honest advice (no BS upselling)</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 trust-green flex-shrink-0" />
                    <span className="text-lg">10-year warranty on all major work</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 trust-green flex-shrink-0" />
                    <span className="text-lg">Same-day quotes for most jobs</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 trust-green flex-shrink-0" />
                    <span className="text-lg">Emergency response when storms hit</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="sky-gradient text-white px-8 py-4 h-12 text-base font-semibold hover:scale-105 transition-transform border border-white/20"
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book Me Now—Slots Are Limited
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right: Hero Image with Trust Badges */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
                    alt="Professional roof restoration completed in Southeast Melbourne"
                    className="w-full h-full object-cover"
                    width={600}
                    height={450}
                    priority
                  />
                </div>
                
                {/* 24/7 Emergency Badge */}
                <div className="absolute -top-4 -left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  24/7
                </div>
                
                {/* Star Rating Badge */}
                <div className="absolute -bottom-4 -right-4 glass-overlay p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-white">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">4.9/5 • 200+ Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Icon Benefit Strip with Sky Background */}
        <section className="section-gradient section-padding">
          <div className="container-max mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 sky-gradient rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">10-Year Warranty</h3>
                <p className="text-muted-foreground text-sm">Backed by premium materials and expert workmanship</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 sky-gradient rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Same-Day Response</h3>
                <p className="text-muted-foreground text-sm">Emergency repairs and fast quotes when you need them</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 sky-gradient rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">500+ Happy Customers</h3>
                <p className="text-muted-foreground text-sm">Trusted throughout Southeast Melbourne</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREE Roof Health Check Offer Card */}
        <section className="section-padding">
          <div className="container-max mx-auto px-4">
            <div className="card-max mx-auto">
              <div className="glass-overlay p-8 text-white text-center shadow-2xl relative overflow-hidden">
                <OptimizedImage
                  src={skyBackground}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                  width={720}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-500/80 rounded-3xl"></div>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <Badge className="trust-badge text-white border-white/30 text-lg px-4 py-2 mb-4">
                      FREE Roof Health Check
                    </Badge>
                    <div className="text-2xl font-bold">Usually $250 • Book before Sunday</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 trust-green flex-shrink-0" />
                      <div>
                        <div className="font-semibold">25-Point Photo Inspection</div>
                        <div className="text-sm text-white/80">Comprehensive roof assessment</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 trust-green flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Written Report</div>
                        <div className="text-sm text-white/80">Current condition vs future needs</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 trust-green flex-shrink-0" />
                      <div>
                        <div className="font-semibold">No-Obligation Quote</div>
                        <div className="text-sm text-white/80">10-year warranty options</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 h-12 text-base font-semibold w-full md:w-auto"
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book Your FREE Inspection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional content sections will be added */}
        {children}
      </main>
    </div>
  );
};

export default TechITLayout;