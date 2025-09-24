import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const pageCtas: ServiceCta[] = [
  { label: 'Book Your Free Roof Health Check', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const featuredServices = [
  {
    title: 'Roof Restoration',
    value: 'Clean, repair, and protect your roof with a full restoration using Dulux membranes and a 10-year warranty.',
    benefits: [
      'Stops leaks and prevents water damage',
      'Adds years to your roof with premium Dulux membranes',
      'Includes ridge rebedding, repointing, and photo proof'
    ],
    slug: '/roof-restoration'
  },
  {
    title: 'Ridge Rebedding & Repointing',
    value: 'Secure ridges and restore stability to your roof with expert rebedding and repointing, backed by our 10-year warranty.',
    benefits: [
      'Reseals and stabilises ridge caps for leak-free performance',
      'Extends roof life with durable compounds designed for Melbourne weather',
      'Photo proof and clean-up included'
    ],
    slug: '/ridge-repointing'
  },
  {
    title: 'Leak Repairs',
    value: 'Fix leaks fast with professional repairs and make-safe solutions, preventing costly damage to your home.',
    benefits: [
      'Stops active leaks and prevents new ones',
      'Includes tile replacement, valley repair, and minor resealing',
      'Fast response with photo-backed proof on completion'
    ],
    slug: '/leak-repairs'
  }
];

const additionalServices = [
  {
    name: 'Roof Pressure Cleaning',
    description: 'Thoroughly cleans tiles and valleys to remove dirt, moss, and lichen.',
    href: '/services/roof-pressure-cleaning'
  },
  {
    name: 'Valley Iron Replacement',
    description: 'Replaces rusted or damaged valley irons to ensure proper water runoff.',
    href: '/services/valley-iron-replacement'
  },
  {
    name: 'Gutter Cleaning',
    description: 'Clears gutters and downpipes to prevent blockages and protect fascia and foundations.',
    href: '/services/gutter-cleaning'
  },
  {
    name: 'Resarking & Battening',
    description: 'Replaces sarking and battens for improved waterproofing and insulation.',
    href: '/services/resarking-battening'
  },
  {
    name: 'Re-roof & Extensions',
    description: 'Provides seamless re-roofing and tie-ins for extensions with matched materials and flashings.',
    href: '/services/re-roof-extensions'
  },
  {
    name: 'Free Roof Health Check',
    description: 'Offers a no-obligation inspection and report so you know the condition of your roof.',
    href: '/services/health-check'
  }
];

const bundles = [
  'Bundle A: Ridge Rebedding & Repointing + Pressure Wash',
  'Bundle B: Gutter Cleaning + Minor Ridge Repointing',
  'Bundle C: Valley Iron Replacement + Leak Make-Safe',
  'Bundle D: Health Check + Maintenance Pack'
];

const trustSignals = [
  '500+ happy customers',
  '4.9/5 stars',
  'Fully licensed & insured',
  'Dulux membranes',
  '10-year workmanship warranty'
];

const serviceAreas = [
  'Clyde North',
  'Pakenham',
  'Narre Warren',
  'Cranbourne',
  'Berwick',
  'Frankston',
  'Dandenong',
  'Brighton',
  'Suburbs within 50 km of Clyde North'
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <SEOHead
        title="Roofing Services Clyde North & SE Melbourne – 10-Year Warranty | Call Kaids Roofing"
        description="Explore our range of featured and additional roofing services in Clyde North and SE Melbourne. Benefit from Dulux products, a 10-year workmanship warranty, and a free roof health check."
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-[#0B3B69] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Roofing Services in Clyde North & SE Melbourne</h1>
          <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
            Discover all our roofing services from restoration and repairs to inspections and bundles. Our top services are featured first, making it easy to find exactly what your roof needs.
          </p>
          <div className="mt-8 flex justify-center">
            <ServiceCtas ctas={pageCtas} align="center" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Featured Services</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            These are the services homeowners book most often for long-lasting, compliant results backed by our 10-year workmanship warranty.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredServices.map((service) => (
              <div key={service.title} className="flex h-full flex-col rounded-2xl border border-primary/10 bg-background p-6 shadow-sm">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="mt-3 text-muted-foreground">{service.value}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <ServiceCtas ctas={pageCtas} align="stretch" />
                  <Link to={service.slug} className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Additional Services</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Our additional services complement the featured work and can be booked separately or as part of a bundle.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {additionalServices.map((service) => (
              <Link
                key={service.name}
                to={service.href}
                className="group flex flex-col justify-between rounded-2xl border border-primary/10 bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{service.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                </div>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Explore service
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Bundles</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Save 10–20% by combining services in one visit with our bundle deals. Choose from four options designed to extend your roof’s life for less.
          </p>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {bundles.map((bundle) => (
              <li key={bundle} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" aria-hidden />
                <span>{bundle}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link to="/bundles" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View bundle deals
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Trust Block</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {trustSignals.map((signal) => (
              <span key={signal} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {signal}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Service Areas</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            We serve Clyde North, Pakenham, Narre Warren, Cranbourne, Berwick, Frankston, Dandenong, Brighton, and suburbs within 50 km of Clyde North.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area) => (
              <div key={area} className="rounded-2xl border border-primary/10 bg-background p-4 text-sm font-medium text-foreground shadow-sm">
                {area}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/10 bg-primary/5 p-10 text-center shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to book Kaidyn?</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Secure your spot for a free roof health check or call for fast advice. We keep scheduling simple and transparent.
          </p>
          <div className="mt-6 flex justify-center">
            <ServiceCtas ctas={pageCtas} align="center" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
