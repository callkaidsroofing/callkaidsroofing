import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { SEOHead } from "@/components/SEOHead";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // Fetch blog posts from Supabase
  const { data: dbPosts, isLoading } = useQuery({
    queryKey: ['blog-posts', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('content_blog_posts')
        .select('*')
        .lte('publish_date', new Date().toISOString())
        .order('publish_date', { ascending: false });
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });

  // Use DB posts if available, fallback to hardcoded
  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : blogPosts;

  const filteredPosts = categoryFilter
    ? posts.filter((p: any) => p.category === categoryFilter)
    : posts;

  return (
    <>
      <SEOHead
        title="Roofing Blog | Expert Tips & Guides | Call Kaids Roofing"
        description="Get expert roofing advice, maintenance tips, and industry insights from Melbourne's trusted roofing professionals."
        keywords="roofing tips, roof maintenance, roofing guides, Melbourne roofing blog"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-roofing-navy to-roofing-navy/90">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
              Expert Roofing Insights
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Learn from Melbourne's roofing experts. Get practical tips, maintenance guides, 
              and honest advice to protect your biggest investment.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4 border-b border-primary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={!categoryFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchParams({})}
              >
                All Posts
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchParams({ category: category.id })}
                  className={categoryFilter === category.id ? category.color : ''}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post: any) => {
                  const category = blogCategories.find(c => c.id === post.category);
                  return (
                    <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <Link to={`/blog/${post.slug}`}>
                        <div className="relative overflow-hidden">
                          <OptimizedImage
                            src={post.imageUrl || post.image_url}
                            alt={post.title}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {category && (
                            <Badge className={`absolute top-3 left-3 ${category.color || 'bg-primary'}`}>
                              {category.icon} {category.name}
                            </Badge>
                          )}
                          {post.featured && (
                            <Badge className="absolute top-3 right-3 bg-yellow-500">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.publishDate || post.publish_date).toLocaleDateString('en-AU', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime || post.read_time} min
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            Read Article <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}

            {filteredPosts.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No posts found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Protect Your Investment?
            </h3>
            <p className="text-xl mb-8 text-white/90">
              Get professional roofing advice tailored to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/book">
                  Book Free Roof Health Check
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <a href="tel:0435900709">
                  Call Kaidyn: 0435 900 709
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
