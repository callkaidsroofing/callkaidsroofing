import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const benefits = [
  'Stops wind-driven rain and leaks',
  'Improves insulation performance',
  'Restores roof structure and alignment',
  'Prepares roof for restoration or coating',
  'Compliant with Australian Standards'
];

const process = [
  'Lift and store tiles in work area',
  'Replace sarking with breathable membrane',
  'Renew and level battens',
  'Relay tiles and seal penetrations',
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
  { label: 'Learn about Roof Restoration', href: '/services/roof-restoration' },
  { label: 'View Re-roof & Extensions', href: '/services/re-roof-extensions' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const ResarkingAndBattening = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Resarking & Battening Clyde North – Improve Waterproofing | Call Kaids Roofing',
        description:
          'Renew sarking and battens for better waterproofing, insulation, and roof support. Serving Clyde North & SE Melbourne with a 10-year workmanship warranty and licensed trades.'
      }}
      hero={{
        title: 'Resarking & Battening',
        subtitle:
          'Keep your home dry, cooler in summer, and warmer in winter with new sarking and battens.'
      }}
      ctas={ctas}
      trustSignals={['10-year workmanship warranty', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Resarking & Battening',
        serviceDescription:
          'Tile lift, breathable sarking replacement, and batten renewal with compliance to Australian Standards across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/resarking-battening'
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

export default ResarkingAndBattening;
