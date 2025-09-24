import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Free Check', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const whatYouGet = [
  'Visual inspection of roof, ridges, valleys, flashings, and gutters',
  'Photos and written condition report',
  'Priority scheduling if repairs are needed'
];

const benefits = [
  'Catch issues early and avoid emergencies',
  'No-obligation check, completely free',
  'Trusted by 500+ homeowners in Clyde North & SE Melbourne'
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
  { label: 'View Leak Repairs', href: '/services/leak-repairs' },
  { label: 'View Bundle Deals', href: '/bundles' }
];

const HealthCheck = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Free Roof Health Check Clyde North | Call Kaids Roofing',
        description:
          'Catch problems before they leak. Get a free photo-based roof health check with a written report and fixed-price quote if issues are found. Trusted by 500+ homeowners in Clyde North & SE Melbourne.'
      }}
      hero={{
        title: 'Free Roof Health Check',
        subtitle: 'Know your roof’s condition before it costs you thousands.'
      }}
      ctas={ctas}
      trustSignals={['4.9/5 star rating', 'No hidden extras']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Free Roof Health Check',
        serviceDescription:
          'Complimentary roof inspection with photos, written report, and fixed-price quotes for homes across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/health-check'
      }}
    >
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">What You Get</h2>
        <ul className="space-y-3 text-muted-foreground">
          {whatYouGet.map((item) => (
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

export default HealthCheck;
