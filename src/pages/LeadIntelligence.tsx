import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  Target, Brain, AlertCircle, CheckCircle2,
  Clock, Phone, Mail, MessageSquare, Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeadMetrics {
  total_leads: number;
  conversion_rate: number;
  avg_response_time: number;
  hot_leads: number;
  cold_leads: number;
  trend: 'up' | 'down';
}

// Interface matching actual Supabase schema
interface LeadInsight {
  id: string;
  name: string;
  stage: string;
  suburb: string;
  source: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export default function LeadIntelligence() {
  const [metrics, setMetrics] = useState<LeadMetrics>({
    total_leads: 0,
    conversion_rate: 0,
    avg_response_time: 0,
    hot_leads: 0,
    cold_leads: 0,
    trend: 'up',
  });
  const [recentLeads, setRecentLeads] = useState<LeadInsight[]>([]);
  const [staleLeads, setStaleLeads] = useState<LeadInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const fetchIntelligence = async () => {
    setLoading(true);
    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leads) {
        // Recent leads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recent = leads.filter(l => new Date(l.created_at) >= sevenDaysAgo);
        
        // Stale leads (older than 30 days, not won/lost)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const stale = leads.filter(l => 
          new Date(l.created_at) < thirtyDaysAgo && 
          l.stage !== 'won' && 
          l.stage !== 'lost'
        );

        setRecentLeads(recent as LeadInsight[]);
        setStaleLeads(stale as LeadInsight[]);

        // Calculate real metrics from database
        const wonLeads = leads.filter(l => l.stage === 'won');
        const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

        // Mock response time - would need tracking first contact time
        const avgResponseTime = 2.4;

        // Determine trend
        const recentCount = recent.length;
        const olderLeads = leads.filter(l => {
          const createdDate = new Date(l.created_at);
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
          return createdDate < sevenDaysAgo && createdDate >= sixtyDaysAgo;
        });
        const trend = recentCount >= olderLeads.length ? 'up' : 'down';

        setMetrics({
          total_leads: leads.length,
          conversion_rate: conversionRate,
          avg_response_time: avgResponseTime,
          hot_leads: recent.length,
          cold_leads: stale.length,
          trend,
        });
      }
    } catch (error) {
      console.error('Error fetching intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Lead Intelligence
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Lead insights and pipeline overview
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Leads</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{metrics.total_leads}</p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm">
              {metrics.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
              )}
              <span className={metrics.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                12% this month
              </span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{metrics.conversion_rate}%</p>
              </div>
              <Target className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
            <Progress value={metrics.conversion_rate} className="mt-2" />
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Avg Response</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{metrics.avg_response_time}h</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Target: &lt;2h</p>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Recent Leads</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{metrics.hot_leads}</p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
          </Card>
        </div>

        {/* Lead Categories */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="recent" className="text-xs md:text-sm">
              Recent Leads ({recentLeads.length})
            </TabsTrigger>
            <TabsTrigger value="stale" className="text-xs md:text-sm">
              Stale Leads ({staleLeads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-3 md:space-y-4 mt-4">
            {recentLeads.map((lead) => (
              <Card key={lead.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base md:text-lg">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.source}</p>
                      </div>
                      <Badge variant="default" className="capitalize">
                        {lead.stage}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                        {lead.stage}
                      </span>
                      <span>•</span>
                      <span>{lead.suburb}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden md:inline">Call</span>
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="hidden md:inline">Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {recentLeads.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                No recent leads in the last 7 days
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stale" className="space-y-3 md:space-y-4 mt-4">
            {staleLeads.map((lead) => (
              <Card key={lead.id} className="p-4 md:p-6 bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {lead.stage}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{lead.source} • {lead.suburb}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Consider re-engaging or archiving
                  </div>
                </div>
              </Card>
            ))}
            {staleLeads.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                No stale leads found
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }
