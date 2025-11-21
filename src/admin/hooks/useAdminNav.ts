import { Home, FileText, FormInput, Database, Image, Megaphone, FileOutput, Sparkles, Wrench, Phone, DollarSign, Calendar, BarChart3, Brain, ClipboardList, Settings, Ruler, Users, FileStack, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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

export const adminNavSections: NavSection[] = [
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
      { title: 'Inspection & Quote', path: '/admin/tools/inspection-quote', icon: ClipboardList },
      { title: 'Measurements', path: '/admin/tools/measurements', icon: Ruler },
      { title: 'AI Assistant', path: '/admin/tools/ai', icon: Sparkles },
      { title: 'Calculator', path: '/admin/tools/calculator', icon: DollarSign },
      { title: 'Forms', path: '/admin/tools/forms', icon: FileText },
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
      { title: 'Pricing', path: '/admin/settings/pricing', icon: DollarSign },
      { title: 'Forms', path: '/admin/settings/forms', icon: FormInput },
      { title: 'Integrations', path: '/admin/settings/integrations', icon: FileStack },
    ],
  },
  {
    title: 'CMS',
    icon: Database,
    items: [
      { title: 'Data Sync', path: '/admin/cms/sync', icon: RefreshCw },
      { title: 'Knowledge Base', path: '/admin/cms/knowledge', icon: FileText },
      { title: 'Services', path: '/admin/cms/services', icon: Wrench },
      { title: 'Suburbs', path: '/admin/cms/suburbs', icon: Home },
      { title: 'Media Gallery', path: '/admin/cms/media-gallery', icon: Image },
      { title: 'Data Hub', path: '/admin/cms/data', icon: Database },
      { title: 'Documents', path: '/admin/cms/documents', icon: FileOutput },
    ],
  },
];

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
