import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { FacebookSDK } from '@/components/FacebookSDK';
import { SocialMediaManager } from '@/components/SocialMediaManager';
import { Helmet } from 'react-helmet-async';

import { 
  LogOut, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Filter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  suburb: string;
  service: string;
  message: string | null;
  urgency: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [facebookAppId, setFacebookAppId] = useState<string>('');

  // Fetch Facebook App ID from secrets
  useEffect(() => {
    const fetchFacebookAppId = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-facebook-app-id');
        if (data?.appId) {
          setFacebookAppId(data.appId);
        }
      } catch (error) {
        console.error('Failed to fetch Facebook App ID:', error);
      }
    };
    fetchFacebookAppId();
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user, fetchLeads]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      toast({
        title: "Status Updated",
        description: "Lead status has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive"
      });
    }
  };

  const filteredLeads = leads.filter(lead => {
    const statusMatch = filterStatus === 'all' || lead.status === filterStatus;
    const serviceMatch = filterService === 'all' || lead.service === filterService;
    return statusMatch && serviceMatch;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'new': 'destructive',
      'contacted': 'secondary', 
      'quoted': 'default',
      'converted': 'default',
      'completed': 'default'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getUrgencyBadge = (urgency: string | null) => {
    if (!urgency) return null;
    const isUrgent = urgency.toLowerCase().includes('urgent') || urgency.toLowerCase().includes('emergency');
    return (
      <Badge variant={isUrgent ? 'destructive' : 'secondary'} className="text-xs">
        {isUrgent && <AlertTriangle className="h-3 w-3 mr-1" />}
        {urgency}
      </Badge>
    );
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    thisWeek: leads.filter(l => {
      const leadDate = new Date(l.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return leadDate > weekAgo;
    }).length
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-muted/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading Call Kaids Admin Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-muted/30">
        {/* Header */}
        <div className="bg-card/95 backdrop-blur-sm border-b shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Call Kaids Roofing</h1>
                <p className="text-muted-foreground text-lg">
                  Professional Roofing Management Dashboard
                </p>
                <p className="text-sm text-primary font-medium mt-1">
                  ABN: 39475055075 | Kaidyn Brownlie | Welcome, {user?.email}
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="lg" className="hover-lift">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 stagger-animation">
          <Card className="hover-lift roofing-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-3xl font-bold text-roofing-charcoal">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift roofing-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-roofing-success/10 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-roofing-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                  <p className="text-3xl font-bold text-roofing-success">{stats.new}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift roofing-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-roofing-warning/10 p-3 rounded-full">
                  <Phone className="h-8 w-8 text-roofing-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                  <p className="text-3xl font-bold text-roofing-warning">{stats.contacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift roofing-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-3xl font-bold text-secondary">{stats.thisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Leads Management</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Filters */}
            <Card className="roofing-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">Filter Leads:</span>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterService} onValueChange={setFilterService}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="roof-restoration">Roof Restoration</SelectItem>
                      <SelectItem value="roof-painting">Roof Painting</SelectItem>
                      <SelectItem value="roof-repairs">Roof Repairs</SelectItem>
                      <SelectItem value="gutter-cleaning">Gutter Cleaning</SelectItem>
                      <SelectItem value="emergency-repairs">Emergency Repairs</SelectItem>
                      <SelectItem value="Free Roof Health Check">Free Roof Health Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="roofing-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-roofing-charcoal">
                  Recent Leads ({filteredLeads.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4 bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          {/* Contact Info */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{lead.name}</h3>
                              {getUrgencyBadge(lead.urgency)}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${lead.phone}`} className="hover:text-primary">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <a href={`mailto:${lead.email}`} className="hover:text-primary">
                                  {lead.email}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {lead.suburb}
                            </div>
                          </div>

                          {/* Service & Message */}
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Service:</p>
                              <p className="text-sm text-muted-foreground">{lead.service}</p>
                            </div>
                            {lead.message && (
                              <div>
                                <p className="text-sm font-medium">Message:</p>
                                <p className="text-sm text-muted-foreground line-clamp-3">{lead.message}</p>
                              </div>
                            )}
                          </div>

                          {/* Date & Source */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(lead.created_at).toLocaleDateString('en-AU', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {lead.source}
                            </Badge>
                          </div>

                          {/* Status & Actions */}
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium mb-1">Status:</p>
                              {getStatusBadge(lead.status)}
                            </div>
                            <Select 
                              value={lead.status} 
                              onValueChange={(value) => updateLeadStatus(lead.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="quoted">Quoted</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No leads found matching your filters.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            {facebookAppId && <FacebookSDK appId={facebookAppId} />}
            <SocialMediaManager />
          </TabsContent>

        </Tabs>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;