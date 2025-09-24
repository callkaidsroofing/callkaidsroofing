import { CheckCircle2 } from 'lucide-react';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/constants/company';

const ctas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: `Call Now – ${COMPANY_PHONE_DISPLAY}`, href: COMPANY_PHONE_TEL, variant: 'secondary' }
];

const whatsIncluded = [
  'High-pressure wash of tiles, ridges, and valleys',
  'Removal of moss, lichen, and dirt',
  'Gutter and downpipe flush where accessible',
  'Debris disposal off-site',
  'Photo evidence on completion'
];

const benefits = [
  'Removes organic growth and staining',
  'Improves roof appearance and colour',
  'Prepares roof for restoration or coating',
  'Prevents blocked valleys and gutters'
];

const process = [
  'Free roof health check and fixed quote',
  'High-pressure clean of tiles, ridges, valleys, and gutters',
  'Downpipe flush and debris removal',
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
  { label: 'View Gutter Cleaning', href: '/services/gutter-cleaning' },
  { label: 'Book a Free Roof Health Check', href: '/services/health-check' }
];

const RoofCleaning = () => {
  return (
    <ServicePageLayout
      seo={{
        title: 'Roof Pressure Cleaning Clyde North – Remove Moss & Dirt | Call Kaids Roofing',
        description:
          'Power wash your roof tiles to remove moss, lichen, and dirt. Restore colour and prepare for coating. Serving Clyde North & SE Melbourne with photo proof on completion.'
      }}
      hero={{
        title: 'Roof Pressure Cleaning',
        subtitle:
          'Remove dirt, moss, and lichen with our safe and thorough high-pressure cleaning. Serving Clyde North & SE Melbourne with photo proof and a free roof health check.'
      }}
      ctas={ctas}
      trustSignals={['500+ happy customers', '4.9/5 stars on local reviews', 'Fully licensed & insured']}
      relatedLinks={relatedLinks}
      structuredData={{
        serviceName: 'Roof Pressure Cleaning',
        serviceDescription:
          'High-pressure roof cleaning for tiles, ridges, and gutters with debris removal and photo documentation across Clyde North and Southeast Melbourne.',
        pageUrl: 'https://callkaidsroofing.com.au/services/roof-pressure-cleaning'
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

export default RoofCleaning;
