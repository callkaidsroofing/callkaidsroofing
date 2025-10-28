import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, Filter, Plus, Phone, Mail, MapPin, 
  Calendar, DollarSign, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  service: string;
  stage?: string;
  value_band?: string;
  next_activity_date?: string;
  tags?: any;
  urgency?: string;
  created_at: string;
}

const stages = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-purple-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-orange-500' },
  { id: 'quoted', title: 'Quoted', color: 'bg-cyan-500' },
  { id: 'won', title: 'Won', color: 'bg-green-500' },
  { id: 'lost', title: 'Lost', color: 'bg-gray-400' },
];

export default function LeadsPipeline() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data || []) as Lead[]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStage: string) => {
    if (!draggedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage } as any)
        .eq('id', draggedLead);

      if (error) throw error;

      // Log activity
      await supabase.from('activities' as any).insert({
        entity_type: 'lead',
        entity_id: draggedLead,
        activity_type: 'status_changed',
        data: { new_status: newStage },
      });

      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setDraggedLead(null);
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => 
      (lead.stage || 'new') === stageId &&
      (searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm))
    );
  };

  const getValueBandIcon = (band?: string) => {
    if (!band) return null;
    const count = band === 'high' ? 3 : band === 'medium' ? 2 : 1;
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <DollarSign key={i} className="h-3 w-3 text-green-600" />
        ))}
      </div>
    );
  };

  return (
    <AppShell>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Leads Pipeline</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage and track your leads through the sales pipeline
            </p>
          </div>
          <Button onClick={() => navigate('/internal/v2/leads/new')} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Kanban Board - Horizontal scroll on mobile */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0 pb-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            
            return (
              <div
                key={stage.id}
                className="flex flex-col min-h-[400px] md:min-h-[600px] flex-shrink-0 w-72 md:w-auto"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className={cn("w-2 h-2 md:w-3 md:h-3 rounded-full", stage.color)} />
                  <h3 className="font-semibold text-sm md:text-base">{stage.title}</h3>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stageLeads.length}
                  </Badge>
                </div>

                {/* Lead Cards */}
                <div className="flex-1 space-y-1.5 md:space-y-2 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onClick={() => navigate(`/internal/v2/leads/${lead.id}`)}
                      className={cn(
                        "p-2.5 md:p-3 cursor-pointer hover:shadow-md transition-all active:scale-95",
                        draggedLead === lead.id && "opacity-50"
                      )}
                    >
                      {/* Lead Header */}
                      <div className="flex items-start justify-between gap-2 mb-1.5 md:mb-2">
                        <h4 className="font-semibold text-xs md:text-sm line-clamp-1">{lead.name}</h4>
                        {lead.urgency === 'urgent' && (
                          <Flame className="h-3 w-3 md:h-4 md:w-4 text-destructive shrink-0" />
                        )}
                      </div>

                      {/* Service & Suburb */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{lead.suburb}</span>
                      </div>

                      <Badge variant="outline" className="text-xs mb-2">
                        {lead.service}
                      </Badge>

                      {/* Value Band */}
                      {lead.value_band && (
                        <div className="mb-2">
                          {getValueBandIcon(lead.value_band)}
                        </div>
                      )}

                      {/* Next Activity */}
                      {lead.next_activity_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(lead.next_activity_date), { addSuffix: true })}
                          </span>
                        </div>
                      )}

                      {/* Age */}
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </div>

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {lead.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
