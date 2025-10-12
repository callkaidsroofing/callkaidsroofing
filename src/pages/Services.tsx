import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star, Phone, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

export default function Services() {
  const services = [
    {
      title: 'Roof Restoration',
      summary: 'Stop leaks and renew your roof for 60-70% less than replacement.',
      description: 'Complete restoration including cleaning, repairs, rebedding and repointing with premium materials.',
      href: '/services/roof-restoration',
      badge: 'Most Popular'
    },
    {
      title: 'Roof Painting',
      summary: 'Refresh your roof colour in 2-3 days using premium paints designed for Melbourne weather.',
      description: 'Professional roof painting with high-quality paints and 10-year warranty.',
      href: '/services/roof-painting',
      badge: 'Quick Turnaround'
    },
    {
      title: 'Roof Repairs',
      summary: 'Repair leaks, replace broken tiles and restore your roof integrity.',
      description: 'Expert repairs using quality materials with same-day emergency service available.',
      href: '/services/roof-repairs',
      badge: 'Emergency Available'
    },
    {
      title: 'Gutter Cleaning',
      summary: 'Professional gutter cleaning and maintenance to protect your property.',
      description: 'Thorough cleaning and inspection with photo evidence of work completed.',
      href: '/services/gutter-cleaning'
    },
    {
      title: 'Roof Repointing',
      summary: 'Secure ridge caps and seal your roof against Melbourne weather.',
      description: 'Professional rebedding and repointing using premium SupaPoint mortar.',
      href: '/services/roof-repointing'
    },
    {
      title: 'Tile Replacement',
      summary: 'Replace broken or damaged tiles with exact matches.',
      description: 'Professional tile replacement with matching colours and quality materials.',
      href: '/services/tile-replacement'
    },
    {
      title: 'Valley Iron Replacement',
      summary: 'Replace rusted valley irons to prevent leaks and water damage.',
      description: 'Complete valley iron replacement with proper sealing and weatherproofing.',
      href: '/services/valley-iron-replacement'
    },
    {
      title: 'Leak Detection',
      summary: 'Expert leak detection and repair to protect your home.',
      description: 'Professional assessment and repair of roof leaks with guaranteed results.',
      href: '/services/leak-detection'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Roofing Services Melbourne | Call Kaids Roofing"
        description="Professional roofing services in Melbourne. Roof restoration, painting, repairs & more. 10-year warranty. Owner-operated business serving SE Melbourne."
        keywords="roofing services Melbourne, roof restoration, roof painting, roof repairs, gutter cleaning, Melbourne roofer"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Roofing Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Professional roofing solutions for Southeast Melbourne. Quality workmanship, premium materials, and 10-year warranties on all major work.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="h-5 w-5" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="h-5 w-5" />
                <span>10 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="h-5 w-5" />
                <span>200+ Happy Customers</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0435900709"
                className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                <Phone className="h-5 w-5" />
                Call 0435 900 709
              </a>
              <Button asChild variant="outline" size="lg" className="bg-white/20 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/book">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base font-medium text-primary">
                    {service.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link to={service.href}>
                    <Button className="w-full group">
                      Learn More 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Suburb-Specific Services Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Local Roofing Experts Across Southeast Melbourne</h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              Kaidyn knows every suburb personally. Get specialised service tailored to your area's specific roofing needs and regulations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Clyde North & Officer</CardTitle>
                  <CardDescription>Home base - know every street and building style</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to="/services/roof-restoration-clyde-north" className="block text-primary hover:underline">• Roof Restoration Clyde North</Link>
                    <Link to="/services/roof-painting-clyde-north" className="block text-primary hover:underline">• Roof Painting Clyde North</Link>
                    <p className="text-sm text-muted-foreground mt-2">New estates, modern materials, quality finishes</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Berwick & Pakenham</CardTitle>
                  <CardDescription>Major service areas - family-focused communities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to="/services/roof-restoration-berwick" className="block text-primary hover:underline">• Berwick Roof Specialist</Link>
                    <Link to="/services/roof-restoration-pakenham" className="block text-primary hover:underline">• Pakenham Roof Restoration</Link>
                    <Link to="/services/roof-painting-pakenham" className="block text-primary hover:underline">• Pakenham Roof Painting</Link>
                    <p className="text-sm text-muted-foreground mt-2">Established homes, renovation projects, quality upgrades</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Cranbourne & Beyond</CardTitle>
                  <CardDescription>High-volume service area - growing rapidly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to="/services/roof-restoration-cranbourne" className="block text-primary hover:underline">• Cranbourne Roof Restoration</Link>
                    <Link to="/services/roof-painting-cranbourne" className="block text-primary hover:underline">• Cranbourne Roof Painting</Link>
                    <Link to="/services/roof-restoration-mount-eliza" className="block text-primary hover:underline">• Mount Eliza Premium Service</Link>
                    <p className="text-sm text-muted-foreground mt-2">Mix of new and established, diverse roof types</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get your free roof health check from Kaidyn. No pressure, just honest advice about your roof's condition and what it needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0435900709"
                className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Phone className="h-5 w-5" />
                Call Now: 0435 900 709
              </a>
              <Button asChild variant="outline" size="lg">
                <Link to="/book">Book Free Assessment</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Usually 2-3 weeks out • Emergency repairs: Same day
            </p>
          </div>
        </div>
      </div>
    </>
  );
}