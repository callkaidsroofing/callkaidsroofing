import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, Briefcase, Tag, Calendar, FileText, ExternalLink } from 'lucide-react';
import { LeadActivityTimeline } from '@/components/LeadActivityTimeline';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  suburb: string;
  service: string;
  message: string | null;
  status: string;
  source: string;
  urgency: string | null;
  ai_score: number | null;
  created_at: string;
}

interface LeadDetailDrawerProps {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailDrawer({ leadId, open, onOpenChange }: LeadDetailDrawerProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (leadId && open) {
      fetchLead();
    }
  }, [leadId, open]);

  const fetchLead = async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lead details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToQuote = () => {
    if (!lead) return;

    navigate('/internal/v2/quotes/new', {
      state: {
        fromLead: true,
        leadData: {
          clientName: lead.name,
          phone: lead.phone,
          email: lead.email || '',
          suburb: lead.suburb,
          service: lead.service,
          message: lead.message || '',
        },
      },
    });

    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contacted':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'qualified':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'quoted':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'won':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'lost':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (!lead && !loading) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl mb-2">{lead?.name || 'Loading...'}</SheetTitle>
              {lead && (
                <p className="text-sm text-muted-foreground">
                  Created {format(new Date(lead.created_at), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            {lead && (
              <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
            )}
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        ) : lead ? (
          <ScrollArea className="flex-1">
            <div className="px-6 pb-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>

                {lead.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Suburb</p>
                    <p className="font-medium">{lead.suburb}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{lead.service}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{lead.source}</p>
                  </div>
                </div>

                {lead.urgency && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Urgency</p>
                      <p className="font-medium capitalize">{lead.urgency}</p>
                    </div>
                  </div>
                )}
              </div>

              {lead.message && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{lead.message}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${lead.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
                {lead.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                )}
                <Button variant="default" size="sm" onClick={handleConvertToQuote} className="col-span-2">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Quote
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate(`/internal/v2/leads/${lead.id}`);
                    onOpenChange(false);
                  }}
                  className="col-span-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Full Details
                </Button>
              </div>

              <Separator />

              {/* Activity Timeline */}
              <div className="min-h-[300px]">
                <LeadActivityTimeline leadId={lead.id} leadName={lead.name} />
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
