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
import callKaidsFullLogo from '@/assets/call-kaids-full-logo.png';

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
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Particle System */}
      <ParticleSystem />
      
      {/* Top Header Bar with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-navbar">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:bg-white/10 mr-4"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Full Logo - Enhanced */}
          <div className="flex-1 flex justify-center lg:justify-start lg:ml-80">
            <OptimizedImage
              src={callKaidsFullLogo}
              alt="Call Kaids Roofing - Professional Roofing Services Melbourne"
              className="h-14 lg:h-18 w-auto max-w-full object-contain hover:scale-105 transition-transform duration-300"
              width={800}
              height={200}
            />
          </div>

          {/* Enhanced Contact Info */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="tel:0435900709" 
              className="flex items-center space-x-3 text-white hover:text-primary transition-all duration-300 hover:scale-105 glass-card px-4 py-2 rounded-lg"
            >
              <Phone className="h-5 w-5" />
              <span className="text-sm font-semibold">0435 900 709</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area - Adjusted for top header */}
      {/* Sidebar */}
      <ElegantSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 pt-20 lg:pt-24 ${
        sidebarOpen ? 'lg:ml-80' : 'lg:ml-80'
      }`}>

        {/* Page Content */}
        <main className="min-h-screen">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      <ScrollToTop />
    </div>
  );
};

export default ElegantLayout;