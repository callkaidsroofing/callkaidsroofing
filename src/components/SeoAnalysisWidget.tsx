import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SeoAnalysisWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous children (avoid duplicate widgets on re-mounts)
    container.innerHTML = "";

    // Create and append the external widget script inside the container
    const script = document.createElement("script");
    script.async = true;
    script.dataset.widgetId = "14442591191020099ff47da23fb09078659dd8a6";
    script.src = "https://www.local-marketing-reports.com/m/assets-v2/lead-gen/js/external/widget-builder.js";

    // Optional: basic error handling UI
    script.onerror = () => {
      const fallback = document.createElement("div");
      fallback.className = "text-sm text-muted-foreground text-center mt-4";
      fallback.textContent = "The SEO tool failed to load. Please refresh and try again.";
      container.appendChild(fallback);
    };

    container.appendChild(script);

    return () => {
      // Cleanup on unmount
      container.innerHTML = "";
    };
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-secondary/5 to-primary/5 border-y border-primary/10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white text-sm px-4 py-2">
            🎯 FREE Business Tool
          </Badge>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Free SEO Analysis Tool
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            As Melbourne business owners ourselves, we believe in supporting the local community.
            Use this free SEO analysis tool to discover how your website ranks and get actionable insights to grow your business online.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-2">✓ Completely Free</span>
            <span className="flex items-center gap-2">✓ Instant Results</span>
            <span className="flex items-center gap-2">✓ No Sign-up Required</span>
            <span className="flex items-center gap-2">✓ Professional Grade Analysis</span>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-background to-background/50 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Analyze Your Website's SEO Performance</h3>
              <p className="text-muted-foreground">
                Enter your website URL below to get a comprehensive SEO report and discover opportunities to improve your online presence.
              </p>
            </div>

            {/* Actual widget mount point */}
            <div className="flex justify-center">
              <div ref={containerRef} id="seo-widget-container" className="w-full max-w-xl" />
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Pro Tip:</strong> This tool analyzes over 100+ SEO factors including mobile-friendliness,
                page speed, keyword optimization, and technical SEO issues. Perfect for business owners who want to understand their online presence better.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Brought to you by Call Kaids Roofing - Supporting Melbourne's business community 🤝
          </p>
        </div>
      </div>
    </section>
  );
}
