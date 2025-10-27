import { Suspense, lazy } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const MeasurementTool = lazy(() => import("./pages/MeasurementTool"));
const InspectionForm = lazy(() => import("./pages/InspectionForm"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const QuotesDashboard = lazy(() => import("./pages/QuotesDashboard"));
const ReportViewer = lazy(() => import("./pages/ReportViewer"));
const QuoteDocumentViewer = lazy(() => import("./pages/QuoteDocumentViewer"));
const InternalHome = lazy(() => import("./pages/InternalHome"));
const InternalHomeNew = lazy(() => import("./pages/InternalHomeNew"));
const SystemTransition = lazy(() => import("./pages/SystemTransition"));
const LeadsDashboard = lazy(() => import("./pages/LeadsDashboard"));
const ChatDashboard = lazy(() => import("./pages/ChatDashboard"));
const Nexus = lazy(() => import("./pages/Nexus"));
const NexusDemo = lazy(() => import("./pages/NexusDemo"));
const ImageGenerator = lazy(() => import("./pages/ImageGenerator"));
const DocsHub = lazy(() => import("./pages/DocsHub"));
const FormsStudio = lazy(() => import("./pages/FormsStudio"));
const DataHub = lazy(() => import("./pages/DataHub"));
const MediaLibrary = lazy(() => import("./pages/MediaLibrary"));
const MarketingStudio = lazy(() => import("./pages/MarketingStudio"));
import { InternalLayout } from "@/components/InternalLayout";
import { InternalLayoutNew } from "@/components/InternalLayoutNew";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
                    <Route path="measurement-tool" element={<MeasurementTool />} />
                    <Route path="quote-document" element={<QuoteDocumentViewer />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  
                  {/* Auth route - no layout, with redirect protection */}
                  <Route path="/auth" element={
                    <ProtectedRoute>
                      <Auth />
                    </ProtectedRoute>
                  } />
                  
                  {/* NEW INTERNAL SYSTEM - with unified sidebar layout */}
                  <Route path="/internal/v2/*" element={<InternalLayoutNew />}>
                    <Route index element={<InternalHomeNew />} />
                    <Route path="home" element={<InternalHomeNew />} />
                    <Route path="docs" element={<DocsHub />} />
                    <Route path="forms" element={<FormsStudio />} />
                    <Route path="data" element={<DataHub />} />
                    <Route path="media" element={<MediaLibrary />} />
                    <Route path="marketing" element={<MarketingStudio />} />
                  </Route>
                  
                  {/* System transition page */}
                  <Route path="/internal/transition" element={<SystemTransition />} />
                  
                  {/* LEGACY INTERNAL ROUTES - will be deprecated */}
                  <Route path="/internal/*" element={<InternalLayout />}>
                    <Route index element={<SystemTransition />} />
                    <Route path="home" element={<InternalHome />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="quotes" element={<QuotesDashboard />} />
                    <Route path="leads" element={<LeadsDashboard />} />
                    <Route path="chat" element={<ChatDashboard />} />
                    <Route path="nexus" element={<Nexus />} />
                    <Route path="nexus-demo" element={<NexusDemo />} />
                    <Route path="inspection" element={<InspectionForm />} />
                    <Route path="image-generator" element={<ImageGenerator />} />
                    <Route path="reports/:id" element={<ReportViewer />} />
                  </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;