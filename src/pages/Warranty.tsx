import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Shield, CheckCircle, Phone, Clock, Award, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Warranty = () => {
  const warrantyTiers = [
    {
      title: "15-Year Coating Warranty",
      badge: "Standard",
      description: "Our standard warranty for industrial roof coatings",
      items: [
        "Coating performance - no cracking, peeling, or premature failure",
        "Weather resistance - performance in Melbourne conditions up to 30°C",
        "Material integrity - approved industrial roof coating systems only",
        "Proper application - correct film build meeting specifications"
      ]
    },
    {
      title: "20-Year Coating Warranty", 
      badge: "Premium",
      description: "Extended warranty with premium system and preparation",
      items: [
        "All standard warranty coverage extended to 20 years",
        "Specified premium coating system application",
        "Enhanced substrate preparation per checklist",
        "Additional quality control and documentation"
      ]
    },
    {
      title: "10-Year Workmanship Warranty",
      badge: "Included",
      description: "Comprehensive coverage on all installation work",
      items: [
        "Installation quality - all work to industry standards",
        "Professional techniques - proper methods and procedures",
        "Substrate preparation - washing, repairs, priming, masking",
        "Code compliance - meeting all building requirements"
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
      <SEOHead
        title="Roofing Warranty | 15 & 20-Year Coating Warranty | Call Kaids Roofing"
        description="Industry-leading 15-year standard and 20-year premium coating warranties plus 10-year workmanship warranty. Covering Clyde North, Cranbourne, Berwick & SE Melbourne."
        keywords="roofing warranty Melbourne, roof coating warranty, 15-year warranty, 20-year warranty, Call Kaids Roofing"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Shield className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Industry-Leading Roof Warranties
            </h1>
            <p className="text-xl text-muted-foreground">
              15-year standard or 20-year premium coating warranty plus 10-year workmanship guarantee on all industrial roof coating projects in Southeast Melbourne.
            </p>
            
            <div className="bg-primary/10 p-6 rounded-lg">
              <p className="text-lg font-semibold mb-2">Warranty Overview</p>
              <p className="text-muted-foreground">
                Call Kaids Roofing offers industry-leading warranty protection: 15-year standard coating warranty, 
                20-year premium coating warranty (with specified system), and 10-year workmanship warranty on all projects. 
                Based in Clyde North, serving SE Melbourne.
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
              <h2 className="text-3xl font-bold">Warranty Coverage Tiers</h2>
              <p className="text-xl text-muted-foreground">
                Choose the protection level that suits your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {warrantyTiers.map((tier, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {tier.badge}
                      </span>
                    </div>
                    <CardTitle>{tier.title}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.items.map((item, i) => (
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
              <h2 className="text-3xl font-bold">Warranty Conditions</h2>
              <p className="text-muted-foreground">Requirements for warranty validity</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Substrate preparation per SOP (wash, repairs, prime, mask)",
                      "Ambient temperature: 10–30°C during application",
                      "Wind speed: less than 30 km/h",
                      "No rain within 24 hours post-coating",
                      "Approved industrial roof coatings system only",
                      "Film build meets specifications with batch numbers recorded",
                      "Photo documentation: before/process/after",
                      "All work performed to manufacturer specifications"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {warrantyServices.map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{service.service} Coverage</CardTitle>
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
              <h2 className="text-3xl font-bold">Warranty Exclusions</h2>
              <p className="text-xl text-muted-foreground">
                Understanding what is not covered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Not Covered by Warranty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Structural issues - building defects or movement",
                      "Unrelated leaks - from areas not treated",
                      "Third-party damage - from other contractors or vandalism",
                      "Neglect - failure to maintain or report issues promptly",
                      "Non-compliant repaints - unauthorized coating applications",
                      "Extreme weather - beyond normal Melbourne conditions"
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
                  <CardTitle className="text-primary">Maintenance & Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Annual Visual Check</p>
                        <p className="text-xs text-muted-foreground">Inspect roof condition annually</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Gutter Cleaning</p>
                        <p className="text-xs text-muted-foreground">Keep gutters clear for drainage</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Claim Process</p>
                        <p className="text-xs text-muted-foreground">Email with job ID and photos</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Inspection & Remedy</p>
                        <p className="text-xs text-muted-foreground">CKR inspects and repairs covered issues</p>
                      </div>
                    </li>
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
              <h2 className="text-3xl font-bold">Why Industry-Leading Warranties</h2>
              <p className="text-muted-foreground">Our commitment to quality and your peace of mind</p>
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
                  Longer than most contractors, comprehensive coverage, local backing, personal warranty.
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
              Ready for Industry-Leading Warranty Protection?
            </h2>
            <p className="text-xl">
              Get quality industrial roof coating work backed by 15-year standard or 20-year premium warranty coverage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/quote">Get Free Quote</Link>
              </Button>
            </div>
            
            <p className="text-sm border-t border-white/20 pt-4">
              15/20-Year Coating Warranty • 10-Year Workmanship • Premium Materials • Industry-Leading Protection
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Warranty;