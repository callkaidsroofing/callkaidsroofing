import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const pathNameMap: Record<string, string> = {
  'home': 'Dashboard',
  'docs': 'Documentation Hub',
  'forms': 'Forms Studio',
  'inspection': 'Inspection Form',
  'data': 'Data Hub',
  'quote-documents': 'Quote Documents',
  'media': 'Media Library',
  'generator': 'Image Generator',
  'marketing': 'Marketing Studio',
  'nexus': 'Nexus AI',
  'tools': 'Measurement Tools',
  'leads': 'Leads Pipeline',
  'quotes': 'Quotes',
  'new': 'New Quote',
  'jobs': 'Jobs Calendar',
  'intelligence': 'Lead Intelligence',
  'reports': 'Reports & Analytics',
  'v2': '',
  'internal': '',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  
  // Build breadcrumb items
  const crumbs = pathParts.map((part, i) => {
    const path = "/" + pathParts.slice(0, i + 1).join("/");
    const name = pathNameMap[part] || part;
    return { name, path, isLast: i === pathParts.length - 1 };
  }).filter(crumb => crumb.name); // Remove empty names (internal, v2)

  // Don't show breadcrumbs on home page
  if (location.pathname === '/internal/v2/home' || location.pathname === '/internal/v2') {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link 
        to="/internal/v2/home" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      
      {crumbs.map((crumb) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.name}</span>
          ) : (
            <Link 
              to={crumb.path} 
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
