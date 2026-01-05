import { useEffect } from 'react';

interface ReputationHubWidgetProps {
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Embeds the ReputationHub review widget iframe
 * Replaces custom review displays with verified third-party reviews
 */
export function ReputationHubWidget({ 
  className = '', 
  title,
  description 
}: ReputationHubWidgetProps) {
  useEffect(() => {
    // Load the ReputationHub script
    const existingScript = document.querySelector('script[src*="reputationhub.site"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://reputationhub.site/reputation/assets/review-widget.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {(title || description) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      <iframe
        className="lc_reviews_widget w-full min-h-[400px] rounded-lg"
        src="https://reputationhub.site/reputation/widgets/review_widget/g9ue9OBQ12B8KgPIszOo"
        frameBorder="0"
        scrolling="no"
        style={{ minWidth: '100%', width: '100%' }}
        title="Customer Reviews"
      />
    </div>
  );
}

export default ReputationHubWidget;
