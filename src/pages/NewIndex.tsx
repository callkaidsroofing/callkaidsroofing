import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import TechITLayout from '@/components/TechITLayout';
import ProcessSteps from '@/components/ProcessSteps';
import ServicesGrid from '@/components/ServicesGrid';
import BeforeAfterLightbox from '@/components/BeforeAfterLightbox';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import FAQAccordion from '@/components/FAQAccordion';
import CTABand from '@/components/CTABand';
import StructuredFooter from '@/components/StructuredFooter';
import QuickCaptureForm from '@/components/QuickCaptureForm';

const NewIndex = () => {
  return (
    <>
      <SEOHead 
        title="Professional Roofing Services Melbourne | Call Kaids Roofing | 10 Year Warranty"
        description="Expert roof restoration, painting & emergency repairs in Southeast Melbourne. 10-year warranty, premium materials, same-day quotes. Call Kaidyn: 0435 900 709"
        keywords="roof restoration Melbourne, roof painting Melbourne, emergency roof repairs, Clyde North roofer, Berwick roofing, Southeast Melbourne roofing"
        canonical="https://callkaidsroofing.com.au/"
        ogImage="https://callkaidsroofing.com.au/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Call Kaids Roofing",
          "description": "Professional roofing services in Southeast Melbourne including roof restoration, painting, and emergency repairs with 10-year warranty.",
          "url": "https://callkaidsroofing.com.au",
          "telephone": "0435900709",
          "email": "callkaidsroofing@outlook.com",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "VIC",
            "addressCountry": "AU",
            "addressLocality": "Southeast Melbourne"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-38.1",
            "longitude": "145.3"
          },
          "openingHours": [
            "Mo-Fr 07:00-18:00",
            "Sa 08:00-16:00"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "-38.1",
              "longitude": "145.3"
            },
            "geoRadius": "50000"
          },
          "areaServed": ["Berwick", "Cranbourne", "Clyde North", "Dandenong", "Pakenham", "Officer", "Rowville", "Narre Warren"],
          "priceRange": "$$",
          "image": "https://callkaidsroofing.com.au/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png",
          "logo": "https://callkaidsroofing.com.au/assets/call-kaids-logo.png"
        }}
      />
      <StructuredData type="homepage" />
      
      <div className="min-h-screen">
        <TechITLayout>
          <ProcessSteps />
          <ServicesGrid />
          <BeforeAfterLightbox />
          <ReviewsCarousel />
          <div id="contact-form">
            <QuickCaptureForm />
          </div>
          <FAQAccordion />
          <CTABand />
        </TechITLayout>
        <StructuredFooter />
      </div>
    </>
  );
};

export default NewIndex;