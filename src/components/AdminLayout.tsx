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
      {/* Premium Home Anchor */}
      <NavLink
        to="/admin"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `p-5 border-b-2 border-primary/20 flex items-center gap-4 font-bold text-lg transition-all duration-300 group relative overflow-hidden ${
            isActive 
              ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-transparent text-primary shadow-lg' 
              : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active indicator bar with gradient */}
            {isActive && (
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary via-primary to-secondary shadow-2xl shadow-primary/50 animate-fade-in" />
            )}
            
            {/* Icon container with 3D effect */}
            <div className={`relative p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
              isActive 
                ? 'bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30' 
                : 'bg-gradient-to-br from-primary/15 to-secondary/15 group-hover:from-primary/25 group-hover:to-secondary/25'
            }`}>
              <Home className={`h-6 w-6 transition-colors ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
              
              {/* Sparkle effect */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <span className="relative z-10 block">Command Hub</span>
              {isActive && (
                <span className="text-xs font-normal text-primary/70 animate-fade-in">Active</span>
              )}
            </div>
            
            {/* Animated chevron */}
            <ChevronDown className={`h-5 w-5 transition-all duration-300 ${
              isActive ? 'rotate-180 text-primary' : 'rotate-0 text-muted-foreground group-hover:translate-x-1'
            }`} />
            
            {/* Hover shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform" />
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
                <AccordionTrigger className="px-5 py-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:no-underline transition-all duration-300 group border-b border-primary/5">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                      <section.icon className="h-5 w-5 text-primary" />
                      {/* Badge pulse effect */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="group-hover:text-primary transition-colors flex-1 text-left">{section.title}</span>
                    {/* Item count badge */}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      {section.items.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1 px-3 py-3">
                    {section.items.map((item, itemIndex) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground font-semibold shadow-xl shadow-primary/40'
                              : 'hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent text-muted-foreground hover:text-foreground hover:translate-x-2'
                          }`
                        }
                        style={{ 
                          animationDelay: `${itemIndex * 50}ms` 
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active indicator with glow */}
                            {isActive && (
                              <>
                                <div className="absolute left-0 top-0 h-full w-1.5 bg-primary-foreground shadow-lg shadow-primary-foreground/50 animate-fade-in" />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
                              </>
                            )}
                            
                            {/* Icon with badge */}
                            <div className="relative">
                              <item.icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 ${
                                isActive ? 'drop-shadow-lg' : 'group-hover:text-primary'
                              }`} />
                              {/* Notification badge (hidden for now, ready for future use) */}
                              {isActive && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                              )}
                            </div>
                            
                            <span className="flex-1 relative z-10">{item.title}</span>
                            
                            {/* Arrow indicator on hover */}
                            {!isActive && (
                              <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary" />
                            )}
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform skew-x-12" />
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

      {/* Premium User Footer */}
      <div className="p-5 border-t-2 border-primary/20 space-y-3 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent backdrop-blur-sm relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-pulse opacity-50" />
        
        <div className="relative z-10 flex items-center gap-3 p-4 rounded-2xl glass-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-lg animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">
              {user?.email?.split('@')[0]}
            </div>
            <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-primary" />
              <span>Admin</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="w-full relative z-10 group hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 hover-lift border-2 border-primary/20 font-semibold shadow-lg"
        >
          <span className="relative z-10">Sign Out</span>
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/50 to-destructive/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md" />
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
      {/* Premium Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 glass-card backdrop-blur-xl border-b-2 border-primary/30 h-16 flex items-center justify-between px-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gradient-to-br hover:from-primary/20 hover:to-secondary/20 hover-lift transition-all duration-300 rounded-xl relative overflow-hidden group"
              >
                <Menu className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col bg-gradient-to-b from-background via-background to-primary/5 backdrop-blur-xl border-r-2 border-primary/30 z-[100] shadow-2xl">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-lg animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent block">
                CKR Admin
              </span>
              <span className="text-xs text-muted-foreground">Command Center</span>
            </div>
          </div>
          
          {/* Quick sync button for mobile */}
          <Button
            onClick={handleNotionSync}
            disabled={isSyncing}
            size="icon"
            variant="ghost"
            className="hover:bg-primary/10 transition-all duration-300 hover-lift rounded-xl"
          >
            <RefreshCw className={`h-5 w-5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      {/* Premium Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 border-r-2 border-primary/20 glass-card backdrop-blur-xl flex-col shadow-2xl relative overflow-hidden">
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-primary/10 pointer-events-none animate-pulse opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse" />
        
        <div className="relative z-10 h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content with Enhanced Layout */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto animate-fade-in">
          {/* Premium Header Bar */}
          <div className="glass-card mb-6 p-5 rounded-2xl border-2 border-primary/20 shadow-xl relative overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <Breadcrumbs />
                  <p className="text-xs text-muted-foreground mt-0.5">Admin Control Center</p>
                </div>
              </div>
              
              <Button
                onClick={handleNotionSync}
                disabled={isSyncing}
                size="sm"
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-0"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="font-semibold">{isSyncing ? 'Syncing...' : 'Sync Notion'}</span>
              </Button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
