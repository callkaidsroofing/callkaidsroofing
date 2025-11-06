import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Send, Calendar, CheckCircle, XCircle, Clock, MapPin, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookLogin } from "./FacebookSDK";
import { ContentCalendar } from "./ContentCalendar";
import { format } from "date-fns";

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  variant?: string;
  image_url?: string;
  scheduled_for?: string;
  created_at: string;
  published_at?: string;
  error_message?: string;
  post_id?: string;
}

interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement_rate: number;
}

export const SocialMediaManager = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [selectedVariant, setSelectedVariant] = useState('custom');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isConnectedToFacebook, setIsConnectedToFacebook] = useState(false);
  const [facebookPages, setFacebookPages] = useState<Array<{ id: string; name: string; access_token: string }>>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [userAccessToken, setUserAccessToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const { toast } = useToast();
  const { login, logout, getLoginStatus, postToPage } = useFacebookLogin();

  interface FBStatusResponse {
    status: string;
    authResponse: { accessToken: string };
  }

  interface FBPagesResponse {
    data?: Array<{ id: string; name: string; access_token: string }>;
  }

  interface FBPostResponse {
    error?: { message: string };
    id?: string;
  }

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } else {
      setPosts(data);
    }
  }, [toast]);

  const fetchAnalytics = useCallback(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data: publishedPosts } = await supabase
      .from('social_posts')
      .select('id, platform, content, published_at, post_engagement(*)')
      .eq('status', 'published')
      .gte('published_at', thirtyDaysAgo.toISOString());

    if (publishedPosts) {
      const totalPosts = publishedPosts.length;
      const totalReach = publishedPosts.reduce((sum, post: any) => 
        sum + (post.post_engagement?.[0]?.reach || 0), 0
      );
      const avgEngagement = publishedPosts.reduce((sum, post: any) => 
        sum + (post.post_engagement?.[0]?.engagement_rate || 0), 0
      ) / totalPosts || 0;

      const topPost = publishedPosts.reduce((best: any, post: any) => {
        const engagement = post.post_engagement?.[0];
        const bestEngagement = best?.post_engagement?.[0];
        return (engagement?.engagement_rate || 0) > (bestEngagement?.engagement_rate || 0) ? post : best;
      }, publishedPosts[0]);

      setAnalytics({
        totalPosts,
        totalReach,
        avgEngagement: avgEngagement.toFixed(2),
        topPost: topPost ? {
          content: topPost.content,
          ...topPost.post_engagement?.[0]
        } : null
      });
    }
  }, []);

  const fetchFacebookPages = useCallback((accessToken: string) => {
    if (window.FB) {
      window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
        const fbResponse = response as FBPagesResponse;
        if (fbResponse.data) {
          setFacebookPages(fbResponse.data);
        }
      });
    }
  }, []);

  const checkFacebookStatus = useCallback(() => {
    getLoginStatus((response) => {
      const fbResponse = response as FBStatusResponse;
      if (fbResponse.status === 'connected') {
        setIsConnectedToFacebook(true);
        setUserAccessToken(fbResponse.authResponse.accessToken);
        fetchFacebookPages(fbResponse.authResponse.accessToken);
      }
    });
  }, [getLoginStatus, fetchFacebookPages]);

  useEffect(() => {
    fetchPosts();
    fetchAnalytics();
    checkFacebookStatus();
  }, [fetchPosts, fetchAnalytics, checkFacebookStatus]);

  const handleFacebookLogin = () => {
    login((response) => {
      const fbResponse = response as FBStatusResponse;
      if (fbResponse.status === 'connected') {
        setIsConnectedToFacebook(true);
        setUserAccessToken(fbResponse.authResponse.accessToken);
        fetchFacebookPages(fbResponse.authResponse.accessToken);
        toast({
          title: "Success",
          description: "Connected to Facebook & Instagram successfully!"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to connect to Facebook",
          variant: "destructive"
        });
      }
    });
  };

  const handleFacebookLogout = () => {
    logout(() => {
      setIsConnectedToFacebook(false);
      setFacebookPages([]);
      setSelectedPage('');
      setUserAccessToken('');
      toast({
        title: "Success",
        description: "Disconnected from Facebook"
      });
    });
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatform === 'instagram' && !imageUrl) {
      toast({
        title: "Error",
        description: "Instagram posts require an image",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const postData: any = {
        platform: selectedPlatform,
        content: newPost,
        variant: selectedVariant,
        image_url: imageUrl || null,
        status: scheduledDateTime ? 'scheduled' : 'draft',
      };

      if (scheduledDateTime) {
        postData.scheduled_for = new Date(scheduledDateTime).toISOString();
      }

      const { error } = await supabase
        .from('social_posts')
        .insert([postData]);

      if (error) throw error;

      setNewPost('');
      setImageUrl('');
      setScheduledDateTime('');
      fetchPosts();
      
      toast({
        title: "Success",
        description: scheduledDateTime ? "Post scheduled successfully" : "Post saved as draft"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (post: SocialPost) => {
    if (post.platform === 'facebook' && !isConnectedToFacebook) {
      toast({
        title: "Error",
        description: "Please connect to Facebook first",
        variant: "destructive"
      });
      return;
    }

    if (post.platform === 'facebook' && !selectedPage) {
      toast({
        title: "Error",
        description: "Please select a Facebook page",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (post.platform === 'facebook') {
        const pageData = facebookPages.find(page => page.id === selectedPage);
        if (!pageData) throw new Error('Page not found');

        postToPage(selectedPage, post.content, pageData.access_token, async (response) => {
          const fbResponse = response as FBPostResponse;
          if (fbResponse.error) {
            await supabase
              .from('social_posts')
              .update({
                status: 'failed',
                error_message: fbResponse.error.message
              })
              .eq('id', post.id);
            
            toast({
              title: "Error",
              description: fbResponse.error.message,
              variant: "destructive"
            });
          } else {
            await supabase
              .from('social_posts')
              .update({
                status: 'published',
                published_at: new Date().toISOString(),
                post_id: fbResponse.id
              })
              .eq('id', post.id);
            
            toast({
              title: "Success",
              description: "Post published to Facebook!"
            });
            
            fetchPosts();
          }
          setLoading(false);
        });
      }
    } catch (error) {
      await supabase
        .from('social_posts')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', post.id);
      
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Social Media Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="create">Create Post</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="manage">Manage Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="google_business_profile">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Google Business
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="variant">Content Variant</Label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger id="variant">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="PAS">PAS (Problem-Agitate-Solution)</SelectItem>
                      <SelectItem value="AIDA">AIDA (Attention-Interest-Desire-Action)</SelectItem>
                      <SelectItem value="Trust">Trust-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's happening with Call Kaids Roofing?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={5}
                />
              </div>

              {selectedPlatform === 'instagram' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <strong>Instagram requires an image.</strong> Add image URL below or it will fail to publish.
                </div>
              )}

              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="schedule">Schedule (optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to save as draft. Scheduled posts publish automatically every 15 minutes.
                </p>
              </div>

              <Button onClick={createPost} disabled={loading} className="w-full">
                {scheduledDateTime ? 'Schedule Post' : 'Save as Draft'}
              </Button>
            </TabsContent>

            <TabsContent value="calendar">
              <ContentCalendar />
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No posts yet</p>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {post.platform === 'facebook' && <Facebook className="h-4 w-4 text-blue-600" />}
                            {post.platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                            {post.platform === 'google_business_profile' && <MapPin className="h-4 w-4 text-red-600" />}
                            <span className="font-medium capitalize">
                              {post.platform === 'google_business_profile' ? 'Google Business' : post.platform}
                            </span>
                            {post.variant && <Badge variant="outline">{post.variant}</Badge>}
                          </div>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1">{post.status}</span>
                          </Badge>
                        </div>
                        
                        {post.scheduled_for && (
                          <p className="text-xs text-muted-foreground mb-2">
                            📅 Scheduled: {format(new Date(post.scheduled_for), 'PPpp')}
                          </p>
                        )}
                        
                        <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
                        
                        {post.image_url && (
                          <img src={post.image_url} alt="Post" className="rounded-lg mb-3 max-h-48 object-cover" />
                        )}
                        
                        {post.error_message && (
                          <div className="text-red-600 text-sm mb-2">
                            Error: {post.error_message}
                          </div>
                        )}
                        
                        {post.status === 'draft' && (
                          <Button
                            onClick={() => publishPost(post)}
                            disabled={loading}
                            size="sm"
                          >
                            Publish Now
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              {analytics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics.totalPosts}</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Reach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics.totalReach.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">People reached</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Avg. Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics.avgEngagement}%</div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                      </CardContent>
                    </Card>
                  </div>

                  {analytics.topPost && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Top Performing Post
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{analytics.topPost.content?.substring(0, 150)}...</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-semibold">{analytics.topPost.likes || 0}</div>
                            <div className="text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="font-semibold">{analytics.topPost.comments || 0}</div>
                            <div className="text-muted-foreground">Comments</div>
                          </div>
                          <div>
                            <div className="font-semibold">{analytics.topPost.shares || 0}</div>
                            <div className="text-muted-foreground">Shares</div>
                          </div>
                          <div>
                            <div className="font-semibold">{analytics.topPost.reach || 0}</div>
                            <div className="text-muted-foreground">Reach</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Loading analytics...</p>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Facebook & Instagram Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isConnectedToFacebook ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium">✓ Connected to Facebook & Instagram</span>
                        <Button variant="outline" onClick={handleFacebookLogout}>
                          Disconnect
                        </Button>
                      </div>
                      
                      {facebookPages.length > 0 && (
                        <div>
                          <Label>Select Page</Label>
                          <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full p-2 border rounded-md mt-1"
                          >
                            <option value="">Select a page...</option>
                            {facebookPages.map((page) => (
                              <option key={page.id} value={page.id}>
                                {page.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Connect your Facebook account to post to Facebook Pages and Instagram Business accounts.
                      </p>
                      <Button onClick={handleFacebookLogin}>
                        Connect Facebook & Instagram
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Google Business Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-2">
                    Google Business Profile integration requires OAuth setup. Contact your admin to configure:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                    <li>GOOGLE_MY_BUSINESS_CLIENT_ID</li>
                    <li>GOOGLE_MY_BUSINESS_CLIENT_SECRET</li>
                    <li>GOOGLE_MY_BUSINESS_REFRESH_TOKEN</li>
                    <li>GOOGLE_MY_BUSINESS_ACCOUNT_ID</li>
                    <li>GOOGLE_MY_BUSINESS_LOCATION_ID</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
