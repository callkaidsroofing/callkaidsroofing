import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { SEOHead } from "./components/SEOHead";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Emergency from "./pages/Emergency";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import RoofRestoration from "./pages/services/RoofRestoration";
import RoofPainting from "./pages/services/RoofPainting";
import RoofRepairs from "./pages/services/RoofRepairs";
import GutterCleaning from "./pages/services/GutterCleaning";
import ValleyIronReplacement from "./pages/services/ValleyIronReplacement";
import Warranty from "./pages/Warranty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <SEOHead />
          <ScrollToTop />
          <Header />
          <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/warranty" element={<Warranty />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/services/roof-restoration" element={<RoofRestoration />} />
                <Route path="/services/roof-painting" element={<RoofPainting />} />
                <Route path="/services/roof-repairs" element={<RoofRepairs />} />
              <Route path="/services/gutter-cleaning" element={<GutterCleaning />} />
              <Route path="/services/valley-iron-replacement" element={<ValleyIronReplacement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
