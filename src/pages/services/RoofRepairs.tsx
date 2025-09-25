import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const whatsIncluded = [
  'Replacement of cracked or broken tiles',
  'Valley iron repair or replacement',
  'Minor reseals and flashing adjustments',
  'Leak make-safe and emergency patches',
  'Photo evidence on completion'
];

const benefits = [
  'Stops active leaks and prevents water damage',
  'Protects interiors and prevents mould growth',
  'Extends the life of your roof',
  'Free roof health check and fixed-price quote'
];

const process = [
  'Free roof health check and leak assessment',
  'Identify sources of leaks and weak points',
  'Replace broken tiles and repair valley irons',
  'Apply minor reseals and adjust flashings',
  'Quality assurance and photo proof provided'
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
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const RoofRepairs = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Leak Repairs Clyde North – Fast & Reliable | Call Kaids Roofing',
        description:
          'Stop roof leaks fast with professional repairs in Clyde North & SE Melbourne. Tile replacement, valley repair, and minor resealing with photo proof. Free roof health check included.',
        canonical: 'https://callkaidsroofing.com.au/services/roof-repairs'
      }}
      hero={{
        title: 'Leak Repairs',
        subtitle:
          'Fix leaks quickly before they cause major damage. Our licensed team repairs leaks in Clyde North & SE Melbourne with photo proof and a fixed quote.'
      }}
      ctas={ctas}
      trustSignals={['500+ happy customers', '4.9/5 stars on local reviews', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Leak Repairs',
        serviceDescription:
          'Tile replacement, valley iron repairs, and emergency leak make-safe services with free roof health checks across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/leak-repairs'
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

export default RoofRepairs;
