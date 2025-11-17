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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white/90">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-conversion-cyan">Call Kaids Roofing</h3>
              <p className="text-sm text-white/70 italic tracking-[0.15em]">*Proof In Every Roof*</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Owner-operated roofing business serving Southeast Melbourne. Quality workmanship, 
              honest service, and 15-year warranties on all major work.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span className="font-semibold">Premium Materials Only</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-semibold">15-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-semibold">500+ Happy Customers</span>
              </div>
            </div>
            
            {/* ABN - Critical compliance requirement */}
            <div className="text-xs text-white/50 border-t border-conversion-black/30 pt-3 mt-3">
              <div className="font-medium">ABN: 39475055075</div>
            </div>
          </div>

          {/* Popular Services & Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-conversion-cyan">Popular Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/roof-restoration-clyde-north" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Clyde North Roofing
                </Link>
              </li>
              <li>
                <Link to="/services/roof-restoration-berwick" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Berwick Roof Restoration
                </Link>
              </li>
              <li>
                <Link to="/services/roof-painting-cranbourne" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Cranbourne Roof Painting
                </Link>
              </li>
              <li>
                <Link to="/services/roof-restoration-pakenham" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Pakenham Roofing Expert
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Before & After Gallery
                </Link>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-block bg-conversion-cyan/20 text-conversion-cyan text-xs px-2 py-1 rounded border border-conversion-cyan/30">
                15-Year Warranty
              </span>
            </div>
          </div>

          {/* Emergency & Specialist Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-conversion-cyan">Emergency & Specialist</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/emergency" className="text-sm text-conversion-blue hover:text-conversion-cyan font-semibold transition-colors">
                  🚨 Emergency Repairs
                </Link>
              </li>
              <li>
                <Link to="/services/leak-detection" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Leak Detection & Repair
                </Link>
              </li>
              <li>
                <Link to="/services/valley-iron-replacement" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Valley Iron Replacement
                </Link>
              </li>
              <li>
                <Link to="/services/tile-replacement" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Tile Replacement
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  15-Year Warranty Info
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-sm text-white/80 hover:text-conversion-cyan transition-colors">
                  Book Free Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Kaidyn Directly</h3>
            <div className="space-y-3">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Owner's Direct Line</div>
                <a 
                  href="tel:0435900709"
                  className="flex items-center space-x-2 text-primary font-bold hover:text-primary/80 transition-colors group"
                >
                  <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">0435 900 709</span>
                </a>
                <div className="text-xs text-muted-foreground mt-1">
                  Text or call - I'll respond within 12 hours
                </div>
              </div>
              
              <a 
                href="mailto:info@callkaidsroofing.com.au"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 group-hover:text-primary" />
                <span>info@callkaidsroofing.com.au</span>
              </a>
            </div>
            
            <div className="space-y-2">
              <Button asChild variant="emergency" size="sm" className="w-full">
                <Link to="/emergency">Emergency: Same Day</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/book">Book Free Roof Health Check</Link>
              </Button>
            </div>
            
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-xs">
                Usually 2-3 weeks out
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <div className="font-semibold">© 2024 Call Kaids Roofing - SE Melbourne's No-BS Roofing Expert</div>
              <div className="text-xs mt-1">
                ABN: 39475055075 • Owner-operated • 15-Year Warranty • Premium Materials • Clyde North Based
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link to="/warranty" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Warranty Info
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Kaidyn
              </Link>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/emergency" className="text-destructive hover:text-destructive/80 font-semibold transition-colors">
                Emergency
              </Link>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="text-center mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-sm font-semibold text-primary">
              Next Available Booking: 2-3 weeks out • Emergency response: Same day
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Quality work takes time - book early to secure your slot
            </div>
          </div>

          {/* Admin Access Link - Discreet */}
          <div className="text-center mt-4">
            <Link 
              to="/internal/v2/home" 
              className="text-xs text-muted-foreground/40 hover:text-primary transition-colors"
            >
              Internal System
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;