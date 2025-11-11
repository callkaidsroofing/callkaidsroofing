import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number | null;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from('content_knowledge_base')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
      } else {
        setFaqs(data || []);
        setFilteredFaqs(data || []);
      }
      setLoading(false);
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  }, [searchQuery, selectedCategory, faqs]);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.map(faq => ({
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
        <title>Roofing FAQs - Call Kaids Roofing | Common Questions Answered</title>
        <meta 
          name="description" 
          content="Get answers to common roofing questions. Learn about our services, pricing, warranties, and roofing processes from SE Melbourne's trusted roofer." 
        />
        <meta name="keywords" content="roofing FAQ, roof questions, roofing warranty, roof pricing, SE Melbourne roofer" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Everything you need to know about our roofing services
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg glass-card border-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 2 && (
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Accordion */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="glass-card animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="glass-card border border-primary/20 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-16 text-center">
                  <h2 className="text-2xl font-bold mb-4">No FAQs Found</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {searchQuery 
                      ? `No questions match "${searchQuery}". Try a different search term.`
                      : 'FAQs are being added. In the meantime, feel free to contact us directly with your questions.'
                    }
                  </p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary">
                    <Link to="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Give Kaidyn a call directly - 
              no call centers, just honest advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="bg-gradient-to-r from-primary to-secondary">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: 0435 900 709
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Email: info@callkaidsroofing.com.au | ABN: 39475055075
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;
