import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ElegantSidebar from '@/components/ElegantSidebar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

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
    <div className="min-h-screen flex bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sidebar */}
      <ElegantSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-80' : 'lg:ml-80'
      }`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-sm font-semibold text-foreground">
              Call Kaids Roofing
            </div>
            <div></div> {/* Spacer for center alignment */}
          </div>
        </header>

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