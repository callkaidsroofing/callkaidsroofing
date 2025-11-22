import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';

const Footer = () => {
  const serviceAreas = [
    { name: 'Clyde North', href: '/services/roof-restoration-clyde-north' },
    { name: 'Berwick', href: '/services/roof-restoration-berwick' },
    { name: 'Pakenham', href: '/services/roof-restoration-pakenham' },
    { name: 'Cranbourne', href: '/services/roof-restoration-cranbourne' },
    { name: 'Mount Eliza', href: '/services/roof-restoration-mount-eliza' },
    { name: 'Officer', href: '#' },
    { name: 'Frankston', href: '#' },
    { name: 'Narre Warren', href: '#' },
    { name: 'Brighton', href: '#' },
    { name: 'Toorak', href: '#' }
  ];

  const services = [
    { name: 'Roof Restoration', href: '/services/roof-restoration' },
    { name: 'Roof Painting', href: '/services/roof-painting' },
    { name: 'Roof Repairs', href: '/services/roof-repairs' },
    { name: 'Gutter Cleaning', href: '/services/gutter-cleaning' },
    { name: 'Emergency Repairs', href: '/emergency' },
  ];

  return (
    <footer className="bg-gradient-to-br from-charcoal via-secondary to-charcoal border-t-2 border-conversion-black/30 relative overflow-hidden">
      {/* Metallic shimmer overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
      
      {/* Hero Call to Action Section with Banner */}
      <OptimizedBackgroundSection
        backgroundImage="/lovable-uploads/5eea137e-7ec4-407d-8452-faeea24c872f.png"
        gradient="linear-gradient(130deg, rgba(11,15,25,0.92), rgba(11,59,105,0.88))"
        className="py-16 text-white relative z-10"
        imageAlt="White roof tiles background"
        sizes="(max-width: 1024px) 100vw, 1440px"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Roof Done Right?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Call Kaidyn directly - no call centers, no waiting, just honest advice from a local expert with 15-year warranty
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="tel:0435900709"
              className="flex items-center gap-3 bg-gradient-to-r from-conversion-blue via-conversion-cyan to-conversion-blue hover:from-conversion-cyan hover:to-conversion-deep text-white px-8 py-4 rounded-xl font-black text-xl transition-all duration-300 shadow-[0_10px_40px_rgba(41,179,255,0.5)] hover:shadow-[0_15px_50px_rgba(0,212,255,0.7)] hover:scale-105 border-2 border-conversion-black/20"
            >
              <Phone className="h-6 w-6" />
              Call 0435 900 709 Now
            </a>
            <Button asChild variant="outline" size="lg" className="bg-gradient-to-r from-conversion-cyan/20 to-conversion-blue/20 border-2 border-conversion-cyan text-white hover:bg-gradient-to-r hover:from-conversion-cyan hover:to-conversion-blue backdrop-blur-sm font-bold shadow-lg">
              <Link to="/book">Get Free Roof Health Check</Link>
            </Button>
          </div>

          {/* Trust indicators overlay */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Award className="h-4 w-4" />
              <span>15-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="h-4 w-4" />
              <span>Quality Work Guaranteed</span>
            </div>
          </div>
        </div>
      </OptimizedBackgroundSection>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Quick Links Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          <Link to="/services" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">Services</h3>
            <p className="text-white/70 text-sm">View all roofing services</p>
          </Link>
          
          <Link to="/portfolio" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">Our Work</h3>
            <p className="text-white/70 text-sm">See completed projects</p>
          </Link>
          
          <Link to="/faq" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">FAQs</h3>
            <p className="text-white/70 text-sm">Common questions</p>
          </Link>
          
          <Link to="/about" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">About</h3>
            <p className="text-white/70 text-sm">Meet the team</p>
          </Link>
          
          <Link to="/services/roof-restoration-clyde-north" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">Clyde North</h3>
            <p className="text-white/70 text-sm">Local roofing experts</p>
          </Link>
          
          <Link to="/services/roof-restoration-berwick" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">Berwick</h3>
            <p className="text-white/70 text-sm">Roof restoration</p>
          </Link>
          
          <Link to="/emergency" className="group bg-gradient-to-br from-destructive/20 to-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-lg p-6 hover:border-destructive transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-destructive mb-2">Emergency</h3>
            <p className="text-white/70 text-sm">Same day service</p>
          </Link>
          
          <Link to="/warranty" className="group bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-6 hover:border-conversion-cyan transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-conversion-cyan mb-2">Warranty</h3>
            <p className="text-white/70 text-sm">15-year guarantee</p>
          </Link>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-conversion-blue/10 to-conversion-cyan/10 backdrop-blur-sm border border-conversion-cyan/20 rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Contact Kaidyn Directly</h3>
              <p className="text-white/70 mb-4">Owner's direct line - no call centers</p>
              <a href="tel:0435900709" className="flex items-center gap-2 text-conversion-cyan hover:text-conversion-blue font-bold text-xl mb-2 transition-colors">
                <Phone className="h-6 w-6" />
                0435 900 709
              </a>
              <a href="mailto:info@callkaidsroofing.com.au" className="flex items-center gap-2 text-white/80 hover:text-conversion-cyan transition-colors">
                <Mail className="h-4 w-4" />
                info@callkaidsroofing.com.au
              </a>
            </div>
            <div className="space-y-3">
              <Button asChild variant="default" size="lg" className="w-full bg-gradient-to-r from-conversion-blue to-conversion-cyan hover:from-conversion-cyan hover:to-conversion-deep text-white font-bold shadow-lg">
                <Link to="/book">Get Free Quote</Link>
              </Button>
              <Button asChild variant="emergency" size="lg" className="w-full">
                <Link to="/emergency">Emergency: Same Day</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-conversion-black/30 pt-8">
          <div className="text-center space-y-3">
            <div className="text-sm text-white/80">
              <span className="font-semibold">© 2024 Call Kaids Roofing</span> • ABN: 39475055075
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy-policy" className="text-white/60 hover:text-conversion-cyan transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="text-white/60 hover:text-conversion-cyan transition-colors">Terms</Link>
              <Link to="/admin" className="text-white/30 hover:text-conversion-cyan transition-colors">Internal</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;