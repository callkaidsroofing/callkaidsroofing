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
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-primary/5 backdrop-blur-xl">
      {/* Home Anchor with Enhanced Styling */}
      <NavLink
        to="/admin"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `p-4 border-b border-primary/10 flex items-center gap-3 font-bold text-lg transition-all duration-300 group relative overflow-hidden ${
            isActive ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm' : 'hover:bg-primary/5'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active indicator bar */}
            {isActive && (
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/50 shadow-lg shadow-primary/50 animate-fade-in" />
            )}
            <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
              isActive ? 'bg-primary/20 shadow-lg shadow-primary/20' : 'bg-primary/10 group-hover:bg-primary/15'
            }`}>
              <Home className={`h-5 w-5 transition-colors ${isActive ? 'text-primary' : 'text-primary/70'}`} />
            </div>
            <span className="relative z-10">Hub</span>
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}
      </NavLink>

      {/* Main Navigation with Enhanced Animations */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <Accordion 
          type="multiple" 
          defaultValue={getDefaultOpenSections()}
          className="w-full"
        >
          {navStructure.map((section, sectionIndex) => {
            return (
              <AccordionItem 
                key={`section-${sectionIndex}`} 
                value={`section-${sectionIndex}`}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-primary/5 hover:no-underline transition-all duration-200 group">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200 group-hover:scale-110">
                      <section.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="group-hover:text-primary transition-colors">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-1 px-2 py-2">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium shadow-lg shadow-primary/30'
                              : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground hover:translate-x-1'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active indicator */}
                            {isActive && (
                              <div className="absolute left-0 top-0 h-full w-1 bg-primary-foreground/30 animate-fade-in" />
                            )}
                            <item.icon className={`h-4 w-4 transition-all duration-200 group-hover:scale-110 ${
                              isActive ? '' : 'group-hover:text-primary'
                            }`} />
                            <span className="flex-1">{item.title}</span>
                            {/* Hover shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform" />
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </nav>

      {/* Enhanced User Footer */}
      <div className="p-4 border-t border-primary/10 space-y-3 bg-gradient-to-t from-primary/5 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground truncate font-medium">
              {user?.email}
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="w-full hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover-lift border-primary/20"
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
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-primary/20 h-16 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover-lift transition-all duration-200">
                <Menu className="h-5 w-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background/95 backdrop-blur-xl border-r border-primary/20 z-[100]">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CKR Admin
            </span>
          </div>
        </div>
      </header>

      {/* Enhanced Desktop Sidebar with Glass Effect */}
      <aside className="hidden md:flex md:w-64 border-r border-primary/10 bg-card/40 backdrop-blur-xl flex-col shadow-xl relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="relative z-10 h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content with Enhanced Layout */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto animate-fade-in">
          {/* Enhanced Header Bar */}
          <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm hover-lift transition-all duration-200">
            <Breadcrumbs />
            <Button
              onClick={handleNotionSync}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 hover-lift backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-medium">{isSyncing ? 'Syncing...' : 'Sync Notion'}</span>
            </Button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
