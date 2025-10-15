import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/ImageUploadField';
import { SEOHead } from '@/components/SEOHead';

interface InspectionFormData {
  // Section 1: Job & Client
  clientName: string;
  phone: string;
  siteAddress: string;
  suburbPostcode: string;
  email: string;
  inspector: string;
  date: string;
  time: string;
  
  // Section 2: Roof Identification
  claddingType: string;
  tileProfile: string;
  tileColour: string;
  ageApprox: string;
  
  // Section 3: Quantity Summary
  ridgeCaps: number | null;
  brokenTiles: number | null;
  gableLengthTiles: number | null;
  gableLengthLM: number | null;
  valleyLength: number | null;
  gutterPerimeter: number | null;
  roofArea: number | null;
  
  // Section 4: Condition Checklist
  brokenTilesCaps: string;
  brokenTilesNotes: string;
  pointing: string;
  pointingNotes: string;
  valleyIrons: string;
  valleyIronsNotes: string;
  boxGutters: string;
  boxGuttersNotes: string;
  guttersDownpipes: string;
  guttersDownpipesNotes: string;
  penetrations: string;
  penetrationsNotes: string;
  internalLeaks: string;
  
  // Section 5: Photo uploads
  brokentilesphoto: string[];
  pointingphoto: string[];
  valleyironsphoto: string[];
  boxguttersphoto: string[];
  guttersphoto: string[];
  penetrationsphoto: string[];
  leaksphoto: string[];
  beforedefects: string[];
  duringafter: string[];
  
  // Section 6: Recommended Works
  replacebrokentilesqty: number | null;
  replacebrokentilesnotes: string;
  rebedridgeqty: number | null;
  rebedridgenotes: string;
  flexiblerepointingqty: number | null;
  flexiblerepointingnotes: string;
  installvalleyclipsqty: number | null;
  installvalleyclipsnotes: string;
  replacevalleyironsqty: number | null;
  replacevalleyironsnotes: string;
  cleanguttersqty: number | null;
  cleanguttersnotes: string;
  pressurewashqty: number | null;
  pressurewashnotes: string;
  sealpenetrationsqty: number | null;
  sealpenetrationsnotes: string;
  coatingsystemqty: number | null;
  coatingsystemnotes: string;
  
  // Section 7: Materials & Specs
  pointingColour: string;
  beddingCementSand: string;
  specTileProfile: string;
  specTileColour: string;
  paintSystem: string;
  paintColour: string;
  flashings: string;
  otherMaterials: string;
  
  // Section 8: Safety & Access
  heightStoreys: string;
  safetyRailNeeded: boolean;
  roofPitch: string;
  accessNotes: string;
  
  // Section 9: Summary
  overallCondition: string;
  overallConditionNotes: string;
  priority: string;
  status: string;
}

