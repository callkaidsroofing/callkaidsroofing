import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ElegantLayout from "@/components/ElegantLayout";

const Index = lazy(() => import("./pages/Index"));
const Quote = lazy(() => import("./pages/Quote"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Warranty = lazy(() => import("./pages/Warranty"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RoofRestoration = lazy(() => import("./pages/services/RoofRestoration"));
const RoofPainting = lazy(() => import("./pages/services/RoofPainting"));
const RoofRepairs = lazy(() => import("./pages/services/RoofRepairs"));
const RoofCleaning = lazy(() => import("./pages/services/RoofCleaning"));
const GutterCleaning = lazy(() => import("./pages/services/GutterCleaning"));
const ValleyIronReplacement = lazy(() => import("./pages/services/ValleyIronReplacement"));
const RoofRepointing = lazy(() => import("./pages/services/RoofRepointing"));
const TileReplacement = lazy(() => import("./pages/services/TileReplacement"));
const LeakDetection = lazy(() => import("./pages/services/LeakDetection"));
const CampaignLanding = lazy(() => import("./pages/CampaignLanding"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));

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
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="emergency" element={<Emergency />} />
                    <Route path="warranty" element={<Warranty />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms-of-service" element={<TermsOfService />} />
                    <Route path="thank-you" element={<ThankYou />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="portfolio" element={<Navigate to="/services" replace />} />
                    <Route path="gallery" element={<Navigate to="/services" replace />} />
                    <Route path="suburbs/:slug" element={<Navigate to="/services" replace />} />
                    <Route path="services/roof-restoration" element={<RoofRestoration />} />
                    <Route path="services/roof-painting" element={<RoofPainting />} />
                    <Route path="services/roof-restoration-clyde-north" element={<Navigate to="/services/roof-restoration" replace />} />
                    <Route path="services/roof-restoration-cranbourne" element={<Navigate to="/services/roof-restoration" replace />} />
                    <Route path="services/roof-restoration-pakenham" element={<Navigate to="/services/roof-restoration" replace />} />
                    <Route path="services/roof-restoration-berwick" element={<Navigate to="/services/roof-restoration" replace />} />
                    <Route path="services/roof-restoration-mount-eliza" element={<Navigate to="/services/roof-restoration" replace />} />
                    <Route path="services/roof-painting-pakenham" element={<Navigate to="/services/roof-painting" replace />} />
                    <Route path="services/roof-painting-cranbourne" element={<Navigate to="/services/roof-painting" replace />} />
                    <Route path="services/roof-painting-clyde-north" element={<Navigate to="/services/roof-painting" replace />} />
                    <Route path="services/roof-repairs" element={<RoofRepairs />} />
                    <Route path="services/roof-cleaning" element={<RoofCleaning />} />
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
                    <Route path="emergency-landing" element={<Navigate to="/lp/emergency" replace />} />
                    <Route path="landing/:source" element={<Navigate to="/lp/meta" replace />} />
                    <Route path="lp/:campaign" element={<CampaignLanding />} />
                    <Route path="restoration-landing" element={<Navigate to="/lp/restoration" replace />} />
                    <Route path="measurement-tool" element={<Navigate to="/quote" replace />} />
                    <Route path="*" element={<NotFound />} />
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
