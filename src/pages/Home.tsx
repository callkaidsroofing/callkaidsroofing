import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Award, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Call Kaids Roofing | SE Melbourne's Trusted Roof Restoration Experts"
        description="Professional roof restoration, repairs & painting in SE Melbourne. 15-year warranty, direct owner contact, 0435 900 709. Proof In Every Roof."
        keywords="roof restoration Melbourne, roof repairs Berwick, roof painting Pakenham, roofing Cranbourne"
      />

      {/* Hero Section - Bold & Direct */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-charcoal"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-glow)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-glow)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white/90 text-sm font-medium">ABN 39475055075 • Fully Insured • SE Melbourne</span>
            </div>
            
            <h1 className="text-white mb-6 animate-fade-in">
              Melbourne's Most Trusted Roof Restoration
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              15-year warranty. Direct owner contact. No sales pressure. 
              <span className="block mt-2 italic text-primary-glow font-semibold">"Proof In Every Roof"</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button asChild size="lg" className="btn-hero group">
                <a href="tel:0435900709" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call 0435 900 709
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary">
                <Link to="/quote">Get Free Quote</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="text-center p-4 glass-card">
                <Award className="h-8 w-8 text-primary-glow mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">15 Year</div>
                <div className="text-sm text-white/70">Warranty</div>
              </div>
              <div className="text-center p-4 glass-card">
                <Shield className="h-8 w-8 text-primary-glow mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">$20M</div>
                <div className="text-sm text-white/70">Insured</div>
              </div>
              <div className="text-center p-4 glass-card">
                <Star className="h-8 w-8 text-primary-glow mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-sm text-white/70">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Short & Punchy */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="gradient-text mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Roof restoration, repairs, and painting across SE Melbourne. Simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Roof Restoration',
                desc: 'Complete restoration from cleaning to coating. 15-year warranty included.',
                price: 'From $4,500',
                link: '/services/roof-restoration'
              },
              {
                title: 'Roof Repairs',
                desc: 'Fast, reliable repairs. Ridge caps, valleys, leaks. Same week service.',
                price: 'From $350',
                link: '/services/roof-repairs'
              },
              {
                title: 'Roof Painting',
                desc: 'Premium membrane coatings. Color consultation. 10-year guarantee.',
                price: 'From $3,800',
                link: '/services/roof-painting'
              }
            ].map((service, idx) => (
              <Card key={idx} className="hover-lift border-2 hover:border-primary group">
                <CardContent className="p-8">
                  <h3 className="text-2xl mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.desc}</p>
                  <div className="text-3xl font-bold text-primary mb-4">{service.price}</div>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                    <Link to={service.link}>
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose CKR - Direct Value Props */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-center gradient-text mb-16">Why Call Kaids Roofing?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Phone,
                title: 'Talk to Kaidyn',
                desc: 'Direct owner contact. No sales team. Real advice.'
              },
              {
                icon: Shield,
                title: '15-Year Warranty',
                desc: 'Workmanship guaranteed. $20M public liability.'
              },
              {
                icon: Award,
                title: 'Local Experts',
                desc: 'SE Melbourne specialists. We know your area.'
              },
              {
                icon: CheckCircle,
                title: 'No Pressure',
                desc: 'Transparent quotes. Take your time. Zero obligation.'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-bold">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas - Clean List */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="gradient-text mb-6">We Service SE Melbourne</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Berwick', 'Cranbourne', 'Pakenham', 'Officer', 'Narre Warren', 'Beaconsfield', 'Hallam', 'Clyde North', 'Hampton Park', 'Rowville', 'Glen Waverley'].map((suburb) => (
                <Link 
                  key={suburb}
                  to={`/suburbs/${suburb.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-white rounded-full transition-all hover-lift text-sm font-medium"
                >
                  {suburb}
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground">And surrounding SE Melbourne suburbs</p>
          </div>
        </div>
      </section>

      {/* CTA - Bold & Simple */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary-glow)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-white mb-6">Ready to Restore Your Roof?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Talk to Kaidyn today. Free quotes, honest advice, zero pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-bold">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                0435 900 709
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/quote">Book Free Inspection</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
