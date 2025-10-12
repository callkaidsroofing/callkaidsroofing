import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Gift, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const quickFormSchema = z.object({
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

const QuickCaptureForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    suburb: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      quickFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: null,
          suburb: formData.suburb,
          service: 'Free Roof Health Check',
          message: 'Requested free roof health check booking',
          source: 'quick_capture_form'
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Free Assessment Booked!",
        description: "Kaidyn will call you within 12 hours to schedule your free roof health check.",
      });
      
      setFormData({ name: '', phone: '', suburb: '' });
      
      // Redirect to thank you page after successful submission
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please call 0435 900 709 or try again later.",
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
    <section className="py-12 bg-gradient-to-br from-primary/10 to-secondary/15 relative overflow-hidden">
      <div className="absolute inset-0 pattern-overlay opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Incentive */}
                <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 lg:p-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Gift className="h-6 w-6" />
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Limited Time Offer
                      </Badge>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                      FREE Roof Health Check
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-1 text-green-300" />
                        <div>
                          <div className="font-semibold">Complete Inspection</div>
                          <div className="text-white/90 text-sm">25-point roof assessment with photo documentation</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-1 text-green-300" />
                        <div>
                          <div className="font-semibold">Honest Written Report</div>
                          <div className="text-white/90 text-sm">What needs fixing now vs. what can wait</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-1 text-green-300" />
                        <div>
                          <div className="font-semibold">No Obligation Quote</div>
                          <div className="text-white/90 text-sm">Transparent pricing with 15-year warranty options</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-300" />
                        <span className="font-semibold">This Week Only</span>
                      </div>
                      <p className="text-sm text-white/90">
                        Usually $250 • Save 100% when you book before Sunday
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 lg:p-12 bg-white">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold mb-2">Book Your Free Check</h4>
                      <p className="text-muted-foreground">
                        Get your roof assessed by Kaidyn personally. No junior staff, no sales pressure.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12"
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
                          className="h-12"
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
                          className="h-12"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Booking...' : 'Book My Free Assessment'}
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
                      ✓ No spam calls ✓ Owner responds within 12 hours ✓ Free assessment this week only
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
};

export default QuickCaptureForm;