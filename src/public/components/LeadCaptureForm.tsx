import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Loader2, Gift, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ImageUploadField } from '@/components/ImageUploadField';

type FormVariant = 'compact' | 'full' | 'split';

interface LeadCaptureFormProps {
  // Content customization
  title?: string;
  description?: string;
  serviceName?: string;
  ctaText?: string;
  source?: string;

  // Feature toggles
  variant?: FormVariant;
  showEmail?: boolean;
  showUrgency?: boolean;
  showMessage?: boolean;
  showImageUpload?: boolean;
  emergencyService?: boolean;

  // UI customization
  showBenefits?: boolean;
  benefits?: Array<{ title: string; description: string }>;
  showUrgencyBadge?: boolean;
  urgencyBadgeText?: string;
}

const baseFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  phone: z.string()
    .min(1, "Phone is required")
    .regex(/^(\+61|0)[2-9][0-9]{8}$|^04[0-9]{8}$/, "Please enter a valid Australian phone number")
    .trim(),
  suburb: z.string()
    .min(1, "Suburb is required")
    .max(100, "Suburb must be less than 100 characters")
    .trim(),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  urgency: z.string().optional(),
  message: z.string()
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  honeypot: z.string().max(0)
});

export const LeadCaptureForm = ({
  title = "Get Your Free Quote",
  description = "Owner responds personally. No sales teams.",
  serviceName = "Free Quote Request",
  ctaText = "Get My Free Quote",
  source = "lead_capture_form",
  variant = "compact",
  showEmail = false,
  showUrgency = false,
  showMessage = false,
  showImageUpload = false,
  emergencyService = false,
  showBenefits = false,
  benefits = [],
  showUrgencyBadge = false,
  urgencyBadgeText = "Limited availability this week"
}: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    suburb: '',
    email: '',
    urgency: '',
    message: '',
    honeypot: ''
  });
  const [roofImages, setRoofImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam check
    if (formData.honeypot) {
      return;
    }

    // Validate form data
    try {
      baseFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Please check your details",
          description: firstError.message,
          variant: "destructive"
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const leadPayload: any = {
        name: formData.name,
        phone: formData.phone,
        suburb: formData.suburb,
        service: serviceName,
        source
      };

      if (showEmail && formData.email) {
        leadPayload.email = formData.email;
      }

      if (showMessage && formData.message) {
        leadPayload.message = formData.message;
      }

      if (showUrgency && formData.urgency) {
        leadPayload.message = `Urgency: ${formData.urgency}\n\n${leadPayload.message || ''}`;
      }

      if (showImageUpload && roofImages.length > 0) {
        leadPayload.roofImages = roofImages;
      }

      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: leadPayload
      });

      if (error) throw error;

      toast({
        title: "Request Received!",
        description: "Kaidyn will call you within 2 hours during business hours.",
      });

      setFormData({ name: '', phone: '', suburb: '', email: '', urgency: '', message: '', honeypot: '' });
      setRoofImages([]);

      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please call 0435 900 709 or try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      urgency: value
    }));
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

  // Compact variant - calm professional feel
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="backdrop-blur-xl bg-white rounded-2xl p-8 shadow-lg border border-border/50"
      >
        {showUrgencyBadge && (
          <div className="bg-primary/10 text-primary px-4 py-2.5 rounded-lg mb-6 text-center border border-primary/20">
            <p className="text-sm font-semibold">
              {urgencyBadgeText}
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-base text-muted-foreground">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12 text-base transition-colors"
            />
          </div>

          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="h-12 text-base transition-colors"
            />
          </div>

          <div>
            <Input
              type="text"
              name="suburb"
              placeholder="Your Suburb"
              value={formData.suburb}
              onChange={handleChange}
              required
              className="h-12 text-base transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              ctaText
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center space-y-3">
          <a
            href="tel:0435900709"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base transition-colors"
          >
            <Phone className="h-4 w-4" />
            0435 900 709
          </a>
          <p className="text-xs text-muted-foreground">
            Owner-operated • SE Melbourne • 15-Year Warranty
          </p>
        </div>
      </motion.div>
    );
  }

  // Split variant - with benefits sidebar
  if (variant === 'split' && showBenefits) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/15 relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-xl border-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Side - Benefits */}
                  <div className="bg-gradient-to-br from-primary to-secondary text-white p-10 lg:p-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-2">
                        <Gift className="h-6 w-6" />
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Limited Time
                        </Badge>
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                        {title}
                      </h3>

                      <div className="space-y-5">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 mt-0.5 text-green-300 flex-shrink-0" />
                            <div>
                              <div className="font-semibold mb-1">{benefit.title}</div>
                              <div className="text-white/90 text-sm leading-relaxed">{benefit.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {showUrgencyBadge && (
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-yellow-300" />
                            <span className="font-semibold">This Week Only</span>
                          </div>
                          <p className="text-sm text-white/90">
                            {urgencyBadgeText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Form */}
                  <div className="p-10 lg:p-12 bg-white">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{ctaText}</h4>
                        <p className="text-muted-foreground">{description}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                          type="text"
                          name="honeypot"
                          value={formData.honeypot}
                          onChange={handleChange}
                          style={{ display: 'none' }}
                          tabIndex={-1}
                          autoComplete="off"
                        />

                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12 text-base"
                        />

                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-12 text-base"
                        />

                        <Input
                          type="text"
                          name="suburb"
                          placeholder="Your Suburb"
                          value={formData.suburb}
                          onChange={handleChange}
                          required
                          className="h-12 text-base"
                        />

                        {showImageUpload && (
                          <ImageUploadField
                            label="Roof Photos (Optional)"
                            name="roofImages"
                            value={roofImages}
                            onChange={(_, urls) => setRoofImages(urls)}
                            helpText="Upload photos for faster assessment"
                          />
                        )}

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-12 text-base font-semibold mt-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : ctaText}
                        </Button>
                      </form>

                      <div className="text-center space-y-2 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Or call Kaidyn directly:
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a href="tel:0435900709" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            0435 900 709
                          </a>
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        No spam calls • Owner responds within 12 hours
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Full variant - for service pages
  return (
    <section className="py-16 card-gradient">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <p className="text-muted-foreground mt-2">{description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0435 900 709"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {showEmail && (
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="h-11"
                    />
                  </div>
                )}
                <div className={showEmail ? '' : 'md:col-span-2'}>
                  <Label htmlFor="suburb" className="text-sm font-medium mb-1.5 block">
                    Suburb *
                  </Label>
                  <Input
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    placeholder="Clyde North"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {showUrgency && (
                <div>
                  <Label htmlFor="urgency" className="text-sm font-medium mb-1.5 block">
                    How urgent is this? *
                  </Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger className="h-11">
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
              )}

              {showMessage && (
                <div>
                  <Label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your roof issue, when you'd like the work done, or any specific requirements..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              {showImageUpload && (
                <ImageUploadField
                  label="Roof Photos (Optional)"
                  name="roofImages"
                  value={roofImages}
                  onChange={(_, urls) => setRoofImages(urls)}
                  helpText="Upload photos for faster assessment"
                />
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold mt-6"
                disabled={isSubmitting}
                variant={emergencyService ? "destructive" : "default"}
              >
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : ctaText}
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-5 mt-5">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>0435 900 709</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>15-Year Warranty</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Fully Insured & Licensed</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
