import { lazy } from 'react';
import {
  Users,
  Phone,
  DollarSign,
  Calendar,
  Brain,
  BarChart3,
  Wrench,
  ClipboardList,
  Ruler,
  Sparkles,
  FileText,
  Megaphone,
  Image,
  Home,
  FormInput,
  FileStack,
  Database,
  FileOutput,
  RefreshCw,
} from 'lucide-react';
import type { NavSection } from '../hooks/useAdminNav';

// Lazy admin pages to keep bundle sizes in check
const AdminHome = lazy(() => import('@/pages/AdminHome'));
const CRMLeads = lazy(() => import('@/pages/admin/crm/Leads'));
const CRMLeadDetail = lazy(() => import('@/pages/admin/crm/LeadDetail'));
const CRMQuotes = lazy(() => import('@/pages/admin/crm/Quotes'));
const CRMJobs = lazy(() => import('@/pages/admin/crm/JobsList'));
const CRMIntelligence = lazy(() => import('@/pages/admin/crm/Intelligence'));
const CRMReports = lazy(() => import('@/pages/admin/crm/Reports'));
const ToolsInspectionQuote = lazy(() => import('@/pages/InspectionQuoteBuilder'));
const ToolsMeasurements = lazy(() => import('@/pages/admin/tools/Measurements'));
const ToolsAI = lazy(() => import('@/pages/admin/tools/AIAssistant'));
const ToolsCalculator = lazy(() => import('@/pages/admin/tools/Calculator'));
const ToolsForms = lazy(() => import('@/pages/admin/tools/Forms'));
const ContentGenerator = lazy(() => import('@/pages/admin/content/Generator'));
const ContentMedia = lazy(() => import('@/pages/admin/content/Media'));
const ContentMarketing = lazy(() => import('@/pages/admin/content/Marketing'));
const ContentBlog = lazy(() => import('@/pages/admin/content/Blog'));
const ContentSEO = lazy(() => import('@/pages/admin/content/SEO'));
const SettingsBusiness = lazy(() => import('@/pages/admin/settings/Business'));
const SettingsPricing = lazy(() => import('@/pages/admin/settings/Pricing'));
const SettingsForms = lazy(() => import('@/pages/admin/settings/Forms'));
const SettingsFormSubs = lazy(() => import('@/pages/admin/settings/FormSubmissions'));
const SettingsIntegrations = lazy(() => import('@/pages/admin/settings/Integrations'));
const CMSKnowledge = lazy(() => import('@/pages/admin/cms/Knowledge'));
const CMSServices = lazy(() => import('@/pages/admin/cms/Services'));
const CMSSuburbs = lazy(() => import('@/pages/admin/cms/Suburbs'));
const CMSData = lazy(() => import('@/pages/admin/cms/Data'));
const CMSDocuments = lazy(() => import('@/pages/admin/cms/Documents'));
const CMSQuoteDocuments = lazy(() => import('@/pages/admin/cms/QuoteDocuments'));
const CMSDataSync = lazy(() => import('@/pages/admin/cms/DataSync'));
const CMSMediaGallery = lazy(() => import('@/pages/admin/cms/MediaGallery'));
const CMSMediaManager = lazy(() => import('@/pages/admin/cms/MediaManager'));
const CMSMediaVerification = lazy(() => import('@/pages/admin/cms/MediaVerification'));
const CMSHomepage = lazy(() => import('@/pages/admin/cms/HomepageEditor'));
const ContentAnalytics = lazy(() => import('@/pages/admin/analytics/ContentAnalytics'));

export interface AdminRoute {
  path: string; // relative to /admin
  element: JSX.Element;
}

