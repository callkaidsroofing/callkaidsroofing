import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Your Free Roof Health Check', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const benefits = [
  'Reseals and stabilises ridge caps for leak-free performance',
  'Flexible pointing compound ensures long-lasting seal',
  'Improves roof appearance and protects against storms',
  'Includes pressure cleaning and debris removal',
  'Backed by our 10-year workmanship warranty'
];

const process = [
  'Free roof health check and fixed quote',
  'Remove old mortar and prepare ridges',
  'Rebed ridges with new bedding',
  'Repoint with flexible compound',
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
  { label: 'View Roof Restoration', href: '/services/roof-restoration' },
  { label: 'Learn about Leak Repairs', href: '/services/leak-repairs' },
  { label: 'Read about our 10-Year Warranty', href: '/warranty' }
];

const RoofRepointing = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Ridge Rebedding & Repointing Clyde North – 10-Year Warranty | Call Kaids Roofing',
        description:
          'Secure your ridge caps with rebedding and repointing using flexible compounds. Serving Clyde North and SE Melbourne with a 10-year workmanship warranty and Dulux products.',
        canonical: 'https://callkaidsroofing.com.au/services/roof-repointing'
      }}
      hero={{
        title: 'Ridge Rebedding & Repointing',
        subtitle:
          'Strengthen and reseal your ridges for a leak-free roof. Professional rebedding and repointing in Clyde North & SE Melbourne with photo proof and a 10-year warranty.'
      }}
      ctas={ctas}
      trustSignals={['500+ happy customers', '4.9/5 stars on local reviews', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Ridge Rebedding & Repointing',
        serviceDescription:
          'Ridge cap rebedding, flexible repointing compound, and pressure cleaning with a 10-year workmanship warranty across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/ridge-repointing'
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

export default RoofRepointing;
