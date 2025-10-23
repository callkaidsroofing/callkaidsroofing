import { NavLink } from 'react-router-dom';
import { Home, FileText, DollarSign, Phone, MessageSquare, Sparkles, ClipboardList, Image } from 'lucide-react';

const navItems = [
  { title: 'Home', path: '/internal/home', icon: Home },
  { title: 'Nexus AI', path: '/internal/nexus', icon: Sparkles },
  { title: 'Leads', path: '/internal/leads', icon: Phone },
  { title: 'Quotes', path: '/internal/quotes', icon: DollarSign },
  { title: 'Reports', path: '/internal/dashboard', icon: FileText },
  { title: 'Chat', path: '/internal/chat', icon: MessageSquare },
  { title: 'New Inspection', path: '/internal/inspection', icon: ClipboardList },
  { title: 'Image Generator', path: '/internal/image-generator', icon: Image },
];

export function InternalHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center gap-6 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
