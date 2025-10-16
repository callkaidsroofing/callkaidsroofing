import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/ImageUploadField';
import { InspectionFormSection } from '@/components/InspectionFormSection';

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

const InspectionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
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

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('inspection-draft', JSON.stringify(formData));
      setIsDraft(true);
      setTimeout(() => setIsDraft(false), 2000);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('inspection-draft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
        toast({
          title: "Draft restored",
          description: "Your previous work has been restored.",
        });
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }
  }, []);

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

      localStorage.removeItem('inspection-draft');
      
      toast({
        title: "Inspection report saved!",
        description: "Report has been successfully submitted.",
      });

      navigate('/internal/dashboard');
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
    <div className="min-h-screen bg-muted/30">
      {/* Internal Header */}
      <div className="bg-primary text-primary-foreground py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Call Kaids Roofing - Inspection Report</h1>
              <p className="text-sm opacity-90">ABN 39475055075 | callkaidsroofing@outlook.com | 0435 900 709</p>
            </div>
            {isDraft && (
              <span className="text-xs bg-primary-foreground/20 px-3 py-1 rounded-full">
                Draft saved
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Job & Client Details */}
          <InspectionFormSection title="Job & Client Details" sectionNumber={1}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="siteAddress">Site Address *</Label>
                <Input
                  id="siteAddress"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="suburbPostcode">Suburb / Postcode *</Label>
                <Input
                  id="suburbPostcode"
                  name="suburbPostcode"
                  value={formData.suburbPostcode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="inspector">Inspector</Label>
                <Input
                  id="inspector"
                  name="inspector"
                  value={formData.inspector}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 2: Roof Identification */}
          <InspectionFormSection title="Roof Identification" sectionNumber={2}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="claddingType">Cladding Type *</Label>
                <Select value={formData.claddingType} onValueChange={(value) => handleSelectChange('claddingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
                    <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
                    <SelectItem value="Metal">Metal (Colorbond/Zincalume)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tileProfile">Tile Profile</Label>
                <Input
                  id="tileProfile"
                  name="tileProfile"
                  value={formData.tileProfile}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="tileColour">Tile Colour</Label>
                <Input
                  id="tileColour"
                  name="tileColour"
                  value={formData.tileColour}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="ageApprox">Age (approx years)</Label>
                <Input
                  id="ageApprox"
                  name="ageApprox"
                  value={formData.ageApprox}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 3: Quantity Summary */}
          <InspectionFormSection title="Quantity Summary" sectionNumber={3}>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ridgeCaps">Ridge Caps (qty)</Label>
                <Input
                  id="ridgeCaps"
                  name="ridgeCaps"
                  type="number"
                  value={formData.ridgeCaps ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="brokenTiles">Broken Tiles (qty)</Label>
                <Input
                  id="brokenTiles"
                  name="brokenTiles"
                  type="number"
                  value={formData.brokenTiles ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="gableLengthTiles">Gable Length (tiles)</Label>
                <Input
                  id="gableLengthTiles"
                  name="gableLengthTiles"
                  type="number"
                  value={formData.gableLengthTiles ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="gableLengthLM">Gable Length (LM)</Label>
                <Input
                  id="gableLengthLM"
                  name="gableLengthLM"
                  type="number"
                  step="0.1"
                  value={formData.gableLengthLM ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="valleyLength">Valley Length (LM)</Label>
                <Input
                  id="valleyLength"
                  name="valleyLength"
                  type="number"
                  step="0.1"
                  value={formData.valleyLength ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="gutterPerimeter">Gutter Perimeter (LM)</Label>
                <Input
                  id="gutterPerimeter"
                  name="gutterPerimeter"
                  type="number"
                  step="0.1"
                  value={formData.gutterPerimeter ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="roofArea">Roof Area (m²)</Label>
                <Input
                  id="roofArea"
                  name="roofArea"
                  type="number"
                  step="0.1"
                  value={formData.roofArea ?? ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 4: Condition Checklist */}
          <InspectionFormSection title="Condition Checklist" sectionNumber={4}>
            <div className="space-y-6">
              {/* Broken Tiles/Caps */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Broken Tiles/Caps</Label>
                <Select value={formData.brokenTilesCaps} onValueChange={(value) => handleSelectChange('brokenTilesCaps', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="brokenTilesNotes"
                  placeholder="Notes..."
                  value={formData.brokenTilesNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="brokentilesphoto"
                  value={formData.brokentilesphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Pointing */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Pointing</Label>
                <Select value={formData.pointing} onValueChange={(value) => handleSelectChange('pointing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="pointingNotes"
                  placeholder="Notes..."
                  value={formData.pointingNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="pointingphoto"
                  value={formData.pointingphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Valley Irons */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Valley Irons</Label>
                <Select value={formData.valleyIrons} onValueChange={(value) => handleSelectChange('valleyIrons', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="valleyIronsNotes"
                  placeholder="Notes..."
                  value={formData.valleyIronsNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="valleyironsphoto"
                  value={formData.valleyironsphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Box Gutters */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Box Gutters</Label>
                <Select value={formData.boxGutters} onValueChange={(value) => handleSelectChange('boxGutters', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="boxGuttersNotes"
                  placeholder="Notes..."
                  value={formData.boxGuttersNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="boxguttersphoto"
                  value={formData.boxguttersphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Gutters/Downpipes */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Gutters/Downpipes</Label>
                <Select value={formData.guttersDownpipes} onValueChange={(value) => handleSelectChange('guttersDownpipes', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="guttersDownpipesNotes"
                  placeholder="Notes..."
                  value={formData.guttersDownpipesNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="guttersphoto"
                  value={formData.guttersphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Penetrations */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Penetrations</Label>
                <Select value={formData.penetrations} onValueChange={(value) => handleSelectChange('penetrations', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="penetrationsNotes"
                  placeholder="Notes..."
                  value={formData.penetrationsNotes}
                  onChange={handleInputChange}
                  rows={2}
                />
                <ImageUploadField
                  label="Photos"
                  name="penetrationsphoto"
                  value={formData.penetrationsphoto}
                  onChange={handleImageChange}
                />
              </div>

              {/* Internal Leaks */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Internal Leaks</Label>
                <Select value={formData.internalLeaks} onValueChange={(value) => handleSelectChange('internalLeaks', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <ImageUploadField
                  label="Photos"
                  name="leaksphoto"
                  value={formData.leaksphoto}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 5: Photo Evidence */}
          <InspectionFormSection title="Photo Evidence" sectionNumber={5}>
            <div className="space-y-4">
              <ImageUploadField
                label="Before - Defects"
                name="beforedefects"
                value={formData.beforedefects}
                onChange={handleImageChange}
                helpText="Photos showing defects before work"
              />
              <ImageUploadField
                label="During/After"
                name="duringafter"
                value={formData.duringafter}
                onChange={handleImageChange}
                helpText="Progress and completion photos"
              />
            </div>
          </InspectionFormSection>

          {/* Section 6: Recommended Works */}
          <InspectionFormSection title="Recommended Works" sectionNumber={6}>
            <div className="space-y-6">
              {[
                { qty: 'replacebrokentilesqty', notes: 'replacebrokentilesnotes', label: 'Replace Broken Tiles' },
                { qty: 'rebedridgeqty', notes: 'rebedridgenotes', label: 'Rebed Ridge' },
                { qty: 'flexiblerepointingqty', notes: 'flexiblerepointingnotes', label: 'Flexible Repointing' },
                { qty: 'installvalleyclipsqty', notes: 'installvalleyclipsnotes', label: 'Install Valley Clips' },
                { qty: 'replacevalleyironsqty', notes: 'replacevalleyironsnotes', label: 'Replace Valley Irons' },
                { qty: 'cleanguttersqty', notes: 'cleanguttersnotes', label: 'Clean Gutters' },
                { qty: 'pressurewashqty', notes: 'pressurewashnotes', label: 'Pressure Wash' },
                { qty: 'sealpenetrationsqty', notes: 'sealpenetrationsnotes', label: 'Seal Penetrations' },
                { qty: 'coatingsystemqty', notes: 'coatingsystemnotes', label: 'Coating System' },
              ].map((item) => (
                <div key={item.qty} className="grid md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-1">
                    <Label className="font-semibold">{item.label}</Label>
                  </div>
                  <div>
                    <Label htmlFor={item.qty}>Qty</Label>
                    <Input
                      id={item.qty}
                      name={item.qty}
                      type="number"
                      value={(formData[item.qty as keyof InspectionFormData] as number | null) ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={item.notes}>Notes</Label>
                    <Input
                      id={item.notes}
                      name={item.notes}
                      value={(formData[item.notes as keyof InspectionFormData] as string) ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ))}
            </div>
          </InspectionFormSection>

          {/* Section 7: Materials & Specs */}
          <InspectionFormSection title="Materials & Specifications" sectionNumber={7}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pointingColour">Pointing Colour</Label>
                <Input
                  id="pointingColour"
                  name="pointingColour"
                  value={formData.pointingColour}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="beddingCementSand">Bedding (Cement/Sand)</Label>
                <Input
                  id="beddingCementSand"
                  name="beddingCementSand"
                  value={formData.beddingCementSand}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="specTileProfile">Tile Profile (if replacing)</Label>
                <Input
                  id="specTileProfile"
                  name="specTileProfile"
                  value={formData.specTileProfile}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="specTileColour">Tile Colour (if replacing)</Label>
                <Input
                  id="specTileColour"
                  name="specTileColour"
                  value={formData.specTileColour}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="paintSystem">Paint System</Label>
                <Input
                  id="paintSystem"
                  name="paintSystem"
                  value={formData.paintSystem}
                  onChange={handleInputChange}
                  placeholder="e.g., Premcoat"
                />
              </div>
              <div>
                <Label htmlFor="paintColour">Paint Colour</Label>
                <Input
                  id="paintColour"
                  name="paintColour"
                  value={formData.paintColour}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="flashings">Flashings</Label>
                <Input
                  id="flashings"
                  name="flashings"
                  value={formData.flashings}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="otherMaterials">Other Materials</Label>
                <Input
                  id="otherMaterials"
                  name="otherMaterials"
                  value={formData.otherMaterials}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 8: Safety & Access */}
          <InspectionFormSection title="Safety & Access" sectionNumber={8}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heightStoreys">Height (storeys)</Label>
                <Select value={formData.heightStoreys} onValueChange={(value) => handleSelectChange('heightStoreys', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Storey</SelectItem>
                    <SelectItem value="2">2 Storey</SelectItem>
                    <SelectItem value="3+">3+ Storey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roofPitch">Roof Pitch</Label>
                <Select value={formData.roofPitch} onValueChange={(value) => handleSelectChange('roofPitch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low (0-15°)</SelectItem>
                    <SelectItem value="Medium">Medium (15-30°)</SelectItem>
                    <SelectItem value="Steep">Steep (30°+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="safetyRailNeeded"
                  checked={formData.safetyRailNeeded}
                  onCheckedChange={(checked) => handleCheckboxChange('safetyRailNeeded', checked as boolean)}
                />
                <Label htmlFor="safetyRailNeeded" className="cursor-pointer">
                  Safety Rail Needed
                </Label>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="accessNotes">Access Notes</Label>
                <Textarea
                  id="accessNotes"
                  name="accessNotes"
                  value={formData.accessNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Access restrictions, ladder placement, etc."
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Section 9: Summary */}
          <InspectionFormSection title="Summary" sectionNumber={9}>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="overallCondition">Overall Condition</Label>
                  <Select value={formData.overallCondition} onValueChange={(value) => handleSelectChange('overallCondition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="overallConditionNotes">Overall Notes</Label>
                <Textarea
                  id="overallConditionNotes"
                  name="overallConditionNotes"
                  value={formData.overallConditionNotes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Summary of findings and recommendations..."
                />
              </div>
            </div>
          </InspectionFormSection>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end pt-6">
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
