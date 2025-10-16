import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReportStatusBadge } from '@/components/ReportStatusBadge';

interface ReportData {
  id: string;
  clientName: string;
  phone: string;
  siteAddress: string;
  suburbPostcode: string;
  email: string;
  inspector: string;
  date: string;
  time: string;
  claddingType: string;
  tileProfile: string;
  tileColour: string;
  ageApprox: string;
  ridgeCaps: number | null;
  brokenTiles: number | null;
  gableLengthTiles: number | null;
  gableLengthLM: number | null;
  valleyLength: number | null;
  gutterPerimeter: number | null;
  roofArea: number | null;
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
  brokentilesphoto: string[];
  pointingphoto: string[];
  valleyironsphoto: string[];
  boxguttersphoto: string[];
  guttersphoto: string[];
  penetrationsphoto: string[];
  leaksphoto: string[];
  beforedefects: string[];
  duringafter: string[];
  overallCondition: string;
  overallConditionNotes: string;
  priority: string;
  status: string;
}

const ReportViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('inspection_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading report',
        description: 'Unable to load the inspection report.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Report not found</p>
          <Button onClick={() => navigate('/internal/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 border-b print:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/internal/dashboard')}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Inspection Report - {report.clientName}</h1>
                <p className="text-sm opacity-90">{report.siteAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReportStatusBadge status={report.status} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/internal/inspection?edit=${report.id}`)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block bg-white p-6 border-b">
        <h1 className="text-2xl font-bold">Call Kaids Roofing - Inspection Report</h1>
        <p className="text-sm text-muted-foreground">ABN 39475055075 | callkaidsroofing@outlook.com | 0435 900 709</p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl print:max-w-full">
        {/* Client & Job Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Client & Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                <p className="font-semibold">{report.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="font-semibold">{report.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Site Address</p>
                <p className="font-semibold">{report.siteAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suburb / Postcode</p>
                <p className="font-semibold">{report.suburbPostcode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inspector</p>
                <p className="font-semibold">{report.inspector}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inspection Date</p>
                <p className="font-semibold">{new Date(report.date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roof Identification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Roof Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cladding Type</p>
                <p className="font-semibold">{report.claddingType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tile Profile</p>
                <p className="font-semibold">{report.tileProfile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tile Colour</p>
                <p className="font-semibold">{report.tileColour || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age (approx)</p>
                <p className="font-semibold">{report.ageApprox || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition Checklist with Photos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Condition Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Broken Tiles/Caps', condition: report.brokenTilesCaps, notes: report.brokenTilesNotes, photos: report.brokentilesphoto },
              { label: 'Pointing', condition: report.pointing, notes: report.pointingNotes, photos: report.pointingphoto },
              { label: 'Valley Irons', condition: report.valleyIrons, notes: report.valleyIronsNotes, photos: report.valleyironsphoto },
              { label: 'Box Gutters', condition: report.boxGutters, notes: report.boxGuttersNotes, photos: report.boxguttersphoto },
              { label: 'Gutters/Downpipes', condition: report.guttersDownpipes, notes: report.guttersDownpipesNotes, photos: report.guttersphoto },
              { label: 'Penetrations', condition: report.penetrations, notes: report.penetrationsNotes, photos: report.penetrationsphoto },
            ].map((item) => (
              <div key={item.label} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{item.label}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.condition === 'Good' ? 'bg-green-100 text-green-700' :
                    item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                    item.condition === 'Poor' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.condition || 'N/A'}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-sm text-muted-foreground mb-3">{item.notes}</p>
                )}
                {item.photos && item.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {item.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`${item.label} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Photo Evidence */}
        {((report.beforedefects && report.beforedefects.length > 0) || (report.duringafter && report.duringafter.length > 0)) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Photo Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.beforedefects && report.beforedefects.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Before - Defects</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {report.beforedefects.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Before ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
              {report.duringafter && report.duringafter.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">During/After</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {report.duringafter.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`After ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Condition</p>
                <p className="font-semibold">{report.overallCondition || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <p className="font-semibold">{report.priority || 'N/A'}</p>
              </div>
            </div>
            {report.overallConditionNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{report.overallConditionNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportViewer;
