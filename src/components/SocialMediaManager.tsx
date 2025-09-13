import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Send, Calendar, Image as ImageIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookLogin } from "./FacebookSDK";

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  created_at: string;
  published_at?: string;
  scheduled_for?: string;
  error_message?: string;
  post_id?: string;
}

export const SocialMediaManager = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isConnectedToFacebook, setIsConnectedToFacebook] = useState(false);
  const [facebookPages, setFacebookPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [userAccessToken, setUserAccessToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { login, logout, getLoginStatus, postToPage } = useFacebookLogin();

  useEffect(() => {
    fetchPosts();
    checkFacebookStatus();
  }, []);

  const fetchPosts = async () => {
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
  };

  const checkFacebookStatus = () => {
    getLoginStatus((response: any) => {
      if (response.status === 'connected') {
        setIsConnectedToFacebook(true);
        setUserAccessToken(response.authResponse.accessToken);
        fetchFacebookPages(response.authResponse.accessToken);
      }
    });
  };

  const fetchFacebookPages = async (accessToken: string) => {
    if (window.FB) {
      window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response: any) => {
        if (response.data) {
          setFacebookPages(response.data);
        }
      });
    }
  };

  const handleFacebookLogin = () => {
    login((response: any) => {
      if (response.status === 'connected') {
        setIsConnectedToFacebook(true);
        setUserAccessToken(response.authResponse.accessToken);
        fetchFacebookPages(response.authResponse.accessToken);
        toast({
          title: "Success",
          description: "Connected to Facebook successfully!"
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
    logout((response: any) => {
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

  const createPost = async (platform: string) => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          platform,
          content: newPost,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setPosts([data, ...posts]);
      setNewPost('');
      
      toast({
        title: "Success",
        description: `${platform} post created as draft`
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

        postToPage(selectedPage, post.content, pageData.access_token, async (response: any) => {
          if (response.error) {
            await supabase
              .from('social_posts')
              .update({
                status: 'failed',
                error_message: response.error.message
              })
              .eq('id', post.id);
            
            toast({
              title: "Error",
              description: response.error.message,
              variant: "destructive"
            });
          } else {
            await supabase
              .from('social_posts')
              .update({
                status: 'published',
                published_at: new Date().toISOString(),
                post_id: response.id
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
            <TabsList>
              <TabsTrigger value="create">Create Post</TabsTrigger>
              <TabsTrigger value="manage">Manage Posts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Post Content</label>
                <Textarea
                  placeholder="What's happening with Call Kaids Roofing?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => createPost('facebook')}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Save for Facebook
                </Button>
                <Button
                  onClick={() => createPost('instagram')}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  Save for Instagram
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {post.platform === 'facebook' ? (
                            <Facebook className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Instagram className="h-4 w-4 text-pink-600" />
                          )}
                          <span className="font-medium capitalize">{post.platform}</span>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1">{post.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
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
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Facebook Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isConnectedToFacebook ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium">✓ Connected</span>
                        <Button variant="outline" onClick={handleFacebookLogout}>
                          Disconnect
                        </Button>
                      </div>
                      
                      {facebookPages.length > 0 && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Select Page</label>
                          <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full p-2 border rounded-md"
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
                        Connect your Facebook account to post to your business pages.
                      </p>
                      <Button onClick={handleFacebookLogin}>
                        Connect Facebook
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    Instagram Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Instagram posting requires Facebook Business verification and additional setup.
                    Posts created here can be manually posted to Instagram.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};