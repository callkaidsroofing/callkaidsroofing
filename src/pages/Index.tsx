import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Shield, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import QuickCaptureForm from "@/components/QuickCaptureForm";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileHeader } from "@/components/StickyMobileHeader";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import GoogleBusinessProfile from "@/components/GoogleBusinessProfile";
import ParallaxBackground from "@/components/ParallaxBackground";

const Index = () => {
  const serviceAreas = [
    "Berwick", "Narre Warren", "Cranbourne", "Pakenham", "Officer",
    "Beaconsfield", "Clyde", "Hampton Park", "Lyndhurst", "Endeavour Hills"
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Call Kaids Roofing - SE Melbourne's Trusted Roofing Experts"
        description="Professional roof restoration, repairs & painting in SE Melbourne. 15-year warranty, direct owner contact, 200+ happy customers. Call 0435 900 709 for a free quote."
      />

      <StickyMobileHeader />
      
      <div className="md:pt-0 pt-16">
        {/* Hero Section */}
        <ParallaxBackground variant="hero" density="high">
          <section className="relative bg-gradient-to-br from-secondary via-charcoal to-secondary text-primary-foreground py-16 md:py-24 min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
            {/* Metallic shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver/5 to-transparent opacity-50 animate-pulse" />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:40px_40px]" />
            </div>
            
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-shadow-lg">
                Roof Looking Tired? Leaking? Faded?
              </h1>
              
              <p className="text-xl md:text-3xl mb-6 opacity-95 font-medium">
                15-Year Warranty • Direct Owner Contact • Local SE Melbourne
              </p>

              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full text-base md:text-lg mb-8 shadow-lg">
                <span>⭐ 4.9/5 Google Reviews</span>
                <span className="text-white/60">•</span>
                <span>200+ Happy Customers</span>
              </div>

              <p className="text-lg md:text-2xl mb-10 italic opacity-90 font-serif">
                "Proof In Every Roof"
              </p>

              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg md:text-xl px-8 py-6 md:py-7 shadow-2xl hover:shadow-xl transition-all w-full sm:w-auto font-bold">
                <a href="tel:0435900709" className="flex items-center justify-center gap-3">
                  <Phone className="h-6 w-6" />
                  Call 0435 900 709
                </a>
              </Button>
            </div>
          </div>
        </section>
        </ParallaxBackground>

        {/* Before/After Proof Carousel */}
        <ParallaxBackground variant="testimonials" density="medium">
          <section className="py-16 md:py-24 bg-gradient-to-b from-background via-steel/10 to-background relative overflow-hidden">
            {/* Metallic accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
                Real Results From Real Customers
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See the transformation we deliver</p>
            </div>
            <BeforeAfterCarousel />
          </div>
        </section>
        </ParallaxBackground>

        {/* Google Business Profile */}
        <section className="py-16 bg-gradient-to-br from-charcoal via-secondary to-charcoal relative overflow-hidden">
          {/* Electric blue accent lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="max-w-2xl mx-auto">
              <GoogleBusinessProfile />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ParallaxBackground variant="services" density="low">
          <section className="py-12 md:py-16 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative">
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Services</h2>
              <p className="text-muted-foreground">
                Professional roofing solutions for SE Melbourne
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: '🏠',
                  title: 'Roof Restoration',
                  benefit: 'Add 15+ years to your roof\'s life',
                  price: 'From $4,500',
                  link: '/services/roof-restoration'
                },
                {
                  icon: '🔧',
                  title: 'Roof Repairs',
                  benefit: 'Fast fixes for leaks & damage',
                  price: 'From $350',
                  link: '/services/roof-repairs'
                },
                {
                  icon: '🎨',
                  title: 'Roof Painting',
                  benefit: 'Refresh & protect with premium coating',
                  price: 'From $3,800',
                  link: '/services/roof-painting'
                }
              ].map((service, idx) => (
                <Link key={idx} to={service.link} className="block group">
                  <Card className="hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 h-full border-2">
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="text-lg md:text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{service.benefit}</p>
                      <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{service.price}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </ParallaxBackground>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-background to-steel/5 relative">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose CKR?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: '15-Year Warranty',
                  desc: 'Industry-leading workmanship guarantee'
                },
                {
                  icon: Phone,
                  title: 'Direct Owner Contact',
                  desc: 'Talk to Kaidyn directly - no sales team'
                },
                {
                  icon: MapPin,
                  title: 'Local SE Melbourne',
                  desc: 'Fast response times for your area'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 md:flex-col md:items-center md:text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-blue border-2 border-primary/30">
                    <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Proudly Serving SE Melbourne
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-background border border-primary/20 rounded-full text-sm hover:border-primary/40 transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-center text-muted-foreground">
              Don't see your suburb? <Link to="/quote" className="text-primary hover:underline">Contact us</Link> - we cover all of SE Melbourne
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <ParallaxBackground variant="cta" density="medium">
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px] opacity-30" />
            <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              Book Your Free Roof Health Check This Week
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Free quotes • Honest advice • Zero pressure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90">
                <a href="tel:0435900709" className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  0435 900 709
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-background hover:text-primary">
                <Link to="/quote" className="flex items-center justify-center gap-2">
                  Request Quote Online
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        </ParallaxBackground>

        {/* Quick Capture Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <QuickCaptureForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
