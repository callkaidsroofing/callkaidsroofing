import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface ServiceSpecificFormProps {
  serviceName: string;
  serviceDescription: string;
  ctaText?: string;
  emergencyService?: boolean;
}

const serviceFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  phone: z.string()
    .min(1, "Phone is required")
    .regex(/^(\+61|0)[2-9][0-9]{8}$|^04[0-9]{8}$/, "Please enter a valid Australian phone number")
    .trim(),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  suburb: z.string()
    .min(1, "Suburb is required")
    .max(100, "Suburb must be less than 100 characters")
    .trim(),
  urgency: z.string()
    .min(1, "Please select an urgency level"),
  message: z.string()
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  honeypot: z.string().max(0)
});

type FormData = z.infer<typeof serviceFormSchema>;

const ServiceSpecificForm: React.FC<ServiceSpecificFormProps> = ({ 
  serviceName, 
  serviceDescription, 
  ctaText = "Get Free Quote",
  emergencyService = false 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    urgency: '',
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

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      urgency: value
    }));
  };

  const validateForm = (): boolean => {
    try {
      serviceFormSchema.parse(formData);
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
        service: serviceName,
        message: `${serviceDescription}\n\nUrgency: ${formData.urgency}\n\nAdditional details: ${formData.message || 'None provided'}`
      };

      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: leadData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Request Sent Successfully!",
        description: "Kaidyn will call you within 4 hours (or immediately for emergencies).",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        suburb: '',
        urgency: '',
        message: '',
        honeypot: ''
      });

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

  const urgencyOptions = emergencyService ? [
    { value: "emergency", label: "Emergency - Active leak/damage" },
    { value: "urgent", label: "Urgent - Need quote this week" },
    { value: "standard", label: "Standard - Can wait 2-3 weeks" }
  ] : [
    { value: "urgent", label: "Urgent - Need quote this week" },
    { value: "standard", label: "Standard - Can wait 2-3 weeks" },
    { value: "planning", label: "Planning ahead - Next few months" }
  ];

  return (
    <section className="py-16 card-gradient">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {ctaText} - {serviceName}
            </CardTitle>
            <p className="text-muted-foreground">
              Fill out this form and Kaidyn will call you within 4 hours to discuss your {serviceName.toLowerCase()} needs.
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
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">How urgent is this? *</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
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

              <div>
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your roof issue, when you'd like the work done, or any specific requirements..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
                variant={emergencyService ? "destructive" : "default"}
              >
                {isSubmitting ? "Sending..." : ctaText}
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>0435 900 709</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>info@callkaidsroofing.com.au</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>10-Year Warranty</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Fully Insured & Licensed</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>ABN: 39475055075</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ServiceSpecificForm;