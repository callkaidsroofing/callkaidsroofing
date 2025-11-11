import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Call Kaids Roofing | SE Melbourne's Trusted Roof Restoration Experts"
        description="Professional roof restoration, repairs & painting in SE Melbourne. 15-year warranty, direct owner contact, 0435 900 709. Proof In Every Roof."
        keywords="roof restoration Melbourne, roof repairs Berwick, roof painting Pakenham, roofing Cranbourne"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-white py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm">
              ABN 39475055075 • Fully Insured
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              SE Melbourne's Most Trusted Roof Restoration
            </h1>
            
            <p className="text-xl md:text-2xl mb-2 opacity-90">
              15-year warranty • Direct owner contact • No pressure
            </p>
            <p className="text-lg mb-8 italic opacity-80">
              "Proof In Every Roof"
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg">
                <a href="tel:0435900709" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg">
                <Link to="/quote">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">
              Professional roofing solutions for SE Melbourne homes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Roof Restoration',
                desc: 'Complete restoration including cleaning, repairs, and protective coating',
                price: 'From $4,500',
                link: '/services/roof-restoration'
              },
              {
                title: 'Roof Repairs',
                desc: 'Fast, reliable repairs for ridge caps, valleys, leaks and storm damage',
                price: 'From $350',
                link: '/services/roof-repairs'
              },
              {
                title: 'Roof Painting',
                desc: 'Premium membrane coatings with color consultation and warranty',
                price: 'From $3,800',
                link: '/services/roof-painting'
              }
            ].map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.desc}</p>
                  <div className="text-2xl font-bold text-primary mb-4">{service.price}</div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={service.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose CKR?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Phone,
                title: 'Direct Owner Contact',
                desc: 'Talk to Kaidyn directly - no sales team, just honest advice'
              },
              {
                icon: Shield,
                title: '15-Year Warranty',
                desc: 'Industry-leading workmanship guarantee plus $20M public liability'
              },
              {
                icon: Award,
                title: 'Local Experts',
                desc: 'SE Melbourne specialists who understand your area'
              },
              {
                icon: CheckCircle,
                title: 'Zero Pressure',
                desc: 'Transparent quotes, take your time, no obligation'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">We Service SE Melbourne</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['Berwick', 'Cranbourne', 'Pakenham', 'Officer', 'Narre Warren', 'Beaconsfield', 'Hallam', 'Clyde North', 'Hampton Park'].map((suburb) => (
                <Link 
                  key={suburb}
                  to={`/suburbs/${suburb.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-white rounded-md transition-colors text-sm font-medium"
                >
                  {suburb}
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground">And surrounding areas</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Restore Your Roof?</h2>
          <p className="text-xl mb-8 opacity-90">
            Free quotes • Honest advice • Zero pressure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                0435 900 709
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/quote">Book Free Inspection</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
