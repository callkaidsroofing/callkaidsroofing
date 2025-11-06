import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Phone, ChevronRight, MapPin, Star } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

interface RelatedPage {
  title: string;
  path: string;
  description: string;
  isPriority?: boolean;
  isLocal?: boolean;
}

interface NavigationFlowProps {
  breadcrumbs?: BreadcrumbItem[];
  relatedPages?: RelatedPage[];
  nextAction?: {
    title: string;
    path: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  showLocalNavigation?: boolean;
}

const NavigationFlowOptimizer = ({ 
  breadcrumbs = [], 
  relatedPages = [], 
  nextAction,
  showLocalNavigation = true 
}: NavigationFlowProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Auto-generate breadcrumbs if not provided
  const autoBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs(currentPath);

  // Smart related pages based on current location
  const smartRelatedPages = relatedPages.length > 0 ? relatedPages : generateSmartRelated(currentPath);

  return (
    <div className="space-y-6">
      {/* Enhanced Breadcrumb Navigation */}
      {autoBreadcrumbs.length > 1 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-lg p-3 border">
          {autoBreadcrumbs.map((item, index) => (
            <div key={item.path} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
              {item.active ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Local Navigation Hub */}
      {showLocalNavigation && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Southeast Melbourne Roofing Services</h3>
            <p className="text-sm text-muted-foreground">Clyde North based, serving 50km radius</p>
          </div>
          
          {/* Quick Service Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Link 
              to="/services/roof-restoration" 
              className="text-center p-3 rounded-lg bg-background/60 hover:bg-background/80 transition-colors border border-primary/10 hover:border-primary/20"
            >
              <div className="text-xs font-medium text-primary">Restoration</div>
              <div className="text-xs text-muted-foreground">Full Overhaul</div>
            </Link>
            <Link 
              to="/services/roof-painting" 
              className="text-center p-3 rounded-lg bg-background/60 hover:bg-background/80 transition-colors border border-primary/10 hover:border-primary/20"
            >
              <div className="text-xs font-medium text-primary">Painting</div>
              <div className="text-xs text-muted-foreground">Color Transform</div>
            </Link>
            <Link 
              to="/emergency" 
              className="text-center p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20"
            >
              <div className="text-xs font-medium text-destructive">Emergency</div>
              <div className="text-xs text-muted-foreground">Same Day</div>
            </Link>
            <Link 
              to="/book" 
              className="text-center p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors border border-accent/30"
            >
              <div className="text-xs font-medium text-accent-foreground">Free Quote</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </Link>
          </div>

          {/* Priority CTA */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm" variant="outline">
              <a href="tel:0435900709" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call: 0435 900 709
              </a>
            </Button>
            <Button asChild size="sm">
              <Link to="/book">Book Free Assessment</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Smart Related Pages */}
      {smartRelatedPages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {smartRelatedPages.map((page, index) => (
            <Link
              key={page.path}
              to={page.path}
              className="group p-4 rounded-lg border border-primary/10 hover:border-primary/20 bg-background/60 hover:bg-background/80 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {page.title}
                </h4>
                <div className="flex items-center gap-1">
                  {page.isPriority && (
                    <Badge variant="secondary" className="text-xs px-2 py-0">Hot</Badge>
                  )}
                  {page.isLocal && (
                    <MapPin className="h-3 w-3 text-primary" />
                  )}
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Next Action CTA */}
      {nextAction && (
        <div className="text-center py-4">
          <Button asChild size="lg" variant={nextAction.variant || 'default'}>
            <Link to={nextAction.path} className="flex items-center gap-2">
              {nextAction.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper function to generate breadcrumbs from URL path
const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert URL segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      path: currentPath,
      active: isLast
    });
  });

  return breadcrumbs;
};

// Helper function to generate smart related pages
const generateSmartRelated = (currentPath: string): RelatedPage[] => {
  const allPages: RelatedPage[] = [
    {
      title: 'Roof Restoration Clyde North',
      path: '/services/roof-restoration-clyde-north',
      description: 'Local restoration specialists in your area',
      isPriority: true,
      isLocal: true
    },
    {
      title: 'Emergency Roof Repairs',
      path: '/emergency',
      description: 'Same-day response for urgent issues',
      isPriority: true
    },
    {
      title: 'Free Roof Health Check',
      path: '/book',
      description: 'Book your free assessment this week',
      isPriority: true
    },
    {
      title: 'Roof Painting Cranbourne',
      path: '/services/roof-painting-cranbourne',
      description: 'Transform your home in 2-3 days',
      isLocal: true
    },
    {
      title: 'Before & After Gallery',
      path: '/gallery',
      description: 'See our transformation results'
    },
    {
      title: 'Customer Reviews',
      path: '/about',
      description: 'Read what customers say about our work'
    }
  ];

  // Filter out current page and return smart suggestions
  const related = allPages.filter(page => page.path !== currentPath);
  
  // Prioritize local and urgent pages
  const prioritized = related.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    if (a.isLocal && !b.isLocal) return -1;
    if (!a.isLocal && b.isLocal) return 1;
    return 0;
  });

  return prioritized.slice(0, 6);
};

export default NavigationFlowOptimizer;