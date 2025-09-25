import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Phone, Mail, Clock, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <>
      <SEO
        title="Thank You - Call Kaids Roofing"
        description="Thank you for your roofing enquiry. We'll contact you within 24 hours to discuss your project and arrange a free inspection."
        canonical="https://callkaidsroofing.com.au/thank-you"
      />
      <Helmet>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="rounded-full bg-gradient-to-br from-primary to-primary-glow p-6 shadow-elegant">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Thank You for Your Enquiry!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              We've received your roofing request and will get back to you soon. 
              Your enquiry is important to us, and we're excited to help with your project.
            </p>

            {/* What Happens Next Section */}
            <Card className="mb-12 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  What Happens Next?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Quick Response
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We'll contact you within 24 hours to discuss your specific needs and requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Free Inspection
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We'll arrange a convenient time for a thorough roof inspection and detailed quote.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Expert Solution
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Professional recommendations with our 7-10 year workmanship warranty.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-destructive/20 bg-destructive/5 mb-12">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Need Emergency Repairs?
                </h3>
                <p className="text-muted-foreground mb-4">
                  For urgent roofing issues that can't wait, call Kaidyn directly:
                </p>
                <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90">
                  <a href="tel:0435900709">
                    <Phone className="w-5 h-5 mr-2" />
                    0435 900 709
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <div className="bg-muted/50 rounded-lg p-8 mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Our Contact Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href="tel:0435900709" className="text-primary hover:text-primary-glow transition-colors">
                      0435 900 709
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:info@callkaidsroofing.com.au" className="text-primary hover:text-primary-glow transition-colors">
                      info@callkaidsroofing.com.au
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/">
                  Return to Home
                </Link>
              </Button>
              
              <Button asChild size="lg">
                <Link to="/gallery">
                  View Our Work
                </Link>
              </Button>
            </div>

            {/* Trust Statement */}
            <div className="mt-12 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Call Kaids Roofing</strong> - ABN: 39475055075
              </p>
              <p>
                Fully insured • 7-10 year workmanship warranty • Serving South East Melbourne
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}