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
  Home,
  Paintbrush,
  Award,
  Camera,
  TrendingUp
} from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  urgency: string;
  message: string;
}

export default function RestorationLanding() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "", 
    email: "",
    suburb: "",
    service: "Complete Roof Restoration",
    urgency: "Within 2 weeks",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
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
          message: `Timeline: ${formData.urgency}. ${formData.message}`,
          urgency: formData.urgency,
          source: 'restoration_landing'
        }
      });

      if (error) throw error;

      toast({
        title: "Restoration Quote Requested!",
        description: "Kaidyn will call you within 24 hours to schedule your free roof health check and provide your restoration quote.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        service: "Complete Roof Restoration",
        urgency: "Within 2 weeks", 
        message: ""
      });
    } catch (error: unknown) {
      toast({
        title: "Quote Request Failed",
        description: "Please call 0435 900 709 to speak with Kaidyn directly.",
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
    "name": "Roof Restoration Melbourne - Call Kaids Roofing",
    "description": "Professional roof restoration services across Melbourne. Restore your roof's beauty and protection with our 10-year warranty. Free roof health check.",
    "provider": {
      "@type": "RoofingContractor",
      "name": "Call Kaids Roofing",
      "telephone": "0435900709"
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <SEOHead
        title="Roof Restoration Melbourne | Transform Your Roof | Call Kaids Roofing"
        description="Professional roof restoration services across Melbourne. Complete roof makeover with painting, repointing & repairs. 10-year warranty. Free health check."
        keywords="roof restoration Melbourne, roof painting Melbourne, roof repointing, complete roof makeover, Melbourne roof restoration"
        structuredData={structuredData}
      />

      {/* Special Offer Banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
        <div className="container mx-auto px-4">
          ✨ LIMITED TIME: Free Roof Health Check + $500 Off Complete Restorations - Expires in {formatTime(timeLeft)} ✨
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        {/* Hero Section */}
        <section className="pt-8 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4 text-sm font-semibold">
                🏠 COMPLETE ROOF RESTORATION
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Roof
                <span className="text-primary block">Like New Again</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Melbourne's premium roof restoration service. Restore your roof's beauty, protection and value with our complete makeover package.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <a href="tel:0435900709">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now: 0435 900 709
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => {
                  document.getElementById('restoration-form')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Get Free Health Check
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Form - Moved to Top */}
        <section id="restoration-form" className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4">Get Your FREE Roof Health Check</h3>
                    <p className="text-muted-foreground">
                      Kaidyn will personally inspect your roof and provide a detailed restoration quote with no obligations.
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
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full h-12 px-3 border rounded-md bg-background"
                        required
                      >
                        <option value="Complete Roof Restoration">🏠 Complete Roof Restoration</option>
                        <option value="Roof Painting Only">🎨 Roof Painting Only</option>
                        <option value="Repointing & Rebedding">🔧 Repointing & Rebedding</option>
                        <option value="Custom Package">⚙️ Custom Package</option>
                      </select>
                    </div>

                    <div>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full h-12 px-3 border rounded-md bg-background"
                        required
                      >
                        <option value="Within 2 weeks">📅 Within 2 weeks</option>
                        <option value="Within 1 month">🗓️ Within 1 month</option>
                        <option value="Within 3 months">⏰ Within 3 months</option>
                        <option value="Just browsing">👀 Just browsing</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Tell us about your roof restoration needs (optional)"
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
                      {isSubmitting ? 'Requesting Health Check...' : '🏠 Get Free Roof Health Check'}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Or call Kaidyn directly:
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

        {/* Social Proof Strip */}
        <section className="py-8 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">500+ Restorations</div>
                  <div className="text-sm text-muted-foreground">Completed across Melbourne</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">10 Year Warranty</div>
                  <div className="text-sm text-muted-foreground">On all restoration work</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">$50K+ Value Add</div>
                  <div className="text-sm text-muted-foreground">Average property value increase</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-muted-foreground">
                  Is Your Roof Making Your Home Look Tired?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-3"></div>
                    <div>
                      <div className="font-semibold">Faded, Discoloured Tiles</div>
                      <div className="text-muted-foreground">Years of Melbourne weather have left your roof looking worn and dated.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-3"></div>
                    <div>
                      <div className="font-semibold">Cracked or Missing Mortar</div>
                      <div className="text-muted-foreground">Ridge caps and tiles are loose, letting water and pests into your roof space.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-3"></div>
                    <div>
                      <div className="font-semibold">Decreasing Property Value</div>
                      <div className="text-muted-foreground">A tired-looking roof can reduce your home's value and street appeal significantly.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 text-primary">
                  Complete Roof Restoration Transforms Everything
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Professional Roof Painting</div>
                      <div className="text-muted-foreground">Premium Dulux AcraTex coating that makes your roof look brand new for 15+ years.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Complete Repointing & Rebedding</div>
                      <div className="text-muted-foreground">Fresh mortar on all ridge caps and valley tiles for maximum weather protection.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold">Increased Property Value</div>
                      <div className="text-muted-foreground">Boost your home's value by $30K-$50K+ with our premium restoration package.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Complete Restoration Package Includes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <Paintbrush className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Professional Roof Painting</h3>
                <p className="text-muted-foreground">
                  High-pressure cleaning, primer application, and 2 coats of premium Dulux AcraTex membrane.
                </p>
              </Card>
              
              <Card className="p-6">
                <Home className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ridge Cap Repointing</h3>
                <p className="text-muted-foreground">
                  Remove old mortar, clean thoroughly, and apply fresh flexible pointing compound.
                </p>
              </Card>
              
              <Card className="p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Broken Tile Replacement</h3>
                <p className="text-muted-foreground">
                  Replace any cracked, broken or missing tiles with matching materials.
                </p>
              </Card>
              
              <Card className="p-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gutter Clean & Check</h3>
                <p className="text-muted-foreground">
                  Complete gutter cleaning and inspection to ensure proper water flow.
                </p>
              </Card>
              
              <Card className="p-6">
                <Camera className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Before & After Photos</h3>
                <p className="text-muted-foreground">
                  Professional documentation of your roof's transformation for your records.
                </p>
              </Card>
              
              <Card className="p-6">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">10 Year Warranty</h3>
                <p className="text-muted-foreground">
                  Comprehensive warranty on all workmanship and materials for complete peace of mind.
                </p>
              </Card>
            </div>
          </div>
        </section>


        {/* Final CTA */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Roof?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join 500+ Melbourne homeowners who've transformed their properties with our premium restoration service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <a href="tel:0435900709">
                  Call Now: 0435 900 709
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => {
                document.getElementById('restoration-form')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Book Free Health Check
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}