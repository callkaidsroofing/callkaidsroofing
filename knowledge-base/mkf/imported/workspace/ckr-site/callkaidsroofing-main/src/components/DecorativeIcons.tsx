import { Wrench, Shield, Clock, Star, Hammer, Home, Zap, Award } from 'lucide-react';

interface DecorativeIconProps {
  variant?: 'floating' | 'accent' | 'background';
  className?: string;
}

export const FloatingIcons = ({ className = '' }: DecorativeIconProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating tool icons */}
      <Wrench className="absolute top-20 left-10 h-8 w-8 text-white/10 animate-pulse" style={{ animationDelay: '0s' }} />
      <Shield className="absolute top-40 right-20 h-12 w-12 text-white/8 animate-pulse" style={{ animationDelay: '1s' }} />
      <Hammer className="absolute bottom-32 left-20 h-6 w-6 text-white/12 animate-pulse" style={{ animationDelay: '2s' }} />
      <Home className="absolute bottom-20 right-10 h-10 w-10 text-white/6 animate-pulse" style={{ animationDelay: '1.5s' }} />
      <Star className="absolute top-60 left-1/4 h-4 w-4 text-white/15 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <Clock className="absolute top-80 right-1/3 h-6 w-6 text-white/10 animate-pulse" style={{ animationDelay: '2.5s' }} />
      <Zap className="absolute bottom-60 right-1/4 h-8 w-8 text-white/8 animate-pulse" style={{ animationDelay: '3s' }} />
      <Award className="absolute top-32 right-1/2 h-5 w-5 text-white/12 animate-pulse" style={{ animationDelay: '1.2s' }} />
    </div>
  );
};

export const SectionDivider = ({ className = '' }: DecorativeIconProps) => {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary"></div>
        <Shield className="h-6 w-6 text-primary" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary"></div>
      </div>
    </div>
  );
};

export const AccentPattern = ({ className = '' }: DecorativeIconProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-5 ${className}`}>
      <div className="grid grid-cols-8 gap-8 h-full w-full rotate-12 transform scale-150">
        {Array.from({ length: 32 }).map((_, i) => {
          const icons = [Home, Wrench, Shield, Hammer];
          const Icon = icons[i % icons.length];
          return <Icon key={i} className="h-4 w-4 text-primary" />;
        })}
      </div>
    </div>
  );
};