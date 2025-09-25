import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Palette, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofPaintingPakenham = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Roof Painting Pakenham | Tile & Metal Roof Coatings"
        description="Transform your home’s look with expert roof painting. Protective coatings, colour matched finishes, 10-year warranty. Serving SE Melbourne."
        keywords="roof painting Pakenham, roof coating Pakenham, tile roof painting Pakenham"
        canonical="https://callkaidsroofing.com.au/services/roof-painting-pakenham"
      />

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Painting in Pakenham
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Pakenham homes benefit massively from a fresh membrane. The mix of winter frost and hot afternoon sun fades roofs quickly along the Princes Highway corridor. Our Pakenham roof painting service renews colour, seals porous tiles and helps regulate roof temperatures.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            We prep every Pakenham roof thoroughly with pressure cleaning, repairs and primer to make sure the final coats bond. Choose from modern matte, satin or gloss finishes that suit Cardinia Lakes, Lakeside and heritage parts of town.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Painting System</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Roof cleaning & sterilising to eliminate moss, lichen and farm dust',
              'Tile repairs and pointing to create a solid base for coatings',
              'Primer application tailored to concrete or terracotta tiles',
              'Two-coat colour system with UV and hail resistance',
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
          <h2 className="text-3xl font-semibold mb-6">Recent Pakenham Roof Painting Results</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/0d5c8d43-0a56-42eb-a3fd-4ce0708040ce.png"
              alt="Pakenham roof before painting"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/50cb1bd1-1166-4391-adc1-99c419346880.png"
              alt="Base coat applied on Pakenham roof"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png"
              alt="Pakenham roof after fresh paint"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Pakenham Chooses Call Kaids Roofing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Local colour consultations to match Pakenham estates and planning guidelines.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 with Dulux or Shield Coat products.</p>
              <p>• Phone: 0435 900 709 – Kaidyn assists with colour boards and sample swatches for Pakenham clients.</p>
              <p>• Optional heat-reflective coatings to keep Pakenham homes cooler in summer.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Popular Pakenham Colour Options</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Basalt and Monument for modern estates</li>
                <li>✔ Jasper and Woodland Grey for acreage properties</li>
                <li>✔ Terracotta revival tones for traditional streets</li>
                <li>✔ Custom colour matching available with gloss, satin or matte</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Pakenham Roof Colour Consultation</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Ready for a Pakenham roof refresh? Call today or request a visit to review colour samples in person.
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

export default RoofPaintingPakenham;
