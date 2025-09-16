import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface FormData {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  urgency: string;
  message: string;
}

export default function LandingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "", 
    email: "",
    suburb: "",
    service: "Emergency Roof Assessment",
    urgency: "Within 24 hours",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [spotsLeft, setSpotsLeft] = useState(3);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reduce available spots over time to create urgency
  useEffect(() => {
    const spotTimer = setInterval(() => {
      setSpotsLeft(prev => (prev > 1 ? prev - 1 : prev));
    }, 300000); // every 5 minutes
    return () => clearInterval(spotTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          suburb: formData.suburb,
          service: formData.service,
          message: `Urgency: ${formData.urgency}. ${formData.message}`,
          urgency: formData.urgency,
          source: 'landing_page'
        }
      });

      if (error) throw error;

      toast({
        title: "Emergency Assessment Booked!",
        description: "Kaidyn will call you within 2 hours to schedule your urgent roof inspection.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        service: "Emergency Roof Assessment",
        urgency: "Within 24 hours", 
        message: ""
      });
    } catch (error: unknown) {
      toast({
        title: "Booking Failed",
        description: "Please call 0435 900 709 immediately for urgent help.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

        {/* Conversion Form */}
        <section id="emergency-form" className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl border-0">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-4">Get Your FREE Emergency Assessment</h3>
                      <p className="text-muted-foreground">
                        Kaidyn will personally assess your roof and provide immediate emergency protection - usually within 2 hours.
                      </p>
                      <p className="mt-2 text-destructive font-semibold animate-pulse">
                        Only {spotsLeft} free assessments left today!
                      </p>
                    </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number *"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          name="suburb"
                          placeholder="Your Suburb *"
                          value={formData.suburb}
                          onChange={handleChange}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full h-12 px-3 border rounded-md bg-background"
                        required
                      >
                        <option value="Immediate - Active leak">🚨 Immediate - Active leak</option>
                        <option value="Within 24 hours">⚡ Within 24 hours</option>
                        <option value="Within 48 hours">🔧 Within 48 hours</option>
                        <option value="This week">📅 This week</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Describe your roof problem (optional)"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Booking Emergency Assessment...' : '🚨 Book Emergency Assessment Now'}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Or call directly for immediate help:
                      </p>
                      <Button asChild variant="outline" size="lg">
                        <a href="tel:0435900709" className="flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          0435 900 709
                        </a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
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