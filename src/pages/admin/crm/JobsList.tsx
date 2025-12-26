import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Loader2, Send, Phone, Mail, MapPin, DollarSign, Plus } from 'lucide-react';
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
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive',
      });
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

  const getTotalValue = () => {
    return jobs.reduce((sum, job) => sum + Number(job.quote_amount), 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Jobs & Quotes
            </h1>
            <p className="text-muted-foreground">
              {jobs.length} total jobs · {formatCurrency(getTotalValue())} total value
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/admin/tools/quick-quote')}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {jobs.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatCurrency(getTotalValue())}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Quotes Sent</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {jobs.filter(j => j.quote_sent_at).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>Complete list of quotes and job records</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first quote to get started
              </p>
              <Button
                onClick={() => navigate('/admin/tools/quick-quote')}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Quote
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Site Address</TableHead>
                    <TableHead>Quote Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="group hover:bg-primary/5">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            {job.customer_name}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            {job.customer_phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3" />
                                <a
                                  href={`tel:${job.customer_phone}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {job.customer_phone}
                                </a>
                              </div>
                            )}
                            {job.customer_email && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3" />
                                <a
                                  href={`mailto:${job.customer_email}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {job.customer_email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1.5 max-w-xs">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm line-clamp-2">{job.site_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">
                            {formatCurrency(job.quote_amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.quote_sent_at ? (
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                            <Send className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(job.created_at).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigate(`/admin/crm/jobs/${job.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
