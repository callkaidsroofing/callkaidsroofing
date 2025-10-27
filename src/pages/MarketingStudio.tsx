import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, TrendingUp, Target, Send, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  platform: string;
  name: string;
  status: string;
  creatives: any;
  created_at: string;
}

export default function MarketingStudio() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    platform: 'facebook',
    name: '',
    content: '',
    scheduleAt: ''
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data || []) as any);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('campaigns' as any)
        .insert({
          platform: newCampaign.platform,
          name: newCampaign.name,
          creatives: { content: newCampaign.content },
          status: newCampaign.scheduleAt ? 'scheduled' : 'draft',
          calendar: newCampaign.scheduleAt ? { publishAt: newCampaign.scheduleAt } : {}
        } as any);

      if (error) throw error;

      toast.success('Campaign created successfully');
      setShowNewCampaign(false);
      setNewCampaign({ platform: 'facebook', name: '', content: '', scheduleAt: '' });
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  };

  const publishCampaign = async (campaignId: string) => {
    try {
      // Call social-manager function
      await supabase.functions.invoke('social-manager', {
        body: { 
          action: 'publish',
          campaignId
        }
      });

      const { error } = await supabase
        .from('campaigns' as any)
        .update({ status: 'published' } as any)
        .eq('id', campaignId);

      if (error) throw error;

      toast.success('Campaign published successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error publishing campaign:', error);
      toast.error('Failed to publish campaign');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing Studio</h1>
          <p className="text-muted-foreground">Campaigns, social media, and analytics</p>
        </div>
        <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select value={newCampaign.platform} onValueChange={(val) => setNewCampaign({ ...newCampaign, platform: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="google_business">Google Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Campaign Name</label>
                <Input 
                  placeholder="e.g., Summer Roof Restoration Promo"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Post Content</label>
                <Textarea 
                  placeholder="Write your post content..."
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Schedule (optional)</label>
                <Input 
                  type="datetime-local"
                  value={newCampaign.scheduleAt}
                  onChange={(e) => setNewCampaign({ ...newCampaign, scheduleAt: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign}>Create Campaign</Button>
                <Button variant="outline" onClick={() => setShowNewCampaign(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>{campaigns.length} total campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns yet. Create your first campaign.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge variant={
                            campaign.status === 'published' ? 'default' : 
                            campaign.status === 'scheduled' ? 'secondary' : 
                            'outline'
                          }>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.platform}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.creatives?.content || 'No content'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {format(new Date(campaign.created_at), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button size="sm" onClick={() => publishCampaign(campaign.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Publish
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Stats
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>Schedule and manage your posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.4K</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.length}</div>
                  <p className="text-xs text-muted-foreground">Active campaigns</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
