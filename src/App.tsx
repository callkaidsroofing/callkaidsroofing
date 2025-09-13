import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ElegantLayout from "@/components/ElegantLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Emergency from "./pages/Emergency";
import Warranty from "./pages/Warranty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import RoofRestoration from "./pages/services/RoofRestoration";
import RoofPainting from "./pages/services/RoofPainting";
import RoofRepairs from "./pages/services/RoofRepairs";
import GutterCleaning from "./pages/services/GutterCleaning";
import ValleyIronReplacement from "./pages/services/ValleyIronReplacement";
import RoofRepointing from "./pages/services/RoofRepointing";
import TileReplacement from "./pages/services/TileReplacement";
import LeakDetection from "./pages/services/LeakDetection";
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RestorationLanding from "./pages/RestorationLanding";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Admin routes - standalone layout */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
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
                  <Route path="services" element={<Index />} />
                  <Route path="services/roof-restoration" element={<RoofRestoration />} />
                  <Route path="services/roof-painting" element={<RoofPainting />} />
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
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;