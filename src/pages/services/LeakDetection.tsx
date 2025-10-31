import { SEOHead } from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Link } from 'react-router-dom';
import { Shield, Star, Phone, CheckCircle, AlertTriangle, Clock, Award, Search, Mail } from 'lucide-react';

const LeakDetection = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Roof Leak Detection Melbourne",
    "description": "Professional roof leak detection and repair in Southeast Melbourne. Advanced techniques to find hidden leaks fast. Emergency service available.",
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
    "serviceType": "Roof Leak Detection",
    "url": "https://callkaidsroofing.com.au/leak-detection"
  };

  return (
    <>
      <SEOHead
        title="Roof Leak Detection & Emergency Repair | Clyde North, Berwick, SE Melbourne"
        description="Expert roof leak detection and emergency repairs in Clyde North, Berwick, Cranbourne & Southeast Melbourne. Same-day response for active leaks. Advanced detection technology. Call 0435 900 709."
        keywords="roof leak detection Melbourne, leak detection Clyde North, roof leak repair Berwick, emergency leak detection Cranbourne, water leak detection, thermal imaging roof inspection, roof leak specialist Melbourne, hidden roof leak detection"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-destructive/10 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="destructive" className="mb-4">
                  Emergency Leak Detection
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Roof Leak Detection in <span className="text-primary">Southeast Melbourne</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Professional roof leak detection and emergency repair services. We find hidden leaks fast 
                  using advanced techniques and provide permanent solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90">
                    <a href="tel:0435900709" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Emergency: 0435 900 709
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/book">Book Leak Inspection</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-destructive" />
                    <span>Same Day Emergency Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span>Advanced Detection Methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>25+ Years Combined Experience</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png"
                  alt="Professional roof leak detection service"
                  className="rounded-lg shadow-2xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Detection Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Advanced Leak Detection Methods</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We use proven techniques to locate even the most hidden roof leaks quickly and accurately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Search className="h-8 w-8 text-primary" />,
                  title: "Visual Inspection",
                  description: "Comprehensive roof and ceiling inspection to identify obvious and subtle leak signs."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Water Trace Method",
                  description: "Controlled water testing to trace leak paths and identify exact entry points."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Thermal Detection",
                  description: "Using thermal imaging to detect temperature differences indicating moisture penetration."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Moisture Mapping",
                  description: "Electronic moisture detection to find hidden water damage in roof structures."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Structural Assessment",
                  description: "Complete assessment of roof structure, flashings, and potential failure points."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Detailed Reporting",
                  description: "Comprehensive report with photos, findings, and recommended repair solutions."
                }
              ].map((method, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{method.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Common Leak Sources */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Common Sources of Roof Leaks</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Cracked or Missing Tiles",
                      description: "Broken tiles allow direct water entry, especially during heavy rain or storms."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Failed Ridge Pointing",
                      description: "Cracked mortar around ridge caps is one of the most common leak sources."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Valley Iron Issues",
                      description: "Corroded or poorly sealed valley irons can cause significant water penetration."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Flashing Failures",
                      description: "Damaged flashing around chimneys, vents, and roof penetrations allows water in."
                    },
                    {
                      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
                      title: "Blocked Gutters",
                      description: "Overflowing gutters can cause water to back up under roof tiles and fascias."
                    }
                  ].map((source, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 p-2 bg-background rounded-lg">
                        {source.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{source.title}</h3>
                        <p className="text-muted-foreground">{source.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/lovable-uploads/58e47c2d-3b15-4aad-ae68-f09f4d0d421e.png"
                  alt="Common roof leak sources and damage"
                  className="rounded-lg shadow-xl"
                  width={600}
                  height={450}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Service */}
        <section className="py-16 bg-destructive/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Emergency Leak Repair Service</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Water damage gets worse every hour. We provide same-day emergency response to stop leaks fast.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="h-12 w-12 text-destructive" />,
                  title: "Same Day Response",
                  description: "Emergency leak calls answered within hours, not days. We prioritize active leaks."
                },
                {
                  icon: <Shield className="h-12 w-12 text-primary" />,
                  title: "Temporary Protection",
                  description: "Immediate temporary repairs using Stormseal to stop water entry until permanent repair."
                },
                {
                  icon: <CheckCircle className="h-12 w-12 text-primary" />,
                  title: "Permanent Solutions",
                  description: "Follow-up with proper permanent repairs once weather conditions allow."
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center border-2">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Common questions about roof leak detection and repair
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How quickly can you detect a roof leak?</AccordionTrigger>
                  <AccordionContent>
                    Most leaks can be detected within 1-2 hours of inspection using our systematic approach. 
                    Complex or hidden leaks may require additional testing time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Do you offer emergency leak services?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we provide same-day emergency response for active roof leaks. We'll stop the leak 
                    temporarily first, then provide permanent repairs when conditions allow.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What if you can't find the leak source?</AccordionTrigger>
                  <AccordionContent>
                    We warrant to find leak sources using our comprehensive detection methods. If the initial 
                    inspection doesn't reveal the source, we'll continue investigating at no extra charge.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How much does leak detection cost?</AccordionTrigger>
                  <AccordionContent>
                    Leak detection inspections start from $150-250 depending on roof size and complexity. 
                    This fee is often waived if you proceed with our repair recommendations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Will insurance cover leak detection and repair?</AccordionTrigger>
                  <AccordionContent>
                    Insurance coverage depends on the leak cause. Storm damage is typically covered, while 
                    wear and tear may not be. We provide detailed reports to support insurance claims.
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
              <h2 className="text-3xl font-bold mb-4">Stop That Leak Today</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Don't let water damage get worse. Call now for fast leak detection and repair.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4">Emergency Response Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Active roof leak? Call Kaidyn directly for same-day emergency response. 
                    We'll stop the leak and prevent further damage.
                  </p>
                  
                  <div className="space-y-4">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">
                      <a href="tel:0435900709" className="flex items-center gap-2 justify-center">
                        <Phone className="h-5 w-5" />
                        Emergency: 0435 900 709
                      </a>
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>📍 Based in Clyde North, VIC</p>
                      <p>📧 info@callkaidsroofing.com.au</p>
                      <p>🏢 ABN: 39475055075</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Book Your Leak Detection</CardTitle>
                    <CardDescription>
                      Contact us directly or use our online booking system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/booking">
                        <Clock className="mr-2 h-5 w-5" />
                        Book Online
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a href="tel:0435900709">
                        <Phone className="mr-2 h-5 w-5" />
                        Call: 0435 900 709
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a href="mailto:info@callkaidsroofing.com.au">
                        <Mail className="mr-2 h-5 w-5" />
                        Email Us
                      </a>
                    </Button>
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

export default LeakDetection;