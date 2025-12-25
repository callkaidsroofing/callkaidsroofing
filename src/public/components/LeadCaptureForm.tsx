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
  urgencyBadgeText = "3 Spots Left This Week"
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

  // Compact variant (like HeroConversionForm)
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-xl bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,122,204,0.2)] border-2 border-primary/10 hover:shadow-[0_25px_70px_rgba(0,122,204,0.3)] transition-all duration-300"
      >
        {showUrgencyBadge && (
          <div className="bg-gradient-to-r from-conversion-blue via-conversion-cyan to-conversion-blue bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white px-4 py-3 rounded-2xl mb-4 text-center shadow-[0_8px_30px_rgba(0,212,255,0.4)] border border-conversion-black/30">
            <p className="text-sm font-black flex items-center justify-center gap-2">
              <span className="text-xl animate-pulse">🔥</span>
              <span>{urgencyBadgeText}</span>
            </p>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-2xl font-black text-roofing-navy mb-2 bg-gradient-to-r from-roofing-navy to-primary bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-semibold">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base font-medium transition-all"
          />

          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base font-medium transition-all"
          />

          <Input
            type="text"
            name="suburb"
            placeholder="Your Suburb"
            value={formData.suburb}
            onChange={handleChange}
            required
            className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base font-medium transition-all"
          />

          <Button
            type="submit"
            className="w-full h-14 text-base font-black bg-gradient-to-r from-conversion-blue via-conversion-cyan to-conversion-blue hover:from-conversion-cyan hover:to-conversion-deep transition-all shadow-[0_8px_30px_rgba(41,179,255,0.5)] hover:shadow-[0_10px_40px_rgba(0,212,255,0.7)] hover:scale-[1.02] rounded-xl border-2 border-conversion-black/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : ctaText}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t-2 border-dashed border-border text-center">
          <a
            href="tel:0435900709"
            className="inline-flex items-center gap-2 text-conversion-blue hover:text-conversion-cyan font-black text-base transition-colors hover:scale-105 transform"
          >
            <Phone className="h-4 w-4" />
            0435 900 709
          </a>
          <p className="text-xs text-muted-foreground mt-3 font-semibold">
            ✓ Owner-operated • ✓ SE Melbourne Local • ✓ 15-Year Warranty
          </p>
        </div>
      </motion.div>
    );
  }

  // Split variant (like QuickCaptureForm)
  if (variant === 'split' && showBenefits) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/10 to-secondary/15 relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Side - Benefits */}
                  <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 lg:p-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Gift className="h-6 w-6" />
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Limited Time Offer
                        </Badge>
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                        {title}
                      </h3>

                      <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 mt-1 text-green-300" />
                            <div>
                              <div className="font-semibold">{benefit.title}</div>
                              <div className="text-white/90 text-sm">{benefit.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {showUrgencyBadge && (
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
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
                  <div className="p-8 lg:p-12 bg-white">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{ctaText}</h4>
                        <p className="text-muted-foreground">{description}</p>
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

                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12"
                        />

                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-12"
                        />

                        <Input
                          type="text"
                          name="suburb"
                          placeholder="Your Suburb"
                          value={formData.suburb}
                          onChange={handleChange}
                          required
                          className="h-12"
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
                          className="w-full h-12 text-lg font-semibold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : ctaText}
                        </Button>
                      </form>

                      <div className="text-center space-y-2">
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
                        ✓ No spam calls ✓ Owner responds within 12 hours ✓ Free assessment
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

  // Full variant (like ServiceSpecificForm)
  return (
    <section className="py-16 card-gradient">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <p className="text-muted-foreground">{description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="0435 900 709"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {showEmail && (
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                )}
                <div className={showEmail ? '' : 'md:col-span-2'}>
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Input
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    placeholder="Clyde North"
                    required
                  />
                </div>
              </div>

              {showUrgency && (
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
              )}

              {showMessage && (
                <div>
                  <Label htmlFor="message">Additional Details (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your roof issue, when you'd like the work done, or any specific requirements..."
                    rows={4}
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
                className="w-full"
                size="lg"
                disabled={isSubmitting}
                variant={emergencyService ? "destructive" : "default"}
              >
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : ctaText}
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>0435 900 709</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>15-Year Warranty</span>
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
