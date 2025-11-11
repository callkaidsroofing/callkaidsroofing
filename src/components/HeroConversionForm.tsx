import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle, TrendingUp, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { motion } from 'framer-motion';

const heroFormSchema = z.object({
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
    .trim()
});

export const HeroConversionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    suburb: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      heroFormSchema.parse(formData);
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
      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: null,
          suburb: formData.suburb,
          service: 'Free Quote Request',
          message: 'Requested free quote via hero form',
          source: 'hero_conversion_form'
        }
      });

      if (error) throw error;
      
      toast({
        title: "Quote Request Received!",
        description: "Kaidyn will call you within 2 hours during business hours.",
      });
      
      setFormData({ name: '', phone: '', suburb: '' });
      
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-md bg-white/95 rounded-2xl p-6 shadow-2xl border-2 border-conversion-orange/30"
    >
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-conversion-orange to-conversion-gold text-white px-4 py-2 rounded-lg mb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <TrendingUp className="h-4 w-4" />
          <span>3 Spots Left This Week</span>
        </div>
      </div>

      {/* Psychological Headline */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-roofing-navy mb-2">
          Get Your Free Quote Now
        </h3>
        <p className="text-sm text-muted-foreground">
          Local owner responds personally. No sales teams, no runaround.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-2 mb-5 text-xs">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-5 w-5 text-roofing-success mb-1" />
          <span className="text-muted-foreground">2-Hour Response</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Shield className="h-5 w-5 text-roofing-success mb-1" />
          <span className="text-muted-foreground">15-Year Warranty</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Clock className="h-5 w-5 text-roofing-success mb-1" />
          <span className="text-muted-foreground">Same-Day Quotes</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-11 border-2 focus:border-conversion-orange"
        />
        
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="h-11 border-2 focus:border-conversion-orange"
        />
        
        <Input
          type="text"
          name="suburb"
          placeholder="Your Suburb"
          value={formData.suburb}
          onChange={handleChange}
          required
          className="h-11 border-2 focus:border-conversion-orange"
        />

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-bold bg-gradient-to-r from-conversion-orange to-conversion-gold hover:opacity-90 transition-opacity shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Get My Free Quote →'}
        </Button>
      </form>

      {/* Alternative CTA */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground mb-2">
          Prefer to talk? Call Kaidyn directly:
        </p>
        <Button 
          asChild 
          variant="outline" 
          size="sm"
          className="w-full border-2 border-conversion-orange text-conversion-orange hover:bg-conversion-orange hover:text-white font-semibold"
        >
          <a href="tel:0435900709" className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            0435 900 709
          </a>
        </Button>
      </div>

      {/* Social Proof */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        ✓ 200+ satisfied customers • ✓ Owner-operated • ✓ No obligation
      </div>
    </motion.div>
  );
};
