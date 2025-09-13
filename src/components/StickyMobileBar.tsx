import { Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StickyMobileBar = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
      <div className="grid grid-cols-2 gap-0">
        <Button 
          className="rounded-none h-14 primary-gradient text-white font-semibold text-base"
          onClick={() => window.location.href = 'tel:0435900709'}
        >
          <Phone className="mr-2 h-5 w-5" />
          Call Now
        </Button>
        <Button 
          variant="outline"
          className="rounded-none h-14 border-0 border-l border-border bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base"
          onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Book
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileBar;