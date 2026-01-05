import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Briefcase,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { LeadActivityTimeline } from '@/components/LeadActivityTimeline';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Interface matching actual Supabase schema
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  suburb: string;
  source: string;
  stage: string;
  notes: string | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
}

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching lead with ID:', id);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ No lead found with ID:', id);
        toast({
          title: 'Lead Not Found',
          description: 'This lead may have been deleted or you don\'t have permission to view it.',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Lead loaded successfully:', data);
      setLead(data as Lead);
    } catch (error: any) {
      console.error('❌ Error fetching lead:', error);
      toast({
        title: 'Error Loading Lead',
        description: error.message || 'Failed to load lead details. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
      });

      navigate('/admin/crm/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const handleConvertToQuote = () => {
    if (!lead) return;
    
    navigate('/admin/tools/inspection-quote', {
      state: {
        leadId: lead.id,
        leadData: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email || '',
          suburb: lead.suburb,
          service: '',
          message: lead.notes || '',
        },
      },
    });
  };

  const handleUpdateStage = async (newStage: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setLead((prev) => (prev ? { ...prev, stage: newStage } : null));

      toast({
        title: 'Success',
        description: `Lead stage updated to ${newStage}`,
      });
    } catch (error) {
      console.error('Error updating stage:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead stage',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (stage: string) => {
    switch (stage) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Lead not found</p>
        <Button onClick={() => navigate('/admin/crm/leads')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/crm/leads')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lead.name}</h1>
            <p className="text-sm text-muted-foreground">
              Lead created {format(new Date(lead.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleConvertToQuote}>
            <FileText className="mr-2 h-4 w-4" />
            Create Quote
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lead Details</CardTitle>
                <Badge className={getStatusColor(lead.stage)}>{lead.stage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{lead.source}</p>
                  </div>
                </div>
              </div>

              {lead.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{lead.notes}</p>
                  </div>
                </>
              )}

              {lead.lost_reason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Lost Reason</p>
                    <p className="text-sm bg-red-500/10 text-red-500 p-3 rounded-lg">{lead.lost_reason}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStage('qualified')}
                  disabled={lead.stage === 'qualified'}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Qualify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStage('lost')}
                  disabled={lead.stage === 'lost'}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark Lost
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Timeline */}
        <div className="lg:col-span-1">
          <LeadActivityTimeline leadId={lead.id} leadName={lead.name} />
        </div>
      </div>
    </div>
  );
}
