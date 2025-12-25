import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import PremiumCTASection from '@/components/PremiumCTASection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicPageHero } from '@/public/components/PublicPageHero';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';

const Contact = () => {
  return (
    <>
      <SEOHead
        title="Contact Call Kaids Roofing | Direct to Owner | Southeast Melbourne"
        description="Talk direct to Kaidyn Brownlie, owner of Call Kaids Roofing. No call centres, no BS. Phone 0435 900 709 for immediate response. Free quotes, emergency repairs."
        keywords="contact roofer Melbourne, Clyde North roofing, emergency roof repairs, free roof quote, direct contact roofer"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section - Pure White, Maximum Clarity */}
      <PublicPageHero
        variant="light"
        h1="Talk to Me Direct—No Call Centre, No BS"
        subtitle="*Proof In Every Roof*"
        description="When you call Call Kaids Roofing, you're talking to me—Kaidyn Brownlie, the owner."
        cta={
          <>
            <Button asChild variant="default" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="mailto:info@callkaidsroofing.com.au">
                <Mail className="mr-2 h-5 w-5" />
                Email Me Direct
              </a>
            </Button>
          </>
        }
      />

      {/* Premium CTA Section */}
      <PremiumCTASection variant="primary" showFullDetails={true} />

      {/* Contact Methods - Pure White for Maximum Clarity */}
      <SectionWrapper variant="default" className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Get Straight Through to the Owner</h2>
                <p className="text-muted-foreground">
                  No receptionists, no account managers, no phone menus. Just me and my phone.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Call Me Direct</h3>
                    <p className="text-lg font-semibold text-primary">0435 900 709</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• 7am-6pm weekdays - Usually answer immediately</p>
                      <p>• Saturdays 8am-4pm - Available for quotes and emergencies</p>
                      <p>• Sundays - Emergency calls only</p>
                      <p>• After hours - Text me, I'll call back within 12 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Me</h3>
                    <p className="text-primary">info@callkaidsroofing.com.au</p>
                    <p className="text-sm text-muted-foreground">I check emails daily and respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Service Area</h3>
                    <p className="text-muted-foreground">Based in Clyde North</p>
                    <p className="text-sm text-muted-foreground">Serving all of Southeast Melbourne within 50km radius</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Availability</h3>
                    <p className="text-muted-foreground">Usually booked 2-3 weeks out</p>
                    <p className="text-sm text-muted-foreground">Emergency jobs get priority scheduling</p>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold">What to Expect When You Call</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Free quotes arranged within 2-3 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Same-day response for emergencies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Honest advice - no pressure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Written quote same day for most jobs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Use the booking system to schedule your free roof assessment or contact me directly:
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/booking">
                        <Clock className="mr-2 h-5 w-5" />
                        Book Your Free Assessment
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a href="tel:0435900709">
                        <Phone className="mr-2 h-5 w-5" />
                        Call Now: 0435 900 709
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a href="mailto:info@callkaidsroofing.com.au">
                        <Mail className="mr-2 h-5 w-5" />
                        Email Direct
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Emergency Section - Urgency Design */}
      <SectionWrapper variant="default" className="bg-destructive/5 border-y-4 border-destructive/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-destructive">Emergency Roof Repairs?</h2>
            <p className="text-xl">
              If you have an active leak, storm damage, or urgent roof problem, don't wait for a quote form.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="emergency" size="xl" className="emergency-pulse">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now: 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/emergency">Emergency Info</Link>
              </Button>
            </div>
            <p className="text-sm text-foreground/70">
              Available 24/7 for genuine emergencies • Usually on-site within 4 hours
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
    </>
  );
};

export default Contact;