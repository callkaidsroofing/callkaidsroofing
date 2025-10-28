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
    <div className="max-w-5xl mx-auto bg-background p-4 md:p-8 space-y-8">
      {/* Header - Matching original quote style */}
      <div className="border-b-4 border-primary pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Call Kaids Roofing</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Roofing Cost Estimate</h2>
          </div>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p className="font-semibold text-foreground">Kaidyn Brownlie</p>
            <p>ABN: 39 475 055 075</p>
            <p>8 Springleaf Avenue, Clyde North, 3978</p>
            <p className="font-medium text-foreground">Licensed & Insured</p>
            <p>Contact: +61 435 900 709</p>
            <p>Email: CallKaidsRoofing@outlook.com</p>
          </div>
        </div>
      </div>

      {/* Client & Property Info */}
      <div className="bg-muted/30 rounded-lg p-4 md:p-6 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{data.client_name}</h3>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {data.property_address}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm pt-2 border-t">
          <div>
            <span className="text-muted-foreground">Roof Type:</span>{" "}
            <span className="font-semibold">{data.roof_type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Measured Area:</span>{" "}
            <span className="font-semibold">{data.measured_area}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Key Lengths:</span>{" "}
            <span className="font-semibold">{data.key_lengths}</span>
          </div>
        </div>
      </div>

      {/* Inspection Photos */}
      {data.photos?.before && data.photos.before.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Inspection Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.photos.before.map((photo, idx) => (
              <img 
                key={idx}
                src={photo} 
                alt={`Inspection photo ${idx + 1}`}
                className="rounded-lg w-full h-40 object-cover border-2 border-border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Scope of Works - Table Style */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Scope of Works</h2>
        
        {/* Option 1 */}
        <Card className="mb-4">
          <CardHeader className="pb-3 bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Option 1: Essential Repairs + Wash</CardTitle>
              <Badge variant="outline" className="text-base px-3 py-1">{formatMoney(o1.incGST)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Re-bed & Re-point Ridge Caps</p>
                <p className="text-muted-foreground">Remove all existing mortar from ridge caps and thoroughly clean the ridge lines. Re-bed all ridge caps using fresh mortar to ensure watertight seal, then apply flexible pointing compound to secure and finish. All work completed to Australian Building Standards.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Valley Clean + Stormseal</p>
                <p className="text-muted-foreground">Thorough cleaning of valley irons and application of premium Stormseal coating to ensure optimal water flow and prevent future issues.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Pressure Wash + Biocide Treatment</p>
                <p className="text-muted-foreground">High-pressure clean entire roof surface to remove moss, lichen, dirt, and debris. Apply biocide treatment to prevent regrowth.</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal (Ex GST):</span>
                  <span className="font-medium">{formatMoney(o1.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (10%):</span>
                  <span className="font-medium">{formatMoney(o1.gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{formatMoney(o1.incGST)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">7-10 year workmanship warranty</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2 - Recommended */}
        <Card className="mb-4 border-primary border-2">
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md">
            RECOMMENDED
          </div>
          <CardHeader className="pb-3 bg-primary/5">
            <div className="flex items-center justify-between pr-24">
              <CardTitle className="text-lg">Option 2: Full Restoration</CardTitle>
              <Badge variant="default" className="text-base px-3 py-1">{formatMoney(o2.incGST)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">All Option 1 Services Included</p>
                <p className="text-muted-foreground">Complete re-bedding, re-pointing, valley treatment, and pressure cleaning as detailed above.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Bonding Primer Application</p>
                <p className="text-muted-foreground">Apply one coat of industrial-grade primer/sealer for concrete roof tiles to ensure maximum adhesion and longevity of coating system.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Premium 2-Coat UV Membrane</p>
                <p className="text-muted-foreground">Two full coats of premium acrylic roofing membrane for maximum durability, UV protection, and colour retention. 15-year manufacturer warranty on coating.</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal (Ex GST):</span>
                  <span className="font-medium">{formatMoney(o2.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (10%):</span>
                  <span className="font-medium">{formatMoney(o2.gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{formatMoney(o2.incGST)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Badge className="text-sm">15 year coating · 7-10 year workmanship</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 3 */}
        <Card>
          <CardHeader className="pb-3 bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Option 3: Premium Package</CardTitle>
              <Badge variant="outline" className="text-base px-3 py-1">{formatMoney(o3.incGST)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">All Option 2 Services Included</p>
                <p className="text-muted-foreground">Complete restoration package with re-bedding, re-pointing, cleaning, primer, and 2-coat membrane system.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold mb-1">Premium Coating Upgrade</p>
                <p className="text-muted-foreground">Choice of high-build coating system OR heat-reflective membrane for enhanced durability and energy efficiency. Extended 15-20 year coating warranty.</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal (Ex GST):</span>
                  <span className="font-medium">{formatMoney(o3.exGST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (10%):</span>
                  <span className="font-medium">{formatMoney(o3.gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{formatMoney(o3.incGST)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">15-20 year coating · 7-10 year workmanship</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms & Conditions */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Quote Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>All works to be completed in accordance with the quoted scope. Any variations or additional work requested will incur separate charges. Quotes remain valid for 30 days.</p>
          
          <p>Payment is due within 7 days unless otherwise agreed. This estimate/quote is issued under the Building and Construction Industry Security of Payment Act 2002 (Vic). Interest may be charged on late payments.</p>
          
          <p>Call Kaids Roofing workmanship is warranted for 7–15 years, depending on the scope of work. Manufacturer warranties apply to all supplied products. Please note, warranties are void if works are altered or if required maintenance is neglected.</p>
          
          <p>We are fully insured. All materials remain the property of Call Kaids Roofing until payment is received in full. Scheduling of works is subject to weather conditions and site access.</p>
          
          <p className="font-semibold text-foreground">By accepting this quote or invoice, you agree to these Terms & Conditions. Full terms are available upon request.</p>
        </CardContent>
      </Card>

      {/* Contact Footer */}
      <div className="border-t-4 border-primary pt-6 text-center">
        <p className="text-lg font-semibold mb-3">Ready to proceed? Contact us today.</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
          <a href="tel:0435900709" className="flex items-center gap-2 text-primary hover:underline font-medium">
            <Phone className="w-4 h-4" />
            0435 900 709
          </a>
          <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 text-primary hover:underline font-medium">
            <Mail className="w-4 h-4" />
            callkaidsroofing@outlook.com
          </a>
        </div>
        <p className="text-xs text-muted-foreground">ABN 39475055075 | Licensed & Insured</p>
      </div>
    </div>
  );
};
