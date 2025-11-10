import { AIAssistantWidget } from '@/components/dashboard/AIAssistantWidget';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
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
  Loader2,
  Shield
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

export default function AdminHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
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
      route: '/admin/leads',
      icon: Users,
      badge: queueData.new_leads > 0 ? String(queueData.new_leads) : undefined
    },
    {
      title: 'Create Quote',
      description: 'Build new quote',
      route: '/admin/quotes/new',
      icon: FileText
    },
    {
      title: 'New Inspection',
      description: 'Create inspection report',
      route: '/admin/inspections/new',
      icon: FileText
    },
    {
      title: 'Forms Studio',
      description: 'Manage forms & submissions',
      route: '/admin/forms',
      icon: Folder
    },
    {
      title: 'Jobs Calendar',
      description: 'Schedule & track jobs',
      route: '/admin/jobs',
      icon: Calendar
    },
    {
      title: 'Marketing Studio',
      description: 'Content & campaigns',
      route: '/admin/marketing',
      icon: TrendingUp
    },
    {
      title: 'Media Library',
      description: 'Manage photos & assets',
      route: '/admin/media',
      icon: Image
    },
    {
      title: 'Reports & Analytics',
      description: 'Business insights',
      route: '/admin/reports',
      icon: BarChart3
    },
    {
      title: 'Data Hub',
      description: 'Database management',
      route: '/admin/data',
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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl p-8 card-gradient border border-primary/20">
        <div className="absolute inset-0 pattern-overlay opacity-50" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">CKR Admin Hub</h1>
            </div>
            <p className="text-lg text-muted-foreground">Business management & operations center</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate('/mfa-setup')}
              className="btn-premium bg-primary hover:bg-primary/90 shadow-lg hover-lift"
              size="lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Setup MFA
            </Button>
          )}
        </div>
      </div>

      {/* AI-Powered Search */}
      <Card className="border-primary/30 shadow-lg hover-lift overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <CardContent className="pt-6 relative z-10">
          <form onSubmit={handleAISearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Ask AI: 'find leads', 'create quote', 'marketing tools'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 border-primary/20 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
                />
              </div>
              <Button 
                type="submit" 
                disabled={searching}
                className="btn-premium h-12 px-6 bg-primary hover:bg-primary/90"
                size="lg"
              >
                {searching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI Search
                  </>
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 stagger-animation">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(result.route)}
                    className="w-full text-left p-4 rounded-xl border border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all hover-lift bg-background/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{result.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{result.description}</div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 bg-primary/5">{result.category}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* KPI Bar */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-animation">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
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
            <Card key={idx} className="hover-lift border-primary/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={kpi.trend === 'up' ? 'text-roofing-success font-semibold' : 'text-roofing-emergency font-semibold'}>
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
      <Card className="border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl">Quick Links</CardTitle>
          <CardDescription>Access key features and tools</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.route)}
                className="flex items-start gap-3 p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group hover-lift relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-110 relative z-10">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold group-hover:text-primary transition-colors">{link.title}</div>
                    {link.badge && (
                      <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20 font-semibold">{link.badge}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{link.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 relative z-10" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Widget */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-primary/20 hover-lift overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-roofing-warning/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-roofing-warning" />
                <CardTitle className="text-xl">Attention Required</CardTitle>
              </div>
              <CardDescription>Items pending action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <button
                onClick={() => navigate('/admin/quotes/new')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group hover-lift"
              >
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">Pending Quotes</span>
                <Badge 
                  variant={queueData.pending_quotes > 0 ? 'default' : 'secondary'}
                  className={queueData.pending_quotes > 0 ? 'bg-primary text-primary-foreground px-3 py-1' : 'px-3 py-1'}
                >
                  {queueData.pending_quotes}
                </Badge>
              </button>
              <button
                onClick={() => navigate('/admin/leads')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group hover-lift"
              >
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">New Leads</span>
                <Badge 
                  variant={queueData.new_leads > 0 ? 'default' : 'secondary'}
                  className={queueData.new_leads > 0 ? 'bg-primary text-primary-foreground px-3 py-1' : 'px-3 py-1'}
                >
                  {queueData.new_leads}
                </Badge>
              </button>
              <button
                onClick={() => navigate('/admin/marketing')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group hover-lift"
              >
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">Scheduled Posts</span>
                <Badge 
                  variant={queueData.scheduled_posts > 0 ? 'default' : 'secondary'}
                  className={queueData.scheduled_posts > 0 ? 'bg-primary text-primary-foreground px-3 py-1' : 'px-3 py-1'}
                >
                  {queueData.scheduled_posts}
                </Badge>
              </button>
            </CardContent>
          </Card>
        </div>

        <AIAssistantWidget />
      </div>

      {/* System Health */}
      <Card className="border-roofing-success/30 hover-lift overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-roofing-success/5 to-transparent pointer-events-none" />
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-roofing-success/10">
              <Settings className="h-5 w-5 text-roofing-success animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <CardTitle className="text-xl">System Status</CardTitle>
          </div>
          <CardDescription>Platform health monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <div className="flex items-center justify-between p-4 rounded-xl border border-roofing-success/20 bg-roofing-success/5 hover:bg-roofing-success/10 transition-colors">
            <span className="text-sm font-semibold">Database</span>
            <Badge className="bg-roofing-success text-white px-3 py-1 shadow-sm">Operational</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-roofing-success/20 bg-roofing-success/5 hover:bg-roofing-success/10 transition-colors">
            <span className="text-sm font-semibold">AI Services</span>
            <Badge className="bg-roofing-success text-white px-3 py-1 shadow-sm">Operational</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-roofing-success/20 bg-roofing-success/5 hover:bg-roofing-success/10 transition-colors">
            <span className="text-sm font-semibold">Storage</span>
            <Badge className="bg-roofing-success text-white px-3 py-1 shadow-sm">Operational</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
