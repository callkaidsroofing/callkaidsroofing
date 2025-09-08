import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Talk to Me Direct—No Call Centre, No BS
            </h1>
            <p className="text-xl text-muted-foreground">
              When you call Call Kaids Roofing, you're talking to me—Kaidyn Brownlie, the owner.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="premium" size="xl">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="mailto:callkaidsroofing@outlook.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Me Direct
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
                    <p className="text-primary">callkaidsroofing@outlook.com</p>
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

            {/* Quote Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Get Your Free Quote</CardTitle>
                  <CardDescription>
                    Fill out this form and I'll get back to you with a detailed quote. Include photos if you can—helps me give you a more accurate estimate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="0400 000 000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input id="address" placeholder="123 Main Street, Suburb, VIC" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Needed</Label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                      <option value="">Select a service</option>
                      <option value="restoration">Roof Restoration</option>
                      <option value="painting">Roof Painting</option>
                      <option value="repairs">Roof Repairs</option>
                      <option value="gutter">Gutter Cleaning</option>
                      <option value="valley">Valley Iron Replacement</option>
                      <option value="emergency">Emergency Repairs</option>
                      <option value="quote">Not sure - need assessment</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Describe Your Roof Issue</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell me about your roof problem, when you noticed it, and any other details that might help..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline">When do you need this done?</Label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                      <option value="">Select timeline</option>
                      <option value="emergency">Emergency - ASAP</option>
                      <option value="urgent">Within 2 weeks</option>
                      <option value="soon">Within a month</option>
                      <option value="planning">Just planning ahead</option>
                    </select>
                  </div>

                  <Button className="w-full" variant="premium" size="lg">
                    Send Quote Request
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    I'll get back to you within 24 hours, usually much faster
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-destructive/5 border-y border-destructive/20">
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
            <p className="text-sm text-muted-foreground">
              Available 24/7 for genuine emergencies • Usually on-site within 4 hours
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;