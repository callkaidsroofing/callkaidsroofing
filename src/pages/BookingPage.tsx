import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, CheckCircle, Star, Shield, Award, Zap } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { OptimizedBackgroundSection } from '@/components/OptimizedBackgroundSection';
import { OptimizedImage } from '@/components/OptimizedImage';
import FilloutForm from '@/components/FilloutForm';
import geometricPattern from '/src/assets/geometric-roofing-pattern.jpg';

const BookingPage = () => {

  return (
    <>
      <SEOHead
        title="Book Your Free Roof Quote | Call Kaids Roofing | Same Day Response"
        description="Book your free roof quote today. Same-day response, 10-year warranty, premium materials. Serving all Southeast Melbourne suburbs. Call 0435 900 709"
        keywords="book roof quote Melbourne, free roof inspection, roof quote Clyde North, emergency roof repairs booking"
      />
      <StructuredData type="contact" />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/15">
        
        {/* Hero Section */}
        <OptimizedBackgroundSection
          backgroundImage="/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
          className="py-16 text-white relative overflow-hidden"
          gradient="linear-gradient(135deg, rgba(0,122,204,0.9), rgba(11,59,105,0.95))"
        >
          <OptimizedImage
            src={geometricPattern}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            width={1600}
            height={900}
            sizes="100vw"
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-100 px-4 py-2 rounded-full mb-6 border border-green-400/30">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Same-Day Response Guarantee</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Your Free Roof Quote
            </h1>
            <h2 className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Book in 2 minutes • Kaidyn calls within 4 hours • Free inspection & quote
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>No obligation quote</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>10-year warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Award className="h-5 w-5 text-yellow-300" />
                <span>200+ happy customers</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-lg">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-300" />
                ))}
              </div>
              <span className="font-semibold">4.9/5 from 47 reviews</span>
            </div>
          </div>
        </OptimizedBackgroundSection>

        {/* Main Form Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              
              {/* Form */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary">
                    Book Your Free Quote
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out this form and Kaidyn will call you within 4 hours
                  </p>
                </div>
                <FilloutForm />
              </div>

              {/* Benefits & Trust Indicators */}
              <div className="space-y-8">
                
                {/* Why Choose Us */}
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/20 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Why 200+ Customers Choose Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Same-Day Response</h4>
                        <p className="text-sm text-muted-foreground">I call you within 4 hours, visit same day for emergencies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">10-Year Warranty</h4>
                        <p className="text-sm text-muted-foreground">All major work backed by comprehensive warranty</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Owner-Operated</h4>
                        <p className="text-sm text-muted-foreground">You deal directly with Kaidyn, no call centers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Premium Materials</h4>
                        <p className="text-sm text-muted-foreground">Premcoat, SupaPoint, Stormseal - only the best</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Process */}
                <Card className="bg-gradient-to-br from-secondary/10 to-primary/20 border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">What Happens Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold">We Call You</h4>
                        <p className="text-sm text-muted-foreground">Within 4 hours to discuss your needs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold">Free Inspection</h4>
                        <p className="text-sm text-muted-foreground">Complete roof assessment at no cost</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold">Detailed Quote</h4>
                        <p className="text-sm text-muted-foreground">Same-day written quote with photos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold">Quality Work</h4>
                        <p className="text-sm text-muted-foreground">Professional service with 10-year warranty</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">0435 900 709</p>
                          <p className="text-sm text-muted-foreground">Direct line to Kaidyn</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">callkaidsroofing@outlook.com</p>
                          <p className="text-sm text-muted-foreground">Email us anytime</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Clyde North, VIC</p>
                          <p className="text-sm text-muted-foreground">Serving 50km radius</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Mon-Fri: 7am-6pm</p>
                          <p className="text-sm text-muted-foreground">Sat: 8am-4pm</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">ABN: 39475055075</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Fully Insured</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Licensed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookingPage;