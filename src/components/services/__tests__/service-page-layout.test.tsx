import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import type { ServiceCta } from '@/components/services/service-ctas';

vi.mock('@/components/SEOHead', () => ({
  SEOHead: ({ title }: { title: string }) => <div data-testid="seo-head">{title}</div>
}));

vi.mock('@/components/StructuredData', () => ({
  StructuredData: () => null
}));

const ctas: ServiceCta[] = [
  { label: 'Book', href: '/book', variant: 'primary' },
  { label: 'Call', href: 'tel:0435900709', variant: 'secondary' }
];

describe('ServicePageLayout', () => {
  it('renders hero, content, related links, and trust signals', () => {
    render(
      <MemoryRouter>
        <ServicePageLayout
          seo={{ title: 'Example Service', description: 'Example description' }}
          hero={{ title: 'Hero Title', subtitle: 'Hero Subtitle' }}
          ctas={ctas}
          trustSignals={['Licensed & insured']}
          relatedLinks={[{ label: 'More Info', href: '/more' }]}
          structuredData={{
            serviceName: 'Example',
            serviceDescription: 'Details',
            pageUrl: 'https://example.com'
          }}
        >
          <section>
            <h2>Content Section</h2>
            <p>Body copy</p>
          </section>
        </ServicePageLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Hero Title')).toBeTruthy();
    expect(screen.getByText('Hero Subtitle')).toBeTruthy();
    expect(screen.getByText('Content Section')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'More Info' }).getAttribute('href')).toBe('/more');
    expect(screen.getByText('Licensed & insured')).toBeTruthy();
  });
});
