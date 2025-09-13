import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X, ChevronDown, Shield, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import wideLogo from '/lovable-uploads/8d1be6f1-c743-47df-8d3e-f1ab6230f326.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const services = [
    { name: 'Roof Restoration', href: '/roof-restoration' },
    { name: 'Roof Painting', href: '/roof-painting' },
    { name: 'Roof Repointing', href: '/roof-repointing' },
    { name: 'Tile Replacement', href: '/tile-replacement' },
    { name: 'Leak Detection', href: '/leak-detection' },
    { name: 'Gutter Cleaning', href: '/services/gutter-cleaning' },
    { name: 'Valley Iron Replacement', href: '/services/valley-iron-replacement' },
    { name: 'Roof Repairs', href: '/services/roof-repairs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar with Hero Gradient Background */}
      <div className="bg-gradient-to-b from-black/60 to-black/40 text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">10-Year Warranty</span>
            </div>
            <div className="hidden sm:block text-white/70">•</div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Clyde North Based - Serving SE Melbourne</span>
            </div>
            <div className="hidden sm:block text-white/70">•</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Book Early - 2-3 Weeks Out
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <OptimizedImage
              src={wideLogo}
              alt="Call Kaids Roofing - Premium Roofing Services Melbourne"
              className="h-14 w-auto max-w-[280px]"
              width={137}
              height={80}
              priority
              sizes="280px"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button className="flex items-center text-foreground hover:text-primary transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-popover border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/emergency" className="text-roofing-emergency hover:text-roofing-emergency/80 font-semibold transition-colors">
              Emergency
            </Link>
          </nav>

          {/* Phone Number & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Call Kaidyn Directly</div>
              <a href="tel:0435900709" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                <Phone className="h-4 w-4" />
                <span className="font-bold text-lg">0435 900 709</span>
              </a>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <Button asChild variant="default" size="lg" className="bg-accent hover:bg-accent/80">
              <Link to="/book">Free Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 py-4 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Services */}
              <div className="px-3 py-2">
                <div className="text-base font-medium text-foreground mb-2">Services</div>
                <div className="pl-4 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/blog"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/emergency"
                className="block px-3 py-2 text-base font-medium text-roofing-emergency hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Emergency
              </Link>
              
              {/* Mobile Phone & CTA */}
              <div className="px-3 py-4 space-y-3 border-t">
                <a href="tel:0435900709" className="flex items-center justify-center space-x-2 text-primary font-semibold">
                  <Phone className="h-5 w-5" />
                  <span>0435 900 709</span>
                </a>
                <Button asChild variant="premium" size="lg" className="w-full">
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)}>Get Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;