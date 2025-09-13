import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  Image, 
  Phone, 
  Calendar, 
  AlertTriangle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/OptimizedImage';
import callKaidsSquareLogo from '@/assets/call-kaids-square-logo.jpg';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ElegantSidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const mainNavItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Services', url: '/services', icon: Wrench, hasSubmenu: true },
    { title: 'Gallery', url: '/gallery', icon: Image },
    { title: 'Book Now', url: '/book', icon: Calendar },
    { title: 'Contact', url: '/contact', icon: Phone },
    { title: 'Emergency', url: '/emergency', icon: AlertTriangle, isEmergency: true },
  ];

  const serviceItems = [
    { title: 'Roof Restoration', url: '/services/roof-restoration' },
    { title: 'Roof Painting', url: '/services/roof-painting' },
    { title: 'Leak Detection', url: '/services/leak-detection' },
    { title: 'Emergency Repairs', url: '/services/roof-repairs' },
    { title: 'Gutter Cleaning', url: '/services/gutter-cleaning' },
    { title: 'Tile Replacement', url: '/services/tile-replacement' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const isServicesOpen = currentPath.startsWith('/services');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-roofing-navy via-roofing-charcoal to-roofing-navy 
        text-white transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'w-80' : 'w-16 lg:w-80'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <OptimizedImage
                  src={callKaidsSquareLogo}
                  alt="Call Kaids Roofing"
                  width={45}
                  height={45}
                  className="rounded-lg border border-white/20"
                />
                <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
                  <h1 className="text-xl font-bold tracking-wide">Call Kaids</h1>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">Professional Roofing</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className={`p-4 border-b border-white/10 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-roofing-emergency/20 border border-roofing-emergency/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-xs font-semibold text-red-400">EMERGENCY 24/7</span>
              </div>
              <a 
                href="tel:0435900709"
                className="text-sm font-bold text-white hover:text-red-200 transition-colors"
              >
                0435 900 709
              </a>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {mainNavItems.map((item) => (
              <div key={item.title}>
                <NavLink
                  to={item.url}
                  onClick={() => !item.hasSubmenu && onToggle()}
                  className={({ isActive: navIsActive }) => `
                    group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                    ${(navIsActive && item.url === '/') || (item.url !== '/' && isActive(item.url))
                      ? 'bg-primary/20 text-white border border-primary/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                    ${item.isEmergency ? 'bg-roofing-emergency/20 border border-roofing-emergency/30' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 ${
                      item.isEmergency ? 'text-red-400' : ''
                    }`} />
                    <span className={`${isOpen ? 'block' : 'hidden lg:block'} font-medium`}>
                      {item.title}
                    </span>
                    {item.isEmergency && (
                      <Badge variant="destructive" className="text-xs">
                        24/7
                      </Badge>
                    )}
                  </div>
                  {item.hasSubmenu && (
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isServicesOpen ? 'rotate-90' : ''
                    } ${isOpen ? 'block' : 'hidden lg:block'}`} />
                  )}
                </NavLink>

                {/* Services Submenu */}
                {item.hasSubmenu && isServicesOpen && (
                  <div className={`mt-2 space-y-1 ${isOpen ? 'block' : 'hidden lg:block'}`}>
                    {serviceItems.map((service) => (
                      <NavLink
                        key={service.title}
                        to={service.url}
                        onClick={onToggle}
                        className={({ isActive: navIsActive }) => `
                          block px-4 py-2 ml-8 text-sm rounded-md transition-colors
                          ${navIsActive 
                            ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {service.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Contact Info */}
          <div className={`p-4 border-t border-white/10 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-1">SERVING SOUTHEAST MELBOURNE</p>
                <p className="text-sm text-white/80">50km radius from Clyde North</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">ABN</p>
                <p className="text-sm text-white/80">39475055075</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  10-Year Warranty
                </Badge>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Fully Insured
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ElegantSidebar;