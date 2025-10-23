import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  pointingColour: string;
  beddingCementSand: string;
  specTileProfile: string;
  specTileColour: string;
  paintSystem: string;
  paintColour: string;
  flashings: string;
  otherMaterials: string;
  heightStoreys: string;
  roofPitch: string;
  accessNotes: string;
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
  safetyRailNeeded: boolean;
  internal_leaks_observed: boolean;
  completed_at: string | null;
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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = async () => {
    if (!contentRef.current) return;
    
    const { printBrandedDocument } = await import('@/lib/pdfGenerator');
    try {
      printBrandedDocument(contentRef.current);
    } catch (error) {
      console.error('Print error:', error);
      toast({
        variant: 'destructive',
        title: 'Print Failed',
        description: 'Unable to print document',
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !report) return;
    
    setGeneratingPDF(true);
    const { generateBrandedPDF } = await import('@/lib/pdfGenerator');
    
    try {
      await generateBrandedPDF(contentRef.current, {
        title: `Inspection Report - ${report.clientName}`,
        filename: `CKR-Inspection-${report.id.slice(0, 8)}-${report.clientName.replace(/\s+/g, '-')}.pdf`,
        orientation: 'portrait',
      });
      
      toast({
        title: 'PDF Downloaded',
        description: 'Inspection report saved successfully',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'Unable to generate PDF',
      });
    } finally {
      setGeneratingPDF(false);
    }
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
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                {generatingPDF ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
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

      <div className="container mx-auto px-4 py-8 max-w-5xl print:max-w-full" ref={contentRef}>
        <Accordion
          type="multiple" 
          defaultValue={["client-details", "roof-id", "condition", "summary"]}
          className="space-y-4"
        >
          {/* Section 1: Client & Job Details */}
          <AccordionItem value="client-details">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Client & Job Details
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                      <p className="font-semibold">{report.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="font-semibold">{report.phone}</p>
                    </div>
                    {report.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-semibold">{report.email}</p>
                      </div>
                    )}
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
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inspection Time</p>
                      <p className="font-semibold">{report.time || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Roof Identification */}
          <AccordionItem value="roof-id">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Roof Identification
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
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
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Roof Measurements */}
          <AccordionItem value="measurements">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Roof Measurements
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ridge Caps</p>
                      <p className="font-semibold">{report.ridgeCaps ?? '—'} {report.ridgeCaps ? 'caps' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Broken Tiles Count</p>
                      <p className="font-semibold">{report.brokenTiles ?? '—'} {report.brokenTiles ? 'tiles' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gable Length (Tiles)</p>
                      <p className="font-semibold">{report.gableLengthTiles ?? '—'} {report.gableLengthTiles ? 'tiles' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gable Length (LM)</p>
                      <p className="font-semibold">{report.gableLengthLM ?? '—'} {report.gableLengthLM ? 'LM' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valley Length</p>
                      <p className="font-semibold">{report.valleyLength ?? '—'} {report.valleyLength ? 'm' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gutter Perimeter</p>
                      <p className="font-semibold">{report.gutterPerimeter ?? '—'} {report.gutterPerimeter ? 'm' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Roof Area</p>
                      <p className="font-semibold">{report.roofArea ?? '—'} {report.roofArea ? 'm²' : ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Specifications & Materials */}
          <AccordionItem value="specifications">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Specifications & Materials
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pointing Colour</p>
                      <p className="font-semibold">{report.pointingColour || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bedding (Cement/Sand)</p>
                      <p className="font-semibold">{report.beddingCementSand || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spec Tile Profile</p>
                      <p className="font-semibold">{report.specTileProfile || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spec Tile Colour</p>
                      <p className="font-semibold">{report.specTileColour || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paint System</p>
                      <p className="font-semibold">{report.paintSystem || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paint Colour</p>
                      <p className="font-semibold">{report.paintColour || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Flashings</p>
                      <p className="font-semibold">{report.flashings || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Other Materials</p>
                      <p className="font-semibold">{report.otherMaterials || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Height (Storeys)</p>
                      <p className="font-semibold">{report.heightStoreys || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Roof Pitch</p>
                      <p className="font-semibold">{report.roofPitch || 'N/A'}</p>
                    </div>
                    {report.accessNotes && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Access Notes</p>
                        <p className="font-semibold whitespace-pre-wrap">{report.accessNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Condition Assessment */}
          <AccordionItem value="condition">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Condition Assessment
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-6">
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
                  {report.internalLeaks && (
                    <div className="border-b pb-4">
                      <h4 className="font-semibold mb-2">Internal Leaks</h4>
                      <p className="text-sm text-muted-foreground mb-3">{report.internalLeaks}</p>
                      {report.leaksphoto && report.leaksphoto.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {report.leaksphoto.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Leak ${idx + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 6: Recommended Works */}
          <AccordionItem value="recommended-works">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Recommended Works
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-semibold">Work Item</th>
                          <th className="text-center py-2 px-3 font-semibold">Quantity</th>
                          <th className="text-left py-2 px-3 font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: 'Replace Broken Tiles', qty: report.replacebrokentilesqty, notes: report.replacebrokentilesnotes },
                          { label: 'Rebed Ridge', qty: report.rebedridgeqty, notes: report.rebedridgenotes },
                          { label: 'Flexible Repointing', qty: report.flexiblerepointingqty, notes: report.flexiblerepointingnotes },
                          { label: 'Install Valley Clips', qty: report.installvalleyclipsqty, notes: report.installvalleyclipsnotes },
                          { label: 'Replace Valley Irons', qty: report.replacevalleyironsqty, notes: report.replacevalleyironsnotes },
                          { label: 'Clean Gutters', qty: report.cleanguttersqty, notes: report.cleanguttersnotes },
                          { label: 'Pressure Wash', qty: report.pressurewashqty, notes: report.pressurewashnotes },
                          { label: 'Seal Penetrations', qty: report.sealpenetrationsqty, notes: report.sealpenetrationsnotes },
                          { label: 'Coating System', qty: report.coatingsystemqty, notes: report.coatingsystemnotes },
                        ].map((work) => {
                          const hasData = work.qty || work.notes;
                          if (!hasData) return null;
                          return (
                            <tr key={work.label} className={`border-b ${work.qty ? 'bg-primary/5' : ''}`}>
                              <td className="py-2 px-3">{work.label}</td>
                              <td className="py-2 px-3 text-center font-semibold">{work.qty ?? '—'}</td>
                              <td className="py-2 px-3 text-sm text-muted-foreground">{work.notes || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 7: Photo Evidence */}
          {((report.beforedefects && report.beforedefects.length > 0) || (report.duringafter && report.duringafter.length > 0)) && (
            <AccordionItem value="photo-evidence">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Photo Evidence ({(report.beforedefects?.length || 0) + (report.duringafter?.length || 0)} photos)
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
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
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Section 8: Safety & Additional Info */}
          <AccordionItem value="safety-info">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Safety & Additional Info
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Safety Rail Needed</p>
                      <Badge variant={report.safetyRailNeeded ? 'destructive' : 'secondary'}>
                        {report.safetyRailNeeded ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Internal Leaks Observed</p>
                      <Badge variant={report.internal_leaks_observed ? 'destructive' : 'secondary'}>
                        {report.internal_leaks_observed ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {report.completed_at && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Completed At</p>
                        <p className="font-semibold">
                          {new Date(report.completed_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Section 9: Summary */}
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Summary
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          [data-state="closed"] {
            display: block !important;
            height: auto !important;
          }
          
          .print\\:hidden,
          button,
          [role="button"] {
            display: none !important;
          }
          
          [data-radix-accordion-trigger] svg {
            display: none !important;
          }
          
          [data-radix-accordion-item] {
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
          
          .shadow,
          .border {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportViewer;
