import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://callkaidsroofing.com.au';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({
  title = "Call Kaids Roofing | Roof Restorations Clyde North & SE Melbourne",
  description = "Local roofing experts in Clyde North. Roof restorations, painting, repairs & gutter cleaning with 10-year warranty. Call 0435 900 709 today.",
  keywords = "roof restoration Clyde North, roof painting Clyde North, roof repairs Southeast Melbourne, local roofing contractor, Call Kaids Roofing",
  canonical,
  ogImage = "https://callkaidsroofing.com.au/og-image.jpg",
  structuredData
}: SEOHeadProps) => {
  const canonicalUrl = canonical.startsWith('http')
    ? canonical
    : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;

  const defaultStructured = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "Call Kaids Roofing",
    url: "https://callkaidsroofing.com.au",
    telephone: "+61-435-900-709",
    email: "callkaidsroofing@outlook.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Clyde North",
      addressRegion: "VIC",
      postalCode: "3978",
      addressCountry: "AU"
    },
    identifier: "ABN 39475055075",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -38.09,
        longitude: 145.33
      },
      geoRadius: "50000"
    },
    sameAs: [
      "https://www.facebook.com/callkaidsroofing",
      "https://www.instagram.com/callkaidsroofing"
    ]
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en-AU' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href={canonicalUrl} hrefLang="en-AU" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="Call Kaids Roofing" />
      <meta name="copyright" content="Call Kaids Roofing" />
      <meta httpEquiv="content-language" content="en-au" />
      <meta name="geo.region" content="AU-VIC" />
      <meta name="geo.placename" content="Clyde North, Southeast Melbourne" />
      <meta name="geo.position" content="-38.1167;145.3333" />
      <meta name="ICBM" content="-38.1167, 145.3333" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Call Kaids Roofing - Professional Roof Services" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_AU" />
      <meta property="og:site_name" content="Call Kaids Roofing" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Call Kaids Roofing - Professional Roof Services" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructured)}
      </script>
      
      {/* Additional Performance and SEO Meta Tags */}
      <meta name="theme-color" content="#007ACC" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#007ACC" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Preconnect to improve performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Additional SEO optimizations */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE_HERE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};