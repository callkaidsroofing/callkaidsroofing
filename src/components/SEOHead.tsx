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
  title = "Call Kaids Roofing | Professional Roof Services Southeast Melbourne",
  description = "Roof restoration, painting, and emergency repairs across Southeast Melbourne. 10-year workmanship warranty. Based in Clyde North.",
  keywords = "roof restoration Melbourne, roof painting, emergency roof repairs, Clyde North roofing, Berwick roofer, Southeast Melbourne roofing",
  canonical,
  ogImage = "https://callkaidsroofing-com-au.lovable.app/lovable-uploads/884e66b0-35da-491d-b03b-d980d46b3043.png",
  structuredData
}: SEOHeadProps) => {
  const defaultStructured = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "Call Kaids Roofing",
    description,
    url: "https://callkaidsroofing-com-au.lovable.app",
    telephone: "+61 435 900 709",
    email: "callkaidsroofing@outlook.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Clyde North",
      addressRegion: "VIC",
      addressCountry: "AU"
    },
    areaServed: [
      "Clyde North", "Berwick", "Officer", "Pakenham", "Cranbourne",
      "Frankston", "Narre Warren", "Brighton", "Toorak", "Kew"
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: -38.1167, longitude: 145.3333 },
      geoRadius: 50000
    },
    currenciesAccepted: "AUD",
    priceRange: "$$"
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en-AU' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="alternate" href={canonical || 'https://callkaidsroofing-com-au.lovable.app/'} hrefLang="en-AU" />
      <meta httpEquiv="content-language" content="en-au" />
      <meta name="geo.region" content="AU-VIC" />
      <meta name="geo.placename" content="Clyde North, Southeast Melbourne" />
      <meta name="geo.position" content="-38.1167;145.3333" />
      <meta name="ICBM" content="-38.1167, 145.3333" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content="en_AU" />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructured)}
      </script>
    </Helmet>
  );
};