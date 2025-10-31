import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, Save, Sparkles, Loader2, Satellite } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { InspectionRoofMeasurement } from './InspectionRoofMeasurement';

interface SimpleInspectionFormProps {
  prefillData?: {
    clientName?: string;
    phone?: string;
    email?: string;
    suburb?: string;
  };
}

/**
 * Simplified Inspection Form - Essential fields only
 * Advanced features moved to separate "Full Report" mode
 */
export function SimpleInspectionForm({ prefillData }: SimpleInspectionFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showRoofMeasurement, setShowRoofMeasurement] = useState(false);
  const [roofMeasurementData, setRoofMeasurementData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    clientName: prefillData?.clientName || '',
    phone: prefillData?.phone || '',
    email: prefillData?.email || '',
    siteAddress: '',
    suburbPostcode: prefillData?.suburb || '',
    inspector: 'Kaidyn Brownlie',
    date: new Date().toISOString().split('T')[0],
    
    // Essential roof details
    claddingType: '',
    roofArea: null as number | null,
    overallCondition: '',
    priority: 'standard',
    
    // Quick notes
    defectsSummary: '',
    recommendedWorks: '',
    
    // Photos
    overviewPhotos: [] as string[],
    defectPhotos: [] as string[],
    
    status: 'draft'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.phone || !formData.siteAddress) {
      toast.error('Please fill required fields: Name, Phone, Address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('inspection_reports')
        .insert([{
          clientName: formData.clientName,
          phone: formData.phone,
          email: formData.email,
          siteAddress: formData.siteAddress,
          suburbPostcode: formData.suburbPostcode,
          inspector: formData.inspector,
          date: formData.date,
          time: new Date().toTimeString().slice(0, 5),
          claddingType: formData.claddingType,
          roofArea: formData.roofArea,
          overallCondition: formData.overallCondition,
          overallConditionNotes: formData.defectsSummary,
          priority: formData.priority,
          beforedefects: formData.overviewPhotos,
          duringafter: formData.defectPhotos,
          status: formData.status
        }]);

      if (error) throw error;

      toast.success('Inspection report saved!');
      navigate('/internal/v2/home');
      
    } catch (error: any) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client & Site Details</CardTitle>
          <CardDescription>Basic information about the job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name *</Label>
              <Input
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label>Site Address *</Label>
            <Input
              value={formData.siteAddress}
              onChange={(e) => handleChange('siteAddress', e.target.value)}
              placeholder="123 Main St"
              required
            />
          </div>
          
          <div>
            <Label>Suburb / Postcode</Label>
            <Input
              value={formData.suburbPostcode}
              onChange={(e) => handleChange('suburbPostcode', e.target.value)}
              placeholder="Berwick 3806"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roof Assessment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Roof Assessment</CardTitle>
              <CardDescription>Essential roof details</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRoofMeasurement(!showRoofMeasurement)}
            >
              <Satellite className="h-4 w-4 mr-2" />
              {showRoofMeasurement ? 'Hide' : 'Scan Roof'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showRoofMeasurement && (
            <InspectionRoofMeasurement
              address={`${formData.siteAddress}, ${formData.suburbPostcode}`}
              onDataReceived={(data) => {
                setRoofMeasurementData(data);
                if (data.totalAreaM2) {
                  handleChange('roofArea', Math.round(data.totalAreaM2));
                }
              }}
            />
          )}
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Roof Type *</Label>
              <Select value={formData.claddingType} onValueChange={(value) => handleChange('claddingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
                  <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
                  <SelectItem value="Metal">Metal (Colorbond)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Roof Area (m²)</Label>
              <Input
                type="number"
                value={formData.roofArea || ''}
                onChange={(e) => handleChange('roofArea', e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g., 150"
              />
            </div>

            <div>
              <Label>Condition</Label>
              <Select value={formData.overallCondition} onValueChange={(value) => handleChange('overallCondition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Defects Summary</Label>
            <Textarea
              value={formData.defectsSummary}
              onChange={(e) => handleChange('defectsSummary', e.target.value)}
              placeholder="List main defects found (broken tiles, leaks, pointing issues, etc.)"
              rows={3}
            />
          </div>

          <div>
            <Label>Recommended Works</Label>
            <Textarea
              value={formData.recommendedWorks}
              onChange={(e) => handleChange('recommendedWorks', e.target.value)}
              placeholder="What work needs to be done?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos
          </CardTitle>
          <CardDescription>Upload inspection photos (optional but recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <ImageUploadField
              label="Overview Photos"
              name="overviewPhotos"
              value={formData.overviewPhotos}
              onChange={(name, urls) => handleChange(name, urls)}
              helpText="Upload general roof photos (optional)"
            />
          </div>

          <div>
            <ImageUploadField
              label="Defect Photos"
              name="defectPhotos"
              value={formData.defectPhotos}
              onChange={(name, urls) => handleChange(name, urls)}
              helpText="Upload photos of defects found (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/internal/v2/home')}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Inspection Report
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/internal/inspection?mode=advanced')}
          disabled={loading}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Advanced Mode
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Using Simple Mode. For detailed inspections with measurements and full checklists, use Advanced Mode.
      </p>
    </form>
  );
}
