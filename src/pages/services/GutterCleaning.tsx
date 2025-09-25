import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const whatsIncluded = [
  'Full debris removal from gutters and valleys',
  'Downpipe flush where accessible',
  'Minor seal checks and repairs',
  'Before/after photo proof',
  'Debris disposal off-site'
];

const benefits = [
  'Prevents leaks, staining, and rot',
  'Protects fascia and foundations',
  'Improves roof lifespan',
  'Eliminates pest and mosquito breeding grounds'
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
  'Suburbs within 50 km'
];

const relatedLinks = [
  { label: 'Learn about Roof Pressure Cleaning', href: '/services/roof-pressure-cleaning' },
  { label: 'View Ridge Rebedding & Repointing', href: '/services/roof-repointing' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const GutterCleaning = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Gutter Cleaning Clyde North – Prevent Overflows | Call Kaids Roofing',
        description:
          'Keep gutters and downpipes clear with professional cleaning and photo proof. Prevent water damage and foundation issues. Serving Clyde North & SE Melbourne.',
        canonical: 'https://callkaidsroofing.com.au/services/gutter-cleaning'
      }}
      hero={{
        title: 'Gutter Cleaning',
        subtitle: 'Stay off the ladder — we keep your gutters clear, safe, and flowing.'
      }}
      ctas={ctas}
      trustSignals={['Licensed & insured', 'Safety harnesses always used']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Gutter Cleaning',
        serviceDescription:
          'Professional gutter and downpipe cleaning with debris removal, minor repairs, and photo proof across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/gutter-cleaning'
      }}
    >
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">What’s Included</h2>
        <ul className="space-y-3 text-muted-foreground">
          {whatsIncluded.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Benefits</h2>
        <ul className="space-y-3 text-muted-foreground">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Service Areas</h2>
        <p className="mb-4 text-muted-foreground">
          Serving Clyde North, Pakenham, Narre Warren, Cranbourne, Berwick, Frankston, Dandenong, Brighton, and suburbs within 50 km.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {serviceAreas.map((area) => (
            <div key={area} className="rounded-2xl border border-primary/10 bg-background p-4 text-sm font-medium text-foreground shadow-sm">
              {area}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">CTAs</h2>
        <ServiceCtas ctas={ctas} />
      </section>
    </ServicePageLayout>
  );
};

export default GutterCleaning;
