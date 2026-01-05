import { ReputationHubWidget } from '@/components/ReputationHubWidget';

interface ReviewsGridProps {
  title?: string;
  description?: string;
}

/**
 * Reviews grid component - now uses ReputationHub widget for verified reviews
 */
export function ReviewsGrid({ title, description }: ReviewsGridProps) {
  return (
    <ReputationHubWidget 
      title={title}
      description={description}
      className="py-4"
    />
  );
}
