import { useEffect, useState } from 'react';
import { MapPin, Phone, Globe, Star, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleBusinessData {
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  rating?: number;
  reviewCount?: number;
}

const GoogleBusinessProfile = () => {
  const [businessData, setBusinessData] = useState<GoogleBusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use hardcoded verified GBP data for consistency
    setBusinessData({
      name: "Call Kaids Roofing",
      address: "8 Springleaf Ave, Clyde North, Victoria 3978",
      phoneNumber: "0435 900 709",
      websiteUrl: "https://callkaidsroofing.com.au/",
      rating: 4.9,
      reviewCount: 200
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm border border-primary/20 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-primary/10 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-primary/10 rounded w-full"></div>
          <div className="h-4 bg-primary/10 rounded w-5/6"></div>
          <div className="h-4 bg-primary/10 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!businessData) return null;

  return (
    <div className="bg-gradient-to-br from-secondary via-charcoal to-secondary backdrop-blur-sm border-2 border-primary rounded-2xl p-6 shadow-blue hover:shadow-lg transition-all duration-500 hover:scale-[1.01] relative overflow-hidden">
      {/* Metallic shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver/10 to-transparent opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-silver via-white to-silver bg-clip-text text-transparent mb-2 drop-shadow-lg">
              {businessData.name}
            </h3>
            {businessData.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center bg-roofing-warning/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-roofing-warning/50">
                  <Star className="w-4 h-4 fill-roofing-warning text-roofing-warning mr-1.5" />
                  <span className="font-bold text-white">{businessData.rating}</span>
                </div>
                <span className="text-sm text-silver/90 font-medium">
                  {businessData.reviewCount}+ Google Reviews
                </span>
              </div>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessData.name + ' ' + businessData.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors drop-shadow-lg"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 group">
            <MapPin className="w-5 h-5 text-primary mt-0.5 group-hover:scale-110 transition-transform drop-shadow-md" />
            <p className="text-sm text-silver/90 flex-1 font-medium">{businessData.address}</p>
          </div>

          <a
            href={`tel:${businessData.phoneNumber}`}
            className="flex items-center gap-3 text-primary hover:text-accent transition-colors group"
          >
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-md" />
            <span className="font-bold text-white text-lg">{businessData.phoneNumber}</span>
          </a>

          {businessData.websiteUrl !== 'N/A' && (
            <a
              href={businessData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors group"
            >
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-md" />
              <span className="text-sm truncate text-silver/80 font-medium">{businessData.websiteUrl}</span>
            </a>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-primary/30">
          <a
            href={`https://search.google.com/local/writereview?placeid=${businessData.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors group"
          >
            <Star className="w-4 h-4 group-hover:fill-roofing-warning group-hover:text-roofing-warning transition-all drop-shadow-md" />
            <span className="text-silver/90">Leave us a review on Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleBusinessProfile;
