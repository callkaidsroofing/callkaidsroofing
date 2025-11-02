import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveIndicator } from '@/components/AutosaveIndicator';
import { ClientSiteStep } from '@/components/inspection-builder/ClientSiteStep';
import { RoofDetailsStep } from '@/components/inspection-builder/RoofDetailsStep';
import { MeasurementsStep } from '@/components/inspection-builder/MeasurementsStep';
import { ConditionChecklistStep } from '@/components/inspection-builder/ConditionChecklistStep';
import { PhotoEvidenceStep } from '@/components/inspection-builder/PhotoEvidenceStep';
import { RecommendedWorksStep } from '@/components/inspection-builder/RecommendedWorksStep';
import { MaterialsSafetyStep } from '@/components/inspection-builder/MaterialsSafetyStep';
import { ReviewSubmitStep } from '@/components/inspection-builder/ReviewSubmitStep';

const steps = [
  { id: 1, name: 'Client', description: 'Client & site details' },
  { id: 2, name: 'Roof', description: 'Roof identification' },
  { id: 3, name: 'Measurements', description: 'Get dimensions' },
  { id: 4, name: 'Condition', description: 'Inspect elements' },
  { id: 5, name: 'Photos', description: 'Photo evidence' },
  { id: 6, name: 'Works', description: 'Recommended repairs' },
  { id: 7, name: 'Materials', description: 'Specs & safety' },
  { id: 8, name: 'Review', description: 'Final check' },
];

