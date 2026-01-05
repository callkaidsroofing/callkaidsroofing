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

interface LeadInsight {
  id: string;
  name: string;
  ai_score: number;
  stage?: string;
  service: string;
  suburb: string;
  phone?: string;
  email?: string;
  created_at: string;
  ai_tags?: any;
  next_action?: string;
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
  const [hotLeads, setHotLeads] = useState<LeadInsight[]>([]);
  const [coldLeads, setColdLeads] = useState<LeadInsight[]>([]);
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
        .order('ai_score', { ascending: false });

      if (leads) {
        const hot = leads.filter(l => (l.ai_score || 0) >= 70);
        const cold = leads.filter(l => (l.ai_score || 0) < 40);

        setHotLeads(hot as LeadInsight[]);
        setColdLeads(cold as LeadInsight[]);

        // Calculate real metrics from database
        // Get conversion rate (leads with stage = 'Won' / total leads)
        const wonLeads = leads.filter(l => (l.status?.toLowerCase() === 'won' || l.status?.toLowerCase() === 'converted'));
        const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

        // Calculate average response time (mock for now - requires tracking first contact time)
        // TODO: Add first_contact_at field to leads table to calculate real response time
        const avgResponseTime = 2.4;

        // Determine trend (compare with last period - simplified)
        const recentLeads = leads.filter(l => {
          const createdDate = new Date(l.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        });
        const olderLeads = leads.filter(l => {
          const createdDate = new Date(l.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
          return createdDate < thirtyDaysAgo && createdDate >= sixtyDaysAgo;
        });
        const trend = recentLeads.length >= olderLeads.length ? 'up' : 'down';

        setMetrics({
          total_leads: leads.length,
          conversion_rate: conversionRate,
          avg_response_time: avgResponseTime,
          hot_leads: hot.length,
          cold_leads: cold.length,
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
            AI-powered insights and lead scoring
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
                <p className="text-xs md:text-sm text-muted-foreground">Hot Leads</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{metrics.hot_leads}</p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score ≥ 70%</p>
          </Card>
        </div>

        {/* Lead Categories */}
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="hot" className="text-xs md:text-sm">
              Hot Leads ({hotLeads.length})
            </TabsTrigger>
            <TabsTrigger value="cold" className="text-xs md:text-sm">
              Cold Leads ({coldLeads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hot" className="space-y-3 md:space-y-4 mt-4">
            {hotLeads.map((lead) => (
              <Card key={lead.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base md:text-lg">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.service}</p>
                      </div>
                      <Badge variant="default" className="flex-shrink-0">
                        {lead.ai_score}% Match
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

                    {lead.ai_tags && lead.ai_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {lead.ai_tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {lead.next_action && (
                      <div className="flex items-center gap-2 text-xs md:text-sm bg-primary/5 text-primary p-2 md:p-3 rounded-lg">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Next: {lead.next_action}</span>
                      </div>
                    )}
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
          </TabsContent>

          <TabsContent value="cold" className="space-y-3 md:space-y-4 mt-4">
            {coldLeads.map((lead) => (
              <Card key={lead.id} className="p-4 md:p-6 bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <Badge variant="outline" className="flex-shrink-0">
                        {lead.ai_score}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{lead.service} • {lead.suburb}</p>
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
          </TabsContent>
        </Tabs>
      </div>
    );
  }