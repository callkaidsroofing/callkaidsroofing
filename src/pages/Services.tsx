import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star, Phone, ArrowRight, Home } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { PublicPageHero } from '@/public/components/PublicPageHero';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';
import ParallaxBackground from '@/components/ParallaxBackground';
import { CTASection } from '@/components/ui/cta-section';

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
      description: 'Professional roof painting with high-quality paints and workmanship warranty.',
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
      title: 'High-Pressure Roof Cleaning',
      summary: 'Remove moss, lichen and dirt buildup to extend your roof life.',
      description: 'Controlled high-pressure washing with preventative treatment and gutter clearance included.',
      href: '/services/roof-cleaning'
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
    <div className="min-h-screen">
      <SEOHead
        title="Roofing Services Melbourne | Call Kaids Roofing"
        description="Professional roofing services in Melbourne. Roof restoration, painting, repairs & more. Up to 20-year warranty on restorations. Owner-operated business serving SE Melbourne."
        keywords="roofing services Melbourne, roof restoration, roof painting, roof repairs, gutter cleaning, Melbourne roofer"
      />

      {/* Service JSON-LD Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Roofing Services Melbourne",
            "description": "Professional roofing services in Southeast Melbourne including roof restoration, painting, repairs, and maintenance",
            "url": "https://callkaidsroofing.com.au/services",
            "provider": {
              "@type": "RoofingContractor",
              "name": "Call Kaids Roofing",
              "telephone": "+61435900709",
              "areaServed": "Southeast Melbourne, VIC"
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": 9,
              "itemListElement": services.map((service, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.summary,
                  "provider": {
                    "@type": "RoofingContractor",
                    "name": "Call Kaids Roofing"
                  },
                  "areaServed": "Southeast Melbourne, VIC",
                  "url": `https://callkaidsroofing.com.au${service.href}`
                }
              }))
            }
          })}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="bg-secondary/50 border-b border-border/40">
        <Container>
          <div className="py-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Services</span>
          </div>
        </Container>
      </div>

      {/* Hero Section - LIGHT VARIANT for high readability */}
      <PublicPageHero
        variant="light"
        h1="Our Roofing Services"
        description="Professional roofing solutions for Southeast Melbourne. Quality workmanship, premium materials, and comprehensive warranties on all work."
        badges={[
          { icon: <Shield className="h-5 w-5" />, text: "Fully Insured" },
          { icon: <Award className="h-5 w-5" />, text: "15–20 Year Warranty" },
          { icon: <Star className="h-5 w-5" />, text: "200+ Happy Customers" }
        ]}
        cta={
          <>
            <Button asChild size="lg" className="font-semibold shadow-lg">
              <a href="tel:0435900709">
                <Phone className="h-5 w-5 mr-2" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/book">Get Free Quote</Link>
            </Button>
          </>
        }
      />

      {/* Main Services Grid - LIGHT & SCANNABLE */}
      <SectionWrapper className="bg-background">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Roofing Solutions
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              From minor repairs to complete restorations, we've got your roof covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              // Service-type color coding (prevents monotony while maintaining brand)
              const serviceColors = {
                'Roof Restoration': 'border-primary hover:border-primary',
                'Roof Painting': 'border-primary/30 hover:border-primary',
                'Roof Repairs': 'border-destructive/30 hover:border-destructive',
                'High-Pressure Roof Cleaning': 'border-primary/30 hover:border-primary',
                'Gutter Cleaning': 'border-roofing-success/30 hover:border-roofing-success',
              };

              const colorClass = serviceColors[service.title as keyof typeof serviceColors] || 'border-muted hover:border-primary';

              return (
                <Card
                  key={service.title}
                  className={`bg-white border-2 ${colorClass} hover:shadow-card-hover transition-all group h-full flex flex-col`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      {service.badge && (
                        <Badge className="text-xs">
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground font-medium mb-2 leading-snug">
                      {service.summary}
                    </p>
                    <p className="text-muted-foreground text-sm mb-auto leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      to={service.href}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm mt-4 transition-colors"
                    >
                      View details
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </SectionWrapper>

      {/* Proof Section - Real Work Examples */}
      <SectionWrapper background="gradient-dark" className="text-primary-foreground">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Proof in Every Service
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Real work, real results. Every project documented before and after.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Roof Restoration</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Complete restoration including rebedding, repointing, and membrane coating
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Roof Painting</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Colour refresh using premium Dulux AcraTex membrane systems
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Emergency Repairs</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Fast fixes for leaks, broken tiles, and valley iron issues
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-white/90 text-sm mb-4">
              Before & after photos from every job
            </p>
            <Link to="/portfolio" className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors">
              View full portfolio →
            </Link>
          </div>
        </Container>
      </SectionWrapper>

      {/* Suburb-Specific Services */}
      <SectionWrapper background="gradient-dark" className="text-primary-foreground">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Servicing Southeast Melbourne
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Local expertise across Clyde North, Berwick, Pakenham, Cranbourne, and surrounding suburbs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Clyde North & Officer</h3>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-clyde-north" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Roof Restoration →
                </Link>
                <Link to="/services/roof-painting-clyde-north" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Roof Painting →
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Berwick & Pakenham</h3>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-berwick" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Berwick Services →
                </Link>
                <Link to="/services/roof-restoration-pakenham" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Pakenham Restoration →
                </Link>
                <Link to="/services/roof-painting-pakenham" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Pakenham Painting →
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Cranbourne & Beyond</h3>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-cranbourne" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Cranbourne Restoration →
                </Link>
                <Link to="/services/roof-painting-cranbourne" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Cranbourne Painting →
                </Link>
                <Link to="/services/roof-restoration-mount-eliza" className="block text-primary hover:text-primary/80 text-sm transition-colors">
                  Mount Eliza Services →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Final CTA */}
      <ParallaxBackground variant="cta" density="medium">
        <CTASection
          headline="Ready to Get Started?"
          description="Get your free roof health check from Kaidyn. No pressure, just honest advice about your roof's condition and what it needs."
        />
      </ParallaxBackground>
    </div>
  );
}
