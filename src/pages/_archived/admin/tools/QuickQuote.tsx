import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send, Loader2, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateBrandedPDF } from '@/lib/pdfGenerator';

const quoteFormSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Valid email is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  site_address: z.string().min(1, 'Site address is required'),
  scope: z.string().min(10, 'Please describe the scope of work'),
  quote_amount: z.coerce.number().min(1, 'Quote amount must be greater than 0'),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

export default function QuickQuote() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      site_address: '',
      scope: '',
      quote_amount: 0,
    },
  });

  const handleGeneratePDF = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPdf(true);
    try {
      // Create a temporary element with quote content
      const quoteElement = document.createElement('div');
      quoteElement.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
          <h1 style="color: #007ACC; margin-bottom: 20px;">Roofing Quote</h1>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0B3B69; font-size: 18px; margin-bottom: 10px;">Customer Information</h2>
            <p><strong>Name:</strong> ${values.customer_name}</p>
            <p><strong>Email:</strong> ${values.customer_email}</p>
            <p><strong>Phone:</strong> ${values.customer_phone}</p>
            <p><strong>Site Address:</strong> ${values.site_address}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #0B3B69; font-size: 18px; margin-bottom: 10px;">Scope of Work</h2>
            <p style="white-space: pre-wrap;">${values.scope}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #0B3B69; font-size: 16px; margin-bottom: 10px;">Quote Amount</h2>
            <p style="font-size: 32px; font-weight: bold; color: #007ACC; margin: 0;">
              ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(values.quote_amount)}
            </p>
            <p style="font-size: 14px; color: #6B7280; margin-top: 5px;">Including GST</p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6B7280;">
              This quote is valid for 30 days. All work includes professional workmanship warranty.
            </p>
          </div>
        </div>
      `;
      
      await generateBrandedPDF(quoteElement, {
        title: `Quote for ${values.customer_name}`,
        filename: `CKR-Quote-${values.customer_name.replace(/\s/g, '-')}.pdf`,
        orientation: 'portrait',
      });

      toast({
        title: "PDF Generated",
        description: "Your quote PDF has been downloaded successfully",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('send-quote', {
        body: data,
      });

      if (error) throw error;

      toast({
        title: "Quote Sent Successfully! 🎉",
        description: `Quote for ${data.quote_amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })} sent to ${data.customer_email}`,
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error sending quote:', error);
      toast({
        title: "Error",
        description: "Failed to send quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Quick Quote Generator
          </h1>
          <p className="text-muted-foreground">Send professional quotes to customers in seconds</p>
        </div>
      </div>

      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>
            Fill in the customer and job details below. The quote will be automatically saved and emailed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Michelle Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 0412 345 678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g. michelle@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="site_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St, Berwick VIC 3806" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope of Work</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Full re-bedding of ridge caps&#10;Replace damaged tiles&#10;Clean gutters"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quote_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote Amount (AUD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 3200.00"
                          className="pl-10 text-lg font-semibold"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPdf}
                  className="flex-1"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Quote
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="glass-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Generate PDF</strong> creates a downloadable quote document for your records</p>
          <p>• <strong>Send Quote</strong> emails the quote to the customer and saves it to the jobs database</p>
          <p>• All quotes are automatically stored in the CRM for tracking and follow-up</p>
          <p>• Quotes are valid for 30 days by default</p>
        </CardContent>
      </Card>
    </div>
  );
}
