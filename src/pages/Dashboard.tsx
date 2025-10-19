import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, LayoutGrid, List, Calendar, Download } from 'lucide-react';
import { ReportCard } from '@/components/ReportCard';
import { ProfessionalQuoteBuilder } from '@/components/ProfessionalQuoteBuilder';
import { ReportsDataTable } from '@/components/ReportsDataTable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InspectionReport {
  id: string;
  created_at: string;
  clientName: string;
  siteAddress: string;
  suburbPostcode: string;
  status: string;
  priority: string;
  date: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<InspectionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [professionalBuilderOpen, setProfessionalBuilderOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, priorityFilter, dateFrom, dateTo]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('inspection_reports')
        .select('id, created_at, clientName, siteAddress, suburbPostcode, status, priority, date')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inspection reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.siteAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.suburbPostcode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date || report.created_at);
        return reportDate >= new Date(dateFrom);
      });
    }

    if (dateTo) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date || report.created_at);
        return reportDate <= new Date(dateTo);
      });
    }

    setFilteredReports(filtered);
  };


  const handleExportPDF = (reportId: string) => {
    const reportWindow = window.open(`/internal/reports/${reportId}`, '_blank');
    reportWindow?.addEventListener('load', () => {
      reportWindow.print();
    });
  };

  const handleGenerateQuote = (reportId: string) => {
    setSelectedReportId(reportId);
    setProfessionalBuilderOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Client', 'Address', 'Suburb', 'Status', 'Priority', 'Date'];
    const rows = filteredReports.map(report => [
      report.clientName,
      report.siteAddress,
      report.suburbPostcode,
      report.status || 'Draft',
      report.priority || '',
      report.date ? new Date(report.date).toLocaleDateString('en-AU') : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Reports exported to CSV',
    });
  };

  return (
    <AuthGuard requireInspector>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inspection Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all inspection reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
              <TabsList>
                <TabsTrigger value="grid">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="table">
                  <List className="h-4 w-4 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <Input
            placeholder="Search by client name, address, suburb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:max-w-sm"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="lg:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="lg:w-48">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From date"
              className="lg:w-40"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To date"
              className="lg:w-40"
            />
          </div>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setDateFrom('');
                setDateTo('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Reports View */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || dateFrom || dateTo
                ? 'Try adjusting your search or filters'
                : 'Create your first inspection report to get started'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <ReportsDataTable
            reports={filteredReports}
            onExportPDF={handleExportPDF}
            onGenerateQuote={handleGenerateQuote}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={() => navigate(`/internal/reports/${report.id}`)}
                onEdit={() => navigate(`/internal/inspection?id=${report.id}`)}
                onExportPDF={() => handleExportPDF(report.id)}
                onGenerateQuote={() => handleGenerateQuote(report.id)}
              />
            ))}
          </div>
        )}

      {/* Professional Quote Builder */}
      {selectedReportId && (
        <ProfessionalQuoteBuilder
          open={professionalBuilderOpen}
          onOpenChange={setProfessionalBuilderOpen}
          reportId={selectedReportId}
        />
      )}
      </div>
    </AuthGuard>
  );
}
