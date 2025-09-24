import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const whatsIncluded = [
  'Removal of old or rusted valley irons',
  'Inspection of valley boards and surrounding tiles',
  'Installation of new valley irons and breathable sarking',
  'Bedding and pointing around the valley edges',
  'Photo evidence on completion'
];

const benefits = [
  'Ensures proper water runoff at the roof valleys',
  'Prevents leaks and water damage',
  'Extends the life of your roof',
  'Uses compliant materials and Dulux membranes where applicable'
];

const process = [
  'Free roof health check and fixed quote',
  'Remove old valley irons and assess valley boards',
  'Install new valley irons with breathable sarking',
  'Apply bedding and pointing',
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
  { label: 'Learn about Leak Repairs', href: '/services/leak-repairs' },
  { label: 'View Ridge Rebedding & Repointing', href: '/services/roof-repointing' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const ValleyIronReplacement = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Valley Iron Replacement Clyde North – Prevent Leaks | Call Kaids Roofing',
        description:
          'Replace rusted or damaged valley irons to ensure proper water runoff. Serving Clyde North & SE Melbourne with new sarking, secure edges, and a 10-year workmanship warranty.'
      }}
      hero={{
        title: 'Valley Iron Replacement',
        subtitle:
          'Protect your roof from leaks at the valleys. Professional valley iron replacements in Clyde North & SE Melbourne with photo proof and a 10-year warranty.'
      }}
      ctas={ctas}
      trustSignals={['500+ happy customers', '4.9/5 stars on local reviews', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Valley Iron Replacement',
        serviceDescription:
          'Valley iron removal, sarking replacement, and new bedding with a 10-year workmanship warranty across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/valley-iron-replacement'
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

export default ValleyIronReplacement;
