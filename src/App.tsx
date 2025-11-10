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
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Warranty = lazy(() => import("./pages/Warranty"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
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
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const SuburbDetail = lazy(() => import("./pages/SuburbDetail"));
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
const InternalHomeNew = lazy(() => import("./pages/InternalHomeNew"));
const ImageGenerator = lazy(() => import("./pages/ImageGenerator"));
const DocsHub = lazy(() => import("./pages/DocsHub"));
const FormsStudio = lazy(() => import("./pages/FormsStudio"));
const FormSubmissions = lazy(() => import("./pages/FormSubmissions"));
const FormView = lazy(() => import("./pages/FormView"));
const DataHub = lazy(() => import("./pages/DataHub"));
const MediaLibrary = lazy(() => import("./pages/MediaLibrary"));
const MarketingStudio = lazy(() => import("./pages/MarketingStudio"));
const LeadsPipeline = lazy(() => import("./pages/LeadsPipeline"));
const LeadDetail = lazy(() => import("./pages/LeadDetail"));
const QuoteBuilderNew = lazy(() => import("./pages/QuoteBuilderNew"));
const InspectionBuilderNew = lazy(() => import("./pages/InspectionBuilderNew"));
const JobsCalendar = lazy(() => import("./pages/JobsCalendar"));
const LeadIntelligence = lazy(() => import("./pages/LeadIntelligence"));
const ReportsAnalytics = lazy(() => import("./pages/ReportsAnalytics"));
const AdminUserManagement = lazy(() => import("./pages/AdminUserManagement"));
const KnowledgeManagement = lazy(() => import("./pages/KnowledgeManagement"));
const KnowledgeBase = lazy(() => import("./pages/internal/v2/KnowledgeBase"));
const DatabaseManagement = lazy(() => import("./pages/internal/v2/DatabaseManagement"));
const AIAssistant = lazy(() => import("./pages/internal/v2/AIAssistant"));
const StorageAdmin = lazy(() => import("./pages/internal/v2/admin/StorageAdmin"));
import { InternalLayoutNew } from "@/components/InternalLayoutNew";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProtectedLayout from "@/components/ProtectedLayout";

const queryClient = new QueryClient();

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
                    <Route path="thank-you" element={<ThankYou />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="suburbs/:slug" element={<SuburbDetail />} />
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
                    <Route path="measurement-tool" element={<Navigate to="/internal/v2/tools" replace />} />
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
                  
                  {/* NEW INTERNAL SYSTEM - with unified sidebar layout */}
                  <Route path="/internal/v2" element={<ProtectedLayout />}>
                    <Route element={<InternalLayoutNew />}>
                      <Route index element={<Navigate to="/internal/v2/home" replace />} />
                      <Route path="home" element={<InternalHomeNew />} />
                      <Route path="docs" element={<DocsHub />} />
                      <Route path="forms" element={<FormsStudio />} />
                      <Route path="forms/:formId/submissions" element={<FormSubmissions />} />
                      <Route path="data" element={<DataHub />} />
                      <Route path="quote-documents" element={<QuoteDocumentViewer />} />
                      <Route path="media" element={<MediaLibrary />} />
                      <Route path="media/generator" element={<ImageGenerator />} />
                      <Route path="marketing" element={<MarketingStudio />} />
                      <Route path="leads" element={<LeadsPipeline />} />
                      <Route path="leads/:id" element={<LeadDetail />} />
                      <Route path="quotes/new" element={<QuoteBuilderNew />} />
                      <Route path="inspections/new" element={<InspectionBuilderNew />} />
                      <Route path="inspections/:id" element={<InspectionBuilderNew />} />
                      <Route path="jobs" element={<JobsCalendar />} />
                      <Route path="intelligence" element={<LeadIntelligence />} />
                      <Route path="reports" element={<ReportsAnalytics />} />
                      <Route path="admin/users" element={<AdminUserManagement />} />
                      <Route path="admin/knowledge" element={<KnowledgeManagement />} />
                      <Route path="admin/storage" element={<StorageAdmin />} />
                      <Route path="admin/knowledge-base" element={<Navigate to="/internal/v2/admin/storage" replace />} />
                      <Route path="admin/database" element={<Navigate to="/internal/v2/admin/storage" replace />} />
                      <Route path="ai-assistant" element={<AIAssistant />} />
                    </Route>
                  </Route>
                  
                  {/* Redirect old /internal routes to new v2 system */}
                  <Route path="/internal/dashboard" element={<Navigate to="/internal/v2/home" replace />} />
                  <Route path="/internal/home" element={<Navigate to="/internal/v2/home" replace />} />
                  <Route path="/internal/*" element={<Navigate to="/internal/v2/home" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;