import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState({
    client: null,
    scope: [],
    lineItems: [],
    photos: [],
    pricing: { discount: 0, allowances: 0 },
    terms: {},
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Client</h2>
            <p className="text-muted-foreground">
              Choose an existing lead or enter new client details
            </p>
            {/* Client selection/creation form */}
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Client selection interface coming soon
              </p>
            </Card>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Define Scope</h2>
            <p className="text-muted-foreground">
              Select services to include in the quote
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Scope matrix coming soon
              </p>
            </Card>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Line Items</h2>
            <p className="text-muted-foreground">
              Add items from price book or create custom items
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Line items editor coming soon
              </p>
            </Card>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Attach Photos</h2>
            <p className="text-muted-foreground">
              Add before/after photos and site documentation
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Photo manager coming soon
              </p>
            </Card>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Pricing</h2>
            <p className="text-muted-foreground">
              Review totals and apply discounts
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Pricing calculator coming soon
              </p>
            </Card>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Payment Terms</h2>
            <p className="text-muted-foreground">
              Set payment schedule and terms
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Terms editor coming soon
              </p>
            </Card>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Preview Quote</h2>
            <p className="text-muted-foreground">
              Review the complete quote before sending
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                PDF preview coming soon
              </p>
            </Card>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Send Quote</h2>
            <p className="text-muted-foreground">
              Send quote to client via email
            </p>
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Email composer coming soon
              </p>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell>
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
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1 md:flex-initial"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="flex-1 md:flex-initial"
          >
            {currentStep === steps.length ? 'Send Quote' : (
              <>
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </>
            )}
            {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
