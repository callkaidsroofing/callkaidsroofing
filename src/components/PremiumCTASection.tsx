import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Star, Calendar, Clock, Award, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface PremiumCTASectionProps {
  variant?: "primary" | "dark";
  showFullDetails?: boolean;
}

export default function PremiumCTASection({ 
  variant = "primary",
  showFullDetails = true 
}: PremiumCTASectionProps) {
  const isPrimary = variant === "primary";
  
  return (
    <section className={`py-12 ${isPrimary ? 'bg-primary text-primary-foreground' : 'bg-secondary/5'}`}>
      <div className="container mx-auto px-4">
        <Card className={`max-w-3xl mx-auto ${isPrimary ? 'bg-primary/10 border-primary-foreground/20 text-primary-foreground' : 'bg-card'} shadow-xl`}>
          <div className="p-8 text-center space-y-6">
            {/* Rating Header */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">Rated #1 in Southeast Melbourne</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Ready to Get Your Roof Done Right?
            </h2>

            {/* Social Proof Message */}
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              I'm booked 2-3 weeks out because quality spreads by word of mouth. 
              Don't wait for a small leak to become a big expensive problem.
            </p>

            {showFullDetails && (
              <>
                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-primary-foreground/10' : 'bg-primary/5'}`}>
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">2-3 Weeks</div>
                    <div className="text-sm opacity-80">Next Available Slot</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-primary-foreground/10' : 'bg-primary/5'}`}>
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">Same Day</div>
                    <div className="text-sm opacity-80">Emergency Response</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-primary-foreground/10' : 'bg-primary/5'}`}>
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">This Week</div>
                    <div className="text-sm opacity-80">Free Inspections</div>
                  </div>
                </div>

                {/* Urgency Message */}
                <p className="text-xl font-semibold">
                  Get your free inspection before summer storms hit
                </p>
              </>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                variant={isPrimary ? "secondary" : "default"}
                className="text-lg px-8 py-6 font-semibold" 
                asChild
              >
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Kaidyn: 0435 900 709
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant={isPrimary ? "outline" : "outline"}
                className={`text-lg px-8 py-6 font-semibold ${isPrimary ? 'border-primary-foreground/30 hover:bg-primary-foreground/10' : ''}`}
                asChild
              >
                <Link to="/contact">
                  Book Free Inspection
                </Link>
              </Button>
            </div>

            {/* Direct Contact Message */}
            <p className="text-sm opacity-80 pt-2">
              Direct line to the owner • No call centers • Text or call, I'll respond within 12 hours
            </p>

            {/* Trust Indicators */}
            {showFullDetails && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-current/20">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">15-Year</div>
                  <div className="text-sm opacity-80">Warranty</div>
                </div>
                
                <div className="text-center">
                  <Award className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">Premium</div>
                  <div className="text-sm opacity-80">Materials</div>
                </div>
                
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">Local</div>
                  <div className="text-sm opacity-80">Owner</div>
                </div>
                
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">200+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Alternative CTA for Dark Variant */}
        {!isPrimary && (
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Your Roof Done Right?
            </h3>
            <p className="text-muted-foreground mb-6">
              Call Kaidyn directly - no call centers, no waiting, just honest advice from a 
              local expert with 15-year warranty
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="tel:0435900709">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 0435 900 709 Now
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/contact">
                  Get Free Quote
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Fully Insured
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                15-Year Warranty
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
