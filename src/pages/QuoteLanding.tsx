import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Shield, Award, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { SEOHead } from '@/components/SEOHead';

const quoteFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().min(10, 'Valid phone number required').max(20),
  address: z.string().trim().min(5, 'Full address required').max(200),
  suburb: z.string().trim().min(2, 'Suburb required').max(100),
  claddingType: z.string().min(1, 'Please select roof type'),
  roofArea: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
  honeypot: z.string().max(0),
});

type FormData = z.infer<typeof quoteFormSchema>;

const QuoteLanding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    claddingType: '',
    roofArea: '',
    message: '',
    honeypot: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, claddingType: value }));
  };

  const validateForm = (): boolean => {
    try {
      quoteFormSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Please check your details",
          description: error.errors[0].message,
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      console.log('Spam detected');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          suburb: formData.suburb,
          service: `Quote Request - ${formData.claddingType}`,
          message: `Address: ${formData.address}\nRoof Type: ${formData.claddingType}\nApprox Area: ${formData.roofArea || 'Not specified'}\n\n${formData.message || ''}`,
          urgency: 'This Week',
        },
      });

      if (error) throw error;

      toast({
        title: "Quote request received!",
        description: "We'll prepare your detailed quote and contact you within 24 hours.",
      });

      setTimeout(() => navigate('/thank-you'), 1500);
    } catch (error) {
      console.error('Quote submission error:', error);
      toast({
        variant: "destructive",
        title: "Unable to submit request",
        description: "Please call us directly at 0435 900 709",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Get Your Free Roof Quote - Call Kaids Roofing | SE Melbourne"
        description="Get a detailed, photo-backed roof quote from Call Kaids Roofing. Fully insured, 15-year warranty, servicing SE Melbourne. No leaks. No lifting. Just quality."
        canonical="https://callkaidsroofing.com.au/quote"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-roofing-navy to-roofing-navy-light text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⭐ Rated #1 in Southeast Melbourne
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get Your Free, Detailed Roof Health Check
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6">
                Photo-backed quotes. 15-year warranty. Fully insured.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>2-3 Weeks Next Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Emergency Response Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Free Inspections This Week</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-2">
                  <div className="bg-card p-8 rounded-lg roofing-shadow">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Request Your Quote
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We need a few key details to prepare an accurate, photo-backed quote for your SE Melbourne property.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Client Contact Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Your Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="0435 900 709"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Property Information</h3>
                        <div>
                          <Label htmlFor="address">Site Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="suburb">Suburb / Postcode *</Label>
                          <Input
                            id="suburb"
                            name="suburb"
                            type="text"
                            value={formData.suburb}
                            onChange={handleInputChange}
                            placeholder="Clyde North 3978"
                            required
                          />
                        </div>
                      </div>

                      {/* Roof Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Roof Details</h3>
                        <div>
                          <Label htmlFor="claddingType">Roof Type *</Label>
                          <Select value={formData.claddingType} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select roof type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
                              <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
                              <SelectItem value="Metal">Metal (Colorbond/Zincalume)</SelectItem>
                              <SelectItem value="Not Sure">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="roofArea">Approximate Roof Area (m²)</Label>
                          <Input
                            id="roofArea"
                            name="roofArea"
                            type="text"
                            value={formData.roofArea}
                            onChange={handleInputChange}
                            placeholder="e.g., 150 (optional)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Describe the Work Needed</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="e.g., 'Full restoration needed', 'Leak in living room', 'Ridge caps loose'"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Honeypot */}
                      <input
                        type="text"
                        name="honeypot"
                        value={formData.honeypot}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <Button
                        type="submit"
                        variant="premium"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Get My Free Quote & Proof Package'}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        We are a fully insured business, and all quotes are backed by our 15-year and 20-year workmanship warranties. <strong>Proof In Every Roof.</strong>
                      </p>
                    </form>
                  </div>
                </div>

                {/* Sidebar - Trust Signals */}
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg roofing-shadow">
                    <h3 className="font-bold text-lg mb-4 text-foreground">Why Call Kaids?</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">15-Year Warranty</p>
                          <p className="text-sm text-muted-foreground">Industry-leading coverage on all work</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Premium Materials</p>
                          <p className="text-sm text-muted-foreground">Premcoat, SupaPoint, quality guaranteed</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Local Clyde North</p>
                          <p className="text-sm text-muted-foreground">15 mins from most SE Melbourne suburbs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-2">Need Help Now?</p>
                    <div className="space-y-2">
                      <a href="tel:0435900709" className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="h-4 w-4" />
                        <span>0435 900 709</span>
                      </a>
                      <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 text-primary hover:underline text-sm">
                        <Mail className="h-4 w-4" />
                        <span>callkaidsroofing@outlook.com</span>
                      </a>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">ABN 39475055075</p>
                    <p>Fully insured. Locally owned and operated.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default QuoteLanding;
