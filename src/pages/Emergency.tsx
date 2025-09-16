import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Phone, Clock, MapPin, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const Emergency = () => {
  const emergencyTypes = [
    {
      title: "Active Leaks",
      description: "Water coming through your ceiling right now",
      examples: ["Ceiling stains growing during rain", "Dripping water into your home", "Electrical hazards from water near wiring"]
    },
    {
      title: "Storm Damage", 
      description: "Immediate damage from Melbourne storms",
      examples: ["Missing or broken tiles from hail/wind", "Tree damage from fallen branches", "Flashing failure causing leaks"]
    },
    {
      title: "Structural Damage",
      description: "Serious damage threatening your home",
      examples: ["Sagging roof sections", "Large holes from debris", "Dangerous loose materials"]
    }
  ];

  const responseAreas = [
    { area: "Clyde North, Berwick, Officer", time: "15-30 minutes" },
    { area: "Pakenham, Cranbourne, Narre Warren", time: "30-45 minutes" },
    { area: "Frankston, Dandenong, Brighton", time: "45-60 minutes" }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Emergency Roof Repairs Clyde North & SE Melbourne | Call Kaids Roofing"
        description="Same-day emergency roof repairs for Clyde North, Cranbourne, Berwick and surrounding suburbs. Call 0435 900 709 for rapid leak control and storm damage support."
        keywords="emergency roof repairs Clyde North, storm damage roofing Melbourne, urgent roof repair"
      />
      {/* Hero Section */}
      <section className="py-20 bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <AlertTriangle className="h-16 w-16 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Roof Emergency? I'll Be There Today
            </h1>
            <p className="text-xl">
              Available 24/7 for genuine emergencies. Usually on-site within 4 hours.
            </p>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-2xl font-bold mb-2">Call Me Now</p>
              <Button asChild variant="secondary" size="xl" className="emergency-pulse">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  0435 900 709
                </a>
              </Button>
              <p className="text-sm mt-2">Available 24/7 for genuine emergencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Counts as Emergency */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">What Counts as an Emergency?</h2>
              <p className="text-xl text-muted-foreground">
                I prioritize genuine emergencies that need immediate attention
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyTypes.map((type, index) => (
                <Card key={index} className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.examples.map((example, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Response Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">My Emergency Response Process</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg">1</div>
                <h3 className="font-semibold">Immediate Phone Assessment</h3>
                <p className="text-sm text-muted-foreground">Quick assessment of severity and safety concerns over the phone</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg">2</div>
                <h3 className="font-semibold">Rapid Response</h3>
                <p className="text-sm text-muted-foreground">Usually on-site within 4 hours, fully equipped for immediate repairs</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg">3</div>
                <h3 className="font-semibold">Immediate Protection</h3>
                <p className="text-sm text-muted-foreground">Stop further damage with temporary waterproofing and safety measures</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg">4</div>
                <h3 className="font-semibold">Permanent Solution</h3>
                <p className="text-sm text-muted-foreground">Full damage assessment and permanent repair planning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Emergency Response Times</h2>
              <p className="text-xl text-muted-foreground">
                Based in Clyde North - here's how quickly I can reach you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {responseAreas.map((area, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center space-y-4">
                    <Clock className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold">{area.area}</h3>
                    <p className="text-2xl font-bold text-primary">{area.time}</p>
                    <p className="text-sm text-muted-foreground">Average response time for emergencies</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                All emergency work covered within 50km radius of Clyde North
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Do While Waiting */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Do This */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary">What to Do While Waiting</h2>
                <div className="space-y-4">
                  {[
                    "Turn off electricity to affected areas if water is present",
                    "Move valuables away from leak areas", 
                    "Place containers under active leaks",
                    "Take photos for insurance documentation",
                    "Stay away from damaged roof areas"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don't Do This */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-destructive">Don't Attempt These</h2>
                <div className="space-y-4">
                  {[
                    "Climbing on damaged roofs - extremely dangerous",
                    "Major repairs without proper equipment",
                    "Electrical work near water damage", 
                    "Structural modifications without assessment"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Pricing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Emergency Pricing</h2>
              <p className="text-xl text-muted-foreground">
                Fair, transparent pricing for emergency work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Callout Fees</CardTitle>
                  <CardDescription>Deducted from repair costs if you proceed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Standard hours (7am-6pm)</span>
                    <span className="font-semibold">No callout fee</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After hours (6pm-10pm)</span>
                    <span className="font-semibold">$150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late night (10pm-7am)</span>
                    <span className="font-semibold">$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public holidays</span>
                    <span className="font-semibold">$200</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Repair Costs</CardTitle>
                  <CardDescription>Typical emergency repair pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Minor leak repairs</span>
                    <span className="font-semibold">$200-500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temporary waterproofing</span>
                    <span className="font-semibold">$300-800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storm damage repairs</span>
                    <span className="font-semibold">$500-2000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assessment only</span>
                    <span className="font-semibold">Free</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Shield className="h-16 w-16 mx-auto" />
            <h2 className="text-3xl font-bold">
              Don't Let Emergency Roof Damage Destroy Your Home
            </h2>
            <p className="text-xl">
              Quick response prevents minor problems becoming major disasters. I'm available 24/7 for genuine roof emergencies across Southeast Melbourne.
            </p>
            
            <Button asChild variant="secondary" size="xl" className="emergency-pulse">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Now: 0435 900 709
              </a>
            </Button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-8">
              <div>Same-day response</div>
              <div>Professional assessment</div>
              <div>Immediate protection</div>
              <div>Insurance documentation</div>
            </div>
            
            <p className="text-sm border-t border-white/20 pt-4">
              Call me now - I'll be there when you need me most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Emergency;