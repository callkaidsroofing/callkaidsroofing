import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { InspectionStep } from './InspectionStep';
import { QuoteStep } from './QuoteStep';
import { ExportStep } from './ExportStep';
import {
  InspectionData,
  QuoteData,
  ScopeItem,
} from './types';
import {
  transformInspectionToSupabase,
  transformSupabaseToInspection,
  transformQuoteToSupabase,
} from './utils';
import { validateInspection, validateQuote } from './validation';
import { parseLineItems, DatabaseLineItem } from './database-types';

const STAGES = [
  { id: 1, name: 'Inspection', description: 'Property inspection details' },
  { id: 2, name: 'Quote', description: 'Scope of works & pricing' },
  { id: 3, name: 'Export', description: 'Save & send' },
];

const emptyInspection: InspectionData = {
  client_name: '',
  phone: '',
  email: '',
  address: '',
  suburb: '',
  roof_type: '',
  storey_count: 'Single Storey',
  access_difficulty: 'Standard',
  photos_taken: 'Yes',
  urgency_level: 'Standard',
  ridge_condition: '',
  valley_condition: '',
  tile_condition: '',
  gutter_condition: '',
  flashing_condition: '',
  leak_status: '',
  inspector_notes: '',
  safety_notes: '',
  roof_area_m2: undefined,
  ridge_length_lm: undefined,
  valley_length_lm: undefined,
  gutter_length_lm: undefined,
  tile_count: undefined,
  roof_pitch: '',
};

const emptyQuote: QuoteData = {
  primary_service: '',
  document_type: 'Multi-Option Quote',
  slogan: 'No Leaks. No Lifting. Just Quality.',
  include_findings: true,
  include_warranty: true,
  include_terms: true,
};

type LeadPrefill = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  suburb?: string;
  service?: string;
  message?: string;
};

