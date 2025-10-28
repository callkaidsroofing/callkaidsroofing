import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, FileText, FormInput, Database, Image, Megaphone, FileOutput, Menu, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { title: 'Docs Hub', path: '/internal/v2/docs', icon: FileText },
  { title: 'Forms Studio', path: '/internal/v2/forms', icon: FormInput },
  { title: 'Data Hub', path: '/internal/v2/data', icon: Database },
  { title: 'Quote Documents', path: '/internal/v2/quote-documents', icon: FileOutput },
  { title: 'Media Library', path: '/internal/v2/media', icon: Image },
  { title: 'Marketing Studio', path: '/internal/v2/marketing', icon: Megaphone },
  { title: 'Nexus AI', path: '/internal/v2/nexus', icon: Sparkles },
  { title: 'Tools', path: '/internal/v2/tools', icon: Wrench },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Home Anchor - Always visible */}
      <NavLink
        to="/internal/v2/home"
        onClick={onLinkClick}
        className="p-4 border-b flex items-center gap-3 font-bold text-lg hover:bg-muted transition-colors"
      >
        <Home className="h-5 w-5" />
        <span>CKR Home</span>
      </NavLink>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
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
    </>
  );
}

export function InternalLayoutNew() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-background">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-card border-b h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 flex flex-col">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold text-primary">Call Kaids Roofing</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 border-r bg-muted/30 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
