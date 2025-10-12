import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Clock, Shield, MapPin, DollarSign, Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';
import ServiceSpecificForm from '@/components/ServiceSpecificForm';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';

const RoofRestoration = () => {
  const restorationSteps = [
    {
      step: "1",
      title: "Honest Assessment First",
      description: "I'll climb up and check every inch of your roof. If it's too far gone, I'll tell you straight—don't waste money on restoration if replacement is the smarter choice.",
      details: [
        "Structural integrity of the roof frame",
        "Tile condition and how many need replacing",
        "Ridge capping and pointing condition", 
        "Valley irons and flashing systems",
        "Overall feasibility of restoration vs replacement"
      ]
    },
    {
      step: "2", 
      title: "High-Pressure Clean",
      description: "Strip off years of dirt, moss, and grime with professional high-pressure equipment. This isn't a garden hose job—we're talking serious cleaning gear that brings tiles back to their original colour.",
      details: []
    },
    {
      step: "3",
      title: "Fix Everything That's Broken", 
      description: "Replace cracked tiles, re-bed loose ridge caps, fix valley irons, repair flashings. No point painting over problems—fix them properly first.",
      details: [
        "Tile replacement with perfect colour matches",
        "Ridge capping re-bedding using quality mortar", 
        "Valley iron repairs or replacement if needed",
        "Flashing adjustments around chimneys and vents"
      ]
    },
    {
      step: "4",
      title: "Premium Primer and Membrane",
      description: "Apply industrial-grade primer, then two thick coats of premium membrane. This isn't paint—it's a protective coating designed specifically for Australian roofs.",
      details: [
        "15+ year lifespan on the coating system",
        "Waterproof seal that stops leaks before they start",
        "UV protection preventing further fading", 
        "Energy savings through reflective properties"
      ]
    }
  ];

  const perfectCandidates = [
    "Structurally sound roofs that just look tired",
    "15-30 year old homes in suburbs like Frankston, Narre Warren, Berwick",
    "Heritage homes where replacement isn't practical", 
    "Budget-conscious owners who want maximum bang for buck"
  ];

  const whenToReplace = [
    "Severely damaged structure with multiple leaks",
    "Asbestos roofing that needs professional removal",
    "Roofs over 40 years old with major structural issues",
    "Extensive storm damage where replacement is more cost-effective"
  ];

  const suburbConsiderations = [
    {
      category: "Established Suburbs (Frankston, Narre Warren)",
      description: "These areas have lots of 20-30 year old homes perfect for restoration.",
      issues: [
        "Faded terracotta tiles from UV exposure",
        "Moss growth from mature tree coverage", 
        "Minor storm damage accumulated over years",
        "Original coatings that have reached end of life"
      ]
    },
    {
      category: "Growth Corridors (Clyde North, Berwick, Officer)",
      description: "Newer homes (10-20 years) often need preventative restoration.",
      issues: [
        "Early maintenance to extend roof life",
        "Colour updates to match renovations",
        "Protective coatings before major problems develop",
        "Investment protection for growing property values"
      ]
    },
    {
      category: "Heritage Areas (Hawthorn, Kew, Toorak)",
      description: "Special considerations for character homes.",
      issues: [
        "Heritage-compliant materials and colours",
        "Traditional techniques where required",
        "Council approval assistance if needed",
        "Character preservation with modern protection"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Roof Restorations Clyde North | Call Kaids Roofing SE Melbourne"
        description="Bring your roof back to life with professional restorations. Serving Clyde North, Cranbourne, Berwick & surrounds. Honest quotes, lasting results."
        keywords="roof restoration Clyde North, roof restoration Cranbourne, roof restoration Berwick, Call Kaids Roofing"
      />
      <StructuredData 
        type="service" 
        serviceName="Roof Restoration"
        serviceDescription="Complete roof overhaul with high-pressure clean, repairs, and premium membrane coating system"
        pageUrl="https://callkaidsroofing.com.au/services/roof-restoration"
      />
      {/* Hero Section */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        className="py-20 text-white"
        gradient="linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Roof Restoration Melbourne
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Transform your roof for 60-70% less than replacement. 10-year warranty included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/book">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </OptimizedBackgroundSection>

      {/* Service Form */}
      <ServiceSpecificForm 
        serviceName="Roof Restoration"
        serviceDescription="Complete roof overhaul with high-pressure clean, repairs, and premium membrane coating system"
        ctaText="Get Free Restoration Quote"
      />

      {/* Process Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Restoration Process</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {restorationSteps.map((step, index) => (
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
                {step.details.length > 0 && (
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
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* When to Choose Restoration vs Replacement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Is Restoration Right for Your Roof?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Perfect Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {perfectCandidates.map((candidate, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{candidate}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-roofing-warning/30 bg-roofing-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-roofing-emergency">
                  <AlertTriangle className="h-5 w-5" />
                  When I'll Tell You to Replace Instead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  I won't take your money if restoration isn't the right choice:
                </p>
                <ul className="space-y-3">
                  {whenToReplace.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-roofing-emergency mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Suburb Considerations */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Suburb-Specific Considerations</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {suburbConsiderations.map((suburb, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{suburb.category}</CardTitle>
                  <CardDescription>{suburb.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suburb.issues.map((issue, issueIndex) => (
                      <li key={issueIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment and Pricing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Investment and Value</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Typical Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Small homes (150-200m²)</span>
                  <Badge variant="outline">$6,000 - $9,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Standard homes (200-300m²)</span>
                  <Badge variant="outline">$9,000 - $15,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Large homes (300m²+)</span>
                  <Badge variant="outline">$15,000 - $22,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Heritage/complex roofs</span>
                  <Badge variant="outline">$22,000 - $30,000</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Return on Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Property value increase: 2-4% typical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Energy savings: $200-400 annually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Maintenance avoidance: Prevents $5,000+ in repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Extended roof life: 15-20 years additional lifespan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Compare to replacement: 60% cost savings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 10-Year Warranty */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What You Get with My Restoration</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    10-Year Warranty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left">
                    <li>• Membrane performance against cracking or peeling</li>
                    <li>• Leak-free guarantee on all repair work</li>
                    <li>• Colour stability within normal parameters</li>
                    <li>• Workmanship quality on all aspects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Premium Materials Only
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left">
                    <li>• Supa Point or Premier Roof Coatings premium membranes</li>
                    <li>• Climate-specific primers and sealers</li>
                    <li>• UV-resistant RGL or Shield Coat colour systems</li>
                    <li>• Industrial-grade coatings that move with your roof</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="xl">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/contact">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofRestoration;