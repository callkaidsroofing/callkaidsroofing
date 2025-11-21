import { Suspense, lazy } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ElegantLayout from "@/components/ElegantLayout";
import { EnhancedCustomerChat } from "@/components/EnhancedCustomerChat";

const Index = lazy(() => import("./pages/Index"));
const Quote = lazy(() => import("./pages/Quote"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Warranty = lazy(() => import("./pages/Warranty"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RoofRestoration = lazy(() => import("./pages/services/RoofRestoration"));
const RoofPainting = lazy(() => import("./pages/services/RoofPainting"));
const RoofRepairs = lazy(() => import("./pages/services/RoofRepairs"));
const GutterCleaning = lazy(() => import("./pages/services/GutterCleaning"));
const ValleyIronReplacement = lazy(() => import("./pages/services/ValleyIronReplacement"));
const RoofRepointing = lazy(() => import("./pages/services/RoofRepointing"));
const TileReplacement = lazy(() => import("./pages/services/TileReplacement"));
const LeakDetection = lazy(() => import("./pages/services/LeakDetection"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const SuburbDetail = lazy(() => import("./pages/SuburbDetail"));
const SuburbPage = lazy(() => import("./pages/SuburbPage"));
const RestorationLanding = lazy(() => import("./pages/RestorationLanding"));
const RoofRestorationClydeNorth = lazy(() => import("./pages/services/suburbs/RoofRestorationClydeNorth"));
const RoofRestorationCranbourne = lazy(() => import("./pages/services/suburbs/RoofRestorationCranbourne"));
const RoofRestorationPakenham = lazy(() => import("./pages/services/suburbs/RoofRestorationPakenham"));
const RoofRestorationBerwick = lazy(() => import("./pages/services/suburbs/RoofRestorationBerwick"));
const RoofRestorationMountEliza = lazy(() => import("./pages/services/suburbs/RoofRestorationMountEliza"));
const RoofPaintingPakenham = lazy(() => import("./pages/services/suburbs/RoofPaintingPakenham"));
const RoofPaintingCranbourne = lazy(() => import("./pages/services/suburbs/RoofPaintingCranbourne"));
const RoofPaintingClydeNorth = lazy(() => import("./pages/services/suburbs/RoofPaintingClydeNorth"));
const Auth = lazy(() => import("./pages/Auth"));
const MFASetup = lazy(() => import("./pages/MFASetup"));
const MFAVerify = lazy(() => import("./pages/MFAVerify"));
const QuoteDocumentViewer = lazy(() => import("./pages/QuoteDocumentViewer"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const ImageGenerator = lazy(() => import("./pages/ImageGenerator"));
const DocsHub = lazy(() => import("./pages/DocsHub"));
const FormsStudio = lazy(() => import("./pages/FormsStudio"));
const FormSubmissions = lazy(() => import("./pages/FormSubmissions"));
const FormView = lazy(() => import("./pages/FormView"));
const DataHub = lazy(() => import("./pages/DataHub"));
const MediaLibrary = lazy(() => import("./pages/MediaLibrary"));
const ChatUploadsImporter = lazy(() => import("./pages/admin/content/ChatUploadsImporter"));
const MarketingStudio = lazy(() => import("./pages/MarketingStudio"));
const LeadsPipeline = lazy(() => import("./pages/LeadsPipeline"));
const LeadDetail = lazy(() => import("./pages/LeadDetail"));
// Legacy pages archived - now using unified InspectionQuoteBuilder
const InspectionQuoteBuilderPage = lazy(() => import("./pages/InspectionQuoteBuilder"));
const JobsCalendar = lazy(() => import("./pages/JobsCalendar"));
const LeadIntelligence = lazy(() => import("./pages/LeadIntelligence"));
const ReportsAnalytics = lazy(() => import("./pages/ReportsAnalytics"));
const AdminUserManagement = lazy(() => import("./pages/AdminUserManagement"));
const AIAssistant = lazy(() => import("./pages/internal/v2/AIAssistant"));
const StorageAdmin = lazy(() => import("./pages/internal/v2/admin/StorageAdmin"));
const EmbeddingGenerator = lazy(() => import("./pages/internal/v2/admin/EmbeddingGenerator"));
const KnowledgeUploader = lazy(() => import("./pages/internal/v2/admin/KnowledgeUploader"));
const AdminHub = lazy(() => import("./pages/internal/v2/admin/AdminHub"));

// New admin structure lazy imports
const CRMLeads = lazy(() => import("./pages/admin/crm/Leads"));
const CRMLeadDetail = lazy(() => import("./pages/admin/crm/LeadDetail"));
const CRMQuotes = lazy(() => import("./pages/admin/crm/Quotes"));
const CRMJobs = lazy(() => import("./pages/admin/crm/JobsList"));
const CRMIntelligence = lazy(() => import("./pages/admin/crm/Intelligence"));
const CRMReports = lazy(() => import("./pages/admin/crm/Reports"));
// Archived: const ToolsQuickQuote = lazy(() => import("./pages/admin/tools/QuickQuote"));
// Archived: const ToolsInspections = lazy(() => import("./pages/admin/tools/Inspections"));
const ToolsMeasurements = lazy(() => import("./pages/admin/tools/Measurements"));
const ToolsAI = lazy(() => import("./pages/admin/tools/AIAssistant"));
const ToolsCalculator = lazy(() => import("./pages/admin/tools/Calculator"));
const ToolsForms = lazy(() => import("./pages/admin/tools/Forms"));
const ContentGenerator = lazy(() => import("./pages/admin/content/Generator"));
const ContentMedia = lazy(() => import("./pages/admin/content/Media"));
const ContentImageGen = lazy(() => import("./pages/admin/content/ImageGenerator"));
const ContentMarketing = lazy(() => import("./pages/admin/content/Marketing"));
const ContentBlog = lazy(() => import("./pages/admin/content/Blog"));
const ContentSEO = lazy(() => import("./pages/admin/content/SEO"));
const SettingsBusiness = lazy(() => import("./pages/admin/settings/Business"));
const SettingsUsers = lazy(() => import("./pages/admin/settings/Users"));
const SettingsPricing = lazy(() => import("./pages/admin/settings/Pricing"));
const SettingsForms = lazy(() => import("./pages/admin/settings/Forms"));
const SettingsFormSubs = lazy(() => import("./pages/admin/settings/FormSubmissions"));
const SettingsIntegrations = lazy(() => import("./pages/admin/settings/Integrations"));
const CMSKnowledge = lazy(() => import("./pages/admin/cms/Knowledge"));
const CMSKnowledgeUpload = lazy(() => import("./pages/admin/cms/KnowledgeUploader"));
const CMSEmbeddings = lazy(() => import("./pages/admin/cms/EmbeddingGenerator"));
const CMSServices = lazy(() => import("./pages/admin/cms/Services"));
const CMSSuburbs = lazy(() => import("./pages/admin/cms/Suburbs"));
const CMSData = lazy(() => import("./pages/admin/cms/Data"));
const CMSDocs = lazy(() => import("./pages/admin/cms/Documents"));
const CMSQuoteDocs = lazy(() => import("./pages/admin/cms/QuoteDocuments"));
const CMSDataSync = lazy(() => import("./pages/admin/cms/DataSync"));
const CMSKnowledgeSystem = lazy(() => import("./pages/admin/cms/KnowledgeSystem"));
const CMSMediaManager = lazy(() => import("./pages/admin/cms/MediaManager"));
const CMSMediaVerification = lazy(() => import("./pages/admin/cms/MediaVerification"));
const CMSHomepageEditor = lazy(() => import("./pages/admin/cms/HomepageEditor"));
const CMSMediaGallery = lazy(() => import("./pages/admin/cms/MediaGallery"));
const ToolsWorkflows = lazy(() => import("./pages/admin/tools/Workflows"));

import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProtectedLayout from "@/components/ProtectedLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    <p className="text-muted-foreground font-medium">Loading Kaidyn's roofing expertise…</p>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <EnhancedCustomerChat />
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Main site routes - with elegant layout */}
                  <Route path="/*" element={<ElegantLayout />}>
                    <Route index element={<Index />} />
                    <Route path="quote" element={<Quote />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="book" element={<BookingPage />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="forms/:formId" element={<FormView />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="emergency" element={<Emergency />} />
                    <Route path="warranty" element={<Warranty />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms-of-service" element={<TermsOfService />} />
                    <Route path="thank-you" element={<ThankYou />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="suburbs/:slug" element={<SuburbPage />} />
                    <Route path="services/roof-restoration" element={<RoofRestoration />} />
                    <Route path="services/roof-painting" element={<RoofPainting />} />
                    <Route path="services/roof-restoration-clyde-north" element={<RoofRestorationClydeNorth />} />
                    <Route path="services/roof-restoration-cranbourne" element={<RoofRestorationCranbourne />} />
                    <Route path="services/roof-restoration-pakenham" element={<RoofRestorationPakenham />} />
                    <Route path="services/roof-restoration-berwick" element={<RoofRestorationBerwick />} />
                    <Route path="services/roof-restoration-mount-eliza" element={<RoofRestorationMountEliza />} />
                    <Route path="services/roof-painting-pakenham" element={<RoofPaintingPakenham />} />
                    <Route path="services/roof-painting-cranbourne" element={<RoofPaintingCranbourne />} />
                    <Route path="services/roof-painting-clyde-north" element={<RoofPaintingClydeNorth />} />
                    <Route path="services/roof-repairs" element={<RoofRepairs />} />
                    <Route path="services/gutter-cleaning" element={<GutterCleaning />} />
                    <Route path="services/valley-iron-replacement" element={<ValleyIronReplacement />} />
                    <Route path="services/roof-repointing" element={<RoofRepointing />} />
                    <Route path="services/tile-replacement" element={<TileReplacement />} />
                    <Route path="services/leak-detection" element={<LeakDetection />} />
                    <Route path="roof-restoration" element={<RoofRestoration />} />
                    <Route path="roof-painting" element={<RoofPainting />} />
                    <Route path="roof-repointing" element={<RoofRepointing />} />
                    <Route path="tile-replacement" element={<TileReplacement />} />
                    <Route path="leak-detection" element={<LeakDetection />} />
                    <Route path="emergency-landing" element={<LandingPage />} />
                    <Route path="landing/:source" element={<LandingPage />} />
                    <Route path="restoration-landing" element={<RestorationLanding />} />
                    <Route path="measurement-tool" element={<Navigate to="/admin/tools/measurements" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  
                  {/* Auth routes - no layout, with redirect protection */}
                  <Route path="/auth" element={
                    <ProtectedRoute>
                      <Auth />
                    </ProtectedRoute>
                  } />
                  <Route path="/mfa-setup" element={
                    <ProtectedRoute>
                      <MFASetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/mfa-verify" element={<MFAVerify />} />
                  
                  {/* CKR Admin Hub - Unified business management system */}
                  <Route path="/admin" element={<ProtectedLayout />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminHome />} />
                      
                      {/* CRM Section */}
                      <Route path="crm/leads" element={<CRMLeads />} />
                      <Route path="crm/leads/:id" element={<CRMLeadDetail />} />
                      <Route path="crm/quotes" element={<CRMQuotes />} />
                      <Route path="crm/jobs" element={<CRMJobs />} />
                      <Route path="crm/intelligence" element={<CRMIntelligence />} />
                      <Route path="crm/reports" element={<CRMReports />} />
                      
                      {/* Tools Section */}
                      {/* Unified Inspection & Quote Builder */}
                      <Route path="tools/inspection-quote" element={<InspectionQuoteBuilderPage />} />
                      <Route path="tools/inspection-quote/:id" element={<InspectionQuoteBuilderPage />} />
                      <Route path="tools/quick-quote" element={<Navigate to="/admin/tools/inspection-quote" replace />} />
                      <Route path="tools/measurements" element={<ToolsMeasurements />} />
                      <Route path="tools/ai" element={<ToolsAI />} />
                      <Route path="tools/calculator" element={<ToolsCalculator />} />
                      <Route path="tools/forms" element={<ToolsForms />} />
                      
                      {/* Content Engine Section */}
                      <Route path="content/generate" element={<ContentGenerator />} />
                      <Route path="content/media" element={<ContentMedia />} />
                      <Route path="content/media/imports" element={<ChatUploadsImporter />} />
                      <Route path="content/media/generate" element={<ContentImageGen />} />
                      <Route path="content/marketing" element={<ContentMarketing />} />
                      <Route path="content/blog" element={<ContentBlog />} />
                      <Route path="content/seo" element={<ContentSEO />} />
                      
                      {/* Settings Section */}
                      <Route path="settings/business" element={<SettingsBusiness />} />
                      {/* <Route path="settings/users" element={<SettingsUsers />} /> */} {/* Hidden - single-user admin, infrastructure preserved */}
                      <Route path="settings/pricing" element={<SettingsPricing />} />
                      <Route path="settings/forms" element={<SettingsForms />} />
                      <Route path="settings/forms/:formId/submissions" element={<SettingsFormSubs />} />
                      <Route path="settings/integrations" element={<SettingsIntegrations />} />
                      
                      {/* CMS Section */}
                      <Route path="cms/knowledge" element={<CMSKnowledge />} />
                      <Route path="cms/knowledge/upload" element={<CMSKnowledgeUpload />} />
                      <Route path="cms/knowledge/embeddings" element={<CMSEmbeddings />} />
                      <Route path="cms/knowledge-system" element={<CMSKnowledgeSystem />} />
                      <Route path="cms/services" element={<CMSServices />} />
                      <Route path="cms/suburbs" element={<CMSSuburbs />} />
                      <Route path="cms/data" element={<CMSData />} />
                      <Route path="cms/documents" element={<CMSDocs />} />
                      <Route path="cms/documents/quotes" element={<CMSQuoteDocs />} />
                      <Route path="cms/sync" element={<CMSDataSync />} />
                      <Route path="cms/media-manager" element={<CMSMediaManager />} />
                      <Route path="cms/media-verification" element={<CMSMediaVerification />} />
                      <Route path="cms/homepage" element={<CMSHomepageEditor />} />
                      <Route path="cms/media-gallery" element={<CMSMediaGallery />} />
                      <Route path="tools/workflows" element={<ToolsWorkflows />} />
                      
                      {/* Legacy redirects */}
                      <Route path="home" element={<Navigate to="/admin" replace />} />
                      <Route path="leads" element={<Navigate to="/admin/crm/leads" replace />} />
                      <Route path="leads/:id" element={<Navigate to="/admin/crm/leads/:id" replace />} />
                      <Route path="intelligence" element={<Navigate to="/admin/crm/intelligence" replace />} />
                      <Route path="quotes/new" element={<Navigate to="/admin/crm/quotes" replace />} />
                      <Route path="jobs" element={<Navigate to="/admin/crm/jobs" replace />} />
                      <Route path="reports" element={<Navigate to="/admin/crm/reports" replace />} />
                      <Route path="inspections/new" element={<Navigate to="/admin/tools/inspection-quote" replace />} />
                      <Route path="inspections/:id" element={<Navigate to="/admin/tools/inspection-quote/:id" replace />} />
                      <Route path="tools/inspections" element={<Navigate to="/admin/tools/inspection-quote" replace />} />
                      <Route path="tools/inspections/:id" element={<Navigate to="/admin/tools/inspection-quote/:id" replace />} />
                      <Route path="ai-assistant" element={<Navigate to="/admin/tools/ai" replace />} />
                      <Route path="media" element={<Navigate to="/admin/content/media" replace />} />
                      <Route path="media/generator" element={<Navigate to="/admin/content/media/generate" replace />} />
                      <Route path="marketing" element={<Navigate to="/admin/content/marketing" replace />} />
                      <Route path="forms" element={<Navigate to="/admin/settings/forms" replace />} />
                      <Route path="forms/:formId/submissions" element={<Navigate to="/admin/settings/forms/:formId/submissions" replace />} />
                      <Route path="data" element={<Navigate to="/admin/cms/data" replace />} />
                      <Route path="docs" element={<Navigate to="/admin/cms/documents" replace />} />
                      <Route path="quote-documents" element={<Navigate to="/admin/cms/documents/quotes" replace />} />
                      <Route path="system" element={<Navigate to="/admin/settings" replace />} />
                      <Route path="system/users" element={<Navigate to="/admin/settings/users" replace />} />
                      <Route path="system/storage" element={<Navigate to="/admin/cms/knowledge" replace />} />
                      <Route path="system/upload" element={<Navigate to="/admin/cms/knowledge/upload" replace />} />
                      <Route path="system/embeddings" element={<Navigate to="/admin/cms/knowledge/embeddings" replace />} />
                    </Route>
                  </Route>
                  
                  {/* Legacy redirects - old internal/v2 routes */}
                  <Route path="/internal/v2/*" element={<Navigate to="/admin" replace />} />
                  <Route path="/internal/*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;