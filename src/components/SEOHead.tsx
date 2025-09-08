import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({
  title = "Call Kaids Roofing | Professional Roof Services Melbourne",
  description = "Professional roofing services in Melbourne. Roof restoration, painting, emergency repairs with 10-year warranty. Serving Clyde North, Berwick, Cranbourne.",
  keywords = "roof restoration Melbourne, roof painting, emergency roof repairs, Clyde North roofing, Berwick roofer",
  canonical,
  ogImage = "https://callkaidsroofing-com-au.lovable.app/lovable-uploads/884e66b0-35da-491d-b03b-d980d46b3043.png",
  structuredData
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};