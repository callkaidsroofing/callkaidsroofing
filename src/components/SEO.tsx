import { SEOHead } from '@/components/SEOHead';

type SEOProps = {
  title?: string;
  description?: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
  structuredData?: object;
};

export function SEO({ title, description, canonical, keywords, ogImage, structuredData }: SEOProps) {
  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      canonical={canonical}
      ogImage={ogImage}
      structuredData={structuredData}
    />
  );
}
