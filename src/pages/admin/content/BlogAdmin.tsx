import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Edit, Trash2, ExternalLink, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/audit';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  tags?: string[];
  featured: boolean;
  publish_date?: string;
  created_at: string;
  updated_at: string;
};

export default function BlogAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Kaidyn Brownlie',
    meta_title: '',
    meta_description: '',
    image_url: '',
    tags: '',
    featured: false,
  });

  // Fetch posts from Supabase
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<BlogPost>) => {
      if (!data.title || !data.slug || !data.category || !data.content) {
        throw new Error('Title, slug, category, and content are required');
      }

      const payload = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        excerpt: data.excerpt,
        author: data.author,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        image_url: data.image_url,
        featured: data.featured || false,
        updated_at: new Date().toISOString(),
      };

      if (selectedPost) {
        const { error } = await supabase
          .from('content_blog_posts')
          .update(payload)
          .eq('id', selectedPost.id);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_edit',
          action: 'update',
          resource_type: 'blog_post',
          resource_id: selectedPost.id,
          details: { title: data.title },
        });
      } else {
        const { error } = await supabase
          .from('content_blog_posts')
          .insert([payload]);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_create',
          action: 'create',
          resource_type: 'blog_post',
          details: { title: data.title },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: selectedPost ? 'Post updated' : 'Post created',
        description: `${formData.title} has been saved successfully.`,
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await logAudit({
        event_type: 'content_delete',
        action: 'delete',
        resource_type: 'blog_post',
        resource_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setSelectedPost(null);
      toast({
        title: 'Post deleted',
        description: 'The blog post has been removed.',
      });
    },
  });

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      category: post.category,
      author: post.author || 'Kaidyn Brownlie',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      image_url: post.image_url || '',
      tags: post.tags?.join(', ') || '',
      featured: post.featured,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug || !formData.category || !formData.content) {
      toast({
        title: 'Validation Error',
        description: 'Title, slug, category, and content are required',
        variant: 'destructive',
      });
      return;
    }

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    saveMutation.mutate({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      author: formData.author,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      image_url: formData.image_url,
      tags,
      featured: formData.featured,
    });
  };

  const handlePublish = async () => {
    if (!selectedPost) return;
    
    const { error } = await supabase
      .from('content_blog_posts')
      .update({ 
        publish_date: selectedPost.publish_date ? null : new Date().toISOString() 
      })
      .eq('id', selectedPost.id);
    
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: selectedPost.publish_date ? 'Post unpublished' : 'Post published',
      });
    }
  };

  const filteredPosts = posts?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const isPublished = selectedPost?.publish_date && new Date(selectedPost.publish_date) <= new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage blog content and SEO</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Posts ({filteredPosts.length})</CardTitle>
              <Button size="sm" onClick={() => {
                setSelectedPost(null);
                setFormData({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  category: '',
                  author: 'Kaidyn Brownlie',
                  meta_title: '',
                  meta_description: '',
                  image_url: '',
                  tags: '',
                  featured: false,
                });
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No posts found</div>
            ) : (
              filteredPosts.map((post) => {
                const isLive = post.publish_date && new Date(post.publish_date) <= new Date();
                return (
                  <div
                    key={post.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPost?.id === post.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectPost(post)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{post.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {post.category}
                        </div>
                      </div>
                      {isLive ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0" variant="secondary">
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="shrink-0">Draft</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedPost || isEditing ? (
            <Tabs defaultValue="content">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {isEditing ? (selectedPost ? 'Edit' : 'New') : ''} {formData.title || 'Blog Post'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedPost && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a href={`/blog/${selectedPost.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Live
                          </a>
                        </Button>
                        <Button
                          variant={isPublished ? "outline" : "default"}
                          size="sm"
                          onClick={handlePublish}
                        >
                          {isPublished ? 'Unpublish' : 'Publish'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      disabled={!isEditing}
                      rows={12}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      disabled={!isEditing}
                      placeholder="roofing, restoration, tips"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      {selectedPost && (
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(selectedPost.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => {
                            setIsEditing(false);
                            if (selectedPost) {
                              handleSelectPost(selectedPost);
                            } else {
                              setSelectedPost(null);
                            }
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={saveMutation.isPending}>
                            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      disabled={!isEditing}
                      maxLength={60}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.meta_title.length}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.meta_description.length}/160 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Featured Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    {isEditing ? (
                      <>
                        <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Save SEO Settings</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit SEO
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No post selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a post from the list or create a new one
              </p>
              <Button onClick={() => {
                setSelectedPost(null);
                setFormData({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  category: '',
                  author: 'Kaidyn Brownlie',
                  meta_title: '',
                  meta_description: '',
                  image_url: '',
                  tags: '',
                  featured: false,
                });
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
