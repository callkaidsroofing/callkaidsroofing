import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Shield, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import QuickCaptureForm from "@/components/QuickCaptureForm";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileHeader } from "@/components/StickyMobileHeader";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";

const Home = () => {
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
        <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12 md:py-20 min-h-[50vh] md:min-h-0 flex items-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Roof Looking Tired? Leaking? Faded?
              </h1>
              
              <p className="text-lg md:text-2xl mb-4 opacity-90">
                15-Year Warranty • Direct Owner Contact • Local SE Melbourne
              </p>

              <div className="inline-flex items-center gap-2 bg-background/20 px-4 py-2 rounded-full text-sm md:text-base mb-6">
                <span>⭐ 4.9/5 Google Reviews</span>
                <span>•</span>
                <span>200+ Happy Customers</span>
              </div>

              <p className="text-base md:text-lg mb-8 italic opacity-80">
                "Proof In Every Roof"
              </p>

              <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 text-lg w-full sm:w-auto">
                <a href="tel:0435900709" className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Before/After Proof Carousel */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Real Results From Real Customers</h2>
              <p className="text-muted-foreground">See the transformation we deliver</p>
            </div>
            <BeforeAfterCarousel />
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-6xl">
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
                <Link key={idx} to={service.link} className="block">
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full">
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="text-lg md:text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{service.benefit}</p>
                      <div className="text-xl md:text-2xl font-bold text-primary">{service.price}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
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
                <div key={idx} className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
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
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-6xl text-center">
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

export default Home;
