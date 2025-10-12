import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import ParticleSystem from '@/components/ParticleSystem';
import { MetaPixelTracker } from '@/components/MetaPixelTracker';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

export const ElegantLayout = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {/* Page Content - Reduced top spacing on mobile */}
        <main className="pt-16 md:pt-20 min-h-screen">
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