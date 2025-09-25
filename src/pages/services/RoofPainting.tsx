import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Clock, Shield, MapPin, Calendar, Palette, Home, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceSpecificForm from '@/components/ServiceSpecificForm';
import { SEO } from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';

const RoofPainting = () => {
  const benefits = [
    "Instant curb appeal - dramatic visual transformation",
    "Energy savings - reflective coatings reduce cooling costs by 10-15%",
    "Property value increase - typically 2-3% boost in home value",
    "Extended roof life - quality paints protect underlying materials",
    "Cost-effective - 60% less expensive than roof restoration"
  ];

  const process = [
    {
      day: "Day 1",
      title: "Preparation and Cleaning",
      tasks: [
        "High-pressure cleaning removes dirt, moss, and debris",
        "Surface preparation including minor repairs",
        "Primer application for optimal paint adhesion",
        "Protection setup for gutters, windows, and landscaping"
      ]
    },
    {
      day: "Day 2", 
      title: "Paint Application",
      tasks: [
        "First coat application using professional spray equipment",
        "Quality control checking coverage and consistency",
        "Second coat preparation ensuring proper drying time",
        "Weather monitoring for optimal application conditions"
      ]
    },
    {
      day: "Day 3",
      title: "Finishing and Cleanup", 
      tasks: [
        "Final coat application for complete coverage",
        "Detail work around edges and penetrations",
        "Quality inspection ensuring professional finish",
        "Complete cleanup and property restoration"
      ]
    }
  ];

  const serviceAreas = [
    {
      category: "Primary Service Area (15-30 minutes)",
      suburbs: [
        "Clyde North - Our home base, know every street",
        "Berwick - Major service area, 10 minutes away", 
        "Officer - Growing suburb, quality-focused homeowners",
        "Pakenham - Established community",
        "Cranbourne - Australia's #4 renovation hotspot"
      ]
    },
    {
      category: "Extended Service Area (30-45 minutes)",
      suburbs: [
        "Frankston - Established suburb, high demand",
        "Narre Warren - Family homes, practical solutions",
        "Dandenong - Mixed residential area",
        "Springvale - Diverse community",
        "Noble Park - Working families area"
      ]
    },
    {
      category: "Premium Service Area (45-60 minutes)",
      suburbs: [
        "Brighton - Bayside luxury homes",
        "Toorak - High-end properties", 
        "Kew - Heritage and character homes",
        "Hawthorn - Premium residential",
        "Canterbury - Established quality area"
      ]
    }
  ];

  const paintSystems = [
    "Supa Point - Premium membrane system with superior adhesion",
    "Premier Roof Coatings - Proven Melbourne performance and durability", 
    "RGL Roof Paint - Superior UV protection and colour retention",
    "Shield Coat Roof Paint - Energy-efficient formulation with thermal reflection",
    "Industrial Roof Coatings - Heavy-duty protection for extreme conditions"
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Roof Painting Melbourne | Tile & Metal Roof Coatings"
        description="Transform your home’s look with expert roof painting. Protective coatings, colour matched finishes, 10-year warranty. Serving SE Melbourne."
        keywords="roof painting Melbourne, tile roof painting Melbourne, metal roof coatings, Call Kaids Roofing"
        canonical="https://callkaidsroofing.com.au/services/roof-painting"
      />
      <StructuredData 
        type="service" 
        serviceName="Roof Painting"
        serviceDescription="Professional 3-day roof painting service with premium weather-resistant paint systems"
        pageUrl="https://callkaidsroofing.com.au/services/roof-painting"
      />
      {/* Hero Section */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png"
        gradient="linear-gradient(130deg, rgba(12,74,110,0.9), rgba(37,99,235,0.82))"
        className="py-20 text-white"
        imageAlt="Roof painting preparation background"
        sizes="(max-width: 1024px) 100vw, 960px"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Roof Painting Melbourne
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Transform your home in 3 days. Premium paints. 10-year warranty. $4,000-$10,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/book">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </OptimizedBackgroundSection>

      {/* Service Form */}
      <ServiceSpecificForm 
        serviceName="Roof Painting"
        serviceDescription="Professional 3-day roof painting service with premium weather-resistant paint systems and thorough preparation"
        ctaText="Get Free Painting Quote"
      />

      {/* Process Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Roof Painting Process by Call Kaids Roofing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {process.map((day, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1">{day.day}</Badge>
                  </div>
                  <CardTitle>{day.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {day.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Suburbs We Serve for Roof Painting</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceAreas.map((area, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {area.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {area.suburbs.map((suburb, subIndex) => (
                      <li key={subIndex} className="text-sm text-muted-foreground">
                        {suburb}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Roof Painting Costs Southeast Melbourne</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Typical Pricing by Home Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Small homes (150-200m²)</span>
                  <Badge variant="outline">$4,000 - $6,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Medium homes (200-300m²)</span>
                  <Badge variant="outline">$6,000 - $9,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Large homes (300-400m²)</span>
                  <Badge variant="outline">$9,000 - $12,000</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Premium/complex roofs</span>
                  <Badge variant="outline">$12,000 - $18,000</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  What's Included in Our Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Complete high-pressure cleaning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Surface preparation and minor repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Premium primer application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Two coats of quality roof paint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">10-year warranty on workmanship</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Full cleanup and site restoration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Call Kaids Roofing for Roof Painting</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Local Southeast Melbourne Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Based in Clyde North - know local conditions</li>
                  <li>• 25+ years of combined roofing experience in Southeast Melbourne</li>
                  <li>• Understand local weather patterns</li>
                  <li>• Community reputation built on quality work</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Quality Materials and Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Premium paint systems only</li>
                  <li>• Professional equipment for consistency</li>
                  <li>• Proper preparation ensuring lasting results</li>
                  <li>• Weather monitoring for optimal application</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Personal Service and Accountability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Owner-operated - Kaidyn personally supervises</li>
                  <li>• Direct communication with decision maker</li>
                  <li>• Handpicked crew trained to our standards</li>
                  <li>• 10-year warranty backed by local reputation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Transform Your Home's Appearance in Just 3 Days</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Professional roof painting by Call Kaids Roofing. Serving all Southeast Melbourne suburbs within 50km of Clyde North. 
            Due to high demand, we're usually booked 2-3 weeks out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Kaidyn Direct: 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/book">Get Free Quote</Link>
            </Button>
          </div>
          <div className="mt-8 space-y-2 text-sm opacity-75">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Monday-Friday: 7am-6pm | Saturday: 8am-4pm</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Service Area: 50km radius of Clyde North</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofPainting;