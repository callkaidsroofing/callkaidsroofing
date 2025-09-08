import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  lastModified: string;
  tags: string[];
  slug: string;
  featured?: boolean;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      
      // For now, we'll need to implement a way to get the page ID from the slug
      // This is a simplified version - in production you'd store slug->ID mapping
      toast.info('Feature in development: Individual blog post pages coming soon!');
      
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <SEOHead 
        title={post?.title ? `${post.title} | Call Kaids Roofing Blog` : "Blog Post | Call Kaids Roofing"}
        description={post?.excerpt || "Expert roofing advice and insights from Melbourne's leading roofing professionals."}
      />
      
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Development Notice */}
        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">
            Individual Blog Posts Coming Soon!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            We're working on implementing individual blog post pages that will fetch full content from your Notion database.
          </p>
          <p className="text-muted-foreground mb-8">
            This will include:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground mb-8">
            <li>• Full blog post content from Notion</li>
            <li>• Rich text formatting and images</li>
            <li>• Social sharing capabilities</li>
            <li>• Related post suggestions</li>
            <li>• Comment system integration</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/blog">View All Blog Posts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>

        {/* Sample of what the post layout will look like */}
        <div className="mt-12 opacity-50 pointer-events-none">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Roof Restoration</Badge>
              <Badge variant="outline">Maintenance Tips</Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Essential Roof Maintenance Tips for Melbourne Homes
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                March 15, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5 min read
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={sharePost}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Melbourne's unpredictable weather can take a serious toll on your roof. From scorching summer heat to winter storms, your roof faces constant challenges throughout the year...
              </p>
              <h2>Regular Inspection Schedule</h2>
              <p>
                The key to maintaining a healthy roof is regular inspection. We recommend checking your roof at least twice a year...
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;