import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
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
      className="backdrop-blur-md bg-white/95 rounded-2xl p-5 shadow-2xl border-2 border-conversion-orange/30"
    >
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-conversion-orange to-conversion-gold text-white px-3 py-2 rounded-lg mb-3 text-center">
        <p className="text-sm font-bold">🔥 3 Spots Left This Week</p>
      </div>

      {/* Headline */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-roofing-navy mb-1">
          Get Your Free Quote
        </h3>
        <p className="text-xs text-muted-foreground">
          Owner responds personally. No sales teams.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-10 border-2 focus:border-conversion-orange text-sm"
        />
        
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="h-10 border-2 focus:border-conversion-orange text-sm"
        />
        
        <Input
          type="text"
          name="suburb"
          placeholder="Your Suburb"
          value={formData.suburb}
          onChange={handleChange}
          required
          className="h-10 border-2 focus:border-conversion-orange text-sm"
        />

        <Button
          type="submit"
          className="w-full h-11 text-sm font-bold bg-gradient-to-r from-conversion-orange to-conversion-gold hover:opacity-90 transition-opacity shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Get My Free Quote'}
        </Button>
      </form>

      {/* Alternative CTA */}
      <div className="mt-3 pt-3 border-t border-border text-center">
        <a 
          href="tel:0435900709" 
          className="inline-flex items-center gap-1.5 text-conversion-orange hover:text-conversion-gold font-semibold text-sm transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          0435 900 709
        </a>
        <p className="text-xs text-muted-foreground mt-2">
          200+ customers • Owner-operated • No obligation
        </p>
      </div>
    </motion.div>
  );
};
