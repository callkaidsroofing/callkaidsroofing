import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Brush, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofPaintingClydeNorth = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Roof Painting Clyde North | Tile & Metal Roof Coatings"
        description="Clyde North roof painting with premium membranes, fast turnaround and 10-year warranty. Freshen new estates or revive original builds."
        keywords="roof painting Clyde North, roof coating Clyde North, tile roof painting Clyde North"
        canonical="https://callkaidsroofing.com.au/services/roof-painting-clyde-north"
      />

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Painting in Clyde North
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Clyde North developments move fast, and keeping your roof sharp helps your home stand out. UV exposure, estate dust and new construction grime can dull tiles quickly. Our Clyde North roof painting service brings back that display-home finish.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Whether you’re in Selandra Rise, Highgrove or Clydevale, we handle the colour consultation, roof prep and coating so everything looks flawless. We schedule work around school traffic and estate guidelines for a smooth experience.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Painting System</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Roof cleaning & sterilising to remove builder dust and grime',
              'Minor roof repairs to ensure a tight finish before coatings go on',
              'Primer tailored to modern concrete tiles used across Clyde North estates',
              'Two top coats with 10-year warranty in your preferred gloss level',
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
          <h2 className="text-3xl font-semibold mb-6">Recent Clyde North Roof Painting Transformations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/e613c84a-7f19-4752-a2cb-836de3466396.png"
              alt="Clyde North roof before painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/7c4b0aaa-18ed-4b8a-80f2-904dc4868236.png"
              alt="Clyde North roof mid painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png"
              alt="Clyde North roof after painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Clyde North Residents Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Clyde North roof painting specialist who understands estate design rules.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 plus manufacturer guarantees.</p>
              <p>• Phone: 0435 900 709 – talk directly with Kaidyn about colour samples and scheduling.</p>
              <p>• Clean site management to keep driveways, render and landscaping spotless.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Clyde North Colour Ideas</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Monument, Night Sky and Basalt for bold contrast</li>
                <li>✔ Shale Grey and Surfmist for bright architectural looks</li>
                <li>✔ Woodland Grey and Dune for warm, earthy tones</li>
                <li>✔ Custom tinting available to match render or garage doors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Clyde North Roof Painting Quote</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Want that display-home shine back? Call today or book online for a detailed roof painting proposal in Clyde North.
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

export default RoofPaintingClydeNorth;
