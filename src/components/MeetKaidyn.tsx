import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MeetKaidyn = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Professional Photo */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative">
              <img
                src="/lovable-uploads/fca54c4d-7c0b-497d-8ed8-670d978cfb7c.png"
                alt="Kaidyn Brownlie - Owner and Lead Roofer at Call Kaids Roofing"
                className="w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-primary/20"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                25+ Years Experience
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                Meet Your Team Leader
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                I'm Kaidyn Brownlie—Leading Southeast Melbourne's Most Experienced Roofing Team
              </h2>
                <p className="text-xl text-muted-foreground">
                 When you call, you're talking directly to me. But you're getting the expertise of my entire skilled team—25+ years of combined roofing experience ensuring your roof gets the best possible service.
               </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Why Work With Our Team?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Local to Clyde North</strong> - We know Southeast Melbourne like the back of our hands</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>25+ Years Combined Roofing Experience</strong> - Our team brings unmatched expertise to every project</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Quality & Honesty First</strong> - We'll tell you what you need to know, backed by 10-year warranties</span>
                </li>
              </ul>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Direct Line to Quality</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  No automated systems, no waiting around. When you call <strong>0435 900 709</strong>, 
                  you get me directly. My team with 25+ years of combined roofing experience and I will take care of everything.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <a href="tel:0435900709">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contact">Get Free Quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Achievements - Moved to bottom row */}
          <div className="lg:col-span-3 mt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-xs text-muted-foreground">Roofs Restored</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">25+</div>
                  <div className="text-xs text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-muted-foreground">Leak-Free Rate</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-xs text-muted-foreground">Emergency</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 text-center space-y-2">
                <h3 className="text-lg font-semibold">Current Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Next Slot:</span> 2-3 weeks
                  </div>
                  <div>
                    <span className="font-semibold text-accent">Emergency:</span> Same day
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Inspections:</span> This week
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  Booked solid due to honest service and proven results. Quality takes time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetKaidyn;