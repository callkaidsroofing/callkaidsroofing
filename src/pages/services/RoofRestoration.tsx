import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Your Free Roof Health Check', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const benefits = [
  'Stops leaks and prevents costly water damage',
  'Premium Dulux membranes designed for Melbourne weather',
  'Fresh new look that boosts street appeal and property value',
  'Includes ridge rebedding and repointing',
  '500+ happy customers, 4.9/5 star rating',
  'Backed by our 10-year workmanship warranty'
];

const process = [
  'Free roof health check and fixed quote',
  'Repairs and ridge rebedding & repointing',
  'Full pressure clean and prep',
  'Primer + two-coat Dulux membrane',
  'Quality assurance and photos delivered'
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
  { label: 'Learn about Ridge Rebedding & Repointing', href: '/services/roof-repointing' },
  { label: 'View Roof Pressure Cleaning', href: '/services/roof-pressure-cleaning' },
  { label: 'Read about our 10-Year Warranty', href: '/warranty' }
];

const RoofRestoration = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Full Roof Restoration Clyde North & SE Melbourne – 10-Year Warranty | Call Kaids Roofing',
        description:
          'Restore your roof with cleaning, rebedding, repointing, and Dulux membrane coating. Serving Clyde North and SE Melbourne with a 10-year workmanship warranty and photo proof.'
      }}
      hero={{
        title: 'Full Roof Restorations',
        subtitle:
          'Protect your home and add years of life. Full roof restorations in Clyde North & SE Melbourne with a 10-year workmanship warranty, premium Dulux membranes, and photo proof on completion.'
      }}
      ctas={ctas}
      trustSignals={['500+ happy customers', '4.9/5 star rating', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Full Roof Restoration',
        serviceDescription:
          'Cleaning, ridge rebedding and repointing, and Dulux membrane coating with a 10-year workmanship warranty across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/roof-restoration'
      }}
    >
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
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Process</h2>
        <ol className="space-y-4 text-muted-foreground">
          {process.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                {index + 1}
              </span>
              <span className="pt-2 text-base">{step}</span>
            </li>
          ))}
        </ol>
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

export default RoofRestoration;
