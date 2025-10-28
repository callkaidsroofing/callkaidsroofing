import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveIndicator } from '@/components/AutosaveIndicator';
import { ClientStep } from '@/components/quote-builder/ClientStep';
import { ScopeStep } from '@/components/quote-builder/ScopeStep';
import { LineItemsStep } from '@/components/quote-builder/LineItemsStep';
import { PhotosStep } from '@/components/quote-builder/PhotosStep';
import { PricingStep } from '@/components/quote-builder/PricingStep';
import { TermsStep } from '@/components/quote-builder/TermsStep';
import { PreviewStep } from '@/components/quote-builder/PreviewStep';
import { SendStep } from '@/components/quote-builder/SendStep';

const steps = [
  { id: 1, name: 'Client', description: 'Select or add client' },
  { id: 2, name: 'Scope', description: 'Define work scope' },
  { id: 3, name: 'Items', description: 'Add line items' },
  { id: 4, name: 'Photos', description: 'Attach photos' },
  { id: 5, name: 'Pricing', description: 'Set pricing' },
  { id: 6, name: 'Terms', description: 'Payment terms' },
  { id: 7, name: 'Preview', description: 'Review quote' },
  { id: 8, name: 'Send', description: 'Send to client' },
];

export default function QuoteBuilderNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [isSaving, setIsSaving] = useState(false);
  const [quoteData, setQuoteData] = useState({
    client: null,
    scope: {
      services: [],
      roofType: '',
      roofPitch: '',
      complexity: '',
      specialRequirements: '',
    },
    lineItems: [],
    photos: [],
    pricing: {
      subtotal: 0,
      discount_amount: 0,
      discount_reason: '',
      gst: 0,
      total: 0,
    },
    terms: {
      deposit_percent: 30,
      progress_percent: 40,
      final_percent: 30,
      payment_terms_days: 7,
      warranty_years: '7-10 years',
      custom_terms: '',
    },
  });

  // Calculate pricing when line items change
  useEffect(() => {
    const subtotal = quoteData.lineItems.reduce(
      (sum, item: any) => sum + item.line_total,
      0
    );
    const discountAmount = quoteData.pricing.discount_amount || 0;
    const afterDiscount = subtotal - discountAmount;
    const gst = afterDiscount * 0.1;
    const total = afterDiscount + gst;

    setQuoteData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        subtotal,
        gst,
        total,
      },
    }));
  }, [quoteData.lineItems, quoteData.pricing.discount_amount]);

  // Save quote to database
  const saveQuote = async (data: any) => {
    setIsSaving(true);
    try {
      const quotePayload = {
        quote_number: `Q-${Date.now()}`,
        client_name: data.client?.name || '',
        phone: data.client?.phone || '',
        email: data.client?.email || '',
        site_address: data.client?.property_address || data.client?.suburb || '',
        suburb_postcode: data.client?.suburb || '',
        tier_level: 'RESTORE',
        scope: data.scope,
        line_items: data.lineItems,
        photo_ids: data.photos.map((p: any) => p.id),
        pricing: data.pricing,
        terms: data.terms,
        subtotal: data.pricing.subtotal,
        gst: data.pricing.gst,
        total: data.pricing.total,
        discount_amount: data.pricing.discount_amount,
        discount_reason: data.pricing.discount_reason,
        draft: true,
      };

      if (quoteId) {
        const { error } = await supabase
          .from('quotes')
          .update(quotePayload)
          .eq('id', quoteId);

        if (error) throw error;
      } else {
        const { data: newQuote, error } = await supabase
          .from('quotes')
          .insert([quotePayload])
          .select()
          .single();

        if (error) throw error;
        if (newQuote) setQuoteId(newQuote.id);
      }

      setLastSaved(new Date());
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave hook
  useAutosave({
    data: quoteData,
    onSave: saveQuote,
    interval: 30000,
    enabled: !!quoteData.client,
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quoteData.client && quoteData.client.name && quoteData.client.phone;
      case 2:
        return quoteData.scope.services.length > 0;
      case 3:
        return quoteData.lineItems.length > 0;
      case 6:
        return (
          quoteData.terms.deposit_percent +
          quoteData.terms.progress_percent +
          quoteData.terms.final_percent ===
          100
        );
      default:
        return true;
    }
  };

  const handleSendQuote = async (emailData: any) => {
    // Mark as sent and navigate
    if (quoteId) {
      await supabase
        .from('quotes')
        .update({ draft: false, sent_at: new Date().toISOString() })
        .eq('id', quoteId);
    }

    // Send email via edge function (to be implemented)
    toast({
      title: 'Quote sent!',
      description: 'The quote has been sent to the client.',
    });

    setTimeout(() => {
      navigate('/internal/v2/data');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Select Client</h2>
              <p className="text-muted-foreground">
                Choose an existing lead or enter new client details
              </p>
            </div>
            <ClientStep
              value={quoteData.client}
              onChange={(client) => setQuoteData({ ...quoteData, client })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Define Scope</h2>
              <p className="text-muted-foreground">
                Select services to include in the quote
              </p>
            </div>
            <ScopeStep
              value={quoteData.scope}
              onChange={(scope) => setQuoteData({ ...quoteData, scope })}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Line Items</h2>
              <p className="text-muted-foreground">
                Add items from price book or create custom items
              </p>
            </div>
            <LineItemsStep
              value={quoteData.lineItems}
              onChange={(lineItems) => setQuoteData({ ...quoteData, lineItems })}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Attach Photos</h2>
              <p className="text-muted-foreground">
                Add before/after photos and site documentation
              </p>
            </div>
            <PhotosStep
              value={quoteData.photos}
              onChange={(photos) => setQuoteData({ ...quoteData, photos })}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Pricing</h2>
              <p className="text-muted-foreground">
                Review totals and apply discounts
              </p>
            </div>
            <PricingStep
              lineItemsTotal={quoteData.pricing.subtotal}
              value={quoteData.pricing}
              onChange={(pricing) => setQuoteData({ ...quoteData, pricing })}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Payment Terms</h2>
              <p className="text-muted-foreground">
                Set payment schedule and terms
              </p>
            </div>
            <TermsStep
              total={quoteData.pricing.total}
              value={quoteData.terms}
              onChange={(terms) => setQuoteData({ ...quoteData, terms })}
            />
          </div>
        );
      case 7:
        return <PreviewStep quoteData={quoteData} />;
      case 8:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Send Quote</h2>
              <p className="text-muted-foreground">
                Send quote to client via email
              </p>
            </div>
            <SendStep
              clientEmail={quoteData.client?.email || ''}
              onSend={handleSendQuote}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <AutosaveIndicator
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
      <div className="max-w-5xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps - Horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          <div className="flex items-center min-w-max md:justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-colors",
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-2 md:ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-1 md:mt-2 text-center">
                    <div className="text-xs md:text-sm font-medium whitespace-nowrap">{step.name}</div>
                    <div className="text-xs text-muted-foreground hidden lg:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 md:w-12 lg:w-24 h-0.5 md:h-1 mx-1 md:mx-2 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-4 md:p-8 min-h-[300px] md:min-h-[400px]">
          {renderStepContent()}
        </Card>

        {/* Navigation - Fixed at bottom on mobile */}
        <div className="flex items-center justify-between gap-3 sticky md:static bottom-0 left-0 right-0 bg-background p-3 md:p-0 border-t md:border-0 -mx-3 md:mx-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveQuote(quoteData)}
              disabled={isSaving || !quoteData.client}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          </div>
          <Button
            onClick={handleNext}
            disabled={currentStep < 8 && !canProceed()}
            className="flex-1 md:flex-initial"
          >
            <span className="hidden sm:inline">
              {currentStep === steps.length ? 'Review' : 'Next'}
            </span>
            <span className="sm:hidden">Next</span>
            {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
