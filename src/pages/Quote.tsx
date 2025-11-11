import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';

const quoteRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required').optional().or(z.literal('')),
  suburb: z.string().min(2, 'Suburb is required'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().optional(),
  urgency: z.enum(['Normal', 'Urgent', 'Emergency']).default('Normal'),
});

type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

const SERVICES = [
  'Roof Repairs',
  'Re-bedding & Re-pointing',
  'Roof Restoration',
  'Gutter Replacement',
  'Valley Repairs',
  'Ridge Capping',
  'Emergency Repairs',
  'Roof Cleaning',
  'Other',
];

const SUBURBS = [
  'Berwick', 'Pakenham', 'Narre Warren', 'Cranbourne', 'Clyde',
  'Officer', 'Beaconsfield', 'Endeavour Hills', 'Hallam', 'Hampton Park',
  'Other',
];

export default function Quote() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<QuoteRequestData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      suburb: '',
      service: '',
      message: '',
      urgency: 'Normal',
    },
  });

  const onSubmit = async (data: QuoteRequestData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          ...data,
          source: 'quote_form',
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your request. Please try calling us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Quote Request Received - Call Kaids Roofing</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full glass-card border-2 border-primary/20">
            <CardContent className="pt-12 pb-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 border-4 border-green-500/30">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Thank You!
                </h1>
                <p className="text-xl text-muted-foreground">
                  We've received your quote request
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  What Happens Next?
                </h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <span className="text-muted-foreground">We'll review your request within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <span className="text-muted-foreground">We'll contact you to discuss your specific needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <span className="text-muted-foreground">We'll provide a detailed quote for your roofing work</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Need urgent assistance?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary/20"
                  >
                    <a href="tel:0435900709">
                      <Phone className="mr-2 h-4 w-4" />
                      Call 0435 900 709
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary/20"
                  >
                    <a href="mailto:info@callkaidsroofing.com.au">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Us
                    </a>
                  </Button>
                </div>
                
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="ghost"
                  className="mt-4"
                >
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Get a Free Roofing Quote - Call Kaids Roofing | SE Melbourne</title>
        <meta name="description" content="Get a free, no-obligation roofing quote from Call Kaids Roofing. Professional roof repairs, restoration, and maintenance across SE Melbourne. 7-10 year warranty." />
        <meta name="keywords" content="roofing quote Melbourne, roof repair quote, free roofing estimate, SE Melbourne roofer, Berwick roofing" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get Your Free Roofing Quote
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional roofing services across SE Melbourne. Fill in the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-2 border-primary/20 text-center p-4">
              <div className="text-3xl font-bold text-primary">24hr</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </Card>
            <Card className="glass-card border-2 border-primary/20 text-center p-4">
              <div className="text-3xl font-bold text-primary">7-10yr</div>
              <div className="text-sm text-muted-foreground">Warranty</div>
            </Card>
            <Card className="glass-card border-2 border-primary/20 text-center p-4">
              <div className="text-3xl font-bold text-primary">FREE</div>
              <div className="text-sm text-muted-foreground">No Obligation</div>
            </Card>
          </div>

          {/* Quote Form */}
          <Card className="glass-card border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Your Details</CardTitle>
              <CardDescription>
                We'll use this information to prepare your personalized quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 0412 345 678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="e.g. john@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="suburb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suburb *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your suburb" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SUBURBS.map((suburb) => (
                                <SelectItem key={suburb} value={suburb}>
                                  {suburb}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Required *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SERVICES.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Normal">Normal - Within 1 week</SelectItem>
                              <SelectItem value="Urgent">Urgent - Within 2-3 days</SelectItem>
                              <SelectItem value="Emergency">Emergency - ASAP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about your roofing needs (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. I have leaking tiles on the north side of my roof..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Get My Free Quote'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting this form, you agree to be contacted by Call Kaids Roofing regarding your quote request.
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Footer Trust */}
          <Card className="glass-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-lg font-semibold italic text-primary">
                "Proof In Every Roof"
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Call Kaids Roofing</strong></p>
                <p>ABN: 39475055075</p>
                <p>Phone: <a href="tel:0435900709" className="text-primary hover:underline">0435 900 709</a></p>
                <p>Email: <a href="mailto:info@callkaidsroofing.com.au" className="text-primary hover:underline">info@callkaidsroofing.com.au</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
