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

  // Avoid returning null (white screen) while mounting; show a lightweight shell instead.
  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-muted-foreground font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background relative overflow-x-hidden w-full max-w-[100vw]">
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
      <div className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Page Content - No top padding, sections control their own spacing */}
        <main className="min-h-screen w-full max-w-full">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Call Button - KF_11 CTA Optimization */}
      <a
        href="tel:0435900709"
        className="md:hidden fixed bottom-4 left-4 right-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 px-4 font-semibold shadow-2xl shadow-primary/40 hover:bg-primary/90 transition-all text-sm animate-pulse"
        aria-label="Call Kaidyn now for immediate assistance"
      >
        <Phone className="h-4 w-4" />
        Call Kaidyn: 0435 900 709
      </a>

      <ScrollToTop />
    </div>
  );
};

export default ElegantLayout;