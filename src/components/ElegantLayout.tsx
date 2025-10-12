import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ElegantSidebar from '@/components/ElegantSidebar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import ParticleSystem from '@/components/ParticleSystem';
import { OptimizedImage } from '@/components/OptimizedImage';
import { MetaPixelTracker } from '@/components/MetaPixelTracker';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import callKaidsFullLogo from '/lovable-uploads/8d1be6f1-c743-47df-8d3e-f1ab6230f326.png';

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
      
      {/* Mobile-First Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-navbar">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:bg-white/10 p-2"
            aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Responsive sizing */}
          <div className="flex-1 flex justify-center lg:justify-start lg:ml-80">
            <OptimizedImage
              src={callKaidsFullLogo}
              alt="Call Kaids Roofing - Professional Roofing Services Melbourne"
              className="h-10 sm:h-12 lg:h-16 xl:h-18 w-auto max-w-full object-contain hover:scale-105 transition-transform duration-300"
              width={800}
              height={200}
            />
          </div>

          {/* Contact Info - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
            <a 
              href="tel:0435900709" 
              className="flex items-center space-x-2 lg:space-x-3 text-white hover:text-primary transition-all duration-300 hover:scale-105 glass-card px-3 py-2 lg:px-4 rounded-lg"
            >
              <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs sm:text-sm font-semibold">0435 900 709</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area - Adjusted for top header */}
      {/* Sidebar */}
      <ElegantSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 w-full ${
        sidebarOpen ? 'lg:ml-80' : 'lg:ml-80'
      }`}>

        {/* Page Content with responsive top spacing */}
        <main className="pt-16 sm:pt-20 lg:pt-28 min-h-screen">
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