const QuoteLanding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InspectionFormData>({
    clientName: '',
    phone: '',
    siteAddress: '',
    suburbPostcode: '',
    email: '',
    inspector: 'Kaidyn Brownlie',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    claddingType: '',
    tileProfile: '',
    tileColour: '',
    ageApprox: '',
    ridgeCaps: null,
    brokenTiles: null,
    gableLengthTiles: null,
    gableLengthLM: null,
    valleyLength: null,
    gutterPerimeter: null,
    roofArea: null,
    brokenTilesCaps: '',
    brokenTilesNotes: '',
    pointing: '',
    pointingNotes: '',
    valleyIrons: '',
    valleyIronsNotes: '',
    boxGutters: '',
    boxGuttersNotes: '',
    guttersDownpipes: '',
    guttersDownpipesNotes: '',
    penetrations: '',
    penetrationsNotes: '',
    internalLeaks: '',
    brokentilesphoto: [],
    pointingphoto: [],
    valleyironsphoto: [],
    boxguttersphoto: [],
    guttersphoto: [],
    penetrationsphoto: [],
    leaksphoto: [],
    beforedefects: [],
    duringafter: [],
    replacebrokentilesqty: null,
    replacebrokentilesnotes: '',
    rebedridgeqty: null,
    rebedridgenotes: 'Strong mortar mix',
    flexiblerepointingqty: null,
    flexiblerepointingnotes: 'Colour to suit',
    installvalleyclipsqty: null,
    installvalleyclipsnotes: 'Where cut tiles slip',
    replacevalleyironsqty: null,
    replacevalleyironsnotes: 'Zinc/Colorbond',
    cleanguttersqty: null,
    cleanguttersnotes: 'All debris removed',
    pressurewashqty: null,
    pressurewashnotes: 'Prep for coating',
    sealpenetrationsqty: null,
    sealpenetrationsnotes: '',
    coatingsystemqty: 3,
    coatingsystemnotes: 'Primer + Membrane',
    pointingColour: '',
    beddingCementSand: '',
    specTileProfile: '',
    specTileColour: '',
    paintSystem: '',
    paintColour: '',
    flashings: '',
    otherMaterials: '',
    heightStoreys: '',
    safetyRailNeeded: false,
    roofPitch: '',
    accessNotes: '',
    overallCondition: '',
    overallConditionNotes: '',
    priority: '',
    status: 'draft',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? (value === '' ? null : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (name: string, urls: string[]) => {
    setFormData(prev => ({ ...prev, [name]: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.phone || !formData.siteAddress) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in client name, phone, and site address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('inspection_reports')
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: "Inspection report saved!",
        description: "Report has been successfully submitted.",
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Inspection submission error:', error);
      toast({
        variant: "destructive",
        title: "Unable to save report",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Get Your Free Roof Quote - Call Kaids Roofing | SE Melbourne"
        description="Get a detailed, photo-backed roof quote from Call Kaids Roofing. Fully insured, 15-year warranty, servicing SE Melbourne. No leaks. No lifting. Just quality."
        canonical="https://callkaidsroofing.com.au/quote"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-roofing-navy to-roofing-navy-light text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⭐ Rated #1 in Southeast Melbourne
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get Your Free, Detailed Roof Health Check
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6">
                Photo-backed quotes. 15-year warranty. Fully insured.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>2-3 Weeks Next Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Emergency Response Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Free Inspections This Week</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-2">
                  <div className="bg-card p-8 rounded-lg roofing-shadow">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Request Your Quote
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We need a few key details to prepare an accurate, photo-backed quote for your SE Melbourne property.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Client Contact Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Your Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="0435 900 709"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Property Information</h3>
                        <div>
                          <Label htmlFor="address">Site Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="suburb">Suburb / Postcode *</Label>
                          <Input
                            id="suburb"
                            name="suburb"
                            type="text"
                            value={formData.suburb}
                            onChange={handleInputChange}
                            placeholder="Clyde North 3978"
                            required
                          />
                        </div>
                      </div>

                      {/* Roof Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Roof Details</h3>
                        <div>
                          <Label htmlFor="claddingType">Roof Type *</Label>
                          <Select value={formData.claddingType} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select roof type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
                              <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
                              <SelectItem value="Metal">Metal (Colorbond/Zincalume)</SelectItem>
                              <SelectItem value="Not Sure">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="roofArea">Approximate Roof Area (m²)</Label>
                          <Input
                            id="roofArea"
                            name="roofArea"
                            type="text"
                            value={formData.roofArea}
                            onChange={handleInputChange}
                            placeholder="e.g., 150 (optional)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Describe the Work Needed</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="e.g., 'Full restoration needed', 'Leak in living room', 'Ridge caps loose'"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Honeypot */}
                      <input
                        type="text"
                        name="honeypot"
                        value={formData.honeypot}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <Button
                        type="submit"
                        variant="premium"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Get My Free Quote & Proof Package'}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        We are a fully insured business, and all quotes are backed by our 15-year and 20-year workmanship warranties. <strong>Proof In Every Roof.</strong>
                      </p>
                    </form>
                  </div>
                </div>

                {/* Sidebar - Trust Signals */}
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg roofing-shadow">
                    <h3 className="font-bold text-lg mb-4 text-foreground">Why Call Kaids?</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">15-Year Warranty</p>
                          <p className="text-sm text-muted-foreground">Industry-leading coverage on all work</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Premium Materials</p>
                          <p className="text-sm text-muted-foreground">Premcoat, SupaPoint, quality guaranteed</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Local Clyde North</p>
                          <p className="text-sm text-muted-foreground">15 mins from most SE Melbourne suburbs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-2">Need Help Now?</p>
                    <div className="space-y-2">
                      <a href="tel:0435900709" className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="h-4 w-4" />
                        <span>0435 900 709</span>
                      </a>
                      <a href="mailto:callkaidsroofing@outlook.com" className="flex items-center gap-2 text-primary hover:underline text-sm">
                        <Mail className="h-4 w-4" />
                        <span>callkaidsroofing@outlook.com</span>
                      </a>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">ABN 39475055075</p>
                    <p>Fully insured. Locally owned and operated.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default QuoteLanding;
