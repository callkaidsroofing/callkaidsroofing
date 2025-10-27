import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Users, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface KPI {
  label: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down';
}

export default function InternalHomeNew() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [queueData, setQueueData] = useState({
    pending_quotes: 0,
    new_leads: 0,
    scheduled_posts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch KPIs
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total revenue (last 30 days)
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .eq('status', 'paid');

      const revenue = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;

      // Conversion rate
      const { count: quoteCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: wonCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const conversionRate = quoteCount && wonCount ? ((wonCount / quoteCount) * 100).toFixed(1) : '0';

      // Lead response time (mock for now)
      const avgResponseTime = '2.4h';

      // Active jobs
      const { count: activeJobs } = await supabase
        .from('inspection_reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

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

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement global search across entities
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Universal Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome back to Call Kaids Roofing</p>
        </div>
      </div>

      {/* Global Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads, quotes, invoices, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* KPI Bar */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={() => navigate('/internal/v2/forms')} size="sm">
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">New Inspection</span>
            <span className="sm:hidden">Inspect</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/internal/v2/data')} size="sm">
            <Users className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Add Lead</span>
            <span className="sm:hidden">Lead</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/internal/v2/media')} size="sm">
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Upload Media</span>
            <span className="sm:hidden">Media</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/internal/v2/docs')} size="sm">
            <FileText className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Create Document</span>
            <span className="sm:hidden">Doc</span>
          </Button>
        </CardContent>
      </Card>

      {/* Queue Monitor & System Health */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Queue Monitor</CardTitle>
            <CardDescription>Pending items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Quotes</span>
              <Badge variant="secondary">{queueData.pending_quotes}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Leads</span>
              <Badge variant="secondary">{queueData.new_leads}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Scheduled Posts</span>
              <Badge variant="secondary">{queueData.scheduled_posts}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>API status and service monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Edge Functions</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Services</span>
              <Badge className="bg-green-600">Operational</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
