import { Helmet } from 'react-helmet-async';
import { BUSINESS, BUSINESS_SCHEMA, CLAIMS } from '@/config/business';

interface StructuredDataProps {
  type?: 'homepage' | 'service' | 'contact' | 'about';
  serviceName?: string;
  serviceDescription?: string;
  pageUrl?: string;
}

export const StructuredData = ({ 
  type = 'homepage', 
  serviceName, 
  serviceDescription,
  pageUrl 
}: StructuredDataProps) => {
  
  const organizationSchema = {
    ...BUSINESS_SCHEMA,
    "@id": `${BUSINESS.website}/#organization`,
    legalName: BUSINESS.name,
    alternateName: ["Kaids Roofing", "Call Kaids"],
    description: `Professional roofing services in ${BUSINESS.location.region} specializing in roof restoration, painting, repairs and gutter work. ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work.`,
    url: BUSINESS.website,
    logo: {
      "@type": "ImageObject",
      url: `${BUSINESS.website}/logo.png`,
      width: "300",
      height: "100"
    },
    image: [
      `${BUSINESS.website}/og-image.jpg`,
      `${BUSINESS.website}/assets/hero-roof-restoration.jpg`
    ],
    telephone: BUSINESS.phone.e164,
    email: BUSINESS.email.primary,
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: BUSINESS.owner,
      jobTitle: "Owner & Master Roofer"
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
      latitude: "-38.1167",
      longitude: "145.3333"
    },
    areaServed: [
      {
        "@type": "City",
        name: "Clyde North",
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
      },
      {
        "@type": "City", 
        name: "Berwick",
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
      },
      {
        "@type": "City",
        name: "Officer", 
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
      },
      {
        "@type": "City",
        name: "Pakenham",
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
      },
      {
        "@type": "City",
        name: "Cranbourne",
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
      },
      {
        "@type": "City",
        name: "Frankston",
        containedInPlace: { "@type": "State", name: "Victoria", "@id": "https://en.wikipedia.org/wiki/Victoria_(Australia)" }
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
      name: "Professional Roofing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
              "@id": `${BUSINESS.website}/services/roof-restoration`,
              name: "Roof Restoration Melbourne",
            description: `Complete roof restoration including high-pressure cleaning, repairs, and premium membrane coating with ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work.`,
            provider: { "@id": `${BUSINESS.website}/#organization` },
            areaServed: { "@id": `${BUSINESS.website}/#servicearea` },
            offers: {
              "@type": "Offer",
              priceRange: "$6,000 - $30,000",
              priceCurrency: "AUD"
            }
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            "@id": `${BUSINESS.website}/services/roof-painting`,
            name: "Roof Painting Melbourne",
            description: `Professional roof painting with premium weather-resistant paints and ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work.`,
            provider: { "@id": `${BUSINESS.website}/#organization` },
            areaServed: { "@id": `${BUSINESS.website}/#servicearea` },
            offers: {
              "@type": "Offer",
              priceRange: "$4,000 - $18,000",
              priceCurrency: "AUD"
            }
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            "@id": `${BUSINESS.website}/services/roof-repairs`,
            name: "Emergency Roof Repairs Melbourne",
            description: "24/7 emergency roof repair services for leaks, storm damage, and urgent roofing issues across Southeast Melbourne.",
            provider: { "@id": `${BUSINESS.website}/#organization` },
            areaServed: { "@id": `${BUSINESS.website}/#servicearea` },
            offers: {
              "@type": "Offer",
              priceRange: "$150 - $2,000",
              priceCurrency: "AUD"
            }
          }
        }
      ]
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00"
      }
    ],
    currenciesAccepted: "AUD",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(CLAIMS.reviews.rating),
      bestRating: "5",
      worstRating: "1",
      reviewCount: String(CLAIMS.reviews.count)
    },
    slogan: "No Leaks. No Lifting. Just Quality.",
    knowsAbout: [
      "Roof Restoration",
      "Roof Painting", 
      "Emergency Roof Repairs",
      "Ridge Capping",
      "Valley Iron Replacement",
      "Gutter Cleaning",
      "Leak Detection",
      "Tile Replacement"
    ],
    identifier: [
      {
        "@type": "PropertyValue",
        name: "ABN",
        value: BUSINESS.abnCompact
      },
      {
        "@type": "PropertyValue", 
        name: "Phone",
        value: BUSINESS.phone.display
      }
    ],
    sameAs: [
      "https://www.facebook.com/callkaidsroofing",
      "https://www.instagram.com/callkaidsroofing"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BUSINESS.website}/`
      },
      ...(type === 'service' && serviceName ? [{
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${BUSINESS.website}/services`
      }, {
        "@type": "ListItem",
        position: 3,
        name: serviceName,
        item: pageUrl || `${BUSINESS.website}/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`
      }] : [])
    ]
  };

  const serviceSchema = serviceName ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": pageUrl || `${BUSINESS.website}/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
    name: serviceName,
    description: serviceDescription || `Professional ${serviceName.toLowerCase()} services in Southeast Melbourne by Call Kaids Roofing.`,
    provider: { "@id": `${BUSINESS.website}/#organization` },
    areaServed: { "@id": `${BUSINESS.website}/#servicearea` },
    category: "Roofing Services",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: serviceName,
      itemListElement: [{
        "@type": "Offer",
        description: serviceDescription,
        priceRange: "Contact for quote",
        priceCurrency: "AUD"
      }]
    }
  } : null;

  const faqSchema = type === 'homepage' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does roof restoration cost in Melbourne?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Roof restoration in Melbourne typically costs between $6,000-$30,000 depending on roof size and condition. We provide free quotes and ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work.`
        }
      },
      {
        "@type": "Question",
        name: "Do you provide emergency roof repairs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we provide 24/7 emergency roof repair services across Southeast Melbourne. We aim to respond within 4 hours for genuine emergencies to prevent further damage."
        }
      },
      {
        "@type": "Question", 
        name: "What areas do you service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We service all of Southeast Melbourne within 50km of Clyde North, including Berwick, Officer, Pakenham, Cranbourne, Frankston, and surrounding suburbs."
        }
      },
      {
        "@type": "Question",
        name: "How long does roof painting take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Professional roof painting typically takes 2-3 days to complete, depending on roof size and weather conditions. We use premium weather-resistant paints with ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work.`
        }
      }
    ]
  } : null;

  const schemas: Record<string, unknown>[] = [organizationSchema, breadcrumbSchema];
  if (serviceSchema) schemas.push(serviceSchema);
  if (faqSchema) schemas.push(faqSchema);

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
