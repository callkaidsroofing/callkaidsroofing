import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StickyMobileHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/10 py-3 px-4 md:hidden shadow-sm">
      <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
        <a href="tel:0435900709" className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" />
          Call Now: 0435 900 709
        </a>
      </Button>
    </div>
  );
};
