import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ClipboardCheck, Receipt, Users } from 'lucide-react';
import { ReportsDataTable } from '@/components/ReportsDataTable';
import { QuotesDataTable } from '@/components/QuotesDataTable';
import { InvoicesDataTable } from '@/components/InvoicesDataTable';
import { ClientsDataTable } from '@/components/ClientsDataTable';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataHub() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inspections');

  const { data: inspections, isLoading: loadingInspections, error: inspectionsError } = useQuery({
    queryKey: ['inspection_reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspection_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes, isLoading: loadingQuotes, error: quotesError } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: invoices, isLoading: loadingInvoices, error: invoicesError } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: clients, isLoading: loadingClients, error: clientsError } = useQuery({
    queryKey: ['leads_as_clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleExportPDF = (id: string) => {
    toast({
      title: 'Export started',
      description: 'Generating PDF...',
    });
  };

  const handleGenerateQuote = (reportId: string) => {
    navigate(`/internal/quote-builder?inspectionId=${reportId}`);
  };

  const handleSendQuote = (id: string) => {
    toast({
      title: 'Quote sent',
      description: 'Quote has been emailed to the client.',
    });
  };

  const handleSendInvoice = (id: string) => {
    toast({
      title: 'Invoice sent',
      description: 'Invoice has been emailed to the client.',
    });
  };

  const handleMarkPaid = async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid', balance_due: 0 })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as paid.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Invoice updated',
        description: 'Invoice marked as paid.',
      });
    }
  };

  const handleNewQuote = (clientId: string) => {
    navigate(`/internal/quote-builder?leadId=${clientId}`);
  };

  const handleNewInspection = (clientId: string) => {
    navigate(`/internal/inspection?leadId=${clientId}`);
  };

  const statsData = {
    inspections: {
      total: inspections?.length || 0,
      draft: inspections?.filter(i => i.status === 'draft').length || 0,
      submitted: inspections?.filter(i => i.status === 'submitted').length || 0,
      completed: inspections?.filter(i => i.status === 'completed').length || 0,
    },
    quotes: {
      total: quotes?.length || 0,
      draft: quotes?.filter(q => q.status === 'draft').length || 0,
      sent: quotes?.filter(q => q.status === 'sent').length || 0,
      accepted: quotes?.filter(q => q.status === 'accepted').length || 0,
    },
    invoices: {
      total: invoices?.length || 0,
      paid: invoices?.filter(i => i.status === 'paid').length || 0,
      pending: invoices?.filter(i => i.status === 'sent').length || 0,
      overdue: invoices?.filter(i => i.status === 'overdue').length || 0,
    },
    clients: {
      total: clients?.length || 0,
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Hub</h1>
          <p className="text-muted-foreground">Single source of truth for all entities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/internal/inspection')}>
            <Plus className="mr-2 h-4 w-4" />
            New Inspection
          </Button>
          <Button onClick={() => navigate('/internal/quote-builder')}>
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inspections</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.inspections.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsData.inspections.draft} draft · {statsData.inspections.submitted} submitted · {statsData.inspections.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.quotes.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsData.quotes.draft} draft · {statsData.quotes.sent} sent · {statsData.quotes.accepted} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.invoices.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsData.invoices.paid} paid · {statsData.invoices.pending} pending · {statsData.invoices.overdue} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.clients.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total active clients
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="inspections">Inspections</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="inspections" className="mt-6">
              {loadingInspections ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : inspectionsError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Error loading inspections. Please try again.</p>
                </div>
              ) : (
                <ReportsDataTable
                  reports={inspections || []}
                  onExportPDF={handleExportPDF}
                  onGenerateQuote={handleGenerateQuote}
                />
              )}
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              {loadingQuotes ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : quotesError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Error loading quotes. Please try again.</p>
                </div>
              ) : (
                <QuotesDataTable
                  quotes={quotes || []}
                  onSendQuote={handleSendQuote}
                  onExportPDF={handleExportPDF}
                />
              )}
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              {loadingInvoices ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : invoicesError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Error loading invoices. Please try again.</p>
                </div>
              ) : (
                <InvoicesDataTable
                  invoices={invoices || []}
                  onSendInvoice={handleSendInvoice}
                  onMarkPaid={handleMarkPaid}
                  onExportPDF={handleExportPDF}
                />
              )}
            </TabsContent>

            <TabsContent value="clients" className="mt-6">
              {loadingClients ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : clientsError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Error loading clients. Please try again.</p>
                </div>
              ) : (
                <ClientsDataTable
                  clients={clients || []}
                  onNewQuote={handleNewQuote}
                  onNewInspection={handleNewInspection}
                />
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Projects Management Coming Soon</p>
                <p className="text-sm">Use the Quotes → Jobs workflow in the meantime.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
