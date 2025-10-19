import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, DollarSign, Plus, LogOut, Menu, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import callKaidsSquareLogo from '@/assets/call-kaids-square-logo.jpg';

const menuItems = [
  { title: 'Home', url: '/internal/home', icon: Home },
  { title: 'Inspection Reports', url: '/internal/dashboard', icon: FileText },
  { title: 'Quotes', url: '/internal/quotes', icon: DollarSign },
  { title: 'Leads', url: '/internal/leads', icon: Phone },
];

export function InternalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <OptimizedImage
              src={callKaidsSquareLogo}
              alt="Call Kaids Roofing"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold truncate">Call Kaids Roofing</h2>
              <p className="text-xs text-muted-foreground truncate">Internal Dashboard</p>
            </div>
          </div>
        )}
        {collapsed && (
          <OptimizedImage
            src={callKaidsSquareLogo}
            alt="Call Kaids Roofing"
            width={32}
            height={32}
            className="rounded-lg mx-auto"
          />
        )}
      </SidebarHeader>

      <SidebarTrigger className="absolute top-4 -right-3 z-50 bg-background border border-border rounded-full p-1.5 shadow-sm hover:bg-muted" />

      <SidebarContent className="px-2">
        {!collapsed && (
          <div className="px-2 py-3">
            <Button
              onClick={() => navigate('/internal/inspection')}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
        )}

        {collapsed && (
          <div className="py-3 flex justify-center">
            <Button
              onClick={() => navigate('/internal/inspection')}
              size="icon"
              className="h-9 w-9"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground truncate">
              {user?.email}
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="icon"
            className="h-9 w-9 mx-auto"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}