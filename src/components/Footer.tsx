import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const serviceAreas = [
    'Clyde North', 'Berwick', 'Officer', 'Pakenham', 'Cranbourne',
    'Frankston', 'Narre Warren', 'Brighton', 'Toorak', 'Kew'
  ];

  const services = [
    { name: 'Roof Restoration', href: '/services/roof-restoration' },
    { name: 'Roof Painting', href: '/services/roof-painting' },
    { name: 'Roof Repairs', href: '/services/roof-repairs' },
    { name: 'Gutter Cleaning', href: '/services/gutter-cleaning' },
    { name: 'Emergency Repairs', href: '/emergency' },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Call Kaids Roofing</h3>
            <p className="text-muted-foreground text-sm">
              Premium roofing services in Southeast Melbourne. Built from scratch by Kaidyn Brownlie, 
              first-generation roofer committed to quality workmanship.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Based in Clyde North, VIC</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Usually booked 2-3 weeks out</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                10-Year Warranty
              </span>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Areas</h3>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Serving Southeast Melbourne:</p>
              <div className="flex flex-wrap gap-1">
                {serviceAreas.map((area, index) => (
                  <span key={area}>
                    {area}
                    {index < serviceAreas.length - 1 && <span className="text-muted-foreground/60"> • </span>}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs">Within 50km of Clyde North</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Kaidyn</h3>
            <div className="space-y-3">
              <a 
                href="tel:0435900709"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 group-hover:text-primary" />
                <span className="font-semibold">0435 900 709</span>
              </a>
              <a 
                href="mailto:callkaidsroofing@outlook.com"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 group-hover:text-primary" />
                <span>callkaidsroofing@outlook.com</span>
              </a>
            </div>
            
            <div className="space-y-2">
              <Button asChild variant="emergency" size="sm" className="w-full">
                <Link to="/emergency">Emergency Repairs</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/contact">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Call Kaids Roofing. Premium roofing services in Southeast Melbourne.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/warranty" className="text-muted-foreground hover:text-primary transition-colors">
              10-Year Warranty
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Kaidyn
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;