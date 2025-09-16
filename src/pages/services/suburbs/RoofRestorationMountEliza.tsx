import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofRestorationMountEliza = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Roof Restorations Mount Eliza | Call Kaids Roofing SE Melbourne"
        description="Coastal roof restoration for Mount Eliza homes facing salt spray and bay winds. Premium coatings, meticulous repairs and 10-year warranties."
        keywords="roof restoration Mount Eliza, coastal roof repair Mount Eliza, roof coating Mount Eliza"
      />

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Roof Restoration in Mount Eliza
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl">
            Mount Eliza roofs contend with salt spray, bay gusts and leafy surrounds. Coastal conditions chew through cheap coatings fast and corrode valley irons. Our Mount Eliza roof restorations reinforce your home against the elements while keeping that polished Mornington Peninsula presentation.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            From Canadian Bay Road to Mount Eliza Village, we work around steep driveways and curated gardens. Expect careful cleaning, ridge repairs and marine-grade membrane systems that resist salt, UV and moisture for the long haul.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Our Roof Restoration Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'High-pressure cleaning to remove salt crystals, leaf stains and mould',
              'Tile replacement & repairs with premium terracotta and concrete matches',
              'Rebedding & repointing ridge caps to withstand coastal wind uplift',
              'Protective coatings with 10-year warranty engineered for seaside exposure',
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
          <h2 className="text-3xl font-semibold mb-6">Before & After Transformations in Mount Eliza</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OptimizedImage
              src="/lovable-uploads/7b53e2bb-e419-483c-b48c-ea2d1f5c139e.png"
              alt="Mount Eliza roof before restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png"
              alt="Mount Eliza roof being restored"
              className="rounded-lg"
              width={600}
              height={400}
            />
            <OptimizedImage
              src="/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png"
              alt="Mount Eliza roof after restoration"
              className="rounded-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Why Mount Eliza Homeowners Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>• Mount Eliza roof restoration team familiar with coastal access and steep blocks.</p>
              <p>• 10-year workmanship warranty backed by ABN 39475055075 plus marine-grade product warranties.</p>
              <p>• Phone: 0435 900 709 – Kaidyn coordinates personally to protect landscaping and scheduling.</p>
              <p>• Detailed clean-up to keep your Mount Eliza property looking pristine for open homes.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Included with Every Mount Eliza Restoration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✔ Salt-resistant primers and membranes</li>
                <li>✔ Flashing upgrades for bay-facing elevations</li>
                <li>✔ Ridge tie-down checks for high-wind zones</li>
                <li>✔ Full site clean-up including driveway wash-down</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Schedule Your Mount Eliza Roof Health Check</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Protect your Mount Eliza investment against salt and wind. Call today or book a premium roof inspection online.
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

export default RoofRestorationMountEliza;
