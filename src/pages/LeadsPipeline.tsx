import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Phone, Mail, MapPin, DollarSign, FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { LeadDetailDrawer } from '@/components/LeadDetailDrawer';
import { LeadBulkActions } from '@/components/LeadBulkActions';
import { LeadFilters, LeadFilterState } from '@/components/LeadFilters';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  suburb: string;
  service: string;
  status: string;
  message: string | null;
  source: string;
  urgency: string | null;
  ai_score: number | null;
  created_at: string;
  updated_at: string;
}

const stages = [
  { id: 'new', title: 'New', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-purple-500/10 text-purple-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-green-500/10 text-green-500' },
  { id: 'quoted', title: 'Quoted', color: 'bg-yellow-500/10 text-yellow-500' },
  { id: 'won', title: 'Won', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'lost', title: 'Lost', color: 'bg-red-500/10 text-red-500' },
];

export default function LeadsPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filters, setFilters] = useState<LeadFilterState>({
    service: '',
    suburb: '',
    status: '',
    source: '',
    dateFrom: '',
    dateTo: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching leads with filters:', filters);
      
      let query = supabase
        .from('leads')
        .select('*')
        .eq('merge_status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters only if they have non-empty values
      if (filters.status && filters.status !== '' && filters.status !== 'all') {
        console.log('Applying status filter:', filters.status);
        query = query.eq('status', filters.status);
      }
      if (filters.service && filters.service !== '' && filters.service !== 'all') {
        console.log('Applying service filter:', filters.service);
        query = query.eq('service', filters.service);
      }
      if (filters.source && filters.source !== '' && filters.source !== 'all') {
        console.log('Applying source filter:', filters.source);
        query = query.eq('source', filters.source);
      }
      if (filters.suburb && filters.suburb !== '') {
        console.log('Applying suburb filter:', filters.suburb);
        query = query.ilike('suburb', `%${filters.suburb}%`);
      }
      if (filters.dateFrom && filters.dateFrom !== '') {
        console.log('Applying dateFrom filter:', filters.dateFrom);
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo && filters.dateTo !== '') {
        console.log('Applying dateTo filter:', filters.dateTo);
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Fetched leads:', data?.length || 0, 'leads');
      setLeads((data || []) as Lead[]);
    } catch (error: any) {
      console.error('❌ Error fetching leads:', error);
      toast({
        title: 'Error Loading Leads',
        description: error.message || 'Failed to load leads. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent, newStage: string) => {
    event.preventDefault();
    if (!draggedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStage, updated_at: new Date().toISOString() })
        .eq('id', draggedLead.id);

      if (error) throw error;

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === draggedLead.id ? { ...lead, status: newStage } : lead
        )
      );

      // Log activity
      await supabase.from('lead_notes').insert({
        lead_id: draggedLead.id,
        note_type: 'status_change',
        content: `Status changed to ${newStage}`,
      });

      toast({
        title: 'Success',
        description: `Lead moved to ${newStage}`,
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
    }

    setDraggedLead(null);
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setDrawerOpen(true);
  };

  const handleConvertToQuote = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/admin/tools/inspection-quote', {
      state: {
        leadId: lead.id,
        leadData: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email || '',
          suburb: lead.suburb,
          service: lead.service,
          message: lead.message || '',
        },
      },
    });
  };

  const handleToggleSelectLead = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAll = (stage: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const stageLeads = getLeadsByStage(stage);
    const stageLeadIds = stageLeads.map((l) => l.id);
    const allSelected = stageLeadIds.every((id) => selectedLeads.includes(id));

    if (allSelected) {
      setSelectedLeads((prev) => prev.filter((id) => !stageLeadIds.includes(id)));
    } else {
      setSelectedLeads((prev) => [...new Set([...prev, ...stageLeadIds])]);
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(
      (lead) =>
        lead.status === stageId &&
        (searchTerm === '' ||
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm) ||
          (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Drag and drop leads between stages or click to view details
            </p>
          </div>
          <Button onClick={() => navigate('/admin/crm/leads')}>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <LeadBulkActions
            selectedLeads={selectedLeads}
            onActionComplete={() => {
              fetchLeads();
              setSelectedLeads([]);
            }}
            onClearSelection={() => setSelectedLeads([])}
          />
        )}

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, phone, or suburb..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <LeadFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Pipeline Board */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stages.map((stage) => {
              const stageLeads = getLeadsByStage(stage.id);
              const allStageSelected =
                stageLeads.length > 0 && stageLeads.every((l) => selectedLeads.includes(l.id));

              return (
                <div
                  key={stage.id}
                  className="flex flex-col gap-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Stage Header */}
                  <div
                    className={`p-3 rounded-lg ${stage.color} font-semibold flex items-center justify-between border`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allStageSelected}
                        onCheckedChange={(e) => handleSelectAll(stage.id, e as any)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{stage.title}</span>
                    </div>
                    <Badge variant="secondary" className="bg-background/50">
                      {stageLeads.length}
                    </Badge>
                  </div>

                  {/* Lead Cards */}
                  <div className="space-y-2 min-h-[200px]">
                    {stageLeads.length === 0 ? (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-sm text-muted-foreground">
                        No leads in this stage
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <Card
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead)}
                          onClick={() => handleLeadClick(lead.id)}
                          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                        >
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedLeads.includes(lead.id)}
                                  onCheckedChange={(e) => handleToggleSelectLead(lead.id, e as any)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="font-semibold">{lead.name}</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleConvertToQuote(lead, e)}
                                className="h-7 text-xs"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                Quote
                              </Button>
                            </div>

                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{lead.phone}</span>
                              </div>

                              {lead.email && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{lead.suburb}</span>
                              </div>
                            </div>

                            <Badge variant="outline" className="text-xs">
                              {lead.service}
                            </Badge>

                            {lead.ai_score && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">AI Score</span>
                                <Badge variant="secondary">{lead.ai_score}/100</Badge>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        leadId={selectedLeadId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
      </div>
    );
  }
