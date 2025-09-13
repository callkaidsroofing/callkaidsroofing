import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';

export const CTABand = () => {
  return (
    <section className="primary-gradient text-white section-padding">
      <div className="container-max mx-auto px-4 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Get Your Free Roof Health Check
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Don't wait for a small problem to become an expensive disaster. 
              Book your comprehensive roof assessment today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
              <span className="text-lg">25-point photo inspection</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
              <span className="text-lg">Detailed written report</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
              <span className="text-lg">No-obligation quote</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 h-14 text-lg font-semibold"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Free Inspection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 h-14 text-lg font-semibold"
              onClick={() => window.location.href = 'tel:0435900709'}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 0435 900 709
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-white/80 text-lg font-semibold">
              Usually $250 • Book before Sunday and save
            </p>
            <p className="text-white/70">
              Direct line to owner • Same-day response • 10-year warranty on all work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABand;