import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { noteLeadQuoteLink, updateLeadStage } from '@/admin/services/pipeline';
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
  QuoteRowGenerated,
  LeadContext,
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

export function InspectionQuoteBuilder() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStage, setCurrentStage] = useState(1);
  const [inspectionData, setInspectionData] = useState<InspectionData>(emptyInspection);
  const [quoteData, setQuoteData] = useState<QuoteData>(emptyQuote);
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([]);
  const [inspectionId, setInspectionId] = useState<string | null>(id || null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [existingQuote, setExistingQuote] = useState<QuoteRowGenerated | null>(null);
  const [leadContext, setLeadContext] = useState<LeadContext | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);

  // Load existing inspection/quote if ID provided
  useEffect(() => {
    if (id) {
      loadExistingData(id);
    }
  }, [id]);

  useEffect(() => {
    const leadId = searchParams.get('leadId');
    if (leadId) {
      loadLeadContext(leadId);
    }
  }, [searchParams]);

  async function syncLeadPipeline(leadId: string, savedQuoteId: string | null) {
    try {
      await updateLeadStage(leadId, 'quoted');
      await noteLeadQuoteLink(leadId, { inspectionId, quoteId: savedQuoteId });
    } catch (error) {
      console.error('Failed to sync lead pipeline', error);
    }
  }

  async function loadLeadContext(leadId: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, phone, suburb, service')
        .eq('id', leadId)
        .single();

      if (error) throw error;

      setLeadContext({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        suburb: data.suburb,
        service: data.service,
      });

      setInspectionData((current) => ({
        ...current,
        lead_id: data.id,
        client_name: current.client_name || data.name || '',
        phone: current.phone || data.phone || '',
        email: current.email || data.email || '',
        suburb: current.suburb || data.suburb || '',
      }));
    } catch (error) {
      console.error('Error loading lead context:', error);
      toast({
        title: 'Lead link failed',
        description: 'Could not load linked lead details for this quote.',
        variant: 'destructive',
      });
    }
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (inspectionId && currentStage >= 1) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [inspectionId, inspectionData, scopeItems, currentStage]);

  async function loadExistingData(recordId: string) {
    try {
      setIsLoading(true);

      // Try to load as inspection first
      const { data: inspection, error: inspError } = await supabase
        .from('inspection_reports')
        .select('*')
        .eq('id', recordId)
        .single();

      if (inspection && !inspError) {
        setInspectionData(transformSupabaseToInspection(inspection));
        setInspectionId(inspection.id!);

        // Check if there's a linked quote
        const { data: quote } = await supabase
          .from('quotes')
          .select('*')
          .eq('inspection_report_id', inspection.id)
          .single();

        if (quote) {
          setQuoteId(quote.id!);
          setExistingQuote(quote);
          const scope = (quote.scope as Record<string, string>) || {};
          if (scope.lead_id || scope.lead_name) {
            setLeadContext({
              id: scope.lead_id,
              name: scope.lead_name,
              suburb: scope.lead_suburb,
              service: scope.lead_service,
              email: quote.email || inspectionData.email,
            });
          }
          setQuoteData(current => ({
            ...current,
            primary_service: scope.primary_service || current.primary_service,
            document_type: (scope.document_type as QuoteData['document_type']) ||
              current.document_type,
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
        }

        toast({
          title: 'Loaded successfully',
          description: 'Inspection data loaded',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAutoSave() {
    if (!inspectionId) return;

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

  async function handleSaveInspection() {
    const validation = validateInspection(inspectionData);
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSaving(true);
      const supabaseData = transformInspectionToSupabase(inspectionData);

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
      }

      setLastSaved(new Date());
      toast({
        title: 'Saved',
        description: 'Inspection saved successfully',
      });
      return true;
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save inspection',
        variant: 'destructive',
      });
      return false;
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

    try {
      setIsSaving(true);
      const quoteDataForSupabase = transformQuoteToSupabase(
        inspectionData,
        scopeItems,
        quoteData,
        inspectionId || undefined,
        existingQuote,
        leadContext
      );

      let savedQuoteId = quoteId || null;

      if (quoteId) {
        // Update existing
        const { error } = await supabase
          .from('quotes')
          .update(quoteDataForSupabase)
          .eq('id', quoteId);

        if (error) throw error;
        savedQuoteId = quoteId;
        setExistingQuote(prev => ({
          ...(prev || {}),
          ...(quoteDataForSupabase as QuoteRowGenerated),
          id: quoteId,
        }));
      } else {
        // Create new
        const { data, error } = await supabase
          .from('quotes')
          .insert(quoteDataForSupabase)
          .select()
          .single();

        if (error) throw error;
        savedQuoteId = data.id || null;
        setQuoteId(data.id!);
        setExistingQuote(data);
      }

      if (leadContext?.id) {
        syncLeadPipeline(leadContext.id, savedQuoteId);
      }

      setLastSaved(new Date());
      toast({
        title: 'Saved',
        description: 'Quote saved successfully',
      });
      return true;
    } catch (error) {
      console.error('Save error:', error);
      const message = (error as { message?: string }).message || 'Failed to save quote';
      toast({
        title: 'Error',
        description: message,
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
            leadContext={leadContext}
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
