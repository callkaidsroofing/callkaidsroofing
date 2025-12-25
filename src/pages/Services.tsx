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
            <Button asChild variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-sm">
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
                'Roof Restoration': 'border-primary hover:border-primary hover:shadow-primary/20',
                'Roof Painting': 'border-conversion-cyan/30 hover:border-conversion-cyan hover:shadow-conversion-cyan/20',
                'Roof Repairs': 'border-destructive/30 hover:border-destructive hover:shadow-destructive/20',
                'High-Pressure Roof Cleaning': 'border-primary/30 hover:border-primary hover:shadow-primary/20',
                'Gutter Cleaning': 'border-roofing-success/30 hover:border-roofing-success hover:shadow-roofing-success/20',
              };

              const colorClass = serviceColors[service.title as keyof typeof serviceColors] || 'border-muted hover:border-primary hover:shadow-primary/20';

              return (
                <article
                  key={service.title}
                  className={`bg-white border-2 ${colorClass} rounded-xl p-6 hover:shadow-xl transition-all duration-300 group h-full flex flex-col`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    {service.badge && (
                      <Badge className="text-xs bg-primary text-white">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground text-base font-medium mb-3">
                    {service.summary}
                  </p>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link to={service.href}>
                    <Button className="w-full font-semibold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </article>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Proof Block 1 - Roof Restoration */}
            <figure className="backdrop-blur bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-conversion-cyan/60 transition-all">
              <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="relative z-10 text-center p-6">
                  <p className="text-white/90 text-sm font-medium mb-2">
                    Before/After photos from real jobs in Clyde North, Berwick, and Pakenham
                  </p>
                  <p className="text-white/60 text-xs">
                    All work documented · <Link to="/portfolio" className="text-conversion-cyan hover:underline">View full portfolio →</Link>
                  </p>
                </div>
              </div>
              <figcaption className="p-4 text-sm">
                <p className="text-white font-semibold mb-1">Roof Restoration Work</p>
                <p className="text-white/70">Complete restoration including rebedding, repointing, and membrane coating</p>
              </figcaption>
            </figure>

            {/* Proof Block 2 - Roof Painting */}
            <figure className="backdrop-blur bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-conversion-cyan/60 transition-all">
              <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-conversion-blue/20 to-conversion-cyan/20" />
                <div className="relative z-10 text-center p-6">
                  <p className="text-white/90 text-sm font-medium mb-2">
                    Roof painting transformations across SE Melbourne
                  </p>
                  <p className="text-white/60 text-xs">
                    Premium paints · 2-3 day turnaround
                  </p>
                </div>
              </div>
              <figcaption className="p-4 text-sm">
                <p className="text-white font-semibold mb-1">Roof Painting Projects</p>
                <p className="text-white/70">Colour refresh using premium Dulux AcraTex membrane systems</p>
              </figcaption>
            </figure>

            {/* Proof Block 3 - Emergency Repairs */}
            <figure className="backdrop-blur bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-conversion-cyan/60 transition-all">
              <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-conversion-orange/20" />
                <div className="relative z-10 text-center p-6">
                  <p className="text-white/90 text-sm font-medium mb-2">
                    Emergency leak repairs and tile replacements
                  </p>
                  <p className="text-white/60 text-xs">
                    Same-day service available
                  </p>
                </div>
              </div>
              <figcaption className="p-4 text-sm">
                <p className="text-white font-semibold mb-1">Repair Work Examples</p>
                <p className="text-white/70">Fast fixes for leaks, broken tiles, and valley iron issues</p>
              </figcaption>
            </figure>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/70 text-sm">
              Every job photographed before and after. <Link to="/warranty" className="text-conversion-cyan hover:underline font-semibold">15-year warranty on restoration work →</Link>
            </p>
          </div>
        </Container>
      </SectionWrapper>

      {/* Suburb-Specific Services */}
      <SectionWrapper background="gradient-dark" className="text-primary-foreground">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Local Roofing Experts Across Southeast Melbourne
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Kaidyn knows every suburb personally. Get specialised service tailored to your area's specific roofing needs and regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Clyde North & Officer</h3>
              <p className="text-white/70 text-sm mb-4">Home base - know every street and building style</p>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-clyde-north" className="block text-conversion-cyan hover:underline">
                  • Roof Restoration Clyde North
                </Link>
                <Link to="/services/roof-painting-clyde-north" className="block text-conversion-cyan hover:underline">
                  • Roof Painting Clyde North
                </Link>
                <p className="text-sm text-white/60 mt-2">New estates, modern materials, quality finishes</p>
              </div>
            </div>

            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Berwick & Pakenham</h3>
              <p className="text-white/70 text-sm mb-4">Major service areas - family-focused communities</p>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-berwick" className="block text-conversion-cyan hover:underline">
                  • Berwick Roof Specialist
                </Link>
                <Link to="/services/roof-restoration-pakenham" className="block text-conversion-cyan hover:underline">
                  • Pakenham Roof Restoration
                </Link>
                <Link to="/services/roof-painting-pakenham" className="block text-conversion-cyan hover:underline">
                  • Pakenham Roof Painting
                </Link>
                <p className="text-sm text-white/60 mt-2">Established homes, renovation projects, quality upgrades</p>
              </div>
            </div>

            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Cranbourne & Beyond</h3>
              <p className="text-white/70 text-sm mb-4">High-volume service area - growing rapidly</p>
              <div className="space-y-2">
                <Link to="/services/roof-restoration-cranbourne" className="block text-conversion-cyan hover:underline">
                  • Cranbourne Roof Restoration
                </Link>
                <Link to="/services/roof-painting-cranbourne" className="block text-conversion-cyan hover:underline">
                  • Cranbourne Roof Painting
                </Link>
                <Link to="/services/roof-restoration-mount-eliza" className="block text-conversion-cyan hover:underline">
                  • Mount Eliza Premium Service
                </Link>
                <p className="text-sm text-white/60 mt-2">Mix of new and established, diverse roof types</p>
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
