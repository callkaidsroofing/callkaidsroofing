import { SEOHead } from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OptimizedImage } from '@/components/OptimizedImage';
import { EnhancedContactForm } from '@/components/EnhancedContactForm';
import { Link } from 'react-router-dom';
import { Shield, Star, Phone, CheckCircle, AlertTriangle, Clock, Award } from 'lucide-react';

const TileReplacement = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Roof Tile Replacement Melbourne",
    "description": "Professional broken roof tile replacement in Southeast Melbourne. Match existing tiles, prevent leaks, 10-year warranty on all work.",
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
    "serviceType": "Roof Tile Replacement",
    "url": "https://callkaidsroofing.com.au/services/tile-replacement"
  };

  return (
    <>
      <SEOHead
        title="Broken Roof Tile Replacement Melbourne | Call Kaids Roofing"
        description="Professional broken roof tile replacement in Southeast Melbourne. Match existing tiles, prevent leaks. 10-year warranty. Call 0435 900 709."
        keywords="roof tile replacement Melbourne, broken tile repair, tile matching, roof leak repair, Clyde North tile replacement"
        canonical="https://callkaidsroofing.com.au/services/tile-replacement"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Professional Tile Replacement
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Broken Roof Tile Replacement in <span className="text-primary">Southeast Melbourne</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Professional replacement of broken, cracked, or missing roof tiles. Perfect color matching 
                  and leak prevention with 10-year workmanship warranty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="tel:0435900709" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Call 0435 900 709
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/book">Get Free Quote</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>10-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Perfect Color Matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>25+ Years Combined Experience</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png"
                  alt="Professional roof tile replacement service"
                  className="rounded-lg shadow-2xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Complete Tile Replacement Service</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From single tile replacement to multiple damaged areas, we match your existing tiles perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Tile Sourcing & Matching",
                  description: "We source exact matches for your existing tiles, including discontinued styles."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Broken Tile Removal",
                  description: "Safe removal of damaged tiles without disturbing surrounding areas."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Leak Prevention",
                  description: "Check and repair underlayment and sarking to prevent water penetration."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Professional Installation",
                  description: "Secure installation with proper bedding and pointing around new tiles."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Weather Sealing",
                  description: "Complete weather sealing to ensure no leaks around replacement tiles."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Clean-up Service",
                  description: "Complete site clean-up with safe disposal of old tiles and debris."
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

        {/* Common Issues Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Common Tile Damage Issues</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Storm Damage",
                      description: "Hail, wind, and falling branches can crack or completely break roof tiles."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Age & Weather Wear",
                      description: "Older tiles become brittle and can crack from thermal expansion and UV exposure."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Poor Installation",
                      description: "Incorrectly installed tiles can slip, crack, or break more easily over time."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Tree Branch Impact",
                      description: "Overhanging branches or falling debris can cause significant tile damage."
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
                  src="/lovable-uploads/3eea8208-16ab-4e73-8295-c92c3bf95f58.png"
                  alt="Examples of damaged roof tiles requiring replacement"
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
                Common questions about roof tile replacement
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Can you match tiles on older roofs?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we specialize in matching tiles even on older roofs. We have access to suppliers who 
                    stock discontinued tiles and can also source second-hand tiles that perfectly match your roof.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How much does tile replacement cost?</AccordionTrigger>
                  <AccordionContent>
                    Costs vary depending on tile type, roof access, and number of tiles. Single tile replacement 
                    typically starts around $150-250 per tile including labor. We provide detailed quotes after inspection.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Do you replace just one tile or do I need multiple?</AccordionTrigger>
                  <AccordionContent>
                    We can replace single tiles if that's all that's needed. However, if surrounding tiles show 
                    signs of wear or damage, we'll recommend replacing those too to prevent future issues.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Will new tiles look different from my old ones?</AccordionTrigger>
                  <AccordionContent>
                    New tiles may initially look slightly different due to weathering of existing tiles. 
                    However, we select the best color match possible, and over time the tiles will weather to match.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Is tile replacement covered by insurance?</AccordionTrigger>
                  <AccordionContent>
                    Storm damage is often covered by insurance. We can provide detailed reports and photos 
                    to support your insurance claim. Check your policy for specific coverage details.
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
              <h2 className="text-3xl font-bold mb-4">Need Broken Tiles Replaced?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get an accurate quote for tile replacement. We'll match your tiles perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">Call for Immediate Service</h3>
                  <p className="text-muted-foreground mb-6">
                    Speak with Kaidyn directly for fast quotes and honest advice about your tile replacement needs.
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
                    <CardTitle>Get Your Tile Replacement Quote</CardTitle>
                    <CardDescription>
                      Tell us about your tile damage and we'll provide an accurate quote
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

export default TileReplacement;