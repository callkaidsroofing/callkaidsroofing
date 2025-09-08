import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoofPainting = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Roof Painting: Transform Your Home's Look in 3 Days
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional roof painting gives you the biggest bang for your buck. Premium paints designed for Melbourne's crazy weather.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="premium" size="xl">
              <a href="tel:0435900709">
                <Phone className="mr-2 h-5 w-5" />
                Call 0435 900 709
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoofPainting;