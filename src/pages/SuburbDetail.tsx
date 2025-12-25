import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock } from 'lucide-react';
import { LeadCaptureForm } from '@/public/components/LeadCaptureForm';
import { CaseStudyShowcase } from '@/components/CaseStudyShowcase';

export default function SuburbDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: suburb, isLoading } = useQuery({
    queryKey: ['suburb', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_suburbs')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });

  const { data: availableServices } = useQuery({
    queryKey: ['suburb-services', suburb?.services_available],
    queryFn: async () => {
      if (!suburb?.services_available || suburb.services_available.length === 0) return [];
      
      const { data, error } = await supabase
        .from('content_services')
        .select('*')
        .in('name', suburb.services_available)
        .order('display_order');
      
      if (error) return [];
      return data;
    },
    enabled: !!suburb?.services_available,
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!suburb) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Suburb Not Found</h1>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={suburb.meta_title || `Professional Roofing Services in ${suburb.name} | Call Kaids Roofing`}
        description={suburb.meta_description || suburb.description || ''}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-roofing-navy to-roofing-navy/95">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold">
                {suburb.region} | Postcode {suburb.postcode}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Professional Roofing Services in {suburb.name}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {suburb.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="phone" onClick={() => window.location.href = 'tel:0435900709'}>
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

      {/* Stats */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {suburb.distance_from_base || 0} km
              </div>
              <div className="text-sm text-muted-foreground">From Our Base</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {suburb.projects_completed || 0}+
              </div>
              <div className="text-sm text-muted-foreground">Completed Projects</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary">Same Day</span>
              </div>
              <div className="text-sm text-muted-foreground">Emergency Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      {suburb.local_seo_content && (
        <section className="py-16 card-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg prose-invert">
              <h2 className="text-3xl font-bold mb-6">Why Choose Us in {suburb.name}?</h2>
              <div dangerouslySetInnerHTML={{ __html: suburb.local_seo_content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        </section>
      )}

      {/* Available Services */}
      {availableServices && availableServices.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services in {suburb.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {availableServices.map((service: any) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group block p-6 rounded-lg bg-card border border-border hover:border-primary transition-all"
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {service.short_description}
                  </p>
                  <span className="text-primary font-semibold">Learn More →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      <section className="py-16 card-gradient">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Recent Projects in {suburb.name}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            See the quality roofing work we've delivered to your neighbors
          </p>
          <CaseStudyShowcase suburb={suburb.name} limit={6} />
        </div>
      </section>

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
