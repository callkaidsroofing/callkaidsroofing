import { ReputationHubWidget } from '@/components/ReputationHubWidget';

const CompactTestimonials = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-secondary/20 to-primary/15">
      <div className="container mx-auto px-4">
        <ReputationHubWidget 
          title="Customer Reviews"
          description="Quality spreads by word of mouth - that's why I'm booked solid"
        />
      </div>
    </section>
  );
};

export default CompactTestimonials;
