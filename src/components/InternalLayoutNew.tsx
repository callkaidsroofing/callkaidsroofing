import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, FileText, FormInput, Database, Image, Megaphone, FileOutput, 
  Menu, Sparkles, Wrench, Phone, DollarSign, Calendar, BarChart3, 
  Brain, ClipboardList, Settings, Ruler, Users, FileStack,
  ChevronDown, Shield, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/Breadcrumbs';

interface NavItem {
  title: string;
  path: string;
  icon: any;
}

interface NavSection {
  title: string;
  icon: any;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navStructure: NavSection[] = [
  {
    title: 'CRM',
    icon: Users,
    defaultOpen: true,
    items: [
      { title: 'Leads Pipeline', path: '/internal/v2/leads', icon: Phone },
      { title: 'Lead Intelligence', path: '/internal/v2/intelligence', icon: Brain },
      { title: 'Quotes', path: '/internal/v2/quotes/new', icon: DollarSign },
      { title: 'Jobs Calendar', path: '/internal/v2/jobs', icon: Calendar },
    ],
  },
  {
    title: 'Business Intelligence',
    icon: BarChart3,
    items: [
      { title: 'Reports & Analytics', path: '/internal/v2/reports', icon: BarChart3 },
      { title: 'Nexus AI Hub', path: '/internal/v2/nexus', icon: Sparkles },
    ],
  },
  {
    title: 'Tools & Utilities',
    icon: Wrench,
    defaultOpen: true,
    items: [
      { title: 'Measurement Tool', path: '/internal/v2/tools', icon: Ruler },
      { title: 'New Inspection', path: '/internal/v2/inspections/new', icon: ClipboardList },
      { title: 'Image Generator', path: '/internal/v2/media/generator', icon: Image },
    ],
  },
  {
    title: 'Marketing & Media',
    icon: Megaphone,
    items: [
      { title: 'Media Library', path: '/internal/v2/media', icon: Image },
      { title: 'Marketing Studio', path: '/internal/v2/marketing', icon: Megaphone },
    ],
  },
  {
    title: 'Configuration',
    icon: Settings,
    items: [
      { title: 'Data Hub', path: '/internal/v2/data', icon: Database },
      { title: 'Forms Studio', path: '/internal/v2/forms', icon: FormInput },
      { title: 'Docs Hub', path: '/internal/v2/docs', icon: FileText },
      { title: 'Quote Documents', path: '/internal/v2/quote-documents', icon: FileStack },
    ],
  },
  {
    title: 'Admin',
    icon: Shield,
    items: [
      { title: 'User Management', path: '/internal/v2/admin/users', icon: Users },
      { title: 'Knowledge Base', path: '/internal/v2/admin/knowledge', icon: FileStack },
    ],
  },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  // Determine which sections should be open by default based on current route
  const getDefaultOpenSections = () => {
    const currentPath = location.pathname;
    const openSections: string[] = [];
    
    navStructure.forEach((section, index) => {
      if (section.defaultOpen || section.items.some(item => currentPath.includes(item.path))) {
        openSections.push(`section-${index}`);
      }
    });
    
    return openSections;
  };

  return (
    <>
      {/* Home Anchor - Always visible */}
      <NavLink
        to="/internal/v2/home"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `p-4 border-b flex items-center gap-3 font-bold text-lg transition-colors ${
            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          }`
        }
      >
        <Home className="h-5 w-5" />
        <span>CKR Home</span>
      </NavLink>

      {/* Main Navigation with Accordions */}
      <nav className="flex-1 overflow-y-auto">
        <Accordion 
          type="multiple" 
          defaultValue={getDefaultOpenSections()}
          className="w-full"
        >
          {navStructure.map((section, sectionIndex) => {
            // Hide Admin section if user is not admin
            if (section.title === 'Admin' && !isAdmin) return null;
            
            return (
              <AccordionItem 
                key={`section-${sectionIndex}`} 
                value={`section-${sectionIndex}`}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <section.icon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="space-y-1 px-2 py-2">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'hover:bg-muted text-muted-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t space-y-2 bg-muted/30">
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
  const [isSyncing, setIsSyncing] = useState(false);

  const handleNotionSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('supabase-to-notion-push', {
        body: { action: 'sync_all' }
      });

      if (error) throw error;

      toast.success('Notion sync initiated successfully', {
        description: `Synced ${data.results?.length || 0} records`
      });
    } catch (error) {
      console.error('Notion sync error:', error);
      toast.error('Failed to sync with Notion', {
        description: error.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumbs />
            <Button
              onClick={handleNotionSync}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync to Notion'}
            </Button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
