import { useState, useEffect } from 'react';
import { Megaphone, Target, TrendingUp, Zap, Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react';
import { AIModuleCard } from '@/components/AIModuleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { loadBrandGuidelines, loadProofPoints, loadWorkflows, checkKnowledgeBaseHealth } from '@/lib/knowledgeBase';
import { toast } from 'sonner';

export default function AdsEngine() {
  const [brandGuidelines, setBrandGuidelines] = useState<any>(null);
  const [proofPoints, setProofPoints] = useState<any>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [kbHealth, setKbHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp_001',
      name: 'Roof Restoration - Clyde North',
      status: 'active',
      budget: 500,
      spent: 347,
      impressions: 12453,
      clicks: 234,
      conversions: 12,
      ctr: 1.88,
      cpc: 1.48,
      suburb: 'Clyde North',
      service: 'Roof Restoration'
    },
    {
      id: 'camp_002',
      name: 'Emergency Repairs - Pakenham',
      status: 'active',
      budget: 300,
      spent: 189,
      impressions: 8932,
      clicks: 178,
      conversions: 8,
      ctr: 1.99,
      cpc: 1.06,
      suburb: 'Pakenham',
      service: 'Emergency Repairs'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brand, proof, workflowData, health] = await Promise.all([
          loadBrandGuidelines(),
          loadProofPoints(),
          loadWorkflows(),
          checkKnowledgeBaseHealth()
        ]);
        
        setBrandGuidelines(brand);
        setProofPoints(proof);
        setWorkflows(workflowData);
        setKbHealth(health);
      } catch (error) {
        console.error('Failed to load ads engine data:', error);
        toast.error('Failed to load ads engine data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateCampaign = () => {
    toast.success('Campaign creation started', {
      description: 'AI is generating proof-driven creatives using MKF_06 copy frameworks'
    });
  };

  const handleOptimizeCampaign = (campaignId: string) => {
    toast.success('Optimization analysis started', {
      description: 'Analyzing performance data with GWA workflow automation'
    });
  };

  const toggleCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
    ));
    toast.success('Campaign status updated');
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B3B69] mb-2">Meta Ads Command Center</h1>
          <p className="text-muted-foreground">
            AI-powered campaign creation, audience targeting, and performance optimization
          </p>
        </div>
        <Badge variant={kbHealth?.accessible ? "default" : "destructive"} className="h-8">
          {kbHealth?.accessible ? (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Knowledge Base: {kbHealth?.structure}
            </>
          ) : (
            <>
              <AlertCircle className="mr-1 h-4 w-4" />
              Knowledge Base Offline
            </>
          )}
        </Badge>
      </div>

      {/* Brand Voice Reference */}
      {brandGuidelines && (
        <Card className="border-l-4 border-l-[#007ACC]">
          <CardHeader>
            <CardTitle className="text-[#0B3B69]">Brand Voice Standards (MKF_01)</CardTitle>
            <CardDescription>All ad copy follows CKR brand guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Messaging</p>
                <p className="text-sm font-semibold text-[#007ACC]">{brandGuidelines.messaging.tagline}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tone</p>
                <p className="text-sm">{brandGuidelines.voice.tone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avoid</p>
                <p className="text-sm">{brandGuidelines.voice.avoid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <AIModuleCard
          title="Active Campaigns"
          description="Currently running"
          icon={Megaphone}
          status="active"
          metrics={[{ label: 'Total', value: activeCampaigns.length }]}
        />
        <Card className="border-l-4 border-l-[#007ACC]">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Impressions</p>
            <p className="text-3xl font-bold text-[#0B3B69]">
              {totalImpressions.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#007ACC]">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-[#007ACC]">
              {totalClicks}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#007ACC]">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Conversions</p>
            <p className="text-3xl font-bold text-green-600">
              {totalConversions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creative">Creative Studio</TabsTrigger>
          <TabsTrigger value="audience">Audience Targeting</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#0B3B69]">Active Campaigns</CardTitle>
                  <CardDescription>Monitor and optimize your Meta Ads campaigns</CardDescription>
                </div>
                <Button className="bg-[#007ACC] hover:bg-[#0B3B69]" onClick={handleCreateCampaign}>
                  <Zap className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-[#0B3B69] mb-1">{campaign.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.suburb}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ${campaign.spent} / ${campaign.budget}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleCampaign(campaign.id)}
                        >
                          {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOptimizeCampaign(campaign.id)}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Progress value={(campaign.spent / campaign.budget) * 100} className="mb-4" />

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-lg font-semibold text-[#0B3B69]">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-lg font-semibold text-[#007ACC]">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-lg font-semibold text-green-600">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CPC</p>
                        <p className="text-lg font-semibold">${campaign.cpc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative Studio Tab */}
        <TabsContent value="creative" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <CardTitle className="text-[#0B3B69]">AI Creative Generation</CardTitle>
              <CardDescription>
                Generate proof-driven visuals and copy using PAS, AIDA, and BAB frameworks (MKF_06)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proofPoints && (
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-[#007ACC]">{proofPoints.statistics.projectsCompleted}</p>
                    <p className="text-xs text-muted-foreground mt-1">Projects Completed</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-[#007ACC]">{proofPoints.statistics.satisfactionRate}</p>
                    <p className="text-xs text-muted-foreground mt-1">Satisfaction Rate</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-[#007ACC]">{proofPoints.statistics.warrantyYears} Years</p>
                    <p className="text-xs text-muted-foreground mt-1">Warranty</p>
                  </Card>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold text-[#0B3B69] mb-2">Visual Assets (MKF_08)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Before/after shots from completed jobs with proof points
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse Proof Points Library
                  </Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold text-[#0B3B69] mb-2">Copy Framework (MKF_06)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI-selected messaging per persona
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">PAS (Problem-Agitate-Solve)</Badge>
                    <Badge variant="outline">AIDA (Attention-Interest-Desire-Action)</Badge>
                    <Badge variant="outline">BAB (Before-After-Bridge)</Badge>
                  </div>
                </Card>
              </div>
              <Button className="w-full bg-[#007ACC] hover:bg-[#0B3B69]">
                <Zap className="h-4 w-4 mr-2" />
                Generate Ad Creative
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Targeting Tab */}
        <TabsContent value="audience" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <CardTitle className="text-[#0B3B69]">Audience Strategy</CardTitle>
              <CardDescription>
                Location-aware targeting based on service areas (from Operations SOPs)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold text-[#0B3B69] mb-3">Service Areas (MKF_04)</h4>
                  <div className="space-y-2">
                    {proofPoints?.serviceAreas?.slice(0, 5).map((area: string) => (
                      <div key={area} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{area}</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-700">Active</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold text-[#0B3B69] mb-3">Retargeting Audiences</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <p className="font-medium text-sm">Website Visitors (30 days)</p>
                      <p className="text-xs text-muted-foreground mt-1">2,347 people</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="font-medium text-sm">Quote Requesters</p>
                      <p className="text-xs text-muted-foreground mt-1">156 people</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="font-medium text-sm">Past Customers</p>
                      <p className="text-xs text-muted-foreground mt-1">89 people</p>
                    </div>
                  </div>
                </Card>
              </div>
              <Button className="w-full bg-[#007ACC] hover:bg-[#0B3B69]">
                <Target className="h-4 w-4 mr-2" />
                Create Audience Segment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0B3B69]">
            <TrendingUp className="h-5 w-5" />
            AI Optimization Recommendations (GWA Workflows)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B3B69]">Increase Budget for High Performers</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Campaign "Roof Restoration - Clyde North" has 2.1x ROAS. Consider +20% budget.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">Workflow: MKF_14 - Marketing Automation</Badge>
                </div>
                <Button size="sm">Apply</Button>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B3B69]">Refresh Creative Assets</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ad fatigue detected. CTR dropped 15% in last 7 days. Rotate new creatives from proof library.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">Workflow: MKF_12 - Content Generation</Badge>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}