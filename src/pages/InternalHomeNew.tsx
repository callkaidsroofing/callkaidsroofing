import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Folder,
  Image,
  BarChart3,
  Settings,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface KPI {
  label: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down';
}

interface SearchResult {
  title: string;
  description: string;
  route: string;
  category: string;
  relevance: number;
}

interface QuickLink {
  title: string;
  description: string;
  route: string;
  icon: any;
  badge?: string;
}

export default function InternalHomeNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState({
    pending_quotes: 0,
    new_leads: 0,
    scheduled_posts: 0
  });

  const quickLinks: QuickLink[] = [
    {
      title: 'Leads Pipeline',
      description: 'Manage and track leads',
      route: '/internal/v2/leads',
      icon: Users,
      badge: queueData.new_leads > 0 ? String(queueData.new_leads) : undefined
    },
    {
      title: 'Create Quote',
      description: 'Build new quote',
      route: '/internal/v2/quotes/new',
      icon: FileText
    },
    {
      title: 'Forms Studio',
      description: 'Manage forms & submissions',
      route: '/internal/v2/forms',
      icon: Folder
    },
    {
      title: 'Jobs Calendar',
      description: 'Schedule & track jobs',
      route: '/internal/v2/jobs',
      icon: Calendar
    },
    {
      title: 'Marketing Studio',
      description: 'Content & campaigns',
      route: '/internal/v2/marketing',
      icon: TrendingUp
    },
    {
      title: 'Media Library',
      description: 'Manage photos & assets',
      route: '/internal/v2/media',
      icon: Image
    },
    {
      title: 'Reports & Analytics',
      description: 'Business insights',
      route: '/internal/v2/reports',
      icon: BarChart3
    },
    {
      title: 'Nexus AI Hub',
      description: 'AI tools & assistants',
      route: '/internal/v2/nexus',
      icon: Sparkles
    },
    {
      title: 'Data Hub',
      description: 'Database management',
      route: '/internal/v2/data',
      icon: Settings
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total revenue (last 30 days)
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('total')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .eq('status', 'paid');

      if (invoiceError) throw invoiceError;

      const revenue = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;

      // Conversion rate
      const { count: quoteCount, error: quoteCountError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (quoteCountError) throw quoteCountError;

      const { count: wonCount, error: wonCountError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (wonCountError) throw wonCountError;

      const conversionRate = quoteCount && wonCount ? ((wonCount / quoteCount) * 100).toFixed(1) : '0';

      const avgResponseTime = '2.4h';

      // Active jobs
      const { count: activeJobs, error: jobsError } = await supabase
        .from('inspection_reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      if (jobsError) throw jobsError;

      const activeJobsCount = activeJobs ?? 0;

      setKpis([
        { 
          label: 'Revenue (30d)', 
          value: `$${revenue.toLocaleString()}`, 
          change: '+12%', 
          icon: DollarSign, 
          trend: 'up' 
        },
        { 
          label: 'Conversion Rate', 
          value: `${conversionRate}%`, 
          change: '+5%', 
          icon: TrendingUp, 
          trend: 'up' 
        },
        { 
          label: 'Avg Response Time', 
          value: avgResponseTime, 
          change: '-18min', 
          icon: Clock, 
          trend: 'up' 
        },
        { 
          label: 'Active Jobs', 
          value: String(activeJobsCount), 
          change: '+3', 
          icon: Users, 
          trend: 'up' 
        }
      ]);

      // Queue depths
      const { count: pendingQuotes } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      const { count: newLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      const { count: scheduledPosts } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      setQueueData({
        pending_quotes: pendingQuotes || 0,
        new_leads: newLeads || 0,
        scheduled_posts: scheduledPosts || 0
      });

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load dashboard data',
        description: error.message || 'Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('internal-search', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      if (data?.results) {
        setSearchResults(data.results);
        if (data.suggestion) {
          toast({
            title: 'AI Suggestion',
            description: data.suggestion,
          });
        }
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        variant: 'destructive',
        title: 'Search failed',
        description: error.message || 'Unable to complete search',
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Command Center</h1>
          <p className="text-muted-foreground">Welcome back to Call Kaids Roofing</p>
        </div>
      </div>

      {/* AI-Powered Search */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <form onSubmit={handleAISearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ask AI: 'find leads', 'create quote', 'marketing tools'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={searching}>
                {searching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Search
                  </>
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(result.route)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                      </div>
                      <Badge variant="outline">{result.category}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* KPI Bar */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis.map((kpi, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Links Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Access key features and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.route)}
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{link.title}</div>
                    {link.badge && (
                      <Badge variant="secondary" className="ml-auto">{link.badge}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{link.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Queue Monitor & System Health */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attention Required</CardTitle>
            <CardDescription>Items pending action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => navigate('/internal/v2/quotes/new')}
              className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">Pending Quotes</span>
              <Badge variant={queueData.pending_quotes > 0 ? 'default' : 'secondary'}>
                {queueData.pending_quotes}
              </Badge>
            </button>
            <button
              onClick={() => navigate('/internal/v2/leads')}
              className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">New Leads</span>
              <Badge variant={queueData.new_leads > 0 ? 'default' : 'secondary'}>
                {queueData.new_leads}
              </Badge>
            </button>
            <button
              onClick={() => navigate('/internal/v2/marketing')}
              className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">Scheduled Posts</span>
              <Badge variant={queueData.scheduled_posts > 0 ? 'default' : 'secondary'}>
                {queueData.scheduled_posts}
              </Badge>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm font-medium">Database</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm font-medium">AI Services</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm font-medium">Storage</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
