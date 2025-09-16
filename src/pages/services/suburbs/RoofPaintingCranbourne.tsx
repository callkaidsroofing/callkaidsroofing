import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, PaintRoller, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofPaintingCranbourne = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Roof Painting Cranbourne | Tile & Metal Roof Coatings"
        description="Cranbourne roof painting specialists delivering sharp finishes, protective membranes and 10-year warranties. Colour matched to your suburb."
        keywords="roof painting Cranbourne, roof coating Cranbourne, tile roof painting Cranbourne"
      />

      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
            Roof Painting in Cranbourne
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Cranbourne’s tree cover and humidity can leave roofs looking tired quickly. We specialise in roof painting for Cranbourne West, North and East, combining deep cleaning, roof repairs and premium coatings that stand up to the suburb’s heavy rainfalls.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Whether you’re updating an investment property or freshening the family home, our Cranbourne roof painting service gives you crisp kerb appeal and long-term protection. We use membranes that resist algae and keep colour rich even under gum tree shade.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Painting System</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Roof cleaning & biocide treatment to remove gum tree sap and staining',
              'Tile and sheet repairs to ensure a smooth base coat',
              'Primer designed for Cranbourne’s damp winters to avoid blistering',
              'Dual-colour coats with 10-year warranty and anti-fungal additives',
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
          <h2 className="text-3xl font-semibold mb-6">Recent Cranbourne Roof Painting Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png"
              alt="Cranbourne roof before painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/58e47c2d-3b15-4aad-ae68-f09f4d0d421e.png"
              alt="Cranbourne roof mid painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/324fc2cc-cf1b-4877-801b-846379d88b45.png"
              alt="Cranbourne roof after painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Cranbourne Owners Trust Call Kaids Roofing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Familiar with local colour palettes and estate requirements across Cranbourne.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 with membranes proven in wet climates.</p>
              <p>• Phone: 0435 900 709 – direct line to Kaidyn for on-site colour comparisons.</p>
              <p>• Careful masking and clean-up to protect gardens, driveways and neighbouring properties.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Cranbourne Colour Recommendations</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Monument, Basalt and Ironstone for modern estates</li>
                <li>✔ Gully and Wallaby for warmer street appeal</li>
                <li>✔ Surfmist for Hamptons-inspired renovations</li>
                <li>✔ Custom colour matching available with gloss, satin or matte finishes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Cranbourne Roof Painting Quote</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Ready to update your Cranbourne property? Call today or request a visit and we’ll bring colour swatches to your door.
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

export default RoofPaintingCranbourne;
