import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  message: string;
  honeypot: string; // Hidden field for spam protection
}

export function EnhancedContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    service: "",
    message: "",
    honeypot: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTime] = useState(Date.now());
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const { name, phone, suburb, service } = formData;
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!phone.trim()) {
      toast({
        title: "Phone Required", 
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }
    
    if (!suburb.trim()) {
      toast({
        title: "Suburb Required",
        description: "Please enter your suburb",
        variant: "destructive"
      });
      return false;
    }
    
    if (!service) {
      toast({
        title: "Service Required",
        description: "Please select a service",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-spam: Check if form was submitted too quickly
    if (Date.now() - submitTime < 3000) {
      toast({
        title: "Please Wait",
        description: "Please take a moment to review your information",
        variant: "destructive"
      });
      return;
    }

    // Anti-spam: Check honeypot field
    if (formData.honeypot) {
      console.log("Spam detected");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          suburb: formData.suburb,
          service: formData.service,
          message: formData.message || null,
          source: 'contact_form'
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thanks! We've received your enquiry and will call you within 24 hours to discuss your roofing needs.",
        duration: 6000
      });
      
      // Clear form and redirect to thank you page
      setFormData({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        service: "",
        message: "",
        honeypot: ""
      });
      
      // Redirect to thank you page after successful submission
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
    } catch (error) {
      // Fallback message for any errors
      toast({
        title: "Form Submission Issue",
        description: (
          <div className="space-y-2">
            <p>Something went wrong with the form submission.</p>
            <p className="font-semibold">Please call us directly:</p>
            <div className="flex flex-col gap-1">
              <a href="tel:+61435900709" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="h-4 w-4" />
                0435 900 709
              </a>
              <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-4 w-4" />
                callkaidsroofing@outlook.com
              </a>
            </div>
          </div>
        ),
        duration: 10000,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Get Your Free Roof Health Check</CardTitle>
        <CardDescription>
          Fill out the form below and we'll call you within 24 hours to schedule your inspection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={formData.honeypot}
            onChange={(e) => handleInputChange('honeypot', e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="04XX XXX XXX"
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb *</Label>
              <Input
                id="suburb"
                type="text"
                value={formData.suburb}
                onChange={(e) => handleInputChange('suburb', e.target.value)}
                placeholder="e.g., Clyde North, Berwick"
                required
                autoComplete="address-level2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Required *</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roof-restoration">Roof Restoration</SelectItem>
                  <SelectItem value="roof-painting">Roof Painting</SelectItem>
                  <SelectItem value="roof-repairs">Roof Repairs</SelectItem>
                  <SelectItem value="gutter-cleaning">Gutter Cleaning</SelectItem>
                  <SelectItem value="valley-iron-replacement">Valley Iron Replacement</SelectItem>
                  <SelectItem value="leak-detection">Leak Detection</SelectItem>
                  <SelectItem value="emergency-repairs">Emergency Repairs</SelectItem>
                  <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your roof concerns, preferred contact times, or any specific requirements..."
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Get Free Quote
                </>
              )}
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <a
                href="tel:+61435900709"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a
                href="mailto:callkaidsroofing@outlook.com"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4" />
              We respect your privacy and will never share your information
            </p>
            <p>
              By submitting this form, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}