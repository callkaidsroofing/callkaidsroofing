import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const scopes = [
  'Full re-roof (tile or metal)',
  'Extension tie-ins with saddles and aprons',
  'New valleys, ridges, and flashings',
  'Compliance certification provided'
];

const benefits = [
  'Profile and colour matched to existing roof',
  'Leak-free finishes with correct flashings',
  'Full compliance with building codes',
  'Boosts home value and longevity'
];

const process = [
  'Strip and inspect existing structure',
  'Install sarking and battens',
  'Fit new roof materials with valleys and flashings',
  'Quality assurance and hose-test',
  'Provide compliance certification'
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
  { label: 'Learn about Resarking & Battening', href: '/services/resarking-battening' },
  { label: 'View Roof Restoration', href: '/services/roof-restoration' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const ReroofAndExtensions = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Re-roof & Extensions Clyde North – Tie-in Specialists | Call Kaids Roofing',
        description:
          'Full or partial re-roofs and seamless tie-ins for extensions with matched profiles and flashings. Serving Clyde North & SE Melbourne with compliance certification and a 10-year workmanship warranty.'
      }}
      hero={{
        title: 'Re-roof & Extensions',
        subtitle: 'Seamless tie-ins and compliant re-roofs that match your home perfectly.'
      }}
      ctas={ctas}
      trustSignals={['Compliance certificates included', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Re-roof & Extensions',
        serviceDescription:
          'Full and partial re-roofing, extension tie-ins, and compliance-certified finishing across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/re-roof-extensions'
      }}
    >
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Scopes</h2>
        <ul className="space-y-3 text-muted-foreground">
          {scopes.map((item) => (
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

export default ReroofAndExtensions;
