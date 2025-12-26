import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { handleAPIError } from '@/lib/api-error-handler';
import {
  ArrowLeft, Calendar, DollarSign, Mail, MapPin, Phone,
  FileText, User, Loader2, Edit, Send, CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  site_address: string;
  scope: string;
  quote_amount: number;
  created_at: string;
  quote_sent_at: string | null;
  updated_at: string;
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setJob(data);
    } catch (error) {
      handleAPIError(error, 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const handleEdit = () => {
    toast({
      title: 'Coming Soon',
      description: 'Job editing functionality will be available soon.',
    });
  };

  const handleSendQuote = () => {
    toast({
      title: 'Coming Soon',
      description: 'Quote sending functionality will be available soon.',
    });
  };

  const handleMarkComplete = () => {
    toast({
      title: 'Coming Soon',
      description: 'Job completion tracking will be available soon.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Job Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/admin/crm/jobs')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/crm/jobs')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Job Details</h1>
            <p className="text-muted-foreground">
              {job.customer_name} · Created {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {!job.quote_sent_at && (
            <Button onClick={handleSendQuote}>
              <Send className="mr-2 h-4 w-4" />
              Send Quote
            </Button>
          )}
          {job.quote_sent_at && (
            <Button variant="default" onClick={handleMarkComplete}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div>
        {job.quote_sent_at ? (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
            <Send className="h-3 w-3 mr-1" />
            Quote Sent
          </Badge>
        ) : (
          <Badge variant="secondary">
            Draft
          </Badge>
        )}
      </div>

      {/* Customer Information */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base font-semibold">{job.customer_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href={`tel:${job.customer_phone}`}
                  className="text-base font-semibold hover:text-primary transition-colors"
                >
                  {job.customer_phone}
                </a>
              </div>
            </div>
            {job.customer_email && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href={`mailto:${job.customer_email}`}
                    className="text-base font-semibold hover:text-primary transition-colors"
                  >
                    {job.customer_email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Site Address</label>
            <div className="flex items-start gap-2 mt-1">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-base font-semibold">{job.site_address}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Scope of Work</label>
            <p className="text-base mt-1 whitespace-pre-wrap">{job.scope}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Quote Amount</label>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(job.quote_amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="flex-1">
              <p className="font-semibold">Job Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(job.created_at).toLocaleString('en-AU', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>
          {job.quote_sent_at && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="font-semibold">Quote Sent</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(job.quote_sent_at).toLocaleString('en-AU', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-muted mt-2" />
            <div className="flex-1">
              <p className="font-semibold">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {new Date(job.updated_at).toLocaleString('en-AU', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
