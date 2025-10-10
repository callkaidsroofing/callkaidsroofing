import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import {
  Phone,
  CheckCircle,
  Clock,
  Shield,
  Star,
  AlertTriangle,
  Camera,
  Award,
  Users
} from "lucide-react";
import FomoBanner from "@/components/FomoBanner";
import FilloutForm from "@/components/FilloutForm";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [spotsLeft, setSpotsLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const spotTimer = setInterval(() => {
      setSpotsLeft(prev => (prev > 1 ? prev - 1 : prev));
    }, 300000);
    return () => clearInterval(spotTimer);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LandingPage",
    "name": "Emergency Roof Repairs Melbourne - Call Kaids Roofing",
    "description": "24/7 emergency roof repairs across Melbourne. Stop leaks now with our rapid response team. Free assessment, 10-year warranty.",
    "provider": {
      "@type": "RoofingContractor",
      "name": "Call Kaids Roofing",
      "telephone": "0435900709"
    }
  };

  return (
    <>
      <SEOHead
        title="Emergency Roof Repairs Melbourne | Stop Leaks Fast | Call Kaids Roofing"
        description="24/7 emergency roof repair service across Melbourne. Professional leak detection & repairs. Free assessment, 10-year warranty. Call now: 0435 900 709"
        keywords="emergency roof repairs Melbourne, roof leak repair, urgent roofing service, 24/7 roof repairs, Melbourne roof emergency"
        structuredData={structuredData}
      />

      <FomoBanner timeLeft={timeLeft} spotsLeft={spotsLeft} />

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        {/* Hero Section */}
        <section className="pt-8 pb-12">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Badge variant="destructive" className="text-sm font-semibold animate-pulse">
                    🚨 Only {spotsLeft} emergency slots left today
                  </Badge>
                  <Badge className="text-sm font-semibold">EMERGENCY ROOF REPAIRS</Badge>
                </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Your Roof Leak
                <span className="text-primary block">Before It's Too Late</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Melbourne's fastest emergency roof repair service. We stop leaks in their tracks with same-day response and 10-year warranty.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <a href="tel:0435900709">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now: 0435 900 709
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => {
                  document.getElementById('emergency-form')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Book Emergency Assessment
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Form */}
        <section id="emergency-form" className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Get Your FREE Emergency Assessment</h3>
                <p className="text-muted-foreground">
                  Kaidyn will personally assess your roof and provide immediate emergency protection - usually within 2 hours.
                </p>
                <p className="mt-2 text-destructive font-semibold animate-pulse">
                  Only {spotsLeft} free assessments left today!
                </p>
              </div>
              <FilloutForm />
            </div>
          </div>
        </section>

        {/* Social Proof Strip */}
        <section className="py-8 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">2 Hour Response</div>
                  <div className="text-sm text-muted-foreground">Emergency callouts</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">10 Year Warranty</div>
                  <div className="text-sm text-muted-foreground">On all repairs</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">5.0 Star Rating</div>
                  <div className="text-sm text-muted-foreground">Google Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Agitation */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-destructive">
                  Every Hour You Wait, The Damage Gets Worse
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                    <div>
                      <div className="font-semibold">Water Damage Spreads Fast</div>
                      <div className="text-muted-foreground">What starts as a small leak can destroy ceilings, walls, and electrical systems within hours.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                    <div>
                      <div className="font-semibold">Mould Growth Begins in 24 Hours</div>
                      <div className="text-muted-foreground">Dangerous mould can start growing within a day, creating health risks for your family.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                    <div>
                      <div className="font-semibold">Insurance Claims Get Complicated</div>
                      <div className="text-muted-foreground">Delayed action can void your insurance coverage and leave you paying thousands out of pocket.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 text-primary">
                  Get Immediate Protection With Our Emergency Service
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Instant Leak Stoppage</div>
                      <div className="text-muted-foreground">Emergency tarping and temporary repairs to stop water damage immediately.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Professional Assessment</div>
                      <div className="text-muted-foreground">Complete damage evaluation with photos for insurance claims.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Permanent Solution</div>
                      <div className="text-muted-foreground">Quality repairs that prevent future problems with our 10-year warranty.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Credentials */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Melbourne Trusts Call Kaids Roofing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">15+ Years Experience</h3>
                <p className="text-muted-foreground">
                  Kaidyn personally handles every emergency with over 15 years of roofing expertise across Melbourne.
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fully Insured & Ready</h3>
                <p className="text-muted-foreground">
                  $20M public liability insurance and all safety equipment for immediate emergency response.
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Photo Evidence Provided</h3>
                <p className="text-muted-foreground">
                  Complete documentation of damage and repairs for your insurance claims and peace of mind.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
          <section className="py-12 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Don't Let Your Roof Emergency Get Worse
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Every minute counts when you have a roof leak. Get professional help now and protect your biggest investment.
              </p>
              <p className="text-lg mb-8 text-yellow-200 font-semibold animate-pulse">
                Only {spotsLeft} emergency appointments left today.
              </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Emergency Line: 0435 900 709
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90" onClick={() => {
                document.getElementById('emergency-form')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Book Free Assessment
              </Button>
            </div>

            <div className="mt-8 text-sm opacity-90">
              <p>✓ 2 Hour Emergency Response ✓ 10 Year Warranty ✓ Fully Insured ✓ ABN: 39475055075</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}