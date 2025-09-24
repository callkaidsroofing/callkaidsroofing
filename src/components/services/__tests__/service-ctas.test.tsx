import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ServiceCtas } from '@/components/services/service-ctas';
import type { ServiceCta } from '@/components/services/service-ctas';

const sampleCtas: ServiceCta[] = [
  { label: 'Book Now', href: '/book', variant: 'primary' },
  { label: 'Call Now – 0435 900 709', href: 'tel:0435900709', variant: 'secondary' },
  { label: 'View Bundles', href: '/bundles', variant: 'tertiary' }
];

describe('ServiceCtas', () => {
  it('renders all CTA links with expected destinations', () => {
    render(
      <MemoryRouter>
        <ServiceCtas ctas={sampleCtas} />
      </MemoryRouter>
    );

    const bookLink = screen.getByRole('link', { name: 'Book Now' });
    const callLink = screen.getByRole('link', { name: 'Call Now – 0435 900 709' });
    const bundlesLink = screen.getByRole('link', { name: 'View Bundles' });

    expect(bookLink.getAttribute('href')).toBe('/book');
    expect(callLink.getAttribute('href')).toBe('tel:0435900709');
    expect(bundlesLink.getAttribute('href')).toBe('/bundles');
  });
});
