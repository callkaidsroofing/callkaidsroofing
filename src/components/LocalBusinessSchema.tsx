import { Helmet } from 'react-helmet-async';
import { BUSINESS, CLAIMS, getPublicWarrantySummary } from '@/config/business';

interface LocalBusinessSchemaProps {
  pageName?: string;
  serviceType?: string;
  suburb?: string;
}

export const LocalBusinessSchema = ({
  pageName = "Home",
  serviceType,
  suburb
}: LocalBusinessSchemaProps) => {
  const baseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${BUSINESS.website}/#organization`,
    name: BUSINESS.name,
    alternateName: "Kaids Roofing",
    description: `Professional roofing services in ${suburb || 'Southeast Melbourne'} specializing in ${serviceType || 'roof restoration, painting and emergency repairs'}`,
    url: BUSINESS.website,
    logo: {
      "@type": "ImageObject",
      url: `${BUSINESS.website}/logo.png`,
      width: 300,
      height: 200
    },
    image: {
      "@type": "ImageObject",
      url: `${BUSINESS.website}/og-image.jpg`,
      width: 1200,
      height: 630
    },
    telephone: BUSINESS.phone.e164,
    email: BUSINESS.email.primary,
    foundingDate: "2020-01-01",
    founder: {
      "@type": "Person",
      name: BUSINESS.owner,
      jobTitle: "Owner & Lead Roofer"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.location.hqSuburb,
      addressRegion: "VIC",
      postalCode: "3978",
      addressCountry: "AU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -38.1167,
      longitude: 145.3333
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00"
      }
    ],
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    currenciesAccepted: "AUD",
    priceRange: "$$",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "Fully Insured & Licensed Roofing Contractor"
    },
    knowsAbout: [
      "Roof Restoration",
      "Roof Painting", 
      "Emergency Roof Repairs",
      "Gutter Cleaning",
      "Leak Detection",
      "Ridge Capping",
      "Tile Replacement",
      "Valley Iron Replacement"
    ],
    slogan: "No Leaks. No Lifting. Just Quality.",
    brand: {
      "@type": "Brand",
      name: "Call Kaids Roofing",
      slogan: "The Best Roof Under the Sun"
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "ABN",
        value: BUSINESS.abnCompact
      }
    ],
    sameAs: [
      "https://www.facebook.com/callkaidsroofing",
      "https://www.instagram.com/callkaidsroofing",
      "https://tradiesnearyou.com.au/trades/roofers/victoria/clyde-north/call-kaids-roofing",
      "https://www.serviceseeking.com.au/profile/308109-call-kaids-roofing",
      "https://roofrestohq.com.au/roofers/clyde/call-kaids-roofing/"
    ]
  };

  // Add service-specific schema if provided
  const serviceSchema: Record<string, unknown> | null = serviceType ? {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceType,
    description: `Professional ${serviceType.toLowerCase()} services in ${suburb || 'Southeast Melbourne'}`,
    provider: {
      "@type": "RoofingContractor",
      name: BUSINESS.name
    },
    areaServed: {
      "@type": "Place",
      name: suburb || "Southeast Melbourne, Victoria"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${serviceType} Services`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: serviceType,
            description: `Expert ${serviceType.toLowerCase()} with ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work. ${getPublicWarrantySummary()}`
          }
        }
      ]
    }
  } : null;

  // Create breadcrumb schema for better navigation understanding
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://callkaidsroofing.com.au/"
      },
      ...(serviceType ? [{
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://callkaidsroofing.com.au/services"
      }, {
        "@type": "ListItem",
        position: 3,
        name: serviceType,
        item: `https://callkaidsroofing.com.au/services/${serviceType.toLowerCase().replace(/\s+/g, '-')}`
      }] : pageName !== "Home" ? [{
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: `https://callkaidsroofing.com.au/${pageName.toLowerCase()}`
      }] : [])
    ]
  };

  const schemas: Record<string, unknown>[] = [baseSchema, breadcrumbSchema];
  if (serviceSchema) schemas.push(serviceSchema);

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
