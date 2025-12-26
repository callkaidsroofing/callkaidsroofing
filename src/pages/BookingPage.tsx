import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, CheckCircle, Star, Shield, Award, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { PublicPageHero } from '@/public/components/PublicPageHero';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';

// Australian phone number regex: accepts 04XX XXX XXX, 0X XXXX XXXX, or +61 formats
const australianPhoneRegex = /^(\+61|0)[2-9][0-9]{8}$|^04[0-9]{8}$/;

const bookingFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  phone: z.string()
    .trim()
    .regex(australianPhoneRegex, { message: "Please enter a valid Australian phone number (e.g., 0435 900 709)" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
  suburb: z.string()
    .trim()
    .min(2, { message: "Suburb must be at least 2 characters" })
    .max(100, { message: "Suburb must be less than 100 characters" }),
  service: z.string()
    .min(1, { message: "Please select a service" }),
  urgency: z.string().optional(),
  propertyType: z.string().optional(),
  message: z.string()
    .max(1000, { message: "Message must be less than 1000 characters" })
    .optional()
    .or(z.literal('')),
  honeypot: z.string().optional()
});

type FormData = z.infer<typeof bookingFormSchema>;

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    service: '',
    urgency: '',
    propertyType: '',
    message: '',
    honeypot: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    try {
      // Normalize phone number by removing spaces
      const normalizedData = {
        ...formData,
        phone: formData.phone.replace(/\s/g, '')
      };
      
      bookingFormSchema.parse(normalizedData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-spam check
    if (formData.honeypot) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        suburb: formData.suburb,
        service: formData.service,
        message: `Service: ${formData.service}\nProperty Type: ${formData.propertyType}\nUrgency: ${formData.urgency}\n\nAdditional details: ${formData.message || 'None provided'}`
      };

      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: leadData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Booking Request Sent!",
        description: "Kaidyn will call you within 4 hours to schedule your free quote.",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        suburb: '',
        service: '',
        urgency: '',
        propertyType: '',
        message: '',
        honeypot: ''
      });

      // Redirect to thank you page
      navigate("/thank-you");

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please call 0435 900 709 directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    { value: "roof-restoration", label: "Roof Restoration" },
    { value: "roof-painting", label: "Roof Painting" },
    { value: "emergency-repairs", label: "Emergency Repairs" },
    { value: "gutter-cleaning", label: "Gutter Cleaning" },
    { value: "leak-detection", label: "Leak Detection" },
    { value: "tile-replacement", label: "Tile Replacement" },
    { value: "ridge-capping", label: "Ridge Capping" },
    { value: "valley-iron", label: "Valley Iron Replacement" },
    { value: "not-sure", label: "Not Sure - Need Assessment" }
  ];

  const urgencyOptions = [
    { value: "emergency", label: "Emergency - Active leak/damage" },
    { value: "urgent", label: "Urgent - Need quote this week" },
    { value: "standard", label: "Standard - Can wait 2-3 weeks" },
    { value: "planning", label: "Planning ahead - Next few months" }
  ];

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "townhouse", label: "Townhouse" },
    { value: "unit", label: "Unit/Apartment" },
    { value: "commercial", label: "Commercial Property" },
    { value: "other", label: "Other" }
  ];

  return (
    <>
      <SEOHead
        title="Book Your Free Roof Quote | Call Kaids Roofing | Same Day Response"
        description="Book your free roof quote today. Same-day response, 15-year warranty, premium materials. Serving all Southeast Melbourne suburbs. Call 0435 900 709"
        keywords="book roof quote Melbourne, free roof inspection, roof quote Clyde North, emergency roof repairs booking"
      />
      <StructuredData type="contact" />

      <div className="min-h-screen bg-background">

        {/* Hero Section - Zero Friction White Design */}
        <PublicPageHero
          variant="light"
          h1="Get Your Free Roof Quote"
          description="Book in 2 minutes • Kaidyn calls within 4 hours • Free inspection & quote"
          badges={[
            { icon: <CheckCircle className="h-5 w-5" />, text: "No obligation quote" },
            { icon: <Shield className="h-5 w-5" />, text: "15-year warranty" },
            { icon: <Award className="h-5 w-5" />, text: "200+ happy customers" }
          ]}
        />

        {/* Main Form Section - Pure White, Zero Friction */}
        <SectionWrapper variant="default" className="bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              
              {/* Form */}
              <Card className="bg-white">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-primary">
                    Book Your Free Quote
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out this form and Kaidyn will call you within 4 hours
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Smith"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0435 900 709"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="suburb">Suburb *</Label>
                        <Input
                          id="suburb"
                          name="suburb"
                          value={formData.suburb}
                          onChange={handleInputChange}
                          placeholder="Clyde North"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service">What service do you need? *</Label>
                      <Select onValueChange={(value) => handleSelectChange('service', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select onValueChange={(value) => handleSelectChange('propertyType', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="urgency">How urgent is this?</Label>
                        <Select onValueChange={(value) => handleSelectChange('urgency', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Details (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe your roof issue, when you'd like the work done, or any specific requirements..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Book My Free Quote"}
                    </Button>

                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        Prefer to call directly?
                      </p>
                      <Button asChild variant="outline" size="lg" className="w-full">
                        <a href="tel:0435900709">
                          <Phone className="mr-2 h-5 w-5" />
                          Call 0435 900 709
                        </a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Benefits & Trust Indicators */}
              <div className="space-y-8">
                
                {/* Why Choose Us */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Why 200+ Customers Choose Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Same-Day Response</h4>
                        <p className="text-sm text-muted-foreground">I call you within 4 hours, visit same day for emergencies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">15-Year Warranty</h4>
                        <p className="text-sm text-muted-foreground">All major work backed by comprehensive warranty</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Owner-Operated</h4>
                        <p className="text-sm text-muted-foreground">You deal directly with Kaidyn, no call centers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Premium Materials</h4>
                        <p className="text-sm text-muted-foreground">Premcoat, SupaPoint, Stormseal - only the best</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Process */}
                <Card className="border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">What Happens Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold">We Call You</h4>
                        <p className="text-sm text-muted-foreground">Within 4 hours to discuss your needs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold">Free Inspection</h4>
                        <p className="text-sm text-muted-foreground">Complete roof assessment at no cost</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold">Detailed Quote</h4>
                        <p className="text-sm text-muted-foreground">Same-day written quote with photos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold">Quality Work</h4>
                        <p className="text-sm text-muted-foreground">Professional service with 15-year warranty</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">0435 900 709</p>
                          <p className="text-sm text-muted-foreground">Direct line to Kaidyn</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">info@callkaidsroofing.com.au</p>
                          <p className="text-sm text-muted-foreground">Email us anytime</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Clyde North, VIC</p>
                          <p className="text-sm text-muted-foreground">Serving 50km radius</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Mon-Fri: 7am-6pm</p>
                          <p className="text-sm text-muted-foreground">Sat: 8am-4pm</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">ABN: 39475055075</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Fully Insured</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Licensed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </SectionWrapper>
      </div>
    </>
  );
};

export default BookingPage;