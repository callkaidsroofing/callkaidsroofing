import { Outlet, NavLink } from 'react-router-dom';
import { Home, FileText, FormInput, Database, Image, Megaphone, FileOutput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { title: 'Docs Hub', path: '/internal/v2/docs', icon: FileText },
  { title: 'Forms Studio', path: '/internal/v2/forms', icon: FormInput },
  { title: 'Data Hub', path: '/internal/v2/data', icon: Database },
  { title: 'Quote Documents', path: '/internal/v2/quote-documents', icon: FileOutput },
  { title: 'Media Library', path: '/internal/v2/media', icon: Image },
  { title: 'Marketing Studio', path: '/internal/v2/marketing', icon: Megaphone },
];

export function InternalLayoutNew() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-muted/30 flex flex-col">
        {/* Home Anchor - Always visible */}
        <NavLink
          to="/internal/v2/home"
          className="p-4 border-b flex items-center gap-3 font-bold text-lg hover:bg-muted transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>CKR Home</span>
        </NavLink>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t space-y-2">
          <div className="text-xs text-muted-foreground truncate px-2">
            {user?.email}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