export default function InspectionBuilderNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportId, setReportId] = useState<string | null>(id || null);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [isSaving, setIsSaving] = useState(false);
  const [reportData, setReportData] = useState({
    clientSite: {
      clientName: '',
      phone: '',
      email: '' as string | undefined,
      siteAddress: '',
      suburbPostcode: '',
      date: '',
      time: '',
      inspector: '',
    },
    roofDetails: {
      claddingType: '',
      tileProfile: '' as string | undefined,
      tileColour: '' as string | undefined,
      ageApprox: '' as string | undefined,
      roofPitch: '' as string | undefined,
    },
    measurements: {
      ridgeCaps: undefined as number | undefined,
      brokenTiles: undefined as number | undefined,
      gableLengthTiles: undefined as number | undefined,
      gableLengthLM: undefined as number | undefined,
      valleyLength: undefined as number | undefined,
      gutterPerimeter: undefined as number | undefined,
      roofArea: undefined as number | undefined,
    },
    condition: {} as any,
    photos: {} as any,
    recommendedWorks: {
      workItems: [] as any[],
    },
    materialsSafety: {} as any,
    summary: {
      overallCondition: '' as string | undefined,
      priority: '' as string | undefined,
      overallConditionNotes: '' as string | undefined,
      status: 'draft' as string | undefined,
    },
  });

  // Load existing report if editing
  useEffect(() => {
    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  const loadReport = async () => {
    const { data, error } = await supabase
      .from('inspection_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (!error && data) {
      // Map DB data to state structure
      setReportData({
        clientSite: {
          clientName: data.clientName,
          phone: data.phone,
          email: data.email || '',
          siteAddress: data.siteAddress,
          suburbPostcode: data.suburbPostcode,
          date: data.date,
          time: data.time,
          inspector: data.inspector,
        },
        roofDetails: {
          claddingType: data.claddingType,
          tileProfile: data.tileProfile || '',
          tileColour: data.tileColour || '',
          ageApprox: data.ageApprox || '',
          roofPitch: data.roofPitch || '',
        },
        measurements: {
          ridgeCaps: data.ridgeCaps,
          brokenTiles: data.brokenTiles,
          gableLengthTiles: data.gableLengthTiles,
          gableLengthLM: data.gableLengthLM,
          valleyLength: data.valleyLength,
          gutterPerimeter: data.gutterPerimeter,
          roofArea: data.roofArea,
        },
        condition: {
          brokenTilesCaps: data.brokenTilesCaps,
          brokenTilesNotes: data.brokenTilesNotes,
          pointing: data.pointing,
          pointingNotes: data.pointingNotes,
          valleyIrons: data.valleyIrons,
          valleyIronsNotes: data.valleyIronsNotes,
          boxGutters: data.boxGutters,
          boxGuttersNotes: data.boxGuttersNotes,
          guttersDownpipes: data.guttersDownpipes,
          guttersDownpipesNotes: data.guttersDownpipesNotes,
          penetrations: data.penetrations,
          penetrationsNotes: data.penetrationsNotes,
          internalLeaks: data.internalLeaks,
        },
        photos: {
          brokentilesphoto: data.brokentilesphoto || [],
          pointingphoto: data.pointingphoto || [],
          valleyironsphoto: data.valleyironsphoto || [],
          boxguttersphoto: data.boxguttersphoto || [],
          guttersphoto: data.guttersphoto || [],
          penetrationsphoto: data.penetrationsphoto || [],
          leaksphoto: data.leaksphoto || [],
          beforedefects: data.beforedefects || [],
          duringafter: data.duringafter || [],
        },
        recommendedWorks: (typeof data.recommendedWorks === 'object' && 
                          data.recommendedWorks !== null && 
                          !Array.isArray(data.recommendedWorks) &&
                          'workItems' in data.recommendedWorks)
          ? (data.recommendedWorks as { workItems: any[] })
          : { workItems: [] },
        materialsSafety: {
          pointingColour: data.pointingColour,
          beddingCementSand: data.beddingCementSand,
          specTileProfile: data.specTileProfile,
          specTileColour: data.specTileColour,
          paintSystem: data.paintSystem,
          paintColour: data.paintColour,
          flashings: data.flashings,
          otherMaterials: data.otherMaterials,
          heightStoreys: data.heightStoreys,
          safetyRailNeeded: data.safetyRailNeeded,
          accessNotes: data.accessNotes,
        },
        summary: {
          overallCondition: data.overallCondition || '',
          priority: data.priority || '',
          overallConditionNotes: data.overallConditionNotes || '',
          status: data.status || 'draft',
        },
      });
    }
  };

  // Save report to database
  const saveReport = async (data: any) => {
    setIsSaving(true);
    try {
      const reportPayload = {
        clientName: data.clientSite.clientName,
        phone: data.clientSite.phone,
        email: data.clientSite.email,
        siteAddress: data.clientSite.siteAddress,
        suburbPostcode: data.clientSite.suburbPostcode,
        date: data.clientSite.date,
        time: data.clientSite.time,
        inspector: data.clientSite.inspector,
        claddingType: data.roofDetails.claddingType,
        tileProfile: data.roofDetails.tileProfile,
        tileColour: data.roofDetails.tileColour,
        ageApprox: data.roofDetails.ageApprox,
        roofPitch: data.roofDetails.roofPitch,
        ridgeCaps: data.measurements.ridgeCaps,
        brokenTiles: data.measurements.brokenTiles,
        gableLengthLM: data.measurements.gableLengthLM,
        valleyLength: data.measurements.valleyLength,
        gutterPerimeter: data.measurements.gutterPerimeter,
        roofArea: data.measurements.roofArea,
        ...data.condition,
        ...data.photos,
        recommendedWorks: data.recommendedWorks,
        ...data.materialsSafety,
        ...data.summary,
      };

      if (reportId) {
        const { error } = await supabase
          .from('inspection_reports')
          .update(reportPayload)
          .eq('id', reportId);

        if (error) throw error;
      } else {
        const { data: newReport, error } = await supabase
          .from('inspection_reports')
          .insert([reportPayload])
          .select()
          .single();

        if (error) throw error;
        if (newReport) setReportId(newReport.id);
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
    data: reportData,
    onSave: saveReport,
    interval: 30000,
    enabled: !!reportData.clientSite.clientName,
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
        return (
          reportData.clientSite.clientName &&
          reportData.clientSite.phone &&
          reportData.clientSite.siteAddress
        );
      case 2:
        return reportData.roofDetails.claddingType;
      case 4:
        return Object.keys(reportData.condition).length > 0;
      case 6:
        return reportData.recommendedWorks.workItems.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    await saveReport(reportData);
    toast({
      title: 'Report submitted!',
      description: 'Inspection report has been saved successfully.',
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
              <h2 className="text-2xl font-bold">Client & Site Details</h2>
              <p className="text-muted-foreground">
                Select from leads or enter new client details
              </p>
            </div>
            <ClientSiteStep
              value={reportData.clientSite}
              onChange={(clientSite) => setReportData({ ...reportData, clientSite: { ...reportData.clientSite, ...clientSite } })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Roof Details</h2>
              <p className="text-muted-foreground">Identify roof type and specifications</p>
            </div>
            <RoofDetailsStep
              value={reportData.roofDetails}
              onChange={(roofDetails) => setReportData({ ...reportData, roofDetails: { ...reportData.roofDetails, ...roofDetails } })}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Roof Measurements</h2>
              <p className="text-muted-foreground">
                Use AI assist or enter manual measurements
              </p>
            </div>
            <MeasurementsStep
              value={reportData.measurements}
              onChange={(measurements) => setReportData({ ...reportData, measurements: { ...reportData.measurements, ...measurements } })}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Condition Checklist</h2>
              <p className="text-muted-foreground">Inspect and record roof condition</p>
            </div>
            <ConditionChecklistStep
              value={reportData.condition}
              onChange={(condition) => setReportData({ ...reportData, condition })}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Photo Evidence</h2>
              <p className="text-muted-foreground">Upload photos organized by category</p>
            </div>
            <PhotoEvidenceStep
              value={reportData.photos}
              onChange={(photos) => setReportData({ ...reportData, photos })}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Recommended Works</h2>
              <p className="text-muted-foreground">
                Add repair items based on inspection findings
              </p>
            </div>
            <RecommendedWorksStep
              value={reportData.recommendedWorks}
              onChange={(recommendedWorks) =>
                setReportData({ ...reportData, recommendedWorks })
              }
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Materials & Safety</h2>
              <p className="text-muted-foreground">
                Specify materials and access requirements
              </p>
            </div>
            <MaterialsSafetyStep
              value={reportData.materialsSafety}
              onChange={(materialsSafety) =>
                setReportData({ ...reportData, materialsSafety })
              }
            />
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Review & Submit</h2>
              <p className="text-muted-foreground">Final review before submission</p>
            </div>
            <ReviewSubmitStep
              value={reportData.summary}
              onChange={(summary) => setReportData({ ...reportData, summary: { ...reportData.summary, ...summary } })}
              reportData={reportData}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      <div className="max-w-5xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="font-medium">
              Step {currentStep} of {steps.length}
            </span>
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
                      'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-colors',
                      currentStep > step.id
                        ? 'bg-primary text-primary-foreground'
                        : currentStep === step.id
                        ? 'bg-primary text-primary-foreground ring-2 md:ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-1 md:mt-2 text-center">
                    <div className="text-xs md:text-sm font-medium whitespace-nowrap">
                      {step.name}
                    </div>
                    <div className="text-xs text-muted-foreground hidden lg:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-8 md:w-12 lg:w-24 h-0.5 md:h-1 mx-1 md:mx-2 transition-colors',
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
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
              onClick={() => saveReport(reportData)}
              disabled={isSaving || !reportData.clientSite.clientName}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          </div>
          <Button
            onClick={currentStep === 8 ? handleSubmit : handleNext}
            disabled={currentStep < 8 && !canProceed()}
            className="flex-1 md:flex-initial"
          >
            <span className="hidden sm:inline">
              {currentStep === steps.length ? 'Submit Report' : 'Next'}
            </span>
            <span className="sm:hidden">
              {currentStep === 8 ? 'Submit' : 'Next'}
            </span>
            {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
}
