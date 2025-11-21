import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

export const StickyMobileHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-secondary via-charcoal to-secondary backdrop-blur-xl border-b border-conversion-cyan/30 shadow-[0_4px_20px_rgba(0,212,255,0.2)] md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Slogan - Spanning Width */}
        <div className="flex-1 text-center">
          <p className="text-white font-serif italic text-sm tracking-[0.15em] opacity-90">
            Proof In Every Roof
          </p>
        </div>

        {/* Menu Icon */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-conversion-cyan/20 hover:text-conversion-cyan transition-all"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-gradient-to-b from-secondary to-charcoal border-conversion-cyan/30">
            <div className="flex flex-col gap-4 mt-8">
              <Link 
                to="/" 
                onClick={() => setOpen(false)}
                className="text-white hover:text-conversion-cyan transition-colors text-lg font-semibold"
              >
                Home
              </Link>
              <Link 
                to="/services" 
                onClick={() => setOpen(false)}
                className="text-white hover:text-conversion-cyan transition-colors text-lg font-semibold"
              >
                Services
              </Link>
              <Link 
                to="/quote" 
                onClick={() => setOpen(false)}
                className="text-white hover:text-conversion-cyan transition-colors text-lg font-semibold"
              >
                Get Quote
              </Link>
              <a 
                href="tel:0435900709" 
                className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-conversion-blue to-conversion-cyan text-white py-3 px-4 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
                onClick={() => setOpen(false)}
              >
                📞 0435 900 709
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
