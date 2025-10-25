import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, User, ArrowLeft, ArrowRight, Share2, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch post from Supabase
  const { data: dbPost, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });

  // Fallback to hardcoded posts
  const hardcodedPost = blogPosts.find((p) => p.slug === slug);
  const post = dbPost || hardcodedPost;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const category = blogCategories.find(c => c.id === post.category);
  const relatedPostsIds = (post as any).relatedPosts || (post as any).related_posts;
  const relatedPosts = relatedPostsIds
    ? blogPosts.filter(p => relatedPostsIds?.includes(p.id)).slice(0, 3)
    : blogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | Call Kaids Roofing Blog`}
        description={(post as any).meta_description || post.excerpt}
        keywords={post.tags?.join(", ") || ''}
      />

      <Helmet>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={(post as any).imageUrl || (post as any).image_url} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={(post as any).publishDate || (post as any).publish_date} />
        <meta property="article:section" content={category?.name} />
        {post.tags?.map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        {/* Back Button */}
        <div className="py-6 px-4 border-b border-primary/10">
          <div className="container mx-auto">
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6">
              <Badge className={`${category?.color || 'bg-primary'} mb-4`}>
                {category?.icon} {category?.name}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date((post as any).publishDate || (post as any).publish_date).toLocaleDateString('en-AU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{(post as any).readTime || (post as any).read_time} min read</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-xl mb-12 shadow-2xl">
              <OptimizedImage
                src={(post as any).imageUrl || (post as any).image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-sm md:prose-base max-w-none">
              {/* Parse markdown-style content */}
              <div 
                className="space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .replace(/#{4,6}\s/g, '<h4 class="text-base md:text-lg font-semibold text-foreground mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-4 bg-primary rounded"></span>')
                    .replace(/#{3}\s/g, '<h3 class="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-5 bg-primary rounded"></span>')
                    .replace(/#{2}\s/g, '<h2 class="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-primary/20">')
                    .replace(/#{1}\s/g, '<h1 class="text-2xl md:text-3xl font-bold text-foreground mt-6 mb-4">')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-primary">$1</em>')
                    .replace(/\n\n/g, '</p><p class="mb-3 text-sm md:text-base">')
                    .replace(/^/, '<p class="mb-3 text-sm md:text-base">')
                    .replace(/$/, '</p>')
                    .replace(/- \*\*(.*?)\*\*:/g, '<li class="mb-2"><strong class="text-foreground">$1</strong>:')
                    .replace(/- (.*?)$/gm, '<li class="mb-1 text-sm md:text-base">$1</li>')
                    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-5 space-y-1 my-3 text-sm md:text-base">$1</ul>')
                    .replace(/✅ \*\*(.*?)\*\*/g, '<div class="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-r mb-3"><span class="text-green-600 text-lg">✅</span><span class="text-sm"><strong class="text-green-800">$1</strong></span></div>')
                    .replace(/⚠️ \*\*(.*?)\*\*/g, '<div class="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r mb-3"><span class="text-yellow-600 text-lg">⚠️</span><span class="text-sm"><strong class="text-yellow-800">$1</strong></span></div>')
                    .replace(/🚨 \*\*(.*?)\*\*/g, '<div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r mb-3"><span class="text-red-600 text-lg">🚨</span><span class="text-sm"><strong class="text-red-800">$1</strong></span></div>')
                }}
              />
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* CTA Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Need Professional Roofing Service?
                </h3>
                <p className="text-lg mb-6 text-white/90">
                  Don't wait for small problems to become major expenses. Get your free roof assessment today.
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
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 px-4 bg-background/60">
            <div className="container mx-auto max-w-6xl">
              <h3 className="text-3xl font-bold mb-8 text-center">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: any) => {
                  const relatedCategory = blogCategories.find(c => c.id === relatedPost.category);
                  return (
                    <Card key={relatedPost.id} className="group hover:shadow-lg transition-all duration-300">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <OptimizedImage
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className={`absolute top-3 left-3 ${relatedCategory?.color || 'bg-primary'}`}>
                          {relatedCategory?.icon} {relatedCategory?.name}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedPost.readTime} min
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-muted-foreground text-sm line-clamp-3">{relatedPost.excerpt}</p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Link to={`/blog/${relatedPost.slug}`}>
                            Read Article <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
