import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Clock, Shield, MapPin, Droplets, Home, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const GutterCleaning = () => {
  const services = [
    {
      service: "Professional Cleaning",
      description: "Complete removal of all debris, leaves, and blockages",
      included: ["High-pressure cleaning", "Debris removal", "Downpipe clearing", "Visual inspection"],
      cost: "$200-400"
    },
    {
      service: "Minor Repairs",
      description: "Fix small issues found during cleaning",
      included: ["Bracket adjustments", "Small hole patching", "Joint resealing", "Alignment corrections"],
      cost: "$50-200"
    },
    {
      service: "Gutter Guard Installation", 
      description: "Leaf guards to prevent future blockages",
      included: ["Quality mesh installation", "Custom fitting", "Existing gutter assessment", "Ongoing protection"],
      cost: "$15-25/m"
    },
    {
      service: "Full Gutter Replacement",
      description: "Complete gutter system replacement when beyond repair",
      included: ["Remove old gutters", "Install new system", "Proper fall installation", "Colour coordination"],
      cost: "$25-45/m"
    }
  ];

  const seasonalTiming = [
    {
      season: "Autumn (March-May)",
      priority: "High Priority",
      description: "Before winter rains, remove leaf debris from deciduous trees.",
      frequency: "Essential annual clean"
    },
    {
      season: "Spring (September-November)", 
      priority: "Recommended",
      description: "Post-winter cleanup, check for damage from storms.",
      frequency: "Preventative maintenance"
    },
    {
      season: "Summer (December-February)",
      priority: "As Needed",
      description: "Check for blockages, especially after storms.",
      frequency: "Problem-specific"
    },
    {
      season: "Winter (June-August)",
      priority: "Emergency Only",
      description: "Only if urgent blockages causing overflow.",
      frequency: "Emergency response"
    }
  ];

  const problemSigns = [
    "Water overflowing during rain",
    "Sagging gutters or visible damage",
    "Water stains on exterior walls",
    "Foundation water pooling",
    "Plant growth in gutters",
    "Rust or corrosion visible"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Gutter Cleaning & Maintenance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Clogged gutters are a leading cause of water damage to homes. Professional cleaning protects your home's foundation, 
            landscaping, and structural integrity. Essential maintenance for all Melbourne homeowners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="premium" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Gutter Cleaning Matters */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Professional Gutter Cleaning Matters</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  What Blocked Gutters Can Cause
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">Foundation damage from water pooling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">Roof damage from water backup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">Landscape erosion and damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">Pest infestations in stagnant water</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">Interior water damage from overflow</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Signs You Need Gutter Cleaning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {problemSigns.map((sign, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{sign}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Gutter Services */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Comprehensive Gutter Services</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.service}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">{service.cost}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.included.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Timing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Best Timing for Gutter Cleaning</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {seasonalTiming.map((timing, index) => (
              <Card key={index} className={`${timing.priority === "High Priority" ? "border-primary bg-primary/5" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{timing.season}</CardTitle>
                  <Badge 
                    variant={timing.priority === "High Priority" ? "default" : timing.priority === "Recommended" ? "secondary" : "outline"}
                    className="w-fit"
                  >
                    {timing.priority}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{timing.description}</p>
                  <p className="text-xs font-medium">{timing.frequency}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <strong>Recommendation:</strong> Annual cleaning in autumn is essential for most Melbourne homes. 
              Properties with many deciduous trees may need bi-annual cleaning.
            </p>
          </div>
        </div>
      </section>

      {/* Process and What's Included */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Gutter Cleaning Process</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <CardTitle className="text-lg">Safety Setup & Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Professional ladder and safety equipment</li>
                  <li>• Full gutter system inspection</li>
                  <li>• Document any damage or issues</li>
                  <li>• Property protection setup</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <CardTitle className="text-lg">Complete Cleaning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Remove all debris and leaves</li>
                  <li>• High-pressure flush of gutters</li>
                  <li>• Clear all downpipes thoroughly</li>
                  <li>• Check water flow and drainage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <CardTitle className="text-lg">Final Check & Cleanup</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Test water flow from roof to ground</li>
                  <li>• Minor repairs if needed</li>
                  <li>• Complete property cleanup</li>
                  <li>• Report on gutter condition</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing and Value */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Gutter Cleaning Investment</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Typical Costs by Home Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Small single-story home</span>
                  <Badge variant="outline">$200-300</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Standard family home</span>
                  <Badge variant="outline">$300-450</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Large two-story home</span>
                  <Badge variant="outline">$450-600</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Complex multi-level home</span>
                  <Badge variant="outline">$600-800+</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Value of Regular Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Prevents thousands in water damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Extends gutter system lifespan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Protects foundation integrity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Maintains property value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Prevents pest infestations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Protect Your Home with Professional Gutter Cleaning</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Don't wait for expensive water damage. Regular gutter maintenance is essential for protecting your home's 
            foundation, landscaping, and structural integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Kaidyn: 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
          </div>
          <div className="mt-8 space-y-2 text-sm opacity-75">
            <p>Book your autumn gutter clean now - essential before winter rains</p>
            <p>Serving all Southeast Melbourne within 50km of Clyde North</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GutterCleaning;