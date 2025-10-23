import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InternalSidebar } from '@/components/InternalSidebar';
import { InternalHeader } from '@/components/InternalHeader';

export const InternalLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <InternalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <InternalHeader />
          <main className="flex-1 overflow-auto bg-background/95">
            <div className="container mx-auto px-6 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};