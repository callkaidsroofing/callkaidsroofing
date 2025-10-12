import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, Search, Phone } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found (404) | Call Kaids Roofing"
        description="The page you're looking for doesn't exist. Browse our roofing services or contact Call Kaids Roofing directly on 0435 900 709."
        keywords="Call Kaids Roofing, page not found, roofing services Melbourne"
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="mb-4 text-6xl md:text-8xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold">Page Not Found</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
            <br />
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-5 w-5" />
                Back to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/services">
                <Search className="h-5 w-5" />
                Browse Services
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="gap-2">
              <a href="tel:0435900709">
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </Button>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Popular Pages:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <Link to="/services/roof-restoration" className="text-primary hover:underline">
                Roof Restoration
              </Link>
              <Link to="/services/roof-painting" className="text-primary hover:underline">
                Roof Painting
              </Link>
              <Link to="/services/roof-repairs" className="text-primary hover:underline">
                Emergency Repairs
              </Link>
              <Link to="/gallery" className="text-primary hover:underline">
                Gallery
              </Link>
              <Link to="/about" className="text-primary hover:underline">
                About Us
              </Link>
              <Link to="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
