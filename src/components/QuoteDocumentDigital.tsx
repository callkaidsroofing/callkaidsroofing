import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Phone, Mail, MapPin } from "lucide-react";

interface QuoteDocumentData {
  company_name: string;
  slogan: string;
  client_name: string;
  property_address: string;
  roof_type: string;
  measured_area: string;
  key_lengths: string;
  option1_total: string;
  option2_total: string;
  option3_total: string;
  photos?: {
    before?: string[];
    during?: string[];
    after?: string[];
  };
}

interface QuoteDocumentDigitalProps {
  data: QuoteDocumentData;
}

export const QuoteDocumentDigital = ({ data }: QuoteDocumentDigitalProps) => {
  const parseMoney = (val: string) => parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
  const formatMoney = (val: number) => new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);

  const calcGST = (totalInc: number) => {
    const exGST = totalInc / 1.1;
    const gst = totalInc - exGST;
    return { exGST, gst, incGST: totalInc };
  };

  const o1 = calcGST(parseMoney(data.option1_total));
  const o2 = calcGST(parseMoney(data.option2_total));
  const o3 = calcGST(parseMoney(data.option3_total));

  return (
    <div className="max-w-4xl mx-auto bg-background p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">{data.company_name}</h1>
        <p className="text-lg md:text-xl opacity-90">{data.slogan}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
          <a href="tel:0435900709" className="flex items-center gap-2 hover:underline">
            <Phone className="w-4 h-4" />
            0435 900 709
          </a>
          <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 hover:underline">
            <Mail className="w-4 h-4" />
            callkaidsroofing@outlook.com
          </a>
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base md:text-lg">Dear <span className="font-semibold">{data.client_name}</span>,</p>
          <p className="mt-4 text-muted-foreground">
            Thank you for considering Call Kaids Roofing. This quote outlines our recommended scope and pricing options for your property.
          </p>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Property Address</p>
              <p className="font-semibold">{data.property_address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roof Type</p>
              <p className="font-semibold">{data.roof_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Measured Area</p>
              <p className="font-semibold">{data.measured_area}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Key Lengths</p>
              <p className="font-semibold">{data.key_lengths}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Findings & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex gap-3">
              <Badge variant="outline" className="shrink-0">1</Badge>
              <div>
                <p className="font-semibold">Ridge Caps</p>
                <p className="text-sm text-muted-foreground">Mortar cracking. Re-bedding required.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="shrink-0">2</Badge>
              <div>
                <p className="font-semibold">Pointing</p>
                <p className="text-sm text-muted-foreground">Deteriorated joints along ridge/junctions.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="shrink-0">3</Badge>
              <div>
                <p className="font-semibold">Valleys</p>
                <p className="text-sm text-muted-foreground">Clean required; apply Stormseal for flow.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="shrink-0">4</Badge>
              <div>
                <p className="font-semibold">Surface Condition</p>
                <p className="text-sm text-muted-foreground">Organic growth; wash + biocide before coating.</p>
              </div>
            </div>
          </div>

          {data.photos?.before && data.photos.before.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {data.photos.before.map((photo, idx) => (
                <img 
                  key={idx}
                  src={photo} 
                  alt={`Inspection photo ${idx + 1}`}
                  className="rounded-lg w-full h-48 object-cover border"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Options */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Investment Options</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Option 1 */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Repairs + Wash</CardTitle>
              <p className="text-3xl font-bold text-primary">{formatMoney(o1.incGST)}</p>
              <p className="text-xs text-muted-foreground">Inc. GST</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Re-bed & re-point</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Valley clean + Stormseal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Pressure wash + biocide</span>
                </li>
              </ul>
              <Separator />
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ex GST:</span>
                  <span>{formatMoney(o1.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST:</span>
                  <span>{formatMoney(o1.gst)}</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center">7-10 year workmanship</Badge>
            </CardContent>
          </Card>

          {/* Option 2 - Featured */}
          <Card className="border-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Full Restoration</CardTitle>
              <p className="text-3xl font-bold text-primary">{formatMoney(o2.incGST)}</p>
              <p className="text-xs text-muted-foreground">Inc. GST</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>All Option 1 services</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Bonding primer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>2-coat UV membrane</span>
                </li>
              </ul>
              <Separator />
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ex GST:</span>
                  <span>{formatMoney(o2.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST:</span>
                  <span>{formatMoney(o2.gst)}</span>
                </div>
              </div>
              <Badge variant="default" className="w-full justify-center">15 year coating · 7-10 year work</Badge>
            </CardContent>
          </Card>

          {/* Option 3 */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Premium Package</CardTitle>
              <p className="text-3xl font-bold text-primary">{formatMoney(o3.incGST)}</p>
              <p className="text-xs text-muted-foreground">Inc. GST</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>All Option 2 services</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>High-build coating or</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Heat-reflective system</span>
                </li>
              </ul>
              <Separator />
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ex GST:</span>
                  <span>{formatMoney(o3.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST:</span>
                  <span>{formatMoney(o3.gst)}</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center">15-20 year coating · 7-10 year work</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms & Warranty */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Warranty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Payment Terms</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 20% deposit on acceptance</li>
                <li>• 50% after prep complete</li>
                <li>• 30% on completion</li>
                <li>• Net 7 days payment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quote Validity</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Valid for 30 days</li>
                <li>• Weather delays at no extra cost</li>
                <li>• Fully insured & licensed</li>
                <li>• Photo documentation provided</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-semibold mb-2">Ready to get started?</p>
          <p className="mb-4">Contact us to accept this quote and schedule your works.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="tel:0435900709" className="flex items-center gap-2 hover:underline">
              <Phone className="w-4 h-4" />
              0435 900 709
            </a>
            <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 hover:underline">
              <Mail className="w-4 h-4" />
              callkaidsroofing@outlook.com
            </a>
          </div>
          <p className="text-xs mt-4 opacity-80">ABN 39475055075</p>
        </CardContent>
      </Card>
    </div>
  );
};
