import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRestorationCranbourne = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Roof Restorations Cranbourne | Call Kaids Roofing SE Melbourne"
        description="Cranbourne roof restoration specialists handling weathered tiles, moss build-up and storm wear. Local crew with 10-year workmanship warranty."
        keywords="roof restoration Cranbourne, moss removal Cranbourne, roof repairs Cranbourne"
      />

      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
            Roof Restoration in Cranbourne
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Cranbourne roofs cop humid mornings, tree debris and plenty of storm activity. The 80s and 90s homes in Cranbourne often suffer from porous tiles and pitted valleys. A custom roof restoration keeps Cranbourne houses looking sharp while sealing out persistent leaks.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            We flush gutters filled with tea-tree litter, reset ridge capping and apply a high-build membrane that stands up to Cranbourne’s temperature swings. Every project is planned around your schedule so you are never left with a half-finished roof when the next front blows through. 
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Restoration Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'High-pressure cleaning that removes years of Cranbourne moss and lichen',
              'Tile replacement & repairs to cracked ridge corners and slipped valleys',
              'Rebedding & repointing ridge caps to lock everything down before winter',
              'Protective coatings with 10-year warranty and reflective pigments for hot summers',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border rounded-lg p-4 shadow-sm">
                <CheckCircle className="h-5 w-5 text-secondary mt-1" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Before & After Transformations in Cranbourne</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/359deff0-4a4b-426d-acbc-993dfb3cb510.png"
              alt="Cranbourne roof before restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/7c4b0aaa-18ed-4b8a-80f2-904dc4868236.png"
              alt="Cranbourne roof restoration during cleaning"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/884e66b0-35da-491d-b03b-d980d46b3043.png"
              alt="Cranbourne roof after restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Cranbourne Homeowners Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Cranbourne-based restoration crew familiar with local covenants and estate guidelines.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 and full insurance on every Cranbourne project.</p>
              <p>• Phone: 0435 900 709 – speak directly with Kaidyn for advice on timing around Cranbourne’s weather.</p>
              <p>• Detailed moisture checks for Cranbourne South, West and North properties where leaks commonly appear.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Included with Every Cranbourne Restoration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Valley iron inspection and rust treatment</li>
                <li>✔ Replacement of broken skylight flashings</li>
                <li>✔ Flexible pointing on all ridge and hip junctions</li>
                <li>✔ Complimentary gutter clean to handle heavy rains</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Cranbourne Roof Health Check</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Protect your Cranbourne home before the next storm season. Call today or request a visit online for a no-pressure roof assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary">
              <Link to="/contact">Book Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofRestorationCranbourne;
