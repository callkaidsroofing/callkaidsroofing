import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewStepProps {
  quoteData: any;
}

export function PreviewStep({ quoteData }: PreviewStepProps) {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    // PDF generation logic will be added
    toast({ title: 'PDF Download', description: 'Feature coming soon' });
  };

  const client = quoteData.client || {};
  const scope = quoteData.scope || {};
  const lineItems = quoteData.lineItems || [];
  const pricing = quoteData.pricing || {};
  const terms = quoteData.terms || {};
  const photos = quoteData.photos || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quote Preview</h2>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6 bg-primary/5 border-primary">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Call Kaids Roofing</h1>
          <p className="text-lg font-semibold">Professional Roofing Cost Estimate</p>
          <p className="text-sm text-muted-foreground">
            ABN 39475055075 | Licensed & Insured
          </p>
        </div>
      </Card>

      {/* Client Details */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Client Details</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>{' '}
            <span className="font-medium">{client.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>{' '}
            <span className="font-medium">{client.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>{' '}
            <span className="font-medium">{client.email || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Suburb:</span>{' '}
            <span className="font-medium">{client.suburb || 'N/A'}</span>
          </div>
          {client.property_address && (
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Property:</span>{' '}
              <span className="font-medium">{client.property_address}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Scope */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Scope of Works</h3>
        {scope.services && scope.services.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {scope.services.map((s: string) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-3">No services selected</p>
        )}
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Roof Type:</span>{' '}
            <span className="font-medium">{scope.roofType || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Pitch:</span>{' '}
            <span className="font-medium">{scope.roofPitch || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Complexity:</span>{' '}
            <span className="font-medium">{scope.complexity || 'N/A'}</span>
          </div>
        </div>
        {scope.specialRequirements && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm">
            <div className="font-medium mb-1">Special Requirements:</div>
            <div className="text-muted-foreground">{scope.specialRequirements}</div>
          </div>
        )}
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Line Items</h3>
        {lineItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No line items added</p>
        ) : (
          <div className="space-y-2">
            {lineItems.map((item: any, idx: number) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{item.display_name}</div>
                  <div className="font-semibold">${item.line_total.toFixed(2)}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.quantity} {item.unit} × ${item.unit_rate}
                </div>
                {item.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Pricing Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">${(pricing.subtotal || 0).toFixed(2)}</span>
          </div>
          {pricing.discount_amount > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount{pricing.discount_reason && ` (${pricing.discount_reason})`}:
                </span>
                <span className="text-green-600">
                  -${pricing.discount_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">After Discount:</span>
                <span>
                  ${(pricing.subtotal - pricing.discount_amount).toFixed(2)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (10%):</span>
            <span className="font-medium">${(pricing.gst || 0).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-xl">
            <span className="font-bold">Total (Inc GST):</span>
            <span className="font-bold text-primary">
              ${(pricing.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Terms */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Payment Terms</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
            <div>
              <div className="text-muted-foreground text-xs">Deposit</div>
              <div className="font-semibold">
                {terms.deposit_percent || 0}% (${((pricing.total || 0) * (terms.deposit_percent || 0)) / 100})
              </div>
            </div>
            {terms.progress_percent > 0 && (
              <div>
                <div className="text-muted-foreground text-xs">Progress</div>
                <div className="font-semibold">
                  {terms.progress_percent}% (${((pricing.total || 0) * terms.progress_percent) / 100})
                </div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground text-xs">Final</div>
              <div className="font-semibold">
                {terms.final_percent || 0}% (${((pricing.total || 0) * (terms.final_percent || 0)) / 100})
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Due:</span>
            <span>Net {terms.payment_terms_days || 7} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Warranty:</span>
            <span>{terms.warranty_years || '7-10 years'} workmanship</span>
          </div>
          {terms.custom_terms && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <div className="font-medium mb-1">Custom Terms:</div>
              <div className="text-muted-foreground whitespace-pre-wrap">
                {terms.custom_terms}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Photos */}
      {photos.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Attached Photos ({photos.length})</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {photos.map((photo: any) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.caption || 'Quote photo'}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
