import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRestorationBerwick = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Roof Restorations Berwick | Call Kaids Roofing SE Melbourne"
        description="High-end roof restoration for Berwick’s heritage homes and modern estates. Precision repairs, colour matched coatings and respectful site management."
        keywords="roof restoration Berwick, heritage roof repair Berwick, roof coating Berwick"
      />

      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Restoration in Berwick
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Berwick’s leafy streets and heritage facades demand tidy rooflines. We restore established Berwick homes by respecting architectural details, matching tile profiles and working around tight driveways. From Brisbane Street character homes to modern Clyde Road builds, we tailor the restoration to the property.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Berwick roofs often suffer from ridge cracking, flaking glaze and staining from towering gums. Our restoration approach blends careful cleaning, tile repairs and modern membrane systems so your Berwick property keeps its street appeal while staying watertight for another decade.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Restoration Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'High-pressure cleaning with attention to delicate heritage flashings',
              'Tile replacement & repairs using reclaimed tiles that match Berwick colourways',
              'Rebedding & repointing ridge caps to eliminate cracks caused by tree movement',
              'Protective coatings with 10-year warranty for premium finishes and kerb appeal',
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
          <h2 className="text-3xl font-semibold mb-6">Before & After Transformations in Berwick</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/0362db50-69c4-4fd7-af15-a0112e09daeb.png"
              alt="Berwick roof before restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/783444da-c25e-4910-89e1-1908a6296118.png"
              alt="Berwick roof cleaning and repairs"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png"
              alt="Berwick roof after restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Berwick Homeowners Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Berwick roof restoration specialists who work neatly on premium properties.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 and careful documentation for Berwick buyers.</p>
              <p>• Phone: 0435 900 709 – direct access to Kaidyn to discuss colour options suited to Berwick Village.</p>
              <p>• Respectful site management to protect driveways, gardens and heritage detailing.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Included with Every Berwick Restoration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Detailed inspection of finials, valleys and flashings</li>
                <li>✔ Colour matching to existing palettes or modern Dulux hues</li>
                <li>✔ Ridge cap stabilization with flexible pointing compounds</li>
                <li>✔ Gutter clean and debris removal after every visit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Berwick Roof Health Check</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Keep your Berwick property looking premium. Call today or request an on-site roof assessment to plan your restoration properly.
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

export default RoofRestorationBerwick;
