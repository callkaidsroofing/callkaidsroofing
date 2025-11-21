import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { 
  Phone, ArrowRight, MapPin, CheckCircle, Star, Clock, 
  Shield, Award, TrendingUp, Zap, MessageCircle 
} from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
        {/* Hero Section - Premium Design */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Location Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
              <Badge variant="outline" className="glass-card border-primary/30 px-4 py-2 text-base">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="font-semibold">{suburb.name}</span>
                {suburb.postcode && (
                  <span className="ml-2 text-muted-foreground">{suburb.postcode}</span>
                )}
              </Badge>
              {suburb.distance_from_base && (
                <Badge variant="outline" className="glass-card border-secondary/30 px-4 py-2 text-base">
                  <Clock className="h-4 w-4 mr-2 text-secondary" />
                  <span>{suburb.distance_from_base} min away</span>
                </Badge>
              )}
            </div>

            {/* Main Headline */}
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                Professional Roofing<br className="md:hidden" /> in {suburb.name}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
                <span className="italic font-serif">Proof In Every Roof</span> – Your Trusted Local Roofer
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Owner-operated, fully insured, 15-year warranty. No call centers, just honest advice from Kaidyn.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                asChild 
                size="xl" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 shadow-xl shadow-primary/30"
              >
                <a href="tel:0435900709" className="group">
                  <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Call Now: 0435 900 709
                </a>
              </Button>
              <Button 
                asChild 
                size="xl" 
                variant="outline"
                className="border-2 border-primary/30 text-lg px-8 py-6 hover:bg-primary/10"
              >
                <Link to={`/quote?suburb=${suburb.slug}`}>
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators - Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-3">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-bold text-xl mb-1">15-Year</p>
                  <p className="text-xs text-muted-foreground">Warranty</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full mb-3">
                    <Award className="h-7 w-7 text-secondary" />
                  </div>
                  <p className="font-bold text-xl mb-1">Fully</p>
                  <p className="text-xs text-muted-foreground">Insured</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-3">
                    <Star className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-bold text-xl mb-1">{suburb.projects_completed || '50'}+</p>
                  <p className="text-xs text-muted-foreground">Local Jobs</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full mb-3">
                    <MessageCircle className="h-7 w-7 text-secondary" />
                  </div>
                  <p className="font-bold text-xl mb-1">Direct</p>
                  <p className="text-xs text-muted-foreground">Owner Contact</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Emergency Services Banner */}
        <section className="py-4 px-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-y border-orange-500/20">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center md:text-left">
                <Zap className="h-6 w-6 text-orange-500 animate-pulse" />
                <div>
                  <p className="font-bold text-foreground">Emergency Roof Repairs in {suburb.name}</p>
                  <p className="text-sm text-muted-foreground">Same-day service available for urgent leaks</p>
                </div>
              </div>
              <Button asChild variant="destructive" size="lg" className="bg-orange-500 hover:bg-orange-600">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency: 0435 900 709
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us for [Suburb] - Enhanced */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why {suburb.name} Homeowners Choose Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {suburb.local_seo_content || suburb.description || 
                  `We're not the biggest roofing company in ${suburb.region || 'SE Melbourne'} - we're the most reliable. Every job in ${suburb.name} gets the same attention to detail, whether it's a small repair or a complete restoration.`
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="glass-card hover:shadow-2xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Local Expertise</CardTitle>
                  <CardDescription>
                    {suburb.distance_from_base 
                      ? `Just ${suburb.distance_from_base} minutes from our Clyde North base`
                      : `Serving ${suburb.name} regularly`
                    }. We know the common roof issues in your area.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card hover:shadow-2xl transition-all duration-300 border-secondary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg mb-4">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">No BS Guarantee</CardTitle>
                  <CardDescription>
                    When you call, you speak with Kaidyn - the owner who will actually do your job. No sales teams, no bait-and-switch.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card hover:shadow-2xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Premium Materials Only</CardTitle>
                  <CardDescription>
                    We don't cut corners with cheap materials. Everything we use is specifically chosen for Melbourne's harsh conditions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Grid - Premium Design */}
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/5 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Roofing Services in {suburb.name}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From minor repairs to complete restorations - we do it all with the same attention to quality
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="glass-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-primary/10 hover:border-primary/30"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {suburb.name}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Professional {service.toLowerCase()} services for {suburb.name} homes. Quality materials, expert workmanship, 15-year warranty.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>15-year warranty</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Premium materials only</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Owner-operated service</span>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link to={`/quote?suburb=${suburb.slug}&service=${service.toLowerCase().replace(/\s+/g, '-')}`}>
                        Get Free Quote
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Service Note */}
            <div className="mt-12 text-center">
              <Card className="glass-card border-secondary/20 max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    <strong>Not sure which service you need?</strong> Kaidyn can assess your roof and recommend the most cost-effective solution. No obligation, no sales pressure.
                  </p>
                  <Button asChild size="lg" variant="outline">
                    <a href="tel:0435900709">
                      <Phone className="mr-2 h-4 w-4" />
                      Call for Free Advice: 0435 900 709
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What {suburb.name} Residents Say
              </h2>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">5.0 stars from 200+ happy customers across SE Melbourne</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "Kaidyn was brilliant - showed up on time, did exactly what he quoted, and the roof looks amazing. No BS, just quality work."
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">David M.</p>
                      <p className="text-sm text-muted-foreground">{suburb.name} Homeowner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "Finally found a roofer who doesn't try to upsell unnecessary work. Fair pricing, excellent quality, highly recommend."
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">Sarah L.</p>
                      <p className="text-sm text-muted-foreground">Local Resident</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "Best roofing experience I've had. Kaidyn explained everything clearly and the 15-year warranty gives total peace of mind."
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">Michael P.</p>
                      <p className="text-sm text-muted-foreground">{suburb.region || 'SE Melbourne'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Conversion Optimized */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready for a Roof That Lasts in {suburb.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stop worrying about your roof. Get honest advice, fair pricing, and work that's built to last 15+ years.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="xl" variant="secondary" className="text-lg px-8 py-6 shadow-2xl">
                <a href="tel:0435900709" className="group">
                  <Phone className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                  Call Kaidyn: 0435 900 709
                </a>
              </Button>
              <Button 
                asChild 
                size="xl" 
                variant="outline" 
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
              >
                <Link to={`/quote?suburb=${suburb.slug}`}>
                  Get Free Quote
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-75 border-t border-white/20 pt-8">
              <div>
                <Shield className="h-5 w-5 mx-auto mb-2" />
                <p>Fully insured with public liability & workers comp</p>
              </div>
              <div>
                <Award className="h-5 w-5 mx-auto mb-2" />
                <p>15-year comprehensive warranty on all major work</p>
              </div>
              <div>
                <Star className="h-5 w-5 mx-auto mb-2" />
                <p>5-star rated by 200+ SE Melbourne customers</p>
              </div>
            </div>

            <div className="mt-8 text-sm opacity-75">
              <p>
                <strong>Call Kaids Roofing</strong> | Email: info@callkaidsroofing.com.au<br />
                ABN: 39475055075 | Serving {suburb.name} and all of {suburb.region || 'SE Melbourne'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuburbPage;
