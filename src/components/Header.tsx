import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import callKaidsLogo from '@/assets/call-kaids-logo.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const services = [
    { name: 'Roof Restoration', href: '/services/roof-restoration' },
    { name: 'Roof Painting', href: '/services/roof-painting' },
    { name: 'Roof Repairs', href: '/services/roof-repairs' },
    { name: 'Gutter Cleaning', href: '/services/gutter-cleaning' },
    { name: 'Valley Iron Replacement', href: '/services/valley-iron-replacement' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={callKaidsLogo} alt="Call Kaids Roofing" className="h-10 w-auto" />
            <span className="text-xl font-bold metallic-gradient bg-clip-text text-transparent">
              Call Kaids Roofing
            </span>
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
            <a href="tel:0435900709" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">0435 900 709</span>
            </a>
            <Button asChild variant="premium" size="lg">
              <Link to="/contact">Get Quote</Link>
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
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Get Quote</Link>
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