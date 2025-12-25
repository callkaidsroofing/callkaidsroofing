import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star, Phone, ArrowRight } from 'lucide-react';
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

      {/* Hero Section */}
      <PublicPageHero
        h1="Our Roofing Services"
        description="Professional roofing solutions for Southeast Melbourne. Quality workmanship, premium materials, and comprehensive warranties on all work."
        badges={[
          { icon: <Shield className="h-5 w-5" />, text: "Fully Insured" },
          { icon: <Award className="h-5 w-5" />, text: "15–20 Year Warranty" },
          { icon: <Star className="h-5 w-5" />, text: "200+ Happy Customers" }
        ]}
        cta={
          <>
            <a
              href="tel:0435900709"
              className="flex items-center gap-3 bg-gradient-to-r from-conversion-blue via-conversion-cyan to-conversion-blue hover:from-conversion-cyan hover:to-conversion-deep text-white px-8 py-4 rounded-lg font-bold text-lg shadow-[0_10px_40px_rgba(41,179,255,0.5)] hover:shadow-[0_15px_50px_rgba(0,212,255,0.7)] transition-all"
            >
              <Phone className="h-5 w-5" />
              Call 0435 900 709
            </a>
            <Button asChild variant="outline" size="lg" className="bg-white/20 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/book">Get Free Quote</Link>
            </Button>
          </>
        }
      />

      {/* Main Services Grid */}
      <ParallaxBackground variant="services" density="low">
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <Container>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Roofing Solutions
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                From minor repairs to complete restorations, we've got your roof covered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg hover:border-conversion-cyan/60 transition-all group h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-conversion-cyan transition-colors">
                      {service.title}
                    </h3>
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs bg-conversion-cyan text-conversion-black">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-white text-base font-medium mb-3">
                    {service.summary}
                  </p>
                  <p className="text-white/70 text-sm mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link to={service.href}>
                    <Button className="w-full bg-conversion-blue hover:bg-conversion-cyan text-white group-hover:scale-105 transition-transform">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      </ParallaxBackground>

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
