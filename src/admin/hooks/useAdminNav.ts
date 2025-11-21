import { useLocation } from 'react-router-dom';
import { adminNavSections } from '@/admin/routes/config';

export interface NavItem {
  title: string;
  path: string;
  icon: any;
}

export interface NavSection {
  title: string;
  icon: any;
  items: NavItem[];
  defaultOpen?: boolean;
}

export function useAdminNavSections() {
  const location = useLocation();

  const defaults = adminNavSections.reduce<string[]>((open, section, index) => {
    const shouldOpen =
      section.defaultOpen || section.items.some((item) => location.pathname.includes(item.path));
    if (shouldOpen) open.push(`section-${index}`);
    return open;
  }, []);

  return { sections: adminNavSections, defaultOpenSections: defaults };
}
