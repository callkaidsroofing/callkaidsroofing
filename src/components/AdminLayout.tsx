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
      { title: 'Leads', path: '/admin/crm/leads', icon: Phone },
      { title: 'Quotes', path: '/admin/crm/quotes', icon: DollarSign },
      { title: 'Jobs', path: '/admin/crm/jobs', icon: Calendar },
      { title: 'Intelligence', path: '/admin/crm/intelligence', icon: Brain },
      { title: 'Reports', path: '/admin/crm/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Tools',
    icon: Wrench,
    defaultOpen: true,
    items: [
      { title: 'Inspections', path: '/admin/tools/inspections', icon: ClipboardList },
      { title: 'Measurements', path: '/admin/tools/measurements', icon: Ruler },
      { title: 'AI Assistant', path: '/admin/tools/ai', icon: Sparkles },
      { title: 'Calculator', path: '/admin/tools/calculator', icon: DollarSign },
    ],
  },
  {
    title: 'Content Engine',
    icon: Sparkles,
    items: [
      { title: 'Generator', path: '/admin/content/generate', icon: Wrench },
      { title: 'Media Library', path: '/admin/content/media', icon: Image },
      { title: 'Marketing', path: '/admin/content/marketing', icon: Megaphone },
      { title: 'Blog', path: '/admin/content/blog', icon: FileText },
      { title: 'SEO', path: '/admin/content/seo', icon: BarChart3 },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      { title: 'Business', path: '/admin/settings/business', icon: Home },
      { title: 'Users', path: '/admin/settings/users', icon: Users },
      { title: 'Pricing', path: '/admin/settings/pricing', icon: DollarSign },
      { title: 'Forms', path: '/admin/settings/forms', icon: FormInput },
      { title: 'Integrations', path: '/admin/settings/integrations', icon: FileStack },
    ],
  },
  {
    title: 'CMS',
    icon: Database,
    items: [
      { title: 'Knowledge Base', path: '/admin/cms/knowledge', icon: FileText },
      { title: 'Services', path: '/admin/cms/services', icon: Wrench },
      { title: 'Suburbs', path: '/admin/cms/suburbs', icon: Home },
      { title: 'Data Hub', path: '/admin/cms/data', icon: Database },
      { title: 'Documents', path: '/admin/cms/documents', icon: FileText },
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
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* Home Anchor */}
      <NavLink
        to="/admin"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `p-4 border-b flex items-center gap-3 font-bold text-lg transition-all hover-lift ${
            isActive ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-primary/5'
          }`
        }
      >
        <div className={`p-1.5 rounded-lg ${({ isActive }: any) => isActive ? 'bg-primary/20' : 'bg-primary/10'}`}>
          <Home className="h-5 w-5" />
        </div>
        <span>Hub</span>
      </NavLink>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <Accordion 
          type="multiple" 
          defaultValue={getDefaultOpenSections()}
          className="w-full"
        >
          {navStructure.map((section, sectionIndex) => {
            // No admin-only restrictions in new structure
            
            return (
              <AccordionItem 
                key={`section-${sectionIndex}`} 
                value={`section-${sectionIndex}`}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-primary/5 hover:no-underline transition-colors">
                  <div className="flex items-center gap-2.5 text-sm font-semibold">
                    <section.icon className="h-4 w-4 text-primary" />
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-0.5 px-2 py-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                              : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-3.5 w-3.5" />
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
      <div className="p-3 border-t space-y-2 bg-card">
        <div className="text-xs text-muted-foreground truncate px-2 font-medium">
          {user?.email}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="w-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
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
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-gradient-to-br from-background via-background to-muted/10">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b h-14 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col bg-background z-[100]">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold gradient-text">CKR Admin</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-primary/10 bg-card/50 backdrop-blur-sm flex-col shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs />
            <Button
              onClick={handleNotionSync}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Notion'}
            </Button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
