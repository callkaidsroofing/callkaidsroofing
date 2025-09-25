import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRestorationClydeNorth = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Roof Restorations Clyde North | Call Kaids Roofing SE Melbourne"
        description="Bring your roof back to life with professional restorations. Serving Clyde North, Cranbourne, Berwick & surrounds. Honest quotes, lasting results."
        keywords="roof restoration Clyde North, roof repair Clyde North, ridge cap repointing Clyde North"
        canonical="https://callkaidsroofing.com.au/services/roof-restoration-clyde-north"
      />

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Restoration in Clyde North
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Clyde North roofing cops a beating from the south-westerly winds that whip across the estate. Terracotta and concrete tiles fade fast from constant UV, and the early 2010s builds are now showing cracked ridge mortar. A tailored roof restoration keeps your Clyde North home watertight and sharp looking without tearing the roof off.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            I live fifteen minutes away, so I know how often the weather turns. Our Clyde North restoration package resets ridge caps, replaces brittle tiles and seals everything with a high-build membrane that holds colour and gloss. It is the quickest way to protect your investment as the suburb keeps growing.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Restoration Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'High-pressure cleaning to blast away moss and Clyde North road dust',
              'Tile replacement & repairs using locally sourced spare tiles',
              'Rebedding & repointing ridge caps with flexible pointing suited to estate winds',
              'Protective coatings with 10-year warranty matched to modern Colorbond palettes',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border rounded-lg p-4 shadow-sm">
                <CheckCircle className="h-5 w-5 text-primary mt-1" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Before & After Transformations in Clyde North</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/3a5f460c-0be2-45c5-9c92-e81b3da4f442.png"
              alt="Clyde North roof before restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/468d2fb1-beac-44d1-a3b6-9b08217e6231.png"
              alt="Clyde North roof cleaning in progress"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
              alt="Clyde North roof after full restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Call Kaids Roofing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Local Clyde North roofing expert who understands the estates, covenants and soil movement issues.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 and full insurance.</p>
              <p>• Phone: 0435 900 709 – you deal direct with me, Kaidyn, from first quote to final inspection.</p>
              <p>• Flexible scheduling to work around Clyde North school runs and estate parking restrictions.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Included with Every Clyde North Restoration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Detailed roof health report</li>
                <li>✔ Drone photos before and after</li>
                <li>✔ Gutter clean and valley iron inspection</li>
                <li>✔ Colour consultation for modern neighbourhood palettes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Get Your Free Roof Health Check</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Clyde North homeowners trust Call Kaids Roofing for straight answers and long-lasting roof restorations. Call us today or book a visit online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Book Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofRestorationClydeNorth;
