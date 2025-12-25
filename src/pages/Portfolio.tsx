import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PublicPageHero } from '@/public/components/PublicPageHero';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';
import ParallaxBackground from '@/components/ParallaxBackground';
import { CTASection } from '@/components/ui/cta-section';

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
    <div className="min-h-screen">
      <Helmet>
        <title>Portfolio - Call Kaids Roofing | Completed Projects SE Melbourne</title>
        <meta
          name="description"
          content="View our completed roofing projects across SE Melbourne. Real results, real customers, real proof. Tile roofing, metal roofing, and roof repairs."
        />
      </Helmet>

      {/* Hero Section */}
      <PublicPageHero
        h1="Our Work Speaks for Itself"
        subtitle="*Proof In Every Roof*"
        description="200+ satisfied homeowners across Southeast Melbourne trust us with their roofs. See the quality and craftsmanship that sets us apart."
      />

      {/* Portfolio Grid */}
      <ParallaxBackground variant="services" density="low">
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Recent Projects
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Real projects from real customers across Southeast Melbourne
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-white/20 rounded w-1/2 mb-6" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/20 rounded w-full" />
                      <div className="h-4 bg-white/20 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : caseStudies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((study) => {
                  const title = `${study.job_type} in ${study.suburb}`;
                  const displaySlug = study.slug || study.study_id;

                  return (
                    <div
                      key={study.id}
                      className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-lg hover:border-conversion-cyan/60 transition-all group"
                    >
                      <h3 className="text-xl font-bold text-white group-hover:text-conversion-cyan transition-colors mb-2">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{study.suburb}</span>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div>
                          <p className="text-sm font-semibold text-conversion-cyan mb-1">Problem</p>
                          <p className="text-white/80 text-sm">{study.client_problem}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-conversion-cyan mb-1">Outcome</p>
                          <p className="text-white/80 text-sm">{study.key_outcome}</p>
                        </div>
                      </div>
                      <Link to={`/portfolio/${displaySlug}`}>
                        <Button className="w-full bg-conversion-blue hover:bg-conversion-cyan text-white group-hover:scale-105 transition-transform">
                          View Project
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 backdrop-blur bg-white/10 border border-white/20 rounded-xl">
                <p className="text-white/70 text-lg">No case studies available at the moment</p>
              </div>
            )}
          </Container>
        </SectionWrapper>
      </ParallaxBackground>

      {/* Final CTA */}
      <ParallaxBackground variant="cta" density="medium">
        <CTASection
          headline="Ready to See Your Roof Transform?"
          description="Join the 200+ homeowners who trust Call Kaids Roofing for quality workmanship and honest service."
        />
      </ParallaxBackground>
    </div>
  );
};

export default Portfolio;