export function InspectionQuoteBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [currentStage, setCurrentStage] = useState(1);
  const [inspectionData, setInspectionData] = useState<InspectionData>(emptyInspection);
  const [quoteData, setQuoteData] = useState<QuoteData>(emptyQuote);
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([]);
  const [inspectionId, setInspectionId] = useState<string | null>(id || null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [leadContext, setLeadContext] = useState<LeadPrefill | null>(null);

  useEffect(() => {
    const state = location.state as { leadId?: string; leadData?: LeadPrefill } | null;

    if (state?.leadData || state?.leadId) {
      const context = { id: state.leadId, ...state.leadData } as LeadPrefill;
      setLeadContext(context);
    }
  }, [location.state]);

  useEffect(() => {
    if (leadContext) {
      applyLeadPrefill(leadContext);
    }
  }, [leadContext]);

  // Load existing inspection/quote if ID provided
  useEffect(() => {
    if (id) {
      loadExistingData(id);
    }
  }, [id]);

  function applyLeadPrefill(lead: LeadPrefill) {
    setInspectionData((prev) => ({
      ...prev,
      client_name: prev.client_name || lead.name || '',
      phone: prev.phone || lead.phone || '',
      email: prev.email || lead.email || '',
      suburb: prev.suburb || lead.suburb || '',
      inspector_notes: prev.inspector_notes || lead.message || '',
    }));

    setQuoteData((prev) => ({
      ...prev,
      primary_service: prev.primary_service || lead.service || prev.primary_service,
    }));
  }

  async function loadLeadPrefill(leadId: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;

      if (data) {
        const context: LeadPrefill = {
          id: data.id,
          name: (data as any).name,
          phone: (data as any).phone,
          email: (data as any).email || undefined,
          suburb: (data as any).suburb,
          service: (data as any).service,
          message: (data as any).message || undefined,
        };

        setLeadContext(context);
        applyLeadPrefill(context);
      }
    } catch (error) {
      console.error('Lead prefill error:', error);
    }
  }

  async function ensureQuoteStub(resolvedInspectionId: string) {
    if (quoteId) return;

    const stubItems = scopeItems.length
      ? scopeItems
      : [
          {
            id: 'stub-item',
            category: quoteData.primary_service || 'Roof works',
            area: '',
            qty: 1,
            unit: 'item',
            priority: 'Must Do' as const,
            labour: 0,
            material: 0,
            markup: 0,
            notes: '',
            subtotal_ex_gst: 0,
            gst_amount: 0,
            total_inc_gst: 0,
          },
        ];

    const payload = transformQuoteToSupabase(
      inspectionData,
      stubItems,
      quoteData,
      resolvedInspectionId,
      quoteNumber
    );

    const { data, error } = await supabase
      .from('quotes')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    setQuoteId(data.id!);
    // Cast to access custom fields that may exist on the payload
    const savedQuoteData = data as any;
    setQuoteNumber(savedQuoteData.quote_number || payload.quote_number || '');
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Guard: autosave only when both records exist to avoid orphan rows
      if (inspectionId && quoteId && currentStage >= 1) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [inspectionId, inspectionData, scopeItems, currentStage, quoteId]);

  async function loadExistingData(recordId: string) {
    try {
      setIsLoading(true);

      // Try to load as inspection first
      const { data: inspection, error: inspError } = await supabase
        .from('inspection_reports')
        .select('*')
        .eq('id', recordId)
        .single();

      if (inspError?.code === 'PGRST116') {
        await loadLeadPrefill(recordId);
        return;
      }

      if (inspError) {
        throw inspError;
      }

      if (inspection) {
        setInspectionData(transformSupabaseToInspection(inspection));
        setInspectionId(inspection.id!);

        // Check if there's a linked quote
        const { data: quoteResult } = await supabase
          .from('quotes')
          .select('*')
          .eq('inspection_id', inspection.id)
          .single();

        if (quoteResult) {
          // Cast to access custom fields
          const quote = quoteResult as any;
          setQuoteId(quote.id!);
          setQuoteNumber(quote.quote_number || '');
          const scope = (quote.scope || {}) as any;
          const documentType =
            scope.document_type === 'Simple Quote' || scope.document_type === 'Multi-Option Quote'
              ? scope.document_type
              : scope.document_type === 'simple'
              ? 'Simple Quote'
              : 'Multi-Option Quote';

          const resolvedDocumentType = documentType as QuoteData['document_type'];

          setQuoteData((prev) => ({
            ...prev,
            primary_service: scope.primary_service || prev.primary_service,
            document_type: resolvedDocumentType,
            include_findings:
              typeof scope.include_findings === 'boolean'
                ? scope.include_findings
                : prev.include_findings,
            include_warranty:
              typeof scope.include_warranty === 'boolean'
                ? scope.include_warranty
                : prev.include_warranty,
            include_terms:
              typeof scope.include_terms === 'boolean' ? scope.include_terms : prev.include_terms,
          }));
          // Load scope items from quote
          if (quote.line_items) {
            const parsedItems = parseLineItems(quote.line_items);
            const items = parsedItems.map((item: DatabaseLineItem, index: number) => ({
              id: `item-${index}`,
              category: item.description || '',
              area: item.area || '',
              qty: item.quantity || 0,
              unit: item.unit || 'lm',
              priority: item.priority || 'Must Do',
              labour: item.labour_cost || 0,
              material: item.material_cost || 0,
              markup: item.markup_percent || 30,
              notes: item.notes || '',
              subtotal_ex_gst: item.subtotal || 0,
              gst_amount: item.gst || 0,
              total_inc_gst: item.total || 0,
            }));
            setScopeItems(items);
          }
        } else if (inspection.id) {
          await ensureQuoteStub(inspection.id);
        }

        toast({
          title: 'Loaded successfully',
          description: 'Inspection data loaded',
        });
      } else {
        throw new Error('Inspection not found');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAutoSave() {
    if (!inspectionId || !quoteId) return;

    try {
      const supabaseData = transformInspectionToSupabase(inspectionData);
      await supabase
        .from('inspection_reports')
        .update(supabaseData)
        .eq('id', inspectionId);

      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  }

  async function handleSaveInspection(): Promise<string | null> {
    const validation = validateInspection(inspectionData);
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsSaving(true);
      const supabaseData = transformInspectionToSupabase(inspectionData);
      let savedInspectionId = inspectionId;

      if (inspectionId) {
        // Update existing
        const { error } = await supabase
          .from('inspection_reports')
          .update(supabaseData)
          .eq('id', inspectionId);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('inspection_reports')
          .insert(supabaseData)
          .select()
          .single();

        if (error) throw error;
        setInspectionId(data.id!);
        savedInspectionId = data.id!;
      }

      if (savedInspectionId && !quoteId) {
        await ensureQuoteStub(savedInspectionId);
      }

      setLastSaved(new Date());
      toast({
        title: 'Saved',
        description: 'Inspection saved successfully',
      });
      return savedInspectionId || inspectionId || null;
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save inspection',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveQuote() {
    const validation = validateQuote(scopeItems);
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return false;
    }

    let resolvedInspectionId = inspectionId;
    let quoteDataForSupabase: ReturnType<typeof transformQuoteToSupabase> | null = null;

    try {
      setIsSaving(true);

      if (!resolvedInspectionId) {
        resolvedInspectionId = await handleSaveInspection();
      }

      if (!resolvedInspectionId) {
        toast({
          title: 'Inspection required',
          description: 'Please save inspection details before saving a quote.',
          variant: 'destructive',
        });
        return false;
      }

      quoteDataForSupabase = transformQuoteToSupabase(
        inspectionData,
        scopeItems,
        quoteData,
        resolvedInspectionId,
        quoteNumber
      );

      if (quoteId) {
        // Update existing
        const { error } = await supabase
          .from('quotes')
          .update(quoteDataForSupabase)
          .eq('id', quoteId);

        if (error) throw error;
        setQuoteNumber(quoteNumber || quoteDataForSupabase.quote_number);
      } else {
        // Create new
        const { data, error } = await supabase
          .from('quotes')
          .insert(quoteDataForSupabase)
          .select()
          .single();

        if (error) throw error;
        setQuoteId(data.id!);
        // Cast to access custom fields
        const savedQuoteResult = data as any;
        setQuoteNumber(savedQuoteResult.quote_number || quoteDataForSupabase.quote_number || '');
      }

      setLastSaved(new Date());
      toast({
        title: 'Saved',
        description: 'Quote saved successfully',
      });
      return true;
    } catch (error) {
      console.error('Save error:', {
        error,
        inspectionId: resolvedInspectionId,
        quoteId,
        payload: quoteDataForSupabase,
      });
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleNext() {
    if (currentStage === 1) {
      const saved = await handleSaveInspection();
      if (saved) {
        setCurrentStage(2);
      }
    } else if (currentStage === 2) {
      const saved = await handleSaveQuote();
      if (saved) {
        setCurrentStage(3);
      }
    }
  }

  function handlePrevious() {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  }

  const progress = (currentStage / STAGES.length) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Inspection & Quote Builder</h1>
            <p className="text-muted-foreground">
              {STAGES[currentStage - 1].description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-sm text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={currentStage === 1 ? handleSaveInspection : handleSaveQuote}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center gap-2 ${
                  stage.id === currentStage
                    ? 'text-primary font-semibold'
                    : stage.id < currentStage
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.id === currentStage
                      ? 'bg-primary text-white'
                      : stage.id < currentStage
                      ? 'bg-green-600 text-white'
                      : 'bg-muted'
                  }`}
                >
                  {stage.id}
                </div>
                <span className="hidden sm:inline">{stage.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <Card className="p-6">
        {currentStage === 1 && (
          <InspectionStep
            data={inspectionData}
            onChange={setInspectionData}
          />
        )}
        {currentStage === 2 && (
          <QuoteStep
            inspectionData={inspectionData}
            quoteData={quoteData}
            scopeItems={scopeItems}
            onQuoteDataChange={setQuoteData}
            onScopeItemsChange={setScopeItems}
          />
        )}
        {currentStage === 3 && (
          <ExportStep
            inspectionData={inspectionData}
            quoteData={quoteData}
            scopeItems={scopeItems}
            inspectionId={inspectionId}
            quoteId={quoteId}
            quoteNumber={quoteNumber}
            leadId={leadContext?.id || null}
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStage < 3 && (
          <Button onClick={handleNext} disabled={isSaving}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
