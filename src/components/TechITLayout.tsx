import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, ArrowRight, Star, Award, Shield, Clock } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

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

      {/* Top Utility Bar */}
      <header className="bg-primary text-primary-foreground py-2 px-4" role="banner">
        <div className="container-max mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Award className="h-3 w-3 mr-1" />
              10-Year Workmanship Warranty
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="h-3 w-3 mr-1" />
              Fully Insured
            </Badge>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="font-semibold">0435 900 709</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Rounded Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <div className="container-max mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px]">
              
              {/* Left: Copy */}
              <div className="space-y-6 text-center lg:text-left">
                {/* Kicker */}
                <div className="flex justify-center lg:justify-start">
                  <Badge className="primary-gradient text-white px-4 py-2 text-sm font-semibold">
                    Same-Day Response • 10-Year Workmanship Warranty
                  </Badge>
                </div>

                {/* H1 */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Roof Restoration Done Properly in{' '}
                  <span className="text-primary">Southeast Melbourne</span>
                </h1>

                {/* Lede */}
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Expert workmanship, premium materials, and a warranty that actually means something.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="primary-gradient text-white px-8 py-4 h-12 text-base font-semibold hover:scale-105 transition-transform"
                    onClick={() => window.location.href = 'tel:0435900709'}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call 0435 900 709
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 h-12 text-base font-semibold"
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right: Hero Image */}
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
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
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

        {/* Icon Benefit Strip */}
        <section className="section-gradient section-padding">
          <div className="container-max mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">10-Year Warranty</h3>
                <p className="text-muted-foreground text-sm">Backed by premium materials and expert workmanship</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Same-Day Response</h3>
                <p className="text-muted-foreground text-sm">Emergency repairs and fast quotes when you need them</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center">
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
              <div className="primary-gradient rounded-3xl p-8 text-white text-center shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2 mb-4">
                      FREE Roof Health Check
                    </Badge>
                    <div className="text-2xl font-bold">Usually $250 • Book before Sunday</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold">25-Point Photo Inspection</div>
                        <div className="text-sm text-white/80">Comprehensive roof assessment</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Written Report</div>
                        <div className="text-sm text-white/80">Current condition vs future needs</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold">No-Obligation Quote</div>
                        <div className="text-sm text-white/80">10-year warranty options</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 px-8 py-4 h-12 text-base font-semibold w-full md:w-auto"
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