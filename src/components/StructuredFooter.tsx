import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const StructuredFooter = () => {
  const serviceAreas = [
    "Berwick", "Cranbourne", "Clyde North", "Dandenong", "Pakenham", 
    "Officer", "Rowville", "Narre Warren", "Hampton Park", "Lyndhurst"
  ];

  const services = [
    { name: "Roof Restoration", href: "/services/roof-restoration" },
    { name: "Roof Painting", href: "/services/roof-painting" },
    { name: "Ridge Repointing", href: "/services/roof-repointing" },
    { name: "Valley Iron Replacement", href: "/services/valley-iron-replacement" },
    { name: "Gutter Cleaning", href: "/services/gutter-cleaning" },
    { name: "Leak Detection", href: "/services/leak-detection" },
    { name: "Roof Repairs", href: "/services/roof-repairs" },
    { name: "Emergency Repairs", href: "/emergency" }
  ];

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Warranty", href: "/warranty" },
    { name: "Privacy Policy", href: "/privacy" }
  ];

  return (
    <footer className="bg-muted/30 border-t" role="contentinfo">
      <div className="container-max mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Call Kaids Roofing</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <a href="tel:0435900709" className="text-primary hover:underline">
                    0435 900 709
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Email</div>
                  <a href="mailto:callkaidsroofing@outlook.com" className="text-primary hover:underline">
                    callkaidsroofing@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Service Area</div>
                  <div className="text-muted-foreground text-sm">
                    Southeast Melbourne<br />
                    50km radius from Clyde North
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div className="text-muted-foreground text-sm">
                    Mon-Fri: 7:00 AM - 6:00 PM<br />
                    Sat: 8:00 AM - 4:00 PM<br />
                    Emergency: 24/7
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>ABN:</strong> 39475055075
              </div>
              <div className="text-sm text-muted-foreground">
                Fully insured • 10-year warranty
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <nav className="space-y-2">
              {services.map((service) => (
                <Link 
                  key={service.name}
                  to={service.href}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Areas */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Service Areas</h3>
            <div className="grid grid-cols-2 gap-1">
              {serviceAreas.map((area) => (
                <div key={area} className="text-muted-foreground text-sm py-1">
                  {area}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links & Action */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 space-y-3">
              <Button 
                className="w-full primary-gradient text-white"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Free Inspection
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => window.location.href = 'tel:0435900709'}
              >
                Call Now: 0435 900 709
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Call Kaids Roofing. All rights reserved. 
              <span className="block md:inline md:ml-2">
                Professional roofing services in Southeast Melbourne.
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Link to="/warranty" className="text-muted-foreground hover:text-primary">
                Warranty
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/admin/login" className="text-muted-foreground hover:text-primary">
                Admin
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">
              <strong>Current Availability:</strong> Booking 2-3 weeks out for full restorations • Same-day emergency response
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Phone: 0435 900 709 • Email: callkaidsroofing@outlook.com • ABN: 39475055075
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StructuredFooter;