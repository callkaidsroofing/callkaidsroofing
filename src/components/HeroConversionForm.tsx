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
        className="backdrop-blur-xl bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,122,204,0.2)] border-2 border-primary/10 hover:shadow-[0_25px_70px_rgba(0,122,204,0.3)] transition-all duration-300"
      >
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-conversion-orange via-conversion-gold to-conversion-orange bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white px-4 py-3 rounded-2xl mb-4 text-center shadow-lg">
        <p className="text-sm font-black flex items-center justify-center gap-2">
          <span className="text-xl animate-pulse">🔥</span>
          <span>3 Spots Left This Week</span>
        </p>
      </div>

      {/* Headline */}
      <div className="mb-5">
        <h3 className="text-2xl font-black text-roofing-navy mb-2 bg-gradient-to-r from-roofing-navy to-primary bg-clip-text text-transparent">
          Get Your Free Quote
        </h3>
        <p className="text-sm text-muted-foreground font-semibold">
          Owner responds personally. No sales teams.
        </p>
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
          className="w-full h-14 text-base font-black bg-gradient-to-r from-conversion-orange to-conversion-gold hover:from-conversion-gold hover:to-conversion-orange transition-all shadow-[0_8px_30px_rgba(255,107,53,0.4)] hover:shadow-[0_10px_40px_rgba(255,107,53,0.6)] hover:scale-[1.02] rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Get My Free Quote →'}
        </Button>
      </form>

      {/* Alternative CTA */}
      <div className="mt-4 pt-4 border-t-2 border-dashed border-border text-center">
        <a 
          href="tel:0435900709" 
          className="inline-flex items-center gap-2 text-conversion-orange hover:text-conversion-gold font-black text-base transition-colors hover:scale-105 transform"
        >
          <Phone className="h-4 w-4" />
          0435 900 709
        </a>
        <p className="text-xs text-muted-foreground mt-3 font-semibold">
          ✓ 200+ customers • ✓ Owner-operated • ✓ No obligation
        </p>
      </div>
    </motion.div>
  );
};
