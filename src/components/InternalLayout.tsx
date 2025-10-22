import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InternalSidebar } from '@/components/InternalSidebar';
import { InternalHeader } from '@/components/InternalHeader';

export const InternalLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/20 to-background">
        <InternalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <InternalHeader />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};