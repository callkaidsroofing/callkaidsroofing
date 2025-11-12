import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
}

interface GalleryDisplayProps {
  page: "homepage" | "about" | "services" | "portfolio";
  className?: string;
}

export function GalleryDisplay({ page, className = "" }: GalleryDisplayProps) {
  const fieldMap: Record<string, string> = {
    homepage: "show_on_homepage",
    about: "show_on_about",
    services: "show_on_services",
    portfolio: "show_on_portfolio",
  };

  const { data: images, isLoading, error } = useQuery<MediaItem[]>({
    queryKey: ["gallery-display", page],
    queryFn: async () => {
      const field = fieldMap[page];
      
      if (!field) {
        console.error(`Invalid page type: ${page}`);
        return [];
      }
      
      const result = await supabase
        .from("media_gallery")
        .select("id, title, description, image_url, display_order")
        .match({ is_active: true, [field]: true })
        .order("display_order", { ascending: true });
      
      if (result.error) {
        console.error("Gallery fetch error:", result.error);
        throw result.error;
      }
      
      return (result.data || []) as MediaItem[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.error("GalleryDisplay error:", error);
    return null;
  }

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {images.map((image, index) => (
        <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
          <OptimizedImage
            src={image.image_url}
            alt={image.title}
            className="w-full h-full aspect-video transition-transform group-hover:scale-105"
            priority={index < 3}
          />
          {image.description && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <h3 className="text-white font-semibold">{image.title}</h3>
                <p className="text-white/90 text-sm">{image.description}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
