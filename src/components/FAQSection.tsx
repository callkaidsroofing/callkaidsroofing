import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/section-wrapper";
import { Helmet } from "react-helmet-async";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How long does a roof restoration take?",
    answer: "Most roof restorations take 3-5 days depending on roof size and weather. We'll provide an accurate timeline during your free inspection.",
  },
  {
    question: "Is roof restoration cheaper than re-roofing?",
    answer: "Yes, restoration typically costs 40-60% less than a full re-roof. If your roof structure is sound, restoration can add 15+ years of life at a fraction of the cost.",
  },
  {
    question: "Do you offer emergency leak repairs?",
    answer: "Absolutely. We prioritize emergency repairs and can usually attend within 48 hours. Call 0435 900 709 for urgent issues.",
  },
  {
    question: "What's included in the 15-year warranty?",
    answer: "Our warranty covers all workmanship including re-bedding, re-pointing, and membrane coating application. Materials are separately covered by manufacturer warranties.",
  },
  {
    question: "Which suburbs do you service?",
    answer: "We service all SE Melbourne suburbs including Berwick, Narre Warren, Cranbourne, Pakenham, Officer, Beaconsfield, and surrounding areas.",
  },
  {
    question: "Do I need to be home during the work?",
    answer: "Not necessarily. We only need access to your property exterior. We'll discuss access details and provide progress updates via phone or photos.",
  },
  {
    question: "How do I know if my roof needs restoration or replacement?",
    answer: "We provide a free honest assessment. If your roof structure and tiles are in good condition, restoration is ideal. We'll recommend re-roofing only when truly necessary.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfer, credit card, and cash. A deposit is required to schedule work, with final payment due on completion.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Common Questions
          </h2>
          <p className="text-white/70 text-lg">Everything you need to know about our roofing services</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:bg-white/10 hover:border-conversion-cyan/40 transition-all"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <span className="font-bold text-white text-base md:text-lg pr-4 group-hover:text-conversion-cyan transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-conversion-cyan flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 pb-5 text-white/80 text-sm md:text-base leading-relaxed border-t border-white/10 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after FAQ */}
        <div className="text-center mt-10">
          <p className="text-white/70 text-base mb-4">Still have questions?</p>
          <a
            href="tel:0435900709"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-conversion-blue to-conversion-cyan text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Call 0435 900 709 - We're Happy to Help
          </a>
        </div>
      </Container>
    </>
  );
};
