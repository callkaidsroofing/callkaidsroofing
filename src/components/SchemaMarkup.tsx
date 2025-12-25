import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SchemaMarkup = () => {
  const [rating, setRating] = useState<number>(4.9);
  const [reviewCount, setReviewCount] = useState<number>(127);

  useEffect(() => {
    const fetchBusinessData = async () => {
      const { data } = await supabase
        .from('business_profile_data')
        .select('rating, review_count')
        .eq('source', 'google')
        .single();

      if (data) {
        if (data.rating) setRating(data.rating);
        if (data.review_count) setReviewCount(data.review_count);
      }
    };

    fetchBusinessData();
  }, []);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "name": "Call Kaids Roofing",
    "image": "https://callkaidsroofing.com.au/logo.png",
    "logo": "https://callkaidsroofing.com.au/logo.png",
    "url": "https://callkaidsroofing.com.au",
    "telephone": "+61435900709",
    "email": "info@callkaidsroofing.com.au",
    "priceRange": "$$",
    "taxID": "39475055075",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Clyde North",
      "addressRegion": "VIC",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -38.0378,
      "longitude": 145.3503
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Clyde North"
      },
      {
        "@type": "City",
        "name": "Berwick"
      },
      {
        "@type": "City",
        "name": "Narre Warren"
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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toString(),
      "reviewCount": reviewCount.toString()
    },
    "sameAs": [
      "https://www.facebook.com/callkaidsroofing",
      "https://www.instagram.com/callkaidsroofing"
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "name": "Roof Restoration",
        "description": "Complete roof restoration with high-pressure cleaning, re-bedding, re-pointing, and premium membrane coating",
        "provider": {
          "@type": "RoofingContractor",
          "name": "Call Kaids Roofing"
        },
        "areaServed": "SE Melbourne, VIC",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "4500",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "minPrice": "4500"
          }
        }
      },
      {
        "@type": "Service",
        "name": "Roof Repairs",
        "description": "Emergency leak repairs, tile replacement, valley repairs, and gutter maintenance",
        "provider": {
          "@type": "RoofingContractor",
          "name": "Call Kaids Roofing"
        },
        "areaServed": "SE Melbourne, VIC",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "350",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "minPrice": "350"
          }
        }
      },
      {
        "@type": "Service",
        "name": "Roof Painting",
        "description": "Professional roof painting with Dulux AcraTex membrane for maximum UV protection",
        "provider": {
          "@type": "RoofingContractor",
          "name": "Call Kaids Roofing"
        },
        "areaServed": "SE Melbourne, VIC",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "3800",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "minPrice": "3800"
          }
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>
    </Helmet>
  );
};
