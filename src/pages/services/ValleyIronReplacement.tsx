import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Clock, Shield, MapPin, AlertTriangle, Wrench, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const ValleyIronReplacement = () => {
  const problemSigns = [
    "Rust stains on valley iron or surrounding tiles",
    "Water leaks during heavy rain in valley areas",
    "Visible holes or corrosion in valley iron",
    "Separation between valley iron and roof tiles",
    "Interior water stains near valley areas",
    "Moss or debris accumulation in valleys"
  ];

  const replacementProcess = [
    {
      step: "1",
      title: "Thorough Inspection",
      description: "Comprehensive assessment of all valley irons and surrounding roof structure.",
      details: [
        "Check for rust, corrosion, and structural damage",
        "Assess water flow and drainage patterns",
        "Examine tile condition around valleys",
        "Identify any structural issues requiring attention"
      ]
    },
    {
      step: "2",
      title: "Safe Removal",
      description: "Careful removal of old valley irons without damaging surrounding tiles.",
      details: [
        "Professional tile lifting techniques",
        "Protect surrounding roof areas",
        "Document any additional issues found",
        "Prepare surface for new installation"
      ]
    },
    {
      step: "3",
      title: "Quality Installation",
      description: "Install premium valley iron with proper flashing and waterproofing.",
      details: [
        "High-grade Colorbond or stainless steel",
        "Proper fall for optimal water flow",
        "Waterproof membrane installation",
        "Secure tile replacement and pointing"
      ]
    },
    {
      step: "4",
      title: "Testing & Warranty",
      description: "Comprehensive water testing and 10-year warranty on workmanship.",
      details: [
        "Water flow testing during installation",
        "Quality inspection of all joints",
        "10-year warranty documentation",
        "Maintenance recommendations provided"
      ]
    }
  ];

  const materialOptions = [
    {
      material: "Colorbond Steel",
      benefits: ["Colour-matched to roof", "20+ year lifespan", "Australian made", "Thermal expansion compatible"],
      cost: "$45-65/metre",
      recommended: "Most homes"
    },
    {
      material: "Stainless Steel", 
      benefits: ["Superior corrosion resistance", "30+ year lifespan", "Premium appearance", "Maintenance-free"],
      cost: "$65-85/metre",
      recommended: "Heritage/premium homes"
    },
    {
      material: "Zincalume",
      benefits: ["Cost-effective option", "Good corrosion resistance", "15+ year lifespan", "Paintable surface"],
      cost: "$35-45/metre", 
      recommended: "Budget-conscious owners"
    }
  ];

  const whyValleyIronsFail = [
    {
      cause: "Age and Corrosion",
      description: "Original valley irons from 20+ years ago often used lower-grade materials that deteriorate faster in Melbourne's climate."
    },
    {
      cause: "Poor Installation",
      description: "Inadequate fall, incorrect flashing, or poor waterproofing during original installation leads to premature failure."
    },
    {
      cause: "Debris Accumulation",
      description: "Leaves and debris in valleys trap moisture against the iron, accelerating corrosion and creating leak points."
    },
    {
      cause: "Thermal Movement",
      description: "Expansion and contraction in Melbourne's temperature extremes can cause separation and joint failure."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Valley Iron Replacement: Stop Hidden Leaks Before They Destroy Your Home
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Rusted valley irons are a common problem in older homes and a major cause of leaks. Specialist replacement service 
            using premium materials with 10-year warranty protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="premium" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Valley Irons Fail */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Valley Irons Fail (And Why It's So Dangerous)</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  The Hidden Danger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Valley irons channel massive amounts of water from multiple roof planes into a concentrated flow. 
                  When they fail, water goes directly into your roof cavity, often causing extensive damage before you even notice.
                </p>
                <p className="font-semibold text-orange-700">
                  A failed valley iron can cause thousands of dollars in structural damage, insulation replacement, 
                  and mould remediation - all hidden until it's too late.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Signs You Need Valley Iron Replacement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {problemSigns.map((sign, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{sign}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Causes of Failure */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Causes of Valley Iron Failure</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyValleyIronsFail.map((cause, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{cause.cause}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{cause.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Replacement Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Valley Iron Replacement Process</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {replacementProcess.map((step, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1 min-w-[40px] text-center">
                      {step.step}
                    </Badge>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Material Options */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Premium Material Options</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {materialOptions.map((option, index) => (
              <Card key={index} className={option.material === "Colorbond Steel" ? "border-primary bg-primary/5" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{option.material}</CardTitle>
                    <Badge variant="outline">{option.cost}</Badge>
                  </div>
                  {option.material === "Colorbond Steel" && (
                    <Badge variant="default" className="w-fit">Most Popular</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {option.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    <strong>Best for:</strong> {option.recommended}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment and Costs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Investment in Valley Iron Replacement</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Typical Project Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Single valley (15-20m)</span>
                  <Badge variant="outline">$600-900</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Two valleys (25-35m)</span>
                  <Badge variant="outline">$900-1,500</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Full house (40-60m)</span>
                  <Badge variant="outline">$1,500-2,500</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Complex/heritage homes</span>
                  <Badge variant="outline">$2,500-4,000+</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  *Includes removal, disposal, premium materials, and 10-year warranty
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Cost of NOT Replacing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">Structural damage: $3,000-10,000+</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">Insulation replacement: $1,500-3,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">Mould remediation: $2,000-6,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">Interior repairs: $2,000-8,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">Temporary accommodation costs</span>
                  </li>
                </ul>
                <div className="bg-orange-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-semibold text-orange-800">
                    Prevention is always cheaper than repair. Valley iron replacement now 
                    can save tens of thousands in water damage later.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Call Kaids Roofing for Valley Iron Replacement</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Specialist Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Valley iron replacement specialist</li>
                  <li>• Experience with all roof types and ages</li>
                  <li>• Proper fall calculation for optimal drainage</li>
                  <li>• Heritage and council compliance knowledge</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Premium Materials Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Colorbond steel - 20+ year lifespan</li>
                  <li>• Stainless steel for premium applications</li>
                  <li>• Quality flashing and waterproof membranes</li>
                  <li>• All materials backed by manufacturer warranty</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Complete Peace of Mind
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 10-year warranty on all workmanship</li>
                  <li>• Comprehensive insurance coverage</li>
                  <li>• Water testing before completion</li>
                  <li>• Local reputation you can trust</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't Let Failed Valley Irons Destroy Your Home</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Valley iron failure causes some of the most expensive and hidden water damage in homes. 
            Get yours inspected and replaced before disaster strikes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Kaidyn: 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/contact">Get Free Inspection</Link>
            </Button>
          </div>
          <div className="mt-8 space-y-2 text-sm opacity-75">
            <p>Free valley iron inspection with any roofing quote</p>
            <p>Serving Southeast Melbourne within 50km of Clyde North</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ValleyIronReplacement;