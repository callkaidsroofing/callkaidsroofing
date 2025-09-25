import { CheckCircle2, Layers3 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'View Bundles', href: '#bundles', variant: 'primary' },
  { label: 'Book Bundle', href: '/book', variant: 'secondary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'tertiary' }
];

const whyBundle = [
  'Lower callout costs',
  'One coordinated schedule',
  'Extended roof life for less'
];

const bundlesOffered = [
  {
    name: 'Bundle A',
    description: 'Ridge Rebedding & Repointing + Pressure Wash'
  },
  {
    name: 'Bundle B',
    description: 'Gutter Cleaning + Minor Ridge Repointing'
  },
  {
    name: 'Bundle C',
    description: 'Valley Iron Replacement + Leak Make-Safe'
  },
  {
    name: 'Bundle D',
    description: 'Health Check + Maintenance Pack (Gutter Clean + Minor Reseals)'
  }
];

const relatedLinks = [
  { label: 'Learn about Featured Services', href: '/services' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const Bundles = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Roof Bundle Deals Clyde North – Save More | Call Kaids Roofing',
        description:
          'Save 10–20% by combining services in one visit. Choose from ridge, cleaning, leak, and maintenance bundles. Serving Clyde North & SE Melbourne with transparent fixed pricing and licensed trades.',
        canonical: 'https://callkaidsroofing.com.au/bundles'
      }}
      hero={{
        title: 'Bundle Deals',
        subtitle: 'Save money and time by combining essential services in one booking.'
      }}
      ctas={ctas}
      trustSignals={['Fully licensed & insured', 'Transparent fixed pricing']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Roof Bundle Deals',
        serviceDescription:
          'Bundled roofing services including ridge repointing, cleaning, leak repairs, and maintenance packs with 10–20% savings for Clyde North and Southeast Melbourne homeowners.',
        pageUrl: 'https://callkaidsroofing.com.au/bundles'
      }}
    >
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Why Bundle?</h2>
        <ul className="space-y-3 text-muted-foreground">
          {whyBundle.map((reason) => (
            <li key={reason} className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="bundles">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Bundles Offered</h2>
        <div className="space-y-4">
          {bundlesOffered.map((bundle) => (
            <div key={bundle.name} className="rounded-2xl border border-primary/10 bg-background p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Layers3 className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{bundle.name}</h3>
                  <p className="text-muted-foreground">{bundle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Each bundle saves 10–20% versus standalone services.</p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">CTAs</h2>
        <ServiceCtas ctas={ctas} />
      </section>
    </ServicePageLayout>
  );
};

export default Bundles;
