import { Helmet } from 'react-helmet-async';

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  faqs: FAQ[];
}

export const FAQJsonLd = ({ faqs }: FAQJsonLdProps) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
