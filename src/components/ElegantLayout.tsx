import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ElegantSidebar from '@/components/ElegantSidebar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import ParticleSystem from '@/components/ParticleSystem';
import { OptimizedImage } from '@/components/OptimizedImage';
import { MetaPixelTracker } from '@/components/MetaPixelTracker';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import callKaidsFullLogo from '@/assets/call-kaids-logo-slogan.png';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About Us" },
  { href: "/book", label: "Book Now" },
];

export const ElegantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-muted/20 to-background relative">
      {/* Analytics and Tracking */}
      <MetaPixelTracker />
      <GoogleAnalytics measurementId="GA-CALLKAIDS-MEASUREMENT-ID" />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Particle System */}
      <div className="z-0">
        <ParticleSystem />
      </div>
      
      {/* Modern Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-roofing-navy/90 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-6">
          
          {/* Logo */}
          <a href="/" className="flex items-center z-10">
            <OptimizedImage
              src={callKaidsFullLogo}
              alt="Call Kaids Roofing - Proof In Every Roof"
              className="h-14 sm:h-16 lg:h-18 w-auto object-contain hover:scale-105 transition-transform duration-300"
              width={800}
              height={300}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-6 text-white">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-roofing-blue' : 'hover:text-roofing-blue'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button 
              className="bg-roofing-blue hover:bg-roofing-blue/90 ml-2"
              onClick={() => window.location.href = 'tel:0435900709'}
            >
              <Phone className="mr-2 h-4 w-4" />
              0435 900 709
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="text-white bg-transparent border-white/50 hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-roofing-navy text-white border-l-white/20">
                <nav className="flex flex-col gap-y-6 pt-10">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      end={link.href === "/"}
                      className={({ isActive }) =>
                        `text-lg font-medium ${isActive ? 'text-roofing-blue' : ''}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  <Button 
                    size="lg" 
                    className="bg-roofing-blue hover:bg-roofing-blue/90 text-lg mt-4"
                    onClick={() => window.location.href = 'tel:0435900709'}
                  >
                    <Phone className="mr-2 h-5 w-5" /> Call Now
                  </Button>
                  <p className="text-sm text-white/70">0435 900 709</p>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {/* Page Content with responsive top spacing */}
        <main className="pt-20 min-h-screen">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Call Button - Improved positioning */}
      <a
        href="tel:0435900709"
        className="md:hidden fixed bottom-4 left-4 right-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 px-4 font-semibold shadow-2xl shadow-primary/40 hover:bg-primary/90 transition-all text-sm"
      >
        <Phone className="h-4 w-4" />
        Call Now • 0435 900 709
      </a>

      <ScrollToTop />
    </div>
  );
};

export default ElegantLayout;