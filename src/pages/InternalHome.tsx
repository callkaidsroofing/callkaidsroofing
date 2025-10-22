import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2,
  Zap,
  BarChart3,
  Camera
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNexusAI } from '@/hooks/useNexusAI';
import { toast } from 'sonner';

interface QuickStats {
  newLeads: number;
  pendingQuotes: number;
  activeJobs: number;
  monthRevenue: number;
  hotLeads: number;
}

export default function InternalHome() {
  const [stats, setStats] = useState<QuickStats>({
    newLeads: 0,
    pendingQuotes: 0,
    activeJobs: 0,
    monthRevenue: 0,
    hotLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  const navigate = useNavigate();
  
  const { ask, isProcessing } = useNexusAI({
    onComplete: (response) => {
      toast.success('AI Task Completed', {
        description: response.substring(0, 100) + '...'
      });
    }
  });

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Get leads
      const { data: leads } = await supabase
        .from('leads')
        .select('status, ai_score, created_at');

      // Get quotes  
      const { data: quotes } = await supabase
        .from('quotes')
        .select('status, total, created_at');

      // Get jobs
      const { data: jobs } = await supabase
        .from('inspection_reports')
        .select('status');

      const newLeads = leads?.filter(l => l.status === 'new').length || 0;
      const hotLeads = leads?.filter(l => (l.ai_score || 0) >= 7).length || 0;
      const pendingQuotes = quotes?.filter(q => q.status === 'draft' || q.status === 'sent').length || 0;
      const activeJobs = jobs?.filter(j => j.status === 'in_progress' || j.status === 'scheduled').length || 0;
      
      const monthRevenue = quotes
        ?.filter(q => new Date(q.created_at) >= new Date(firstDayOfMonth))
        .reduce((sum, q) => sum + parseFloat(String(q.total) || '0'), 0) || 0;

      setStats({
        newLeads,
        pendingQuotes,
        activeJobs,
        monthRevenue,
        hotLeads,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim() || isProcessing) return;
    await ask(aiQuery);
    setAiQuery('');
  };

  const quickActions = [
    {
      title: 'New Lead',
      description: 'AI-powered lead capture',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/internal/leads'),
    },
    {
      title: 'New Inspection',
      description: 'Start inspection report',
      icon: Camera,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/internal/inspection'),
    },
    {
      title: 'AI Assistant',
      description: 'Chat with Nexus AI',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/internal/nexus'),
    },
    {
      title: 'View Reports',
      description: 'All inspection reports',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/internal/dashboard'),
    },
  ];

  const navSections: Array<{
    title: string;
    description: string;
    path: string;
    badge: string;
    badgeVariant: "default" | "destructive" | "outline" | "secondary";
  }> = [
    {
      title: '🎯 Lead Management',
      description: 'Track and convert website leads with AI intelligence',
      path: '/internal/leads',
      badge: `${stats.newLeads} new`,
      badgeVariant: stats.newLeads > 0 ? 'default' : 'secondary',
    },
    {
      title: '📋 Inspection Reports',
      description: 'Create and manage detailed roof inspection reports',
      path: '/internal/dashboard',
      badge: `${stats.activeJobs} active`,
      badgeVariant: 'secondary',
    },
    {
      title: '💰 Quotes & Pricing',
      description: 'Generate professional quotes with AI suggestions',
      path: '/internal/quotes',
      badge: `${stats.pendingQuotes} pending`,
      badgeVariant: stats.pendingQuotes > 0 ? 'default' : 'secondary',
    },
    {
      title: '🤖 Nexus AI Command Center',
      description: 'Natural language CRM control - ask anything, do anything',
      path: '/internal/nexus',
      badge: 'Powered by GPT',
      badgeVariant: 'outline',
    },
    {
      title: '💬 AI Chat Support',
      description: 'Internal AI assistant for business intelligence',
      path: '/internal/chat',
      badge: 'Live',
      badgeVariant: 'outline',
    },
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Call Kaids Roofing Command Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered business management system. Automate tasks, track leads, and grow your business.
          </p>
        </div>

        {/* AI Quick Command */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI Quick Command
            </CardTitle>
            <CardDescription>
              Ask AI to do anything - create leads, search data, generate quotes, analyze trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                placeholder="e.g., 'Show all hot leads from this week' or 'Create a lead for John in Berwick'"
                disabled={isProcessing}
                className="text-base"
              />
              <Button onClick={handleAIQuery} disabled={isProcessing || !aiQuery.trim()}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setAiQuery("Show today's new leads")}>
                Today's Leads
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAiQuery("What's my revenue this month?")}>
                Monthly Revenue
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAiQuery("Show pending quotes")}>
                Pending Quotes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/internal/leads')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                New Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.newLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting contact</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/internal/leads')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Hot Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.hotLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">AI Score ≥ 7</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/internal/quotes')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pending Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingQuotes}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs follow-up</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/internal/dashboard')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Month Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${stats.monthRevenue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-4">System Sections</h2>
          <div className="space-y-3">
            {navSections.map((section, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(section.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={section.badgeVariant}>{section.badge}</Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Info */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              💡 Pro Tip: Use AI Everywhere
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>🤖 <strong>Nexus AI</strong> - Full natural language control of your CRM</p>
            <p>🔗 <strong>CKR-GEM API</strong> - Your Custom GPT can manage everything via API</p>
            <p>📱 <strong>Website Integration</strong> - AI powers work on any page using useNexusAI hook</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/internal/nexus-demo')}
            >
              View Integration Guide
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
