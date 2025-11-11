import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Phone, ArrowRight, MapPin, CheckCircle, Star, Clock } from 'lucide-react';

interface Suburb {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postcode: string | null;
  region: string | null;
  services_available: string[] | null;
  local_seo_content: string | null;
  distance_from_base: number | null;
  projects_completed: number | null;
  meta_title: string | null;
  meta_description: string | null;
}

const SuburbPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [suburb, setSuburb] = useState<Suburb | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSuburb = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('content_suburbs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        console.error('Error fetching suburb:', error);
        setNotFound(true);
      } else {
        setSuburb(data);
      }
      setLoading(false);
    };

    fetchSuburb();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (notFound || !suburb) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-6">Suburb Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              We couldn't find information for this suburb. We serve all of SE Melbourne - give us a call to discuss your roofing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="bg-gradient-to-r from-primary to-secondary">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: 0435 900 709
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/quote">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const services = suburb.services_available || [
    'Roof Restoration',
    'Roof Painting',
    'Roof Repairs',
    'Tile Replacement',
    'Rebedding & Repointing'
  ];

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Call Kaids Roofing - ${suburb.name}`,
    "image": "https://callkaidsroofing.com.au/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": suburb.name,
      "addressRegion": "VIC",
      "postalCode": suburb.postcode || "",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "",
      "longitude": ""
    },
    "telephone": "0435900709",
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": suburb.name
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "postalCode": suburb.postcode || ""
      },
      "geoRadius": "15000"
    }
  };

  const pageTitle = suburb.meta_title || `Roof Repairs ${suburb.name} | Call Kaids Roofing - Trusted Local Roofer`;
  const pageDescription = suburb.meta_description || 
    `Professional roofing services in ${suburb.name}, VIC. Roof restoration, painting, repairs. 15-year warranty. Call Kaidyn: 0435 900 709. Proof In Every Roof.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`roof repairs ${suburb.name}, roofing ${suburb.name}, roof restoration ${suburb.name}, ${suburb.postcode || ''}`} />
        <script type="application/ld+json">
          {JSON.stringify(localSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  {suburb.region || 'SE Melbourne'} {suburb.postcode && `• ${suburb.postcode}`}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Roofing Services in {suburb.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                <em>Proof In Every Roof</em> - Your Trusted Local Roofer
              </p>
              {suburb.distance_from_base && (
                <p className="text-muted-foreground flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" />
                  Just {suburb.distance_from_base} minutes from our base in Clyde North
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="font-bold text-2xl mb-1">15-Year</p>
                  <p className="text-sm text-muted-foreground">Warranty on All Work</p>
                </CardContent>
              </Card>
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <Star className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="font-bold text-2xl mb-1">{suburb.projects_completed || '50+'}+</p>
                  <p className="text-sm text-muted-foreground">Projects in {suburb.name}</p>
                </CardContent>
              </Card>
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="font-bold text-2xl mb-1">Direct</p>
                  <p className="text-sm text-muted-foreground">Owner Contact</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Local Content */}
        {(suburb.description || suburb.local_seo_content) && (
          <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="container mx-auto max-w-4xl">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Professional Roofing in {suburb.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {suburb.local_seo_content || suburb.description || 
                      `Call Kaids Roofing proudly serves ${suburb.name} and the surrounding ${suburb.region || 'SE Melbourne'} area. As your local roofing experts, we understand the unique challenges that ${suburb.name} homes face - from weather exposure to building styles common in the area. Our owner-operated business ensures you receive personalized service and the highest quality workmanship, backed by our comprehensive 15-year warranty.`
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Services Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services in {suburb.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      {service}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Professional {service.toLowerCase()} services for {suburb.name} homes.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/quote?suburb=${suburb.slug}&service=${service.toLowerCase().replace(/\s+/g, '-')}`}>
                        Get Free Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready for Professional Roofing in {suburb.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Call Kaidyn directly - no call centers, just honest advice from a local tradesman who cares about quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" variant="secondary">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now: 0435 900 709
                </a>
              </Button>
              <Button asChild size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Serving {suburb.name} and all of {suburb.region || 'SE Melbourne'} • ABN: 39475055075
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuburbPage;
