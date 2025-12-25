import { SEOHead } from '@/components/SEOHead';
import { Phone, MapPin, Award, Users, Clock, Shield } from 'lucide-react';
import { PublicPageHero } from '@/public/components/PublicPageHero';
import { SectionWrapper, Container } from '@/components/ui/section-wrapper';
import ParallaxBackground from '@/components/ParallaxBackground';
import { CTASection } from '@/components/ui/cta-section';

const About = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Call Kaids Roofing | Clyde North Roofing Specialist"
        description="Meet Kaidyn Brownlie – the Clyde North local behind Call Kaids Roofing. Discover the story, service area and workmanship that sets our SE Melbourne roofing crew apart."
        keywords="Call Kaids Roofing about, Clyde North roofer story, local roofing specialist"
      />

      {/* Hero Section */}
      <PublicPageHero
        subtitle="*Proof In Every Roof*"
        h1="I'm Kaidyn Brownlie—Built This Business from Scratch"
        description="First-generation roofer serving Southeast Melbourne with no BS, quality workmanship, and a 15-year warranty."
      />

      {/* My Story */}
      <SectionWrapper background="gradient-dark" className="text-primary-foreground">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">No Family Business, No Safety Net</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  I'm a first-generation roofer. Didn't inherit this business or learn it from dad—I built it myself from the ground up. Started with a ute, some tools, and a lot of determination to do things properly.
                </p>
                <p>
                  Here's the truth: I taught myself this trade because I wanted to do it right. No shortcuts, no corner-cutting, no "that'll do" attitude. When you call me, you're getting someone who learned every lesson the hard way and won't make the same mistakes twice.
                </p>
              </div>

              <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="font-bold text-lg text-white mb-3">Why I Do This</h3>
                <p className="text-sm text-white/70 mb-4">
                  Simple—I like repairing things properly. There's nothing worse than a dodgy roof job that fails in two years. I've seen too many homeowners get burned by cowboys who take the money and run.
                </p>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>• I show up when I say I will</li>
                  <li>• I do what I quote, nothing more, nothing less</li>
                  <li>• I use materials that actually last</li>
                  <li>• I back my work with a proper 15-year warranty</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-3 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-conversion-cyan/20 rounded-full">
                  <Users className="h-8 w-8 text-conversion-cyan" />
                </div>
                <h3 className="font-bold text-white">My Crew</h3>
                <p className="text-sm text-white/70">Handpicked team trained by me personally</p>
              </div>
              <div className="text-center space-y-3 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-conversion-cyan/20 rounded-full">
                  <MapPin className="h-8 w-8 text-conversion-cyan" />
                </div>
                <h3 className="font-bold text-white">Local Base</h3>
                <p className="text-sm text-white/70">15 minutes from most SE Melbourne suburbs</p>
              </div>
              <div className="text-center space-y-3 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-conversion-cyan/20 rounded-full">
                  <Award className="h-8 w-8 text-conversion-cyan" />
                </div>
                <h3 className="font-bold text-white">Premium Only</h3>
                <p className="text-sm text-white/70">Industry-leading materials for Melbourne conditions</p>
              </div>
              <div className="text-center space-y-3 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-conversion-cyan/20 rounded-full">
                  <Shield className="h-8 w-8 text-conversion-cyan" />
                </div>
                <h3 className="font-bold text-white">15-Year Warranty</h3>
                <p className="text-sm text-white/70">Comprehensive coverage on all major work</p>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* How I Work */}
      <ParallaxBackground variant="services" density="low">
        <SectionWrapper background="gradient-dark" className="text-primary-foreground">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How I Work</h2>
              <p className="text-xl text-white/70">Quality over quantity, every single time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <Clock className="h-12 w-12 text-conversion-cyan mx-auto" />
                <h3 className="text-xl font-bold text-white">Quality Over Quantity</h3>
                <p className="text-white/70">
                  I deliberately keep my workload manageable. Rather than rushing through 10 jobs badly, I'd rather do 5 jobs perfectly with my crew.
                </p>
              </div>
              <div className="text-center space-y-4 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <Award className="h-12 w-12 text-conversion-cyan mx-auto" />
                <h3 className="text-xl font-bold text-white">Premium Materials Only</h3>
                <p className="text-white/70">
                  I don't use low-cost materials because they don't last. Every product I use is specifically chosen for Melbourne's harsh conditions.
                </p>
              </div>
              <div className="text-center space-y-4 backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
                <Users className="h-12 w-12 text-conversion-cyan mx-auto" />
                <h3 className="text-xl font-bold text-white">Honest Communication</h3>
                <p className="text-white/70">
                  I'll tell you straight what needs doing and what doesn't. No upselling, no scare tactics, no BS.
                </p>
              </div>
            </div>
          </Container>
        </SectionWrapper>
      </ParallaxBackground>

      {/* Service Areas */}
      <SectionWrapper background="gradient-dark" className="text-primary-foreground">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Service Area</h2>
            <p className="text-xl text-white/70">If you're within 50km of Clyde North, I'll come have a look</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Primary Coverage (15-30 minutes)</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Clyde North - Home base, know every street</li>
                <li>• Berwick - Do heaps of work here, 10 minutes away</li>
                <li>• Officer - Growing suburb, lots of young families</li>
                <li>• Pakenham - Established community, quality-focused</li>
                <li>• Cranbourne - #4 renovation hotspot nationally</li>
              </ul>
            </div>
            <div className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Extended Coverage (30-45 minutes)</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Frankston - Established suburb, lots of restoration work</li>
                <li>• Narre Warren - Family homes, practical solutions</li>
                <li>• Brighton - Premium suburb, heritage work</li>
                <li>• Toorak - High-end restoration, heritage compliance</li>
                <li>• Kew - Character homes, specialist requirements</li>
              </ul>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Final CTA */}
      <ParallaxBackground variant="cta" density="medium">
        <CTASection
          headline="Ready to get your roof sorted properly?"
          description="When you choose Call Kaids Roofing, you're getting personal service from a local tradesman who cares about his reputation."
        />
      </ParallaxBackground>
    </div>
  );
};

export default About;
