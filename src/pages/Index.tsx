import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import TrustIndicators from '@/components/TrustIndicators';
import TestimonialCard from '@/components/TestimonialCard';
import heroImage from '@/assets/hero-roof-restoration.jpg';

const Index = () => {
  const services = [
    {
      title: "Roof Restoration",
      description: "Stop leaks before they wreck your house. Complete overhaul with 10-year warranty.",
      benefits: [
        "Complete overhaul with 10-year warranty",
        "Premium membrane that lasts 15+ years", 
        "Looks like a brand new roof"
      ],
      perfectFor: "Frankston, Narre Warren, established suburbs where roofs are 15+ years old",
      href: "/services/roof-restoration"
    },
    {
      title: "Roof Painting", 
      description: "Transform your home's look in 3 days with professional grade paints.",
      benefits: [
        "Dramatic transformation in 2-3 days",
        "Energy savings through reflective coating",
        "Premium paints designed for Melbourne weather"
      ],
      perfectFor: "Cranbourne, Point Cook, anywhere you want your house to stand out",
      href: "/services/roof-painting"
    },
    {
      title: "Emergency Repairs",
      description: "Storm damage? I'll be there same day when Melbourne weather hits hard.",
      benefits: [
        "Same-day response for urgent issues",
        "Temporary protection then permanent fix",
        "Available 24/7 for genuine emergencies"
      ],
      perfectFor: "Anyone with active leaks, storm damage, or 'oh shit' moments",
      href: "/services/roof-repairs",
      isEmergency: true
    }
  ];

  const testimonials = [
    {
      quote: "Kaidyn's a straight shooter. Told me exactly what needed doing, did it properly, cleaned up after himself. Roof looks brand new and hasn't leaked since. Worth every dollar.",
      author: "Dave M.",
      location: "Clyde North"
    },
    {
      quote: "Had three quotes—Kaidyn wasn't the cheapest but he was the most honest. Explained everything, showed up when he said he would, and the work's still perfect two years later.",
      author: "Sarah K.", 
      location: "Berwick"
    },
    {
      quote: "Emergency call on a Sunday night after a storm. Kaidyn picked up, came out first thing Monday, had it fixed by lunch. That's service.",
      author: "Mike T.",
      location: "Frankston"
    }
  ];

  const serviceAreas = {
    "My Patch (Close to Home)": [
      "Clyde North - My home base, know every street",
      "Berwick - 10 minutes away, do heaps of work here", 
      "Officer - Growing fast, lots of new builds needing maintenance",
      "Pakenham - Young families, quality-focused homeowners"
    ],
    "Bayside & Premium Suburbs": [
      "Brighton - Heritage homes, premium materials only",
      "Toorak - High-end restoration, heritage compliance",
      "Kew - Character homes needing specialist care",
      "Canterbury - Established properties, quality expectations"
    ],
    "Renovation Hotspots": [
      "Cranbourne - Australia's #4 renovation suburb",
      "Frankston - Established homes getting makeovers", 
      "Point Cook - #2 renovation hotspot nationally",
      "Narre Warren - Family homes, practical solutions"
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Stop Leaks Now—Get a Free Inspection from Your Local Roofing Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            No Leaks. No Lifting. Just Quality.
          </p>
          
          <div className="space-y-4 max-w-2xl mx-auto text-left bg-black/20 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-lg">
              I'm Kaidyn Brownlie, and I run the best roofing crew in Southeast Melbourne. No call centre, no sales team—when you call <strong>0435 900 709</strong>, you're talking directly to me, the owner.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Free inspection with honest advice (no BS upselling)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                10-year warranty on all major work
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Same-day quotes for most jobs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Emergency response when storms hit
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="premium" size="xl">
              <Link to="/contact">Book Me Now—Slots Are Limited</Link>
            </Button>
            <Button asChild variant="phone" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
          </div>

          <p className="text-sm text-gray-300">
            Serving: Clyde North • Berwick • Cranbourne • Frankston • Brighton • Toorak<br/>
            50km radius—if you're close, I'll come have a look
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What I Do Best</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three main services that stop problems before they cost you thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Problem Side */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-destructive">
                Your Roof Problems Are Costing You Money Right Now
              </h2>
              <ul className="space-y-3">
                {[
                  "That small leak is rotting your roof timbers and growing mould",
                  "Faded, mossy tiles are killing your property value", 
                  "Dodgy repairs from cheap operators fail within 2 years",
                  "Blocked gutters are backing up and damaging your eaves"
                ].map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Side */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                Here's How I Fix It Properly
              </h2>
              <ul className="space-y-3">
                {[
                  "Find the real problem and fix it once (not just patch symptoms)",
                  "Use premium materials designed for Melbourne conditions",
                  "Give you straight answers about what needs doing and what doesn't", 
                  "Back everything with a 10-year warranty you can trust"
                ].map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="premium" size="lg">
                <Link to="/contact">
                  Get a free inspection—I'll tell you exactly what's wrong
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">I Cover All of Southeast Melbourne</h2>
            <p className="text-xl text-muted-foreground">
              Based in Clyde North, I service everywhere within 50km. Know the local challenges because I live here too.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(serviceAreas).map(([category, areas]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold">{category}</h3>
                <ul className="space-y-2">
                  {areas.map((area, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What My Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Urgency CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Book Now—I'm Usually 2-3 Weeks Out
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            I only take on jobs I can do properly. That means limited slots and you might have to wait. 
            But here's the thing—quality work takes time, and rushing leads to problems.
          </p>
          
          <ul className="max-w-2xl mx-auto text-left space-y-2">
            <li>• Summer storms are coming - get your roof checked before they hit</li>
            <li>• I'm booked solid because word spreads fast</li>
            <li>• Emergency jobs get priority, but planned work books out fast</li>
            <li>• Free inspections available this week for new customers</li>
          </ul>

          <div className="space-y-4">
            <p className="text-2xl font-semibold">
              Don't wait for a small problem to become a big expensive one
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="xl">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now: 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Get Free Quote</Link>
              </Button>
            </div>

            <p className="text-sm">
              I pick up, not a call centre • Text me: Same number, I'll call you back within 12 hours
            </p>
            
            <p className="text-lg font-semibold border-t border-white/20 pt-4 mt-6">
              10-Year Warranty • Premium Materials • Honest Service • Local Guy
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
