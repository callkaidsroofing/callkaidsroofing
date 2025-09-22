import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SecurityMonitor } from "@/components/SecurityMonitor";
import ElegantLayout from "@/components/ElegantLayout";

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
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RestorationLanding = lazy(() => import("./pages/RestorationLanding"));
const RoofRestorationClydeNorth = lazy(() => import("./pages/services/suburbs/RoofRestorationClydeNorth"));
const RoofRestorationCranbourne = lazy(() => import("./pages/services/suburbs/RoofRestorationCranbourne"));
const RoofRestorationPakenham = lazy(() => import("./pages/services/suburbs/RoofRestorationPakenham"));
const RoofRestorationBerwick = lazy(() => import("./pages/services/suburbs/RoofRestorationBerwick"));
const RoofRestorationMountEliza = lazy(() => import("./pages/services/suburbs/RoofRestorationMountEliza"));
const RoofPaintingPakenham = lazy(() => import("./pages/services/suburbs/RoofPaintingPakenham"));
const RoofPaintingCranbourne = lazy(() => import("./pages/services/suburbs/RoofPaintingCranbourne"));
const RoofPaintingClydeNorth = lazy(() => import("./pages/services/suburbs/RoofPaintingClydeNorth"));

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
          <BrowserRouter>
            <AuthProvider>
              <SecurityMonitor />
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Admin routes - standalone layout */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

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
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;