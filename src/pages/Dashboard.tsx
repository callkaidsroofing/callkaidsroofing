import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, LogOut, FileText } from 'lucide-react';
import logoMain from '@/assets/call-kaids-logo-main.png';
import { ReportCard } from '@/components/ReportCard';
import { QuoteBuilderDialog } from '@/components/QuoteBuilderDialog';

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
  const [quoteBuilderOpen, setQuoteBuilderOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter]);

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

    setFilteredReports(filtered);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleExportPDF = (reportId: string) => {
    const reportWindow = window.open(`/internal/reports/${reportId}`, '_blank');
    reportWindow?.addEventListener('load', () => {
      reportWindow.print();
    });
  };

  const handleGenerateQuote = (reportId: string) => {
    setSelectedReportId(reportId);
    setQuoteBuilderOpen(true);
  };

  return (
    <AuthGuard requireInspector>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={logoMain} alt="Call Kaids Roofing" className="h-12" />
                <div>
                  <h1 className="text-xl font-bold">Inspection Dashboard</h1>
                  <p className="text-sm text-muted-foreground">ABN 39475055075</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Button onClick={() => navigate('/internal/inspection')} className="md:w-auto w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection Report
            </Button>
            
            <div className="flex-1 flex flex-col md:flex-row gap-3">
              <Input
                placeholder="Search by client name, address, suburb..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:max-w-sm"
              />
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by status" />
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
            </div>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first inspection report to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </main>

        {/* Quote Builder Dialog */}
        {selectedReportId && (
          <QuoteBuilderDialog
            open={quoteBuilderOpen}
            onOpenChange={setQuoteBuilderOpen}
            reportId={selectedReportId}
          />
        )}
      </div>
    </AuthGuard>
  );
}
