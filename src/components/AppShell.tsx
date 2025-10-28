import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Users, FileText, Calendar, DollarSign, Image, 
  BarChart3, Settings, Menu, X, Search, Plus, Bell,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { CommandPalette } from '@/components/CommandPalette';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  showActivityRail?: boolean;
  entityType?: 'lead' | 'quote' | 'job' | 'invoice';
  entityId?: string;
}

const navItems = [
  { title: 'Dashboard', path: '/internal/v2/home', icon: Home },
  { title: 'Leads', path: '/internal/v2/leads', icon: Users },
  { title: 'Quotes', path: '/internal/v2/quotes', icon: FileText },
  { title: 'Jobs', path: '/internal/v2/jobs', icon: Calendar },
  { title: 'Invoices', path: '/internal/v2/invoices', icon: DollarSign },
  { title: 'Media', path: '/internal/v2/media', icon: Image },
  { title: 'Reports', path: '/internal/v2/reports', icon: BarChart3 },
  { title: 'Settings', path: '/internal/v2/settings', icon: Settings },
];

export function AppShell({ children, showActivityRail = false, entityType, entityId }: AppShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityRailOpen, setActivityRailOpen] = useState(showActivityRail);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global keyboard shortcut for command palette
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="flex h-14 items-center gap-4 px-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-primary">
            <span className="hidden sm:inline">Call Kaids Roofing</span>
            <span className="sm:hidden">CKR</span>
          </div>

          {/* Command Palette Trigger */}
          <Button
            variant="outline"
            className="ml-auto w-64 justify-start text-muted-foreground"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* New Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/internal/v2/leads/new')}>
                New Lead
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/internal/v2/quotes/new')}>
                New Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/internal/inspection')}>
                New Inspection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/internal/v2/media')}>
                Upload Media
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'K'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {user?.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/internal/v2/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Desktop */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r bg-muted/30 transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-60"
          )}
        >
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <aside className="absolute left-0 top-14 bottom-0 w-60 border-r bg-card shadow-lg">
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Right Activity Rail */}
        {activityRailOpen && entityType && entityId && (
          <aside className="hidden lg:flex w-80 border-l bg-card flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Activity</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivityRailOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ActivityTimeline entityType={entityType} entityId={entityId} />
          </aside>
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
