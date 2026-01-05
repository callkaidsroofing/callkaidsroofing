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
  Shield,
  Plus,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { RAGSearchBar } from '@/components/admin/RAGSearchBar';
import { useQueryClient } from '@tanstack/react-query';

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
      title: 'Leads',
      description: 'Pipeline management',
      route: '/admin/crm/leads',
      icon: Users,
      badge: queueData.new_leads > 0 ? String(queueData.new_leads) : undefined,
    },
    {
      title: 'Inspection & Quote',
      description: 'Start unified builder',
      route: '/admin/tools/inspection-quote',
      icon: FileText,
    },
    {
      title: 'Quotes',
      description: 'Track drafts & sent',
      route: '/admin/crm/quotes',
      icon: DollarSign,
    },
    {
      title: 'Jobs',
      description: 'Schedule & crews',
      route: '/admin/crm/jobs',
      icon: Calendar,
    },
    {
      title: 'Marketing',
      description: 'Campaigns',
      route: '/admin/content/marketing',
      icon: TrendingUp,
    },
    {
      title: 'Media',
      description: 'Assets',
      route: '/admin/content/media',
      icon: Image,
    },
    {
      title: 'Reports',
      description: 'Analytics',
      route: '/admin/crm/reports',
      icon: BarChart3,
    },
    {
      title: 'Data',
      description: 'Database',
      route: '/admin/cms/data',
      icon: Settings,
    },
  ];

  const queryClient = useQueryClient();

  useEffect(() => {
    loadDashboardData();
    
    // Prefetch top admin routes after 2 seconds
    const prefetchTimer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['leads-pipeline'],
        queryFn: async () => {
          const { data } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
          return data;
        },
      });
      
      queryClient.prefetchQuery({
        queryKey: ['quotes-list'],
        queryFn: async () => {
          const { data } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
          return data;
        },
      });
    }, 2000);

    return () => clearTimeout(prefetchTimer);
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
        .eq('stage', 'new');

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
      {/* Enhanced Hero Header with Animated Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl group">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Animated particles effect */}
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Animated icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/30 shadow-lg">
                  <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                  CKR Admin Hub
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-1 font-medium">
                  Business management & operations center
                </p>
              </div>
            </div>
            
            {/* Stats preview */}
            <div className="flex gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
                <div className="text-2xl font-bold text-primary">{kpis[0]?.value || '...'}</div>
                <div className="text-xs text-muted-foreground">Revenue (30d)</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
                <div className="text-2xl font-bold text-primary">{kpis[3]?.value || '...'}</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/admin/crm/leads')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-xl shadow-primary/30 hover-lift transition-all duration-300 border-0"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span className="font-semibold">New Lead</span>
            </Button>

            <Button
              onClick={() => navigate('/admin/tools/inspection-quote')}
              variant="outline"
              className="bg-background/80 hover:bg-primary/10 border-primary/30 shadow-lg"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <span className="font-semibold">Start Inspection & Quote</span>
            </Button>

            {isAdmin && (
              <Button
                onClick={() => navigate('/mfa-setup')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl shadow-primary/30 hover-lift transition-all duration-300 border-0"
                size="lg"
              >
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-semibold">Setup MFA</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* RAG-Powered Knowledge Search */}
      <Card className="border-2 border-primary/30 shadow-2xl hover-lift overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Knowledge Search</CardTitle>
              <CardDescription>Search across pricing, services, knowledge base, and case studies</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <RAGSearchBar
            placeholder="Search: 'ridge capping costs', 'tile replacement process', 'warranty terms'..."
            onResultSelect={(result) => {
              toast({
                title: "Knowledge Retrieved",
                description: result.title,
              });
            }}
          />
        </CardContent>
      </Card>

      {/* Legacy Admin Search */}
      <Card className="border-primary/20 shadow-xl hover-lift overflow-hidden relative group">
        {/* Gradient background with animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="pt-6 relative z-10">
          <form onSubmit={handleAISearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                {/* Icon with glow effect */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                  <Search className="relative h-5 w-5 text-primary" />
                </div>
                <Input
                  placeholder="Ask AI: 'find leads', 'create quote', 'marketing tools'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-primary/30 focus:border-primary/60 bg-card/50 backdrop-blur-xl text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
              <Button 
                type="submit" 
                disabled={searching}
                className="h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl shadow-primary/30 hover-lift transition-all duration-300 font-semibold"
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
              <div className="space-y-2 stagger-animation mt-6">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(result.route)}
                    className="w-full text-left p-4 rounded-xl border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 hover-lift bg-card/50 backdrop-blur-sm group/item relative overflow-hidden"
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/item:translate-x-full" />
                    
                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors">{result.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{result.description}</div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-medium">
                        {result.category}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Enhanced KPI Bar with Animated Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-animation">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis.map((kpi, idx) => (
            <Card key={idx} className="hover-lift border-primary/20 overflow-hidden relative group cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {kpi.label}
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-2">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    kpi.trend === 'up' 
                      ? 'bg-roofing-success/10 text-roofing-success' 
                      : 'bg-roofing-emergency/10 text-roofing-emergency'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                    {kpi.change}
                  </div>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </Card>
          ))
        )}
      </div>

      {/* Enhanced Quick Links Grid with 3D Effects */}
      <Card className="border-primary/20 overflow-hidden shadow-xl relative group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <CardHeader className="relative z-10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quick Links
              </CardTitle>
              <CardDescription className="mt-1 font-medium">Access key features and tools</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-animation">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.route)}
                className="flex flex-col gap-3 p-5 rounded-2xl border border-primary/20 hover:border-primary/40 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all duration-300 text-left group/link hover-lift relative overflow-hidden shadow-md hover:shadow-xl"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/link:translate-x-full transform" />
                
                {/* Icon with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 group-hover/link:from-primary/25 group-hover/link:to-secondary/20 transition-all duration-300 group-hover/link:scale-110 shadow-sm">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-lg group-hover/link:text-primary transition-colors">{link.title}</div>
                    {link.badge && (
                      <Badge className="ml-auto bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 font-bold shadow-sm animate-pulse">
                        {link.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground group-hover/link:text-foreground transition-colors font-medium">
                    {link.description}
                  </div>
                </div>
                
                {/* Arrow indicator */}
                <div className="flex justify-end">
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover/link:bg-primary/20 transition-all duration-300">
                    <ArrowRight className="h-4 w-4 text-primary group-hover/link:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500" />
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
                onClick={() => navigate('/admin/crm/quotes')}
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
                onClick={() => navigate('/admin/crm/leads')}
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
                onClick={() => navigate('/admin/content/marketing')}
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
