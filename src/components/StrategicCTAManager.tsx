import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, MessageCircle, ArrowRight, X, Clock, Star } from 'lucide-react';

interface CTAConfig {
  primary: {
    text: string;
    action: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  };
  secondary?: {
    text: string;
    action: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  };
  urgency?: {
    text: string;
    badge?: string;
  };
}

interface PageCTAConfig {
  [key: string]: CTAConfig;
}

const StrategicCTAManager = () => {
  const location = useLocation();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Page-specific CTA configurations
  const pageCTAConfigs: PageCTAConfig = {
    '/': {
      primary: {
        text: 'Get Free Quote Today',
        action: '/book',
        icon: <Calendar className="h-4 w-4" />
      },
      secondary: {
        text: 'Call: 0435 900 709',
        action: 'tel:0435900709',
        icon: <Phone className="h-4 w-4" />,
        variant: 'outline'
      },
      urgency: {
        text: 'Free assessments available this week only',
        badge: 'Limited Time'
      }
    },
    '/services/roof-restoration': {
      primary: {
        text: 'Book Restoration Quote',
        action: '/book',
        icon: <ArrowRight className="h-4 w-4" />
      },
      secondary: {
        text: 'Emergency Repairs',
        action: '/emergency',
        icon: <Phone className="h-4 w-4" />,
        variant: 'destructive'
      },
      urgency: {
        text: 'Prevent water damage - act now',
        badge: 'Urgent'
      }
    },
    '/services/roof-painting': {
      primary: {
        text: 'Transform Your Roof',
        action: '/book',
        icon: <ArrowRight className="h-4 w-4" />
      },
      secondary: {
        text: 'View Gallery',
        action: '/gallery',
        icon: <Star className="h-4 w-4" />,
        variant: 'outline'
      },
      urgency: {
        text: 'Best weather window is now - book ahead',
        badge: 'Seasonal'
      }
    },
    '/emergency': {
      primary: {
        text: 'Call Emergency Line',
        action: 'tel:0435900709',
        icon: <Phone className="h-4 w-4" />,
        variant: 'destructive'
      },
      secondary: {
        text: 'Text Kaidyn',
        action: 'sms:0435900709',
        icon: <MessageCircle className="h-4 w-4" />,
        variant: 'outline'
      },
      urgency: {
        text: 'Same-day response guaranteed',
        badge: 'Emergency'
      }
    },
    '/gallery': {
      primary: {
        text: 'Get Similar Results',
        action: '/book',
        icon: <ArrowRight className="h-4 w-4" />
      },
      secondary: {
        text: 'See All Services',
        action: '/services',
        icon: <Star className="h-4 w-4" />,
        variant: 'outline'
      }
    },
    '/about': {
      primary: {
        text: 'Work With Kaidyn',
        action: '/book',
        icon: <ArrowRight className="h-4 w-4" />
      },
      secondary: {
        text: 'Call Direct',
        action: 'tel:0435900709',
        icon: <Phone className="h-4 w-4" />,
        variant: 'outline'
      }
    }
  };

  // Get CTA config for current page or default
  const getCurrentCTAConfig = (): CTAConfig => {
    const currentPage = location.pathname;
    
    // Check for exact match first
    if (pageCTAConfigs[currentPage]) {
      return pageCTAConfigs[currentPage];
    }
    
    // Check for service page patterns
    if (currentPage.startsWith('/services/')) {
      return {
        primary: {
          text: 'Get Quote for This Service',
          action: '/book',
          icon: <ArrowRight className="h-4 w-4" />
        },
        secondary: {
          text: 'Call Kaidyn',
          action: 'tel:0435900709',
          icon: <Phone className="h-4 w-4" />,
          variant: 'outline'
        },
        urgency: {
          text: 'Local experts - fast response',
          badge: 'Local'
        }
      };
    }
    
    // Default fallback
    return pageCTAConfigs['/'];
  };

  const currentCTA = getCurrentCTAConfig();

  // Show sticky bar after scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 800;
      setShowStickyBar(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Handle CTA action
  const handleCTAAction = (action: string) => {
    if (action.startsWith('tel:') || action.startsWith('sms:')) {
      window.location.href = action;
    }
  };

  // Reset dismissed state on page change
  useEffect(() => {
    setIsDismissed(false);
  }, [location.pathname]);

  return (
    <>
      {/* Inline CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 py-8 px-4 rounded-xl my-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {currentCTA.urgency && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
                {currentCTA.urgency.badge && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {currentCTA.urgency.text}
              </Badge>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* Primary CTA */}
            {currentCTA.primary.action.startsWith('/') ? (
              <Button asChild size="lg" variant={currentCTA.primary.variant || 'default'}>
                <Link to={currentCTA.primary.action} className="flex items-center gap-2">
                  {currentCTA.primary.icon}
                  {currentCTA.primary.text}
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant={currentCTA.primary.variant || 'default'}
                onClick={() => handleCTAAction(currentCTA.primary.action)}
                className="flex items-center gap-2"
              >
                {currentCTA.primary.icon}
                {currentCTA.primary.text}
              </Button>
            )}

            {/* Secondary CTA */}
            {currentCTA.secondary && (
              currentCTA.secondary.action.startsWith('/') ? (
                <Button asChild size="lg" variant={currentCTA.secondary.variant || 'outline'}>
                  <Link to={currentCTA.secondary.action} className="flex items-center gap-2">
                    {currentCTA.secondary.icon}
                    {currentCTA.secondary.text}
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant={currentCTA.secondary.variant || 'outline'}
                  onClick={() => handleCTAAction(currentCTA.secondary.action)}
                  className="flex items-center gap-2"
                >
                  {currentCTA.secondary.icon}
                  {currentCTA.secondary.text}
                </Button>
              )
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            ✓ Free consultation ✓ Same-day quotes ✓ 10-year warranty ✓ Local owner-operator
          </p>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  Ready to get started?
                </div>
                {currentCTA.urgency && (
                  <div className="text-xs text-muted-foreground truncate">
                    {currentCTA.urgency.text}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Quick Phone CTA */}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCTAAction('tel:0435900709')}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
                
                {/* Primary CTA */}
                {currentCTA.primary.action.startsWith('/') ? (
                  <Button asChild size="sm">
                    <Link to={currentCTA.primary.action}>
                      {currentCTA.primary.text}
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleCTAAction(currentCTA.primary.action)}
                  >
                    {currentCTA.primary.text}
                  </Button>
                )}
                
                {/* Dismiss button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDismissed(true)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StrategicCTAManager;