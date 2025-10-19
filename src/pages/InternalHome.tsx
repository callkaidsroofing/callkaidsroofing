import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Plus,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardMetrics {
  totalReports: number;
  reportsThisMonth: number;
  totalQuotes: number;
  quotesThisMonth: number;
  totalRevenue: number;
  avgQuoteValue: number;
  completedReports: number;
  draftReports: number;
}

export default function InternalHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalReports: 0,
    reportsThisMonth: 0,
    totalQuotes: 0,
    quotesThisMonth: 0,
    totalRevenue: 0,
    avgQuoteValue: 0,
    completedReports: 0,
    draftReports: 0,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current month start date
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch inspection reports
      const { data: reports, error: reportsError } = await supabase
        .from('inspection_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Fetch quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Calculate metrics
      const reportsThisMonth = reports?.filter(r => new Date(r.created_at) >= new Date(firstDayOfMonth)).length || 0;
      const quotesThisMonth = quotes?.filter(q => new Date(q.created_at) >= new Date(firstDayOfMonth)).length || 0;
      const totalRevenue = quotes?.reduce((sum, q) => sum + parseFloat(String(q.total) || '0'), 0) || 0;
      const avgQuoteValue = quotes?.length ? totalRevenue / quotes.length : 0;
      const completedReports = reports?.filter(r => r.status === 'completed').length || 0;
      const draftReports = reports?.filter(r => r.status === 'draft').length || 0;

      setMetrics({
        totalReports: reports?.length || 0,
        reportsThisMonth,
        totalQuotes: quotes?.length || 0,
        quotesThisMonth,
        totalRevenue,
        avgQuoteValue,
        completedReports,
        draftReports,
      });

      setRecentReports(reports?.slice(0, 5) || []);
      setRecentQuotes(quotes?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard metrics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireInspector>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireInspector>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your business at a glance.
            </p>
          </div>
          <Button onClick={() => navigate('/internal/inspection')}>
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalReports}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{metrics.reportsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quotes
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalQuotes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{metrics.quotesThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Quote Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.avgQuoteValue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average per quote
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completedReports}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.draftReports} in draft
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Inspection Reports</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/internal/dashboard')}
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reports yet
                  </p>
                ) : (
                  recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-all hover:shadow-sm animate-fade-in"
                      onClick={() => navigate(`/internal/reports/${report.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{report.clientName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {report.siteAddress}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(report.created_at).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                      <Badge variant={report.status === 'completed' ? 'default' : 'outline'}>
                        {report.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Quotes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/internal/quotes')}
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQuotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No quotes yet
                  </p>
                ) : (
                  recentQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-all hover:shadow-sm animate-fade-in"
                      onClick={() => navigate('/internal/quotes')}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{quote.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {quote.quote_number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(quote.created_at).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          ${parseFloat(quote.total).toFixed(2)}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {quote.tier_level}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}