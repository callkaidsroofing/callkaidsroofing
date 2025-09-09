import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SEOHead } from '@/components/SEOHead';
import { 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Star, 
  Users,
  Award,
  Calendar,
  FileText,
  Camera,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    service: '',
    urgency: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 32 });
  const [showBanner, setShowBanner] = useState(true);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Priority Booking Confirmed!",
        description: "Kaidyn will call you within 2 hours to schedule your emergency assessment.",
      });
      
      setFormData({
        name: '', phone: '', email: '', suburb: '', service: '', urgency: '', message: ''
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please call 0435 900 709 immediately for urgent issues.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LandingPage",
    "name": "Emergency Roof Repairs Melbourne - Call Kaids Roofing",
    "description": "24/7 emergency roof repairs in Southeast Melbourne. Storm damage, leaks, urgent repairs. Same-day response with 10-year warranty.",
    "provider": {
      "@type": "RoofingContractor",
      "name": "Call Kaids Roofing",
      "telephone": "+61 435 900 709"
    }
  };

  return (
    <>
      <SEOHead
        title="URGENT: Emergency Roof Repairs Melbourne | Same-Day Response | Call Kaids Roofing"
        description="Storm damage? Urgent leak? Call 0435 900 709 for same-day emergency roof repairs in Southeast Melbourne. 24/7 response, 10-year warranty."
        keywords="emergency roof repairs, storm damage, urgent leak repair, same day roofing, Melbourne emergency roofer, 24/7 roof repair"
        canonical="https://callkaidsroofing.com.au/emergency-landing"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Urgency Banner */}
        {showBanner && (
          <div className="bg-destructive text-white py-2 px-4 relative">
            <div className="container mx-auto text-center">
              <div className="flex items-center justify-center gap-4">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <span className="font-semibold">
                  STORM SEASON ALERT: Emergency slots filling fast - 
                  <span className="mx-2">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  left for today's emergency calls
                </span>
                <button 
                  onClick={() => setShowBanner(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-destructive/10 to-primary/20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <Badge variant="destructive" className="text-sm font-semibold animate-pulse">
                🚨 EMERGENCY RESPONSE ACTIVE
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-destructive">STORM DAMAGE?</span><br />
                <span className="text-primary">I'll Be There Today</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Melbourne's fastest emergency roofer. Same-day response for urgent leaks, 
                storm damage, and roof emergencies. Owner-operated with 25+ years experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-lg px-8 py-4 h-auto emergency-pulse">
                  <a href="tel:0435900709" className="flex items-center gap-2">
                    <Phone className="h-6 w-6" />
                    CALL NOW: 0435 900 709
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 h-auto border-2 border-primary"
                  onClick={() => document.getElementById('emergency-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <a href="#emergency-form">Book Emergency Assessment</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-8 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">200+ Emergency Repairs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">Average 2-Hour Response</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold">10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                ))}
                <span className="ml-2 font-semibold">4.9/5 Emergency Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Agitation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-destructive">
                Every Minute Your Roof Leaks, The Damage Gets Worse
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-destructive/20">
                  <CardContent className="p-6">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-xl font-bold mb-3 text-destructive">Right Now Your Roof Is:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Letting water into your ceiling cavity</li>
                      <li>• Rotting your timber frames and insulation</li>
                      <li>• Creating mold that's dangerous to your family</li>
                      <li>• Damaging your belongings and electronics</li>
                      <li>• Costing you thousands in structural damage</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <CheckCircle className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3 text-primary">Here's How I Stop It Today:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Emergency temporary protection within hours</li>
                      <li>• Permanent repair with 10-year warranty</li>
                      <li>• Insurance documentation and photos</li>
                      <li>• Prevention of further water damage</li>
                      <li>• Save thousands in repair costs</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Form */}
        <section id="emergency-form" className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <Badge variant="destructive" className="mb-4">
                      PRIORITY EMERGENCY BOOKING
                    </Badge>
                    <h3 className="text-2xl font-bold mb-4">
                      Get Emergency Response Within 2 Hours
                    </h3>
                    <p className="text-muted-foreground">
                      Fill out this form and Kaidyn will call you immediately to arrange emergency protection.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12"
                      />
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

                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-3 border border-input bg-background rounded-md"
                    >
                      <option value="">How urgent is this? *</option>
                      <option value="emergency">EMERGENCY - Water coming in now</option>
                      <option value="urgent">URGENT - Noticed damage today</option>
                      <option value="soon">SOON - Want it fixed this week</option>
                    </select>

                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-3 border border-input bg-background rounded-md"
                    >
                      <option value="">What's the issue? *</option>
                      <option value="leak">Active leak - water coming in</option>
                      <option value="storm">Storm damage - tiles/gutters damaged</option>
                      <option value="emergency">Emergency temporary protection needed</option>
                      <option value="assessment">Need urgent assessment</option>
                    </select>

                    <Textarea
                      name="message"
                      placeholder="Describe the problem (helps me bring the right materials)"
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-24"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-bold bg-destructive hover:bg-destructive/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'BOOKING EMERGENCY RESPONSE...' : 'BOOK EMERGENCY RESPONSE NOW'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>2-hour response</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>Direct to owner</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Fully insured</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Can't wait? Call Kaidyn directly:
                      </p>
                      <Button asChild variant="outline" size="lg">
                        <a href="tel:0435900709" className="flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          0435 900 709
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Why Melbourne Trusts Call Kaids for Emergencies</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Calendar className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-bold">25+ Years Experience</h3>
                  <p className="text-muted-foreground">
                    Combined team experience handling every type of roof emergency Melbourne can throw at us.
                  </p>
                </div>

                <div className="space-y-4">
                  <FileText className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-bold">Insurance Ready</h3>
                  <p className="text-muted-foreground">
                    Complete documentation and photos for your insurance claim. We know what they need.
                  </p>
                </div>

                <div className="space-y-4">
                  <Camera className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-bold">Photo Evidence</h3>
                  <p className="text-muted-foreground">
                    Before, during, and after photos. You'll see exactly what was wrong and how we fixed it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-destructive to-primary text-white text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Don't Let a Small Problem Become a Big Expensive Disaster
              </h2>
              <p className="text-xl">
                Every hour you wait, the damage gets worse and more expensive. 
                Get it fixed today with a 10-year warranty.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
                  <a href="tel:0435900709" className="flex items-center gap-2">
                    <Phone className="h-6 w-6" />
                    CALL: 0435 900 709
                  </a>
                </Button>
              </div>

              <p className="text-sm opacity-90">
                ABN: 39475055075 • Fully Insured • 10-Year Warranty • Southeast Melbourne
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;