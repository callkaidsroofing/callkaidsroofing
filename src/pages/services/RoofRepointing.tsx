import { SEOHead } from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OptimizedImage } from '@/components/OptimizedImage';
import { EnhancedContactForm } from '@/components/EnhancedContactForm';
import { Link } from 'react-router-dom';
import { Shield, Star, Phone, CheckCircle, AlertTriangle, Clock, Award } from 'lucide-react';

const RoofRepointing = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Roof Repointing Melbourne",
    "description": "Professional roof repointing services in Southeast Melbourne. Fix cracked mortar, stop leaks, and extend your roof's life with our 10-year warranty.",
    "provider": {
      "@type": "RoofingContractor",
      "name": "Call Kaids Roofing",
      "telephone": "+61 435 900 709",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Grices Rd",
        "addressLocality": "Clyde North",
        "addressRegion": "VIC",
        "postalCode": "3978",
        "addressCountry": "AU"
      }
    },
    "areaServed": ["Clyde North", "Berwick", "Officer", "Pakenham", "Cranbourne", "Southeast Melbourne"],
    "serviceType": "Roof Repointing",
    "url": "https://callkaidsroofing.com.au/roof-repointing"
  };

  return (
    <>
      <SEOHead
        title="Ridge Capping Rebedding & Repointing | Clyde North, Berwick, SE Melbourne"
        description="Professional ridge capping rebedding and repointing in Clyde North, Berwick, Cranbourne & Southeast Melbourne. SupaPoint premium mortar. 10-year warranty. Stop leaks at the ridge. Call 0435 900 709."
        keywords="ridge capping rebedding Melbourne, roof repointing Clyde North, ridge cap repairs Berwick, roof rebedding Cranbourne, SupaPoint mortar, ridge capping Melbourne, ridge repairs Southeast Melbourne, mortar repair Melbourne"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Professional Roof Repointing
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Roof Repointing in <span className="text-primary">Southeast Melbourne</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Fix cracked mortar, stop leaks, and extend your roof's life with our professional repointing services. 
                  Using premium SupaPoint materials with 10-year warranty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="tel:0435900709" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Call 0435 900 709
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/book">Get Free Assessment</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>10-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Premium Materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>25+ Years Combined Experience</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/lovable-uploads/99c2917f-b2e3-44ab-ba7d-79754ca91997.png"
                  alt="Professional roof repointing service in Southeast Melbourne"
                  className="rounded-lg shadow-2xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Complete Roof Repointing Service</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive repointing service addresses all mortar issues to prevent leaks and extend your roof's lifespan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Ridge Cap Repointing",
                  description: "Complete ridge cap removal, cleaning, and repointing with premium SupaPoint mortar."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Gable End Pointing",
                  description: "Detailed gable end mortar repair and repointing to prevent water penetration."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Tile Bedding Repair",
                  description: "Replace cracked or missing tile bedding with flexible pointing compound."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Leak Detection",
                  description: "Thorough inspection to identify and fix all mortar-related leak points."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Quality Materials",
                  description: "Premium SupaPoint flexible pointing compound designed for Australian conditions."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Detailed Photos",
                  description: "Before, during, and after photos documenting all work completed."
                }
              ].map((service, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Repoint Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Roof Repointing is Essential</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Prevent Water Damage",
                      description: "Cracked mortar allows water to penetrate, causing ceiling damage and mold issues."
                    },
                    {
                      icon: <Shield className="h-6 w-6 text-primary" />,
                      title: "Extend Roof Life",
                      description: "Proper pointing protects tiles and timber, adding 15+ years to your roof's lifespan."
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-primary" />,
                      title: "Cost-Effective Solution",
                      description: "Repointing costs far less than full roof replacement while solving leak issues."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 p-2 bg-background rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/lovable-uploads/59ae7b51-3197-43f9-9e4e-3ac96bc90d97.png"
                  alt="Before and after roof repointing comparison"
                  className="rounded-lg shadow-xl"
                  width={600}
                  height={450}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Common questions about roof repointing services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does roof repointing take?</AccordionTrigger>
                  <AccordionContent>
                    Most roof repointing jobs take 1-3 days depending on the roof size and extent of work needed. 
                    We'll provide an accurate timeline during the free assessment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What's the difference between bedding and pointing?</AccordionTrigger>
                  <AccordionContent>
                    Bedding is the mortar that sits under ridge caps and tiles, while pointing is the outer layer 
                    that seals and protects the bedding. Both work together to keep water out.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Do you offer a warranty on repointing work?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we provide a 10-year workmanship warranty on all repointing work using premium SupaPoint materials. 
                    This covers any defects in workmanship or material failure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I know if my roof needs repointing?</AccordionTrigger>
                  <AccordionContent>
                    Signs include: cracked or missing mortar around ridge caps, water stains on ceilings, 
                    loose tiles, or visible gaps in pointing. We offer free assessments to determine if repointing is needed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What areas do you service for repointing?</AccordionTrigger>
                  <AccordionContent>
                    We service all of Southeast Melbourne within 50km of Clyde North, including Berwick, Officer, 
                    Pakenham, Cranbourne, Narre Warren, and surrounding suburbs.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Fix Your Roof Pointing?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get a free assessment and detailed quote. No obligation, honest advice only.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">Call Kaidyn Directly</h3>
                  <p className="text-muted-foreground mb-6">
                    Speak directly with the owner for honest advice and accurate pricing. 
                    No call centers or sales pressure.
                  </p>
                  
                  <div className="space-y-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <a href="tel:0435900709" className="flex items-center gap-2 justify-center">
                        <Phone className="h-5 w-5" />
                        0435 900 709
                      </a>
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>📍 Based in Clyde North, VIC</p>
                      <p>📧 callkaidsroofing@outlook.com</p>
                      <p>🏢 ABN: 39475055075</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Get Your Free Roof Assessment</CardTitle>
                    <CardDescription>
                      Complete the form below and we'll call you back within 12 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RoofRepointing;