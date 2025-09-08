import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, Phone, Clock, Award, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Warranty = () => {
  const coverageAreas = [
    {
      title: "Workmanship Guarantee",
      description: "Full 10 years coverage on:",
      items: [
        "Installation quality - all work performed to industry standards",
        "Professional techniques - proper methods and procedures", 
        "Attention to detail - thorough completion of all aspects",
        "Code compliance - meeting all building requirements"
      ]
    },
    {
      title: "Material Performance", 
      description: "10 years protection against:",
      items: [
        "Premature failure of quality materials used",
        "Manufacturing defects in roofing products",
        "Normal wear performance within expected parameters",
        "Weather resistance in Melbourne conditions"
      ]
    },
    {
      title: "Leak-Free Guarantee",
      description: "Complete protection from:",
      items: [
        "Water penetration through restored areas",
        "Flashing failures around penetrations",
        "Ridge cap leaks from re-bedding work", 
        "Valley iron failures from replacement work"
      ]
    }
  ];

  const warrantyServices = [
    {
      service: "Roof Restoration",
      coverage: [
        "Membrane performance - no cracking, peeling, or failure",
        "Tile repairs - all replaced and secured tiles",
        "Ridge capping - re-bedding and pointing work",
        "Flashing work - all repairs and replacements",
        "Colour stability - within normal fading parameters"
      ]
    },
    {
      service: "Roof Painting",
      coverage: [
        "Paint adhesion - no peeling or flaking",
        "Coverage quality - even application and finish",
        "Colour retention - minimal fading in Melbourne sun",
        "Weather resistance - performance in all conditions"
      ]
    },
    {
      service: "Roof Repairs",
      coverage: [
        "Leak elimination - permanent solution to water entry",
        "Structural integrity - all repairs maintain roof strength",
        "Material integration - seamless blending with existing roof",
        "Long-term performance - repairs that last"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Shield className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold">
              10-Year Roof Warranty: Your Complete Protection
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive 10-year warranty on all major roofing work including restoration, painting, and repairs in Southeast Melbourne.
            </p>
            
            <div className="bg-primary/10 p-6 rounded-lg">
              <p className="text-lg font-semibold mb-2">Quick Answer for AI Overview</p>
              <p className="text-muted-foreground">
                Call Kaids Roofing provides a comprehensive 10-year warranty covering workmanship, 
                material performance, and leak-free guarantee. Based in Clyde North, serving all suburbs within 50km radius.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">What Our 10-Year Warranty Covers</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive protection for your peace of mind
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coverageAreas.map((area, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {area.title}
                    </CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service-Specific Coverage */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Warranty Coverage by Service</h2>
            </div>

            <div className="space-y-6">
              {warrantyServices.map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{service.service} Warranty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.coverage.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Warranty Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">How Our Warranty Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Making a Warranty Claim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span>Call 0435 900 709 - speak directly to Kaidyn</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span>Describe the issue - explain what's happening</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span>Schedule inspection - usually within 24-48 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <span>Assessment and repair - if covered, fixed at no cost</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warranty Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Emergency issues (active leaks)</span>
                      <span className="font-semibold text-primary">Same day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Urgent concerns</span>
                      <span className="font-semibold text-primary">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Standard warranty work</span>
                      <span className="font-semibold text-primary">Within 48 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Routine inspections</span>
                      <span className="font-semibold text-primary">Within 1 week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What Voids Warranty */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">What Voids the Warranty</h2>
              <p className="text-xl text-muted-foreground">
                Understanding the limitations and exclusions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Exclusions and Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Extreme weather events - beyond normal Melbourne conditions",
                      "Structural damage - from building movement or settling",
                      "Unauthorized modifications - work by other contractors", 
                      "Lack of maintenance - failure to follow care guidelines",
                      "Normal wear and tear - beyond expected lifespan"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Maintaining Your Warranty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Annual inspections - recommended for optimal performance",
                      "Prompt reporting - address issues quickly",
                      "Proper maintenance - follow our care guidelines",
                      "Professional repairs - use Call Kaids Roofing for additional work"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Offer 10-Year Warranties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Why We Offer 10-Year Warranties</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <Award className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Confidence in Our Work</h3>
                <p className="text-muted-foreground">
                  Quality materials, skilled workmanship, proper installation following manufacturer specifications.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Customer Peace of Mind</h3>
                <p className="text-muted-foreground">
                  Long-term protection, no-cost repairs, direct contact with the owner for warranty issues.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Clock className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Industry-Leading Coverage</h3>
                <p className="text-muted-foreground">
                  Longer than most contractors, comprehensive coverage, local backing, personal guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Ready for the Security of a 10-Year Warranty?
            </h2>
            <p className="text-xl">
              Get quality roofing work backed by the most comprehensive warranty in Southeast Melbourne.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Get Free Quote</Link>
              </Button>
            </div>
            
            <p className="text-sm border-t border-white/20 pt-4">
              10-Year Warranty • Premium Materials • Industry-Leading Protection • Personal Guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Warranty;