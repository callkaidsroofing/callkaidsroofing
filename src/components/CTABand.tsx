import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import skyBackground from '@/assets/sky-background.jpg';

export const CTABand = () => {
  return (
    <section className="relative text-white section-padding overflow-hidden">
      <OptimizedImage
        src={skyBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={400}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/85 to-blue-500/85"></div>
      
      <div className="container-max mx-auto px-4 text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight metallic-text">
              Book Me Now—Slots Are Limited
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              I'm booked 2-3 weeks out because quality spreads by word of mouth. 
              Book your comprehensive roof assessment today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 trust-green flex-shrink-0" />
              <span className="text-lg">Free inspection with honest advice</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 trust-green flex-shrink-0" />
              <span className="text-lg">10-year warranty on major work</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-6 w-6 trust-green flex-shrink-0" />
              <span className="text-lg">Emergency response when storms hit</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 h-14 text-lg font-semibold"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Me Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 h-14 text-lg font-semibold"
              onClick={() => window.location.href = 'tel:0435900709'}
            >
              <Phone className="mr-2 h-5 w-5" />
              <span className="highlight-yellow">Call 0435 900 709</span>
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-white/80 text-lg font-semibold">
              Usually $250 • Book before Sunday and save
            </p>
            <p className="text-white/70">
              Direct line to owner • Same-day response guarantee • 25+ years experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABand;