import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({
  title = "Call Kaids Roofing | Roof Restorations Clyde North & SE Melbourne",
  description = "Local roofing experts in Clyde North. Roof restorations, painting, repairs & gutter cleaning with 15-year warranty. Call 0435 900 709 today.",
  keywords = "roof restoration Clyde North, roof painting Clyde North, roof repairs Southeast Melbourne, local roofing contractor, Call Kaids Roofing",
  canonical,
  ogImage = "https://callkaidsroofing.com.au/og-image.jpg",
  structuredData
}: SEOHeadProps) => {
  const location = useLocation();

  const canonicalUrl = canonical || `https://callkaidsroofing.com.au${location.pathname}${location.search}`;

  const defaultStructured = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "Call Kaids Roofing",
    description: "Professional roofing services in Southeast Melbourne including roof restoration, painting, repairs, gutter cleaning, leak detection, and emergency repairs. 15-year warranty on all major work.",
    url: "https://callkaidsroofing.com.au",
    telephone: "+61-435-900-709",
    email: "info@callkaidsroofing.com.au",
    image: "https://callkaidsroofing.com.au/lovable-uploads/call-kaids-logo-main.png",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Clyde North",
      addressRegion: "VIC",
      postalCode: "3978",
      addressCountry: "AU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-38.1167",
      longitude: "145.3333"
    },
    identifier: "ABN 39475055075",
    areaServed: [
      {
        "@type": "City",
        "name": "Clyde North",
        "@id": "https://en.wikipedia.org/wiki/Clyde_North,_Victoria"
      },
      {
        "@type": "City",
        "name": "Berwick"
      },
      {
        "@type": "City",
        "name": "Cranbourne"
      },
      {
        "@type": "City",
        "name": "Pakenham"
      },
      {
        "@type": "City",
        "name": "Officer"
      }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      "name": "Roofing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roof Restoration",
            "description": "Complete roof restoration including cleaning, repairs, rebedding and protective coating"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roof Painting",
            "description": "Professional roof painting with premium weather-resistant paints"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergency Roof Repairs",
            "description": "Same-day emergency response for leaks and storm damage"
          }
        }
      ]
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    sameAs: [
      "https://www.facebook.com/callkaidsroofing",
      "https://www.instagram.com/callkaidsroofing"
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    },
    founder: {
      "@type": "Person",
      "name": "Kaidyn Brownlie",
      "jobTitle": "Owner & Master Roofer"
    }
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en-AU' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href={canonicalUrl} hrefLang="en-AU" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
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
      <meta property="og:phone_number" content="+61435900709" />
      <meta property="business:contact_data:street_address" content="Clyde North" />
      <meta property="business:contact_data:locality" content="Clyde North" />
      <meta property="business:contact_data:region" content="VIC" />
      <meta property="business:contact_data:postal_code" content="3978" />
      <meta property="business:contact_data:country_name" content="Australia" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Call Kaids Roofing - Professional Roof Services" />
      <meta name="twitter:site" content="@callkaidsroofing" />
      <meta name="twitter:creator" content="@callkaidsroofing" />
      
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
      
      {/* Preload critical hero image for LCP optimization */}
      <link 
        rel="preload" 
        as="image" 
        href="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f-960.avif"
        type="image/avif"
        fetchPriority="high"
      />
      <link 
        rel="preload" 
        as="image" 
        href="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f-640.avif"
        type="image/avif"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      
      {/* Additional SEO optimizations */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE_HERE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      
      {/* Additional SEO meta tags */}
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="classification" content="Business" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Prevent duplicate content */}
      <meta name="referrer" content="origin-when-cross-origin" />
    </Helmet>
  );
};