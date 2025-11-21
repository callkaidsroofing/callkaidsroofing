import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface CaseStudy {
  id: string;
  study_id: string;
  slug: string | null;
  job_type: string;
  client_problem: string;
  solution_provided: string;
  key_outcome: string;
  suburb: string;
  featured: boolean | null;
  meta_description: string | null;
  before_image: string | null;
  after_image: string | null;
}

const Portfolio = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching case studies:', error);
      } else {
        setCaseStudies(data || []);
      }
      setLoading(false);
    };

    fetchCaseStudies();
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio - Call Kaids Roofing | Completed Projects SE Melbourne</title>
        <meta 
          name="description" 
          content="View our completed roofing projects across SE Melbourne. Real results, real customers, real proof. Tile roofing, metal roofing, and roof repairs." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Work Speaks for Itself
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              <em>Proof In Every Roof</em> - Real projects from real customers
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              200+ satisfied homeowners across Southeast Melbourne trust us with their roofs. 
              See the quality and craftsmanship that sets us apart.
            </p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="glass-card animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : caseStudies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((study) => {
                  const title = `${study.job_type} in ${study.suburb}`;
                  const displaySlug = study.slug || study.study_id;
                  
                  return (
                  <Card
                    key={study.id} 
                    className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">
                        {title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        {study.suburb}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-4">
                        {study.client_problem}
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/case-studies/${displaySlug}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-16 text-center">
                  <h2 className="text-2xl font-bold mb-4">Our Portfolio is Growing</h2>
                  <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                    We're currently updating our portfolio with recent projects. In the meantime, 
                    we've completed 200+ successful roofing projects across Berwick, Narre Warren, 
                    Cranbourne, and surrounding SE Melbourne areas.
                  </p>
                  <div className="space-y-4 mb-8 max-w-xl mx-auto text-left">
                    <div className="flex gap-3">
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        <strong>Tile Roofing:</strong> Full re-roofs, ridge cap re-bedding, tile replacements
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        <strong>Metal Roofing:</strong> Colorbond installations, repairs, re-sheeting
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        <strong>Roof Repairs:</strong> Leak fixes, storm damage, general maintenance
                      </p>
                    </div>
                  </div>
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary">
                    <Link to="/quote">
                      Get Your Free Quote
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join 200+ satisfied homeowners who chose Call Kaids Roofing for their roofing needs. 
              Get your free, no-obligation quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="bg-gradient-to-r from-primary to-secondary">
                <Link to="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/services">
                  View Our Services
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Portfolio;
