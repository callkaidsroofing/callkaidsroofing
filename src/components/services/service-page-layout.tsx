import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { ServiceCtas, type ServiceCta } from '@/components/services/service-ctas';
import { cn } from '@/lib/utils';

interface ServicePageLayoutProps {
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  intro?: ReactNode;
  ctas: ServiceCta[];
  trustSignals: string[];
  children: ReactNode;
  relatedLinks?: {
    label: string;
    href: string;
  }[];
  structuredData?: {
    serviceName: string;
    serviceDescription: string;
    pageUrl: string;
  };
  className?: string;
}

const ServicePageLayout = ({
  seo,
  hero,
  intro,
  ctas,
  trustSignals,
  children,
  relatedLinks,
  structuredData,
  className
}: ServicePageLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-gradient-to-b from-background to-muted/10', className)}>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />
      {structuredData ? (
        <StructuredData
          type="service"
          serviceName={structuredData.serviceName}
          serviceDescription={structuredData.serviceDescription}
          pageUrl={structuredData.pageUrl}
        />
      ) : null}

      <section className="bg-gradient-to-br from-primary via-primary/90 to-[#0B3B69] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{hero.title}</h1>
          <p className="mb-8 mx-auto max-w-3xl text-lg text-white/90 md:text-xl">{hero.subtitle}</p>
          <ServiceCtas ctas={ctas} align="center" className="justify-center" />
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {intro ? (
          <div className="mx-auto mb-12 max-w-3xl text-center text-lg text-muted-foreground">{intro}</div>
        ) : null}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 text-left">
          {children}
          {relatedLinks ? (
            <section>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">Related Links</h2>
              <ul className="space-y-3 text-primary">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('http') ? (
                      <a href={link.href} className="font-semibold hover:underline">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="font-semibold hover:underline">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Trust</h2>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-primary">
              {trustSignals.map((signal) => (
                <span key={signal} className="rounded-full bg-primary/10 px-4 py-2 text-primary">
                  {signal}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export { ServicePageLayout };