export const adminRoutes: AdminRoute[] = [
  { path: '', element: <AdminHome /> },
  { path: 'crm/leads', element: <CRMLeads /> },
  { path: 'crm/leads/:id', element: <CRMLeadDetail /> },
  { path: 'crm/quotes', element: <CRMQuotes /> },
  { path: 'crm/jobs', element: <CRMJobs /> },
  { path: 'crm/intelligence', element: <CRMIntelligence /> },
  { path: 'crm/reports', element: <CRMReports /> },
  { path: 'tools/inspection-quote', element: <ToolsInspectionQuote /> },
  { path: 'tools/inspection-quote/:id', element: <ToolsInspectionQuote /> },
  { path: 'tools/measurements', element: <ToolsMeasurements /> },
  { path: 'tools/ai', element: <ToolsAI /> },
  { path: 'tools/calculator', element: <ToolsCalculator /> },
  { path: 'tools/forms', element: <ToolsForms /> },
  { path: 'content/generate', element: <ContentGenerator /> },
  { path: 'content/media', element: <ContentMedia /> },
  { path: 'content/marketing', element: <ContentMarketing /> },
  { path: 'content/blog', element: <ContentBlog /> },
  { path: 'content/seo', element: <ContentSEO /> },
  { path: 'settings/business', element: <SettingsBusiness /> },
  { path: 'settings/pricing', element: <SettingsPricing /> },
  { path: 'settings/forms', element: <SettingsForms /> },
  { path: 'settings/forms/:formId/submissions', element: <SettingsFormSubs /> },
  { path: 'settings/integrations', element: <SettingsIntegrations /> },
  { path: 'cms/knowledge', element: <CMSKnowledge /> },
  { path: 'cms/services', element: <CMSServices /> },
  { path: 'cms/suburbs', element: <CMSSuburbs /> },
  { path: 'cms/data', element: <CMSData /> },
  { path: 'cms/documents', element: <CMSDocuments /> },
  { path: 'cms/documents/quotes', element: <CMSQuoteDocuments /> },
  { path: 'cms/sync', element: <CMSDataSync /> },
  { path: 'cms/media-gallery', element: <CMSMediaGallery /> },
  { path: 'cms/media-manager', element: <CMSMediaManager /> },
  { path: 'cms/media-verification', element: <CMSMediaVerification /> },
  { path: 'cms/homepage', element: <CMSHomepage /> },
  { path: 'analytics/content', element: <ContentAnalytics /> },
];

export const adminRedirects: Array<{ from: string; to: string }> = [
  { from: 'tools/quick-quote', to: 'tools/inspection-quote' },
  { from: 'inspections/new', to: 'tools/inspection-quote' },
  { from: 'inspections/:id', to: 'tools/inspection-quote/:id' },
  { from: 'tools/inspections', to: 'tools/inspection-quote' },
  { from: 'tools/inspections/:id', to: 'tools/inspection-quote/:id' },
  { from: 'ai-assistant', to: 'tools/ai' },
  { from: 'media', to: 'content/media' },
  { from: 'media/generator', to: 'content/media' },
  { from: 'marketing', to: 'content/marketing' },
  { from: 'forms', to: 'settings/forms' },
  { from: 'forms/:formId/submissions', to: 'settings/forms/:formId/submissions' },
  { from: 'data', to: 'cms/data' },
  { from: 'docs', to: 'cms/documents' },
  { from: 'quote-documents', to: 'cms/documents/quotes' },
  { from: 'system', to: '' },
  { from: 'system/users', to: 'settings/forms' },
  { from: 'system/storage', to: 'cms/knowledge' },
  { from: 'system/upload', to: 'cms/knowledge' },
  { from: 'system/embeddings', to: 'cms/knowledge' },
  { from: 'home', to: '' },
  { from: 'leads', to: 'crm/leads' },
  { from: 'leads/:id', to: 'crm/leads/:id' },
  { from: 'intelligence', to: 'crm/intelligence' },
  { from: 'quotes/new', to: 'crm/quotes' },
  { from: 'jobs', to: 'crm/jobs' },
  { from: 'reports', to: 'crm/reports' },
  { from: 'content/media/imports', to: 'content/media' },
  { from: 'content/media/generate', to: 'content/media' },
];

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
    title: 'Content',
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
    icon: FormInput,
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
      { title: 'Knowledge Base', path: '/admin/cms/knowledge', icon: FileText },
      { title: 'Services', path: '/admin/cms/services', icon: Wrench },
      { title: 'Suburbs', path: '/admin/cms/suburbs', icon: Home },
      { title: 'Media', path: '/admin/cms/media-gallery', icon: Image },
      { title: 'Data Hub', path: '/admin/cms/data', icon: Database },
      { title: 'Documents', path: '/admin/cms/documents', icon: FileOutput },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      { title: 'Content Analytics', path: '/admin/analytics/content', icon: RefreshCw },
    ],
  },
];
