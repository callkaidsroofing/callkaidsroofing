import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowRight, Search, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  lastModified: string;
  tags: string[];
  slug: string;
  featured?: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [databaseId, setDatabaseId] = useState('');
  const [availableDatabases, setAvailableDatabases] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogPosts();
  }, [databaseId]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('fetch-notion-blog', {
        body: databaseId ? { databaseId } : {}
      });

      if (error) {
        throw error;
      }

      if (data.posts) {
        setPosts(data.posts);
      } else if (data.availableDatabases) {
        setAvailableDatabases(data.availableDatabases);
        toast.info('Please select a database to display blog posts');
      }
      
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to fetch blog posts from Notion');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <SEOHead 
          title="Roofing Blog & Tips | Call Kaids Roofing Melbourne"
          description="Expert roofing advice, maintenance tips, and industry insights from Melbourne's leading roofing professionals. Learn about roof restoration, painting, and repairs."
        />
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-8">
            <Skeleton className="h-12 w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <SEOHead 
        title="Roofing Blog & Expert Tips | Call Kaids Roofing Melbourne"
        description="Get expert roofing advice from Melbourne's leading professionals. Learn about roof restoration, painting, maintenance tips, and industry insights from Kaidyn Brownlie."
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Roofing Expertise & Industry Insights
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Get professional advice from Melbourne's most experienced roofing team. Tips, insights, and real-world solutions for your roofing needs.
          </p>
          
          {!databaseId && availableDatabases.length > 0 && (
            <div className="max-w-md mx-auto">
              <p className="text-sm mb-4">Select your Notion database to display blog posts:</p>
              <div className="space-y-2">
                {availableDatabases.map((db) => (
                  <Button
                    key={db.id}
                    variant="secondary"
                    onClick={() => setDatabaseId(db.id)}
                    className="w-full text-left justify-start"
                  >
                    {db.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <>
          {/* Search and Filter */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedTag === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag('')}
                  >
                    All Topics
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8">
                  <Star className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-bold">Featured Articles</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Featured
                          </Badge>
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-xl md:text-2xl line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.publishedDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            5 min read
                          </div>
                        </div>
                        
                        <Button asChild className="w-full">
                          <Link to={`/blog/${post.slug}`}>
                            Read Full Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Regular Posts Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
              </h2>
              
              {regularPosts.length === 0 && featuredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No articles found matching your search criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('');
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                      <CardHeader className="pb-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground line-clamp-3 text-sm">{post.excerpt}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            3 min read
                          </div>
                        </div>
                        
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link to={`/blog/${post.slug}`}>
                            Read Article
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {posts.length === 0 && !loading && databaseId && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">No Blog Posts Found</h2>
            <p className="text-muted-foreground mb-8">
              Make sure your Notion database has pages with a "Status" property set to "Published".
            </p>
            <Button onClick={fetchBlogPosts} variant="outline">
              Retry Loading
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;