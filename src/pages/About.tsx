import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { Phone, MapPin, Award, Users, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumCTASection from '@/components/PremiumCTASection';

const About = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Call Kaids Roofing | Clyde North Roofing Specialist"
        description="Meet Kaidyn Brownlie – the Clyde North local behind Call Kaids Roofing. Discover the story, service area and workmanship that sets our SE Melbourne roofing crew apart."
        keywords="Call Kaids Roofing about, Clyde North roofer story, local roofing specialist"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-lg italic text-primary">*Proof In Every Roof*</p>
            <h1 className="text-4xl md:text-5xl font-bold">
              I'm Kaidyn Brownlie—Built This Business from Scratch
            </h1>
            <p className="text-xl text-muted-foreground">
              First-generation roofer serving Southeast Melbourne with no BS, quality workmanship, and a 15-year warranty.
            </p>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <PremiumCTASection variant="primary" showFullDetails={true} />

      {/* My Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">No Family Business, No Safety Net</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a first-generation roofer. Didn't inherit this business or learn it from dad—I built it myself from the ground up. Started with a ute, some tools, and a lot of determination to do things properly.
                </p>
                <p>
                  Here's the truth: I taught myself this trade because I wanted to do it right. No shortcuts, no corner-cutting, no "that'll do" attitude. When you call me, you're getting someone who learned every lesson the hard way and won't make the same mistakes twice.
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold">Why I Do This</h3>
                <p className="text-sm text-muted-foreground">
                  Simple—I like repairing things properly. There's nothing worse than a dodgy roof job that fails in two years. I've seen too many homeowners get burned by cowboys who take the money and run.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• I show up when I say I will</li>
                  <li>• I do what I quote, nothing more, nothing less</li>
                  <li>• I use materials that actually last</li>
                  <li>• I back my work with a proper 15-year warranty</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">My Crew</h3>
                <p className="text-sm text-muted-foreground">Handpicked team trained by me personally</p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Local Base</h3>
                <p className="text-sm text-muted-foreground">15 minutes from most SE Melbourne suburbs</p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Premium Only</h3>
                <p className="text-sm text-muted-foreground">Industry-leading materials for Melbourne conditions</p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">15-Year Warranty</h3>
                <p className="text-sm text-muted-foreground">Comprehensive coverage on all major work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">How I Work</h2>
              <p className="text-xl text-muted-foreground">
                Quality over quantity, every single time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <Clock className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Quality Over Quantity</h3>
                <p className="text-muted-foreground">
                  I deliberately keep my workload manageable. Rather than rushing through 10 jobs badly, I'd rather do 5 jobs perfectly with my crew.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Award className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Premium Materials Only</h3>
                <p className="text-muted-foreground">
                  I don't use low-cost materials because they don't last. Every product I use is specifically chosen for Melbourne's harsh conditions.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Honest Communication</h3>
                <p className="text-muted-foreground">
                  I'll tell you straight what needs doing and what doesn't. No upselling, no scare tactics, no BS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">My Service Area</h2>
              <p className="text-xl text-muted-foreground">
                If you're within 50km of Clyde North, I'll come have a look
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Primary Coverage (15-30 minutes)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clyde North - Home base, know every street</li>
                  <li>• Berwick - Do heaps of work here, 10 minutes away</li>
                  <li>• Officer - Growing suburb, lots of young families</li>
                  <li>• Pakenham - Established community, quality-focused</li>
                  <li>• Cranbourne - #4 renovation hotspot nationally</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Extended Coverage (30-45 minutes)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Frankston - Established suburb, lots of restoration work</li>
                  <li>• Narre Warren - Family homes, practical solutions</li>
                  <li>• Brighton - Premium suburb, heritage work</li>
                  <li>• Toorak - High-end restoration, heritage compliance</li>
                  <li>• Kew - Character homes, specialist requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to get your roof sorted properly?</h2>
            <p className="text-xl">
              When you choose Call Kaids Roofing, you're getting personal service from a local tradesman who cares about his reputation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/book">Get Free Quote</Link>
              </Button>
            </div>
            
            <p className="text-sm border-t border-white/20 pt-4">
              Personal service • Quality workmanship • 15-year warranty • Fair pricing • Reliable service
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;