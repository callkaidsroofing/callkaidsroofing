import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQAccordion = () => {
  const faqs = [
    {
      question: "How long does a roof restoration take?",
      answer: "Most roof restorations take 3-5 days depending on the size and condition of your roof. This includes cleaning, repairs, repointing, and painting. Weather conditions may extend the timeline slightly."
    },
    {
      question: "What's included in your 10-year warranty?",
      answer: "Our 10-year workmanship warranty covers all pointing, painting, and repair work. This includes materials and labor for any defects in our workmanship. The warranty is transferable if you sell your home."
    },
    {
      question: "Do you provide emergency roof repair services?",
      answer: "Yes, we offer same-day emergency response for urgent issues like storm damage, active leaks, or dangerous loose tiles. We'll provide temporary protection immediately and permanent repairs as soon as weather permits."
    },
    {
      question: "How much does roof restoration cost?",
      answer: "Costs vary based on roof size, condition, and materials needed. Most homes range from $8,000-$15,000 for complete restoration. We provide detailed written quotes with no hidden fees after a free inspection."
    },
    {
      question: "What areas do you service?",
      answer: "We service all suburbs within 50km of Clyde North, including Berwick, Cranbourne, Dandenong, Pakenham, Officer, Rowville, Narre Warren, and surrounding Southeast Melbourne areas."
    },
    {
      question: "Are you fully insured?",
      answer: "Yes, we carry full public liability insurance and workers compensation. All insurance certificates can be provided before work begins. This protects both you and our workers during the project."
    },
    {
      question: "Do you clean up after the job?",
      answer: "Absolutely. We leave your property cleaner than we found it. This includes removing all debris, washing down gutters and driveways, and ensuring your gardens are protected throughout the process."
    },
    {
      question: "Can I get a free roof inspection?",
      answer: "Yes, we provide comprehensive 25-point roof inspections with detailed photo reports at no cost. This helps you understand your roof's current condition and plan for any necessary maintenance or repairs."
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-max mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground text-column mx-auto">
            Common questions about our roofing services and what to expect.
          </p>
        </div>

        <div className="card-max mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg border px-6 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:0435900709"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Call 0435 900 709
            </a>
            <a 
              href="mailto:callkaidsroofing@outlook.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;