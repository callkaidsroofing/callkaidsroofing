import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { LeadCaptureForm } from '@/public/components/LeadCaptureForm';
import { CaseStudyShowcase } from '@/components/CaseStudyShowcase';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_services')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['related-blog-posts', service?.name],
    queryFn: async () => {
      if (!service?.name) return [];
      
      const { data, error } = await supabase
        .from('content_blog_posts')
        .select('*')
        .contains('tags', [service.name])
        .limit(3);
      
      if (error) return [];
      return data;
    },
    enabled: !!service,
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Service Not Found</h1>
        <Button asChild>
          <Link to="/services">View All Services</Link>
        </Button>
      </div>
    );
  }

  const processSteps = service.process_steps ? 
    (typeof service.process_steps === 'string' ? JSON.parse(service.process_steps) : service.process_steps) : 
    [];

  return (
    <>
      <SEOHead
        title={service.meta_title || `${service.name} | Call Kaids Roofing`}
        description={service.meta_description || service.short_description || ''}
        keywords={service.service_tags?.join(', ') || ''}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-roofing-navy to-roofing-navy/95">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {service.short_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" onClick={() => window.location.href = 'tel:0435900709'}>
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/book">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Description */}
      <section className="py-16 card-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
            <div dangerouslySetInnerHTML={{ __html: service.full_description?.replace(/\n/g, '<br/>') || '' }} />
          </div>
        </div>
      </section>

      {/* Process Steps */}
      {processSteps.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {processSteps.map((step: any, index: number) => (
                <div key={index} className="flex gap-4 p-6 rounded-lg bg-card border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{step.step || index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      <section className="py-16 card-gradient">
        <div className="container mx-auto px-4">
          <CaseStudyShowcase limit={3} />
        </div>
      </section>

      {/* Related Blog Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((post: any) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group block p-6 rounded-lg bg-card border border-border hover:border-primary transition-all"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="text-primary flex items-center gap-2">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture Form */}
      <LeadCaptureForm
        variant="split"
        title="FREE Roof Health Check"
        description="Get your roof assessed by Kaidyn personally. No junior staff, no sales pressure."
        serviceName="Free Roof Health Check"
        ctaText="Book My Free Assessment"
        source="quick_capture_form"
        showBenefits={true}
        showImageUpload={true}
        showUrgencyBadge={true}
        urgencyBadgeText="Free assessment - limited availability"
        benefits={[
          { title: "Complete Inspection", description: "25-point roof assessment with photo documentation" },
          { title: "Honest Written Report", description: "What needs fixing now vs. what can wait" },
          { title: "No Obligation Quote", description: "Transparent pricing with 15-year warranty options" }
        ]}
      />
    </>
  );
}
