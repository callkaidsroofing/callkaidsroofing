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
    const fetchBusinessProfile = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-gbp-location-id');
        
        if (error) throw error;
        
        if (data?.success && data.locations?.[0]) {
          const location = data.locations[0];
          setBusinessData({
            name: location.name,
            address: location.address,
            phoneNumber: location.phoneNumber,
            websiteUrl: location.websiteUrl,
            rating: 4.9,
            reviewCount: 200
          });
        }
      } catch (error) {
        console.error('Error fetching Google Business Profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
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
    <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            {businessData.name}
          </h3>
          {businessData.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center bg-roofing-warning/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-roofing-warning text-roofing-warning mr-1" />
                <span className="font-bold text-foreground">{businessData.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {businessData.reviewCount}+ Google Reviews
              </span>
            </div>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessData.name + ' ' + businessData.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 group">
          <MapPin className="w-5 h-5 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
          <p className="text-sm text-foreground flex-1">{businessData.address}</p>
        </div>

        <a
          href={`tel:${businessData.phoneNumber}`}
          className="flex items-center gap-3 text-primary hover:text-secondary transition-colors group"
        >
          <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">{businessData.phoneNumber}</span>
        </a>

        {businessData.websiteUrl !== 'N/A' && (
          <a
            href={businessData.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-primary hover:text-secondary transition-colors group"
          >
            <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm truncate">{businessData.websiteUrl}</span>
          </a>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-primary/20">
        <a
          href={`https://search.google.com/local/writereview?placeid=${businessData.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors group"
        >
          <Star className="w-4 h-4 group-hover:fill-roofing-warning group-hover:text-roofing-warning transition-all" />
          Leave us a review on Google
        </a>
      </div>
    </div>
  );
};

export default GoogleBusinessProfile;
