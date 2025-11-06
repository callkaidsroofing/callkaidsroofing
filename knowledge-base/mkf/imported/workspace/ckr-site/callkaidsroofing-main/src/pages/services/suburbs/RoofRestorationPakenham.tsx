import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRestorationPakenham = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Roof Restorations Pakenham | Call Kaids Roofing SE Melbourne"
        description="Restore weathered Pakenham roofs with cleaning, repairs and membrane coatings designed for the hills and winter frost. Local crew, honest pricing."
        keywords="roof restoration Pakenham, roof repair Pakenham, membrane coating Pakenham"
      />

      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Restoration in Pakenham
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Pakenham rooftops handle frosty mornings, strong afternoon sun and the occasional hailstorm rolling off the ranges. The older estates in Pakenham are showing tile delamination and worn ridge mortar. A tailored roof restoration gives Pakenham homes a new lease on life while sealing out winter moisture.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            We focus on dense cleaning, tile swaps and triple-coat membranes that shrug off UV and frost alike. Being regularly in Pakenham means we know the estate layouts and can source matching tiles quickly when replacements are needed.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Restoration Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'High-pressure cleaning to remove lichen and dairy dust common around Pakenham',
              'Tile replacement & repairs for cracked hips and valleys from thermal movement',
              'Rebedding & repointing ridge caps with flexible compounds that hold through cold snaps',
              'Protective coatings with 10-year warranty to lock in colour on sloped Pakenham roofs',
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
          <h2 className="text-3xl font-semibold mb-6">Before & After Transformations in Pakenham</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/3eea8208-16ab-4e73-8295-c92c3bf95f58.png"
              alt="Pakenham roof before restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png"
              alt="Mid restoration cleaning in Pakenham"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/b583ddb3-be15-4d62-b3fe-1d5a4ed4cd2a.png"
              alt="Pakenham roof after restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Pakenham Homeowners Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Pakenham roof restoration experts who understand hillside access challenges.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 and comprehensive insurance for every Pakenham project.</p>
              <p>• Phone: 0435 900 709 – speak directly with Kaidyn about booking around school traffic on the Princes Highway.</p>
              <p>• Advice on colour schemes that complement Pakenham’s modern estates and heritage pockets.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Included with Every Pakenham Restoration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Ridge cap inspection across every hip and valley</li>
                <li>✔ Replacement valley irons where corrosion has started</li>
                <li>✔ Dulux Acratex or Shield Coat membrane matched to local palettes</li>
                <li>✔ Gutter clean and downpipe flush to prep for winter rains</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Book Your Pakenham Roof Health Check</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Keep your Pakenham property protected from frost, hail and summer heat. Call today or request an inspection online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/book">Book Free Roof Health Check</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofRestorationPakenham;
