import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Emergency from "./pages/Emergency";
import Warranty from "./pages/Warranty";
import NotFound from "./pages/NotFound";
import RoofRestoration from "./pages/services/RoofRestoration";
import RoofPainting from "./pages/services/RoofPainting";
import RoofRepairs from "./pages/services/RoofRepairs";
import GutterCleaning from "./pages/services/GutterCleaning";
import ValleyIronReplacement from "./pages/services/ValleyIronReplacement";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen w-full overflow-x-hidden">
              <Header />
              <main className="w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/warranty" element={<Warranty />} />
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
    </HelmetProvider>
  );
}

export default App;