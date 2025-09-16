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
  title = "Professional Roofing Services Melbourne | Call Kaids Roofing | 10 Year Warranty",
  description = "Expert roof restoration, painting & emergency repairs in Southeast Melbourne. 10-year warranty, premium materials, same-day quotes. Call Kaidyn: 0435 900 709",
  keywords = "roof restoration Melbourne, roof painting Melbourne, emergency roof repairs, Clyde North roofer, Berwick roofing, Southeast Melbourne roofing, roof maintenance Melbourne",
  canonical,
  ogImage = "https://callkaidsroofing.com.au/og-image.jpg",
  structuredData
}: SEOHeadProps) => {
  const defaultStructured = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": "https://callkaidsroofing.com.au/#organization",
    name: "Call Kaids Roofing",
    legalName: "Call Kaids Roofing",
    description,
    url: "https://callkaidsroofing.com.au",
    logo: "https://callkaidsroofing.com.au/logo.png",
    image: ogImage,
    telephone: "+61 435 900 709",
    email: "callkaidsroofing@outlook.com",
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Kaidyn Brownlie"
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Grices Rd",
      addressLocality: "Clyde North",
      addressRegion: "VIC",
      postalCode: "3978",
      addressCountry: "AU"
    },
    areaServed: [
      {
        "@type": "City",
        name: "Clyde North",
        containedInPlace: { "@type": "State", name: "Victoria" }
      },
      {
        "@type": "City", 
        name: "Berwick",
        containedInPlace: { "@type": "State", name: "Victoria" }
      },
      {
        "@type": "City",
        name: "Officer", 
        containedInPlace: { "@type": "State", name: "Victoria" }
      },
      {
        "@type": "City",
        name: "Pakenham",
        containedInPlace: { "@type": "State", name: "Victoria" }
      },
      {
        "@type": "City",
        name: "Cranbourne",
        containedInPlace: { "@type": "State", name: "Victoria" }
      }
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { 
        "@type": "GeoCoordinates", 
        latitude: -38.1167, 
        longitude: 145.3333 
      },
      geoRadius: "50000"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Roofing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Roof Restoration",
            description: "Complete roof restoration including cleaning, repairs, and painting"
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            name: "Roof Painting",
            description: "Professional roof painting services with premium materials"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "Emergency Roof Repairs",
            description: "24/7 emergency roof repair services across Southeast Melbourne"
          }
        }
      ]
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00"
      }
    ],
    currenciesAccepted: "AUD",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47"
    },
    identifier: {
      "@type": "PropertyValue",
      name: "ABN",
      value: "39475055075"
    }
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en-AU' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="alternate" href={canonical || 'https://callkaidsroofing.com.au/'} hrefLang="en-AU" />
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
      {canonical && <meta property="og:url" content={canonical} />}
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