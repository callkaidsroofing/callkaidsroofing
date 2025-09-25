import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  MapPin, 
  Star, 
  Clock,
  Shield,
  Phone
} from 'lucide-react';

interface PageRelationship {
  parent?: {
    title: string;
    path: string;
  };
  siblings?: Array<{
    title: string;
    path: string;
    isCurrent?: boolean;
  }>;
  children?: Array<{
    title: string;
    path: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
  }>;
  crossLinks?: Array<{
    title: string;
    path: string;
    description: string;
    category: 'service' | 'location' | 'urgent' | 'info';
  }>;
}

interface SmartPageHierarchyProps {
  pageTitle: string;
  relationships?: PageRelationship;
  showEmergencyPath?: boolean;
  showLocalPath?: boolean;
}

const SmartPageHierarchy = ({ 
  pageTitle, 
  relationships,
  showEmergencyPath = true,
  showLocalPath = true 
}: SmartPageHierarchyProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Auto-generate relationships if not provided
  const autoRelationships = relationships || generateAutoRelationships(currentPath);

  // Emergency shortcut always available
  const emergencyShortcut = {
    title: 'Need Emergency Help?',
    path: '/emergency',
    description: 'Same-day response for urgent roof issues',
    urgent: true
  };

  // Local service shortcut
  const localShortcut = {
    title: 'Find Local Services',
    path: '/services',
    description: 'SE Melbourne roofing specialists',
    local: true
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'service': return <Star className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'info': return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service': return 'bg-primary/10 border-primary/20 text-primary';
      case 'location': return 'bg-secondary/10 border-secondary/20 text-secondary';
      case 'urgent': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'info': return 'bg-accent/10 border-accent/20 text-accent-foreground';
      default: return 'bg-muted/50 border-muted/20';
    }
  };

  return (
    <div className="space-y-6 py-8">
      {/* Page Context Navigation */}
      <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Page Navigation</h3>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            {autoRelationships.parent && (
              <Button asChild size="sm" variant="ghost">
                <Link to={autoRelationships.parent.path} className="flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  <span className="hidden sm:inline">{autoRelationships.parent.title}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sibling Navigation */}
        {autoRelationships.siblings && autoRelationships.siblings.length > 1 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Related Pages</h4>
            <div className="flex flex-wrap gap-2">
              {autoRelationships.siblings.map((sibling) => (
                <Button
                  key={sibling.path}
                  asChild
                  size="sm"
                  variant={sibling.isCurrent ? "default" : "outline"}
                  className="text-xs"
                >
                  <Link to={sibling.path}>{sibling.title}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Children/Sub-pages */}
        {autoRelationships.children && autoRelationships.children.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Explore Further</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {autoRelationships.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className="p-3 rounded-lg border border-primary/10 hover:border-primary/20 bg-background/40 hover:bg-background/60 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-sm">{child.title}</h5>
                      {child.description && (
                        <p className="text-xs text-muted-foreground mt-1">{child.description}</p>
                      )}
                    </div>
                    {child.priority === 'high' && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">Hot</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Category Links */}
        {autoRelationships.crossLinks && autoRelationships.crossLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">You Might Also Need</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {autoRelationships.crossLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getCategoryColor(link.category)}`}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(link.category)}
                    <div>
                      <h5 className="font-medium text-sm">{link.title}</h5>
                      <p className="text-xs opacity-80">{link.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Emergency Path */}
        {showEmergencyPath && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive text-sm">Emergency Service</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Urgent roof issues? Get same-day response
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="destructive" className="flex-1">
                <a href="tel:0435900709" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Call Now
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                <Link to="/emergency">Details</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Local Service Path */}
        {showLocalPath && (
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="font-medium text-secondary text-sm">Local Service</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              SE Melbourne roofing specialists
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="secondary" className="flex-1">
                <Link to="/book">Free Quote</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-secondary/20 text-secondary hover:bg-secondary/10">
                <Link to="/services">Services</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Trust/Info Path */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-accent-foreground" />
            <span className="font-medium text-accent-foreground text-sm">Why Choose Us</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            10-year warranty, local owner-operator
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1 border-accent/20 text-accent-foreground hover:bg-accent/10">
              <Link to="/warranty">Warranty</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-accent/20 text-accent-foreground hover:bg-accent/10">
              <Link to="/about">About</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auto-generate page relationships based on URL structure
const generateAutoRelationships = (currentPath: string): PageRelationship => {
  const segments = currentPath.split('/').filter(Boolean);
  
  // Service pages
  if (currentPath.startsWith('/services/')) {
    if (segments.length === 2) {
      // Main service page
      return {
        parent: { title: 'All Services', path: '/services' },
        siblings: [
          { title: 'Roof Restoration', path: '/services/roof-restoration', isCurrent: currentPath === '/services/roof-restoration' },
          { title: 'Roof Painting', path: '/services/roof-painting', isCurrent: currentPath === '/services/roof-painting' },
          { title: 'Emergency Repairs', path: '/services/roof-repairs', isCurrent: currentPath === '/services/roof-repairs' },
        ],
        children: [
          { title: 'Clyde North Service', path: '/services/roof-restoration-clyde-north', description: 'Local restoration specialists', priority: 'high' },
          { title: 'Cranbourne Service', path: '/services/roof-restoration-cranbourne', description: 'Cranbourne roof experts', priority: 'high' },
        ],
        crossLinks: [
          { title: 'Free Quote', path: '/book', description: 'Get your project quote today', category: 'service' },
          { title: 'Emergency Repairs', path: '/emergency', description: 'Same-day response', category: 'urgent' },
          { title: 'View Gallery', path: '/gallery', description: 'See our work examples', category: 'info' },
        ]
      };
    } else if (segments.length === 3) {
      // Suburb-specific service page
      const serviceType = segments[1].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        parent: { title: serviceType, path: `/services/${segments[1]}` },
        siblings: [
          { title: 'Clyde North', path: `/services/${segments[1]}-clyde-north`, isCurrent: currentPath.includes('clyde-north') },
          { title: 'Cranbourne', path: `/services/${segments[1]}-cranbourne`, isCurrent: currentPath.includes('cranbourne') },
          { title: 'Pakenham', path: `/services/${segments[1]}-pakenham`, isCurrent: currentPath.includes('pakenham') },
        ],
        crossLinks: [
          { title: 'Book Local Service', path: '/book', description: 'Local owner-operator', category: 'location' },
          { title: 'Emergency Help', path: '/emergency', description: 'Urgent roof issues', category: 'urgent' },
        ]
      };
    }
  }

  // Gallery page
  if (currentPath === '/gallery') {
    return {
      crossLinks: [
        { title: 'Get Similar Results', path: '/book', description: 'Book your transformation', category: 'service' },
        { title: 'View Services', path: '/services', description: 'All available services', category: 'service' },
        { title: 'Local Work Examples', path: '/services/roof-restoration-clyde-north', description: 'Local transformations', category: 'location' },
      ]
    };
  }

  // Default relationships
  return {
    crossLinks: [
      { title: 'Our Services', path: '/services', description: 'Complete roofing solutions', category: 'service' },
      { title: 'Emergency Repairs', path: '/emergency', description: 'Same-day response', category: 'urgent' },
      { title: 'Local Areas', path: '/services/roof-restoration-clyde-north', description: 'SE Melbourne coverage', category: 'location' },
    ]
  };
};

export default SmartPageHierarchy;