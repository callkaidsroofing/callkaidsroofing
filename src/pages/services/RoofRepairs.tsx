import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, Clock, Shield, MapPin, AlertTriangle, Wrench, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRepairs = () => {
  const commonRepairs = [
    {
      issue: "Cracked or Broken Tiles",
      description: "A single cracked tile is all it takes for water to penetrate your roof cavity.",
      solution: "Replace individual tiles, ensuring perfect match with existing roof.",
      cost: "$150-400"
    },
    {
      issue: "Deteriorated Ridge Capping", 
      description: "The mortar holding your ridge caps can crack and crumble over time.",
      solution: "Re-bed and re-point ridge caps to ensure they are secure and watertight.",
      cost: "$1,500-2,000"
    },
    {
      issue: "Rebedding Complete Ridge",
      description: "Complete rebedding of all ridge caps for comprehensive protection.",
      solution: "Full removal and rebedding using Supa Point premium mortar systems.",
      cost: "$3,000-5,000"
    },
    {
      issue: "Leaking Valley Irons",
      description: "Rusted or damaged valley irons are a frequent cause of serious leaks.",
      solution: "Repair or replace valley irons to restore proper water flow.",
      cost: "$600-1,500"
    },
    {
      issue: "Damaged Flashings",
      description: "Metal flashings around chimneys, skylights, and vents prevent leaks.",
      solution: "Repair or replace damaged flashings to ensure watertight seal.",
      cost: "$200-600"
    },
    {
      issue: "Storm Damage",
      description: "High winds and heavy rain can cause significant roof damage.",
      solution: "Rapid response service to assess and repair, securing your home quickly.",
      cost: "$400-2,000+"
    }
  ];

  const responseAreas = [
    {
      category: "Priority Response (15-30 minutes)",
      suburbs: ["Clyde North - My home base", "Berwick - Major service area", "Officer - Growing community", "Pakenham - Established area", "Cranbourne - High service volume"]
    },
    {
      category: "Standard Response (30-45 minutes)", 
      suburbs: ["Frankston - Established suburb", "Narre Warren - Family area", "Dandenong - Industrial and residential", "Springvale - Diverse community", "Noble Park - Mixed residential"]
    },
    {
      category: "Extended Response (45-60 minutes)",
      suburbs: ["Brighton - Bayside premium area", "Toorak - Heritage and luxury homes", "Kew - Established premium suburb", "Hawthorn - Heritage considerations", "Canterbury - Quality residential area"]
    }
  ];

  const emergencySteps = [
    "Turn off electricity to affected areas if water is present",
    "Move valuables away from leak areas",
    "Place containers under active leaks", 
    "Take photos for insurance documentation",
    "Stay away from damaged roof areas"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prompt & Reliable Roof Repairs: Protecting Your Home from the Elements
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            In Melbourne, where the weather can turn in an instant, a small roof leak can quickly escalate into a major problem. 
            Swift and reliable roof repair service designed to quickly identify and implement lasting solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="emergency" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Now: 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/emergency">Emergency Info</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Response Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Emergency Response Process</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">1. Immediate Phone Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quick assessment of damage severity, safety concerns, and timeline for response.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">2. Rapid On-Site Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Aim to be on-site within 4 hours for genuine emergencies with fully equipped vehicle.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">3. Immediate Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  First priority is stopping further damage with temporary waterproofing and safety measures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">4. Permanent Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full damage assessment, permanent repair quote, and scheduling for complete repairs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Repair Issues */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Issues We Expertly Repair</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {commonRepairs.map((repair, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="flex-1">{repair.issue}</span>
                    <Badge variant="outline" className="ml-2">{repair.cost}</Badge>
                  </CardTitle>
                  <CardDescription>{repair.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">Solution: {repair.solution}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Response Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Service Areas for Emergency Response</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {responseAreas.map((area, index) => (
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
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Anywhere within 50km of Clyde North for genuine emergencies
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Pricing */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Emergency Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Callout Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Standard hours (7am-6pm)</span>
                  <Badge variant="outline">No fee</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>After hours (6pm-10pm)</span>
                  <Badge variant="outline">$150</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Late night (10pm-7am)</span>
                  <Badge variant="outline">$250</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Public holidays</span>
                  <Badge variant="outline">$200</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  *Callout fees deducted from repair costs if you proceed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Emergency Repair Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Minor leak repairs</span>
                  <Badge variant="outline">$150-400</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Temporary waterproofing</span>
                  <Badge variant="outline">$200-600</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Storm damage repairs</span>
                  <Badge variant="outline">$400-1,500+</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Structural stabilization</span>
                  <Badge variant="outline">Quote required</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Complete reroofing</span>
                  <Badge variant="outline">$15,000-30,000</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Do While Waiting */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What to Do While Waiting</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Immediate Safety Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {emergencySteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-1">{index + 1}.</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Don't Attempt These
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Climbing on damaged roofs - extremely dangerous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Major repairs without proper equipment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Electrical work near water damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Structural modifications without assessment</span>
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
          <h2 className="text-3xl font-bold mb-6">Don't Let Emergency Roof Damage Destroy Your Home</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Quick response prevents minor problems becoming major disasters. Available 24/7 for genuine roof emergencies across Southeast Melbourne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency: 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/contact">Get Quote</Link>
            </Button>
          </div>
          <div className="mt-8 space-y-2 text-sm opacity-75">
            <p>Available 24/7 for genuine emergencies</p>
            <p>Same-day response for active leaks and storm damage</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofRepairs;