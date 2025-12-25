import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Droplets, Shield, AlertCircle, Leaf, Sparkles, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeadCaptureForm } from '@/public/components/LeadCaptureForm';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';

const RoofCleaning = () => {
  const cleaningBenefits = [
    "Prevents moss and lichen growth that damages tiles over time",
    "Identifies early warning signs of roof damage before they worsen",
    "Extends roof lifespan by 3-5 years when done regularly",
    "Improves home appearance and curb appeal immediately",
    "Prevents blocked gutters from roof debris washing down"
  ];

  const cleaningProcess = [
    {
      step: "1",
      title: "Roof Inspection First",
      description: "Before touching a single tile, I inspect your roof for damage. If tiles are fragile or the roof structure is compromised, I'll tell you straight—cleaning might do more harm than good.",
      details: [
        "Check for cracked or loose tiles that need repair first",
        "Assess moss and lichen severity",
        "Identify any structural concerns",
        "Confirm roof can handle high-pressure cleaning safely"
      ]
    },
    {
      step: "2",
      title: "Controlled High-Pressure Wash",
      description: "Not all roofs need the same pressure. I adjust equipment based on your tile type, age, and condition. Too much pressure damages tiles; too little leaves growth behind.",
      details: [
        "Variable pressure settings for tile vs metal roofs",
        "Start low, increase only as needed",
        "Work from ridge down to gutters systematically",
        "Remove moss, lichen, dirt, and organic matter"
      ]
    },
    {
      step: "3",
      title: "Treatment and Prevention",
      description: "Cleaning alone isn't enough. I apply roof-safe treatments that prevent regrowth for 12-18 months, depending on tree coverage and local conditions.",
      details: [
        "Anti-fungal treatment for moss and lichen prevention",
        "Biodegradable solutions safe for gardens and gutters",
        "Target problem areas with heavier growth",
        "Document before/after with photos for your records"
      ]
    },
    {
      step: "4",
      title: "Gutter Clearance and Cleanup",
      description: "All that debris has to go somewhere. I clear gutters and downpipes completely, ensuring water flows properly before I leave.",
      details: [
        "Remove all washed-down debris from gutters",
        "Check downpipes aren't blocked",
        "Clear ground-level debris around house",
        "Final inspection ensuring job is complete"
      ]
    }
  ];

  const whenYouNeedCleaning = [
    "Visible moss, lichen, or black streaks on roof tiles",
    "Roof colour looks faded or patchy from growth",
    "Trees overhanging or dropping leaves regularly",
    "Live in humid areas near trees (Berwick, Narre Warren, Frankston)",
    "Planning to sell—buyers notice dirty roofs immediately",
    "Before roof painting or restoration (saves money on prep)"
  ];

  const notJustCosmeticReasons = [
    {
      issue: "Moss and Lichen Damage",
      explanation: "These organisms hold moisture against tiles, causing them to crack and deteriorate faster. In Melbourne's freeze-thaw cycles, this accelerates damage significantly.",
      icon: Leaf
    },
    {
      issue: "Hidden Leak Risks",
      explanation: "Growth under ridge caps and in valleys creates water pathways where there shouldn't be any. By the time you see a ceiling leak, the damage is often extensive.",
      icon: Droplets
    },
    {
      issue: "Premature Tile Failure",
      explanation: "Organic growth breaks down tile coatings and sealants. Tiles that should last 50 years might only give you 30 if neglected.",
      icon: AlertCircle
    }
  ];

  const faqs = [
    {
      question: "How often should I get my roof cleaned?",
      answer: "Depends on your location and tree coverage. Homes with overhanging trees in suburbs like Berwick or Narre Warren: every 2-3 years. Open properties with minimal tree coverage in Clyde North or Officer: every 4-5 years. I'll tell you honestly what your roof needs when I inspect it."
    },
    {
      question: "Will high-pressure cleaning damage my tiles?",
      answer: "Not if done correctly. I've cleaned hundreds of roofs—the key is adjusting pressure based on tile age and type. Concrete tiles handle more pressure than terracotta. Older tiles need gentler treatment. Cowboys with one pressure setting damage roofs; I don't."
    },
    {
      question: "Can I just clean the roof myself with a garden hose?",
      answer: "You can try, but you won't remove moss and lichen properly. Garden hoses lack the pressure needed, and you'll spend hours achieving minimal results. Plus, roof work is dangerous—one slip can mean serious injury or worse. Not worth the risk."
    },
    {
      question: "Is roof cleaning included in roof restoration?",
      answer: "Yes. High-pressure cleaning is Step 2 of my restoration process. But if your roof only needs cleaning (no painting or repairs), it's a standalone service at a fraction of restoration cost."
    },
    {
      question: "What's the difference between roof cleaning and gutter cleaning?",
      answer: "Completely separate services. Roof cleaning removes moss, lichen, and dirt from tiles. Gutter cleaning clears leaves and debris from gutters and downpipes. Often done together, but they're different jobs with different equipment and pricing."
    },
    {
      question: "How long does roof cleaning take?",
      answer: "Half-day to full day, depending on roof size and growth severity. Small homes (150-200m²) with light growth: 3-4 hours. Large homes (300m²+) with heavy moss: full day. I'll give you an accurate timeframe after inspecting your roof."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="High-Pressure Roof Cleaning Melbourne | Call Kaids Roofing"
        description="Professional roof washing removes moss, lichen and dirt safely. Extends roof life, prevents damage. Serving SE Melbourne. Get your free quote today."
        keywords="roof cleaning Melbourne, high pressure roof cleaning, roof washing, moss removal, Call Kaids Roofing"
      />
      <StructuredData
        type="service"
        serviceName="High-Pressure Roof Cleaning"
        serviceDescription="Professional controlled roof washing service that removes moss, lichen, and organic growth safely without damaging tiles"
        pageUrl="https://callkaidsroofing.com.au/services/roof-cleaning"
      />

      {/* Hero Section */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        className="py-20 text-white"
        gradient="linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            High-Pressure Roof Cleaning Melbourne
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Remove moss, lichen, and years of buildup. Extend your roof's life. Same-day service available.
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
      <LeadCaptureForm
        variant="full"
        title="Get Free Quote - Roof Cleaning"
        description="Fill out this form and Kaidyn will call you within 4 hours to discuss your roof cleaning needs."
        serviceName="High-Pressure Roof Cleaning"
        ctaText="Get Free Cleaning Quote"
        showEmail={true}
        showUrgency={true}
        showMessage={true}
      />

      {/* Why Cleaning Matters */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Roof Cleaning Isn't Just Cosmetic</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {notJustCosmeticReasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {reason.issue}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{reason.explanation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Roof Cleaning Process</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {cleaningProcess.map((step, index) => (
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

      {/* When You Need Cleaning */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Signs Your Roof Needs Cleaning</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Common Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whenYouNeedCleaning.map((sign, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{sign}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits of Professional Roof Cleaning</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Preventative Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {cleaningBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Before/after photos documenting work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Anti-fungal treatment preventing regrowth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Complete gutter clearance included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Honest assessment of any damage found</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Recommendations for ongoing maintenance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get Your Roof Cleaned Properly</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Serving Clyde North, Berwick, Officer, Pakenham, Cranbourne, Narre Warren, and surrounding Southeast Melbourne suburbs.
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
      </section>
    </div>
  );
};

export default RoofCleaning;
