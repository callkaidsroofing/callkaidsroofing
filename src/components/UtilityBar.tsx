import { Clock, Phone, Shield } from 'lucide-react';
import { BUSINESS } from '@/config/business';

export const UtilityBar = () => {
  return (
    <div className="bg-gradient-to-r from-charcoal to-roofing-navy text-white py-2 px-4 border-b border-conversion-cyan/30">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-conversion-cyan" />
            <span>Open: Mon-Fri 8am-4pm</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Shield className="h-4 w-4 text-conversion-blue" />
            <span className="text-conversion-blue font-semibold">Emergency Repairs Available</span>
          </div>
        </div>
        <a
          href={BUSINESS.phone.href}
          className="flex items-center gap-2 font-semibold hover:text-conversion-cyan transition-colors"
        >
          <Phone className="h-4 w-4" />
          {BUSINESS.phone.display}
        </a>
      </div>
    </div>
  );
};
