import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Call Kaids Roofing"
        description="Privacy policy for Call Kaids Roofing. Learn how we collect, use and protect your personal information."
        canonical="https://callkaidsroofing.com.au/privacy-policy"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-lg">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-AU')}
              </p>
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Who We Are</h2>
                <p>
                  Call Kaids Roofing (ABN: 39475055075) is a roofing contractor based in Clyde North, Victoria. 
                  Our website address is: https://callkaidsroofing.com.au
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact Form Data:</strong> Name, phone number, email address, suburb, and service requirements</li>
                  <li><strong>Quote Request Data:</strong> Property details, roof type, and preferred contact times</li>
                  <li><strong>Emergency Contact Data:</strong> Urgent repair requests and contact information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respond to your inquiries and provide roofing services</li>
                  <li>Schedule roof inspections and assessments</li>
                  <li>Send you quotes and follow-up communications</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
                <p>
                  Our website uses cookies for analytics purposes to understand how visitors use our site. 
                  We use Google Analytics to track website performance and user behavior. By using our website, 
                  you consent to our use of cookies as described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  We may share information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and property</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p>Under Australian Privacy Principles, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information we hold</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Withdraw consent for marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p>
                  If you have questions about this Privacy Policy or wish to exercise your rights, 
                  please contact us:
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p><strong>Call Kaids Roofing</strong></p>
                  <p>Phone: <a href="tel:+61435900709" className="text-primary hover:underline">0435 900 709</a></p>
                  <p>Email: <a href="mailto:callkaidsroofing@outlook.com" className="text-primary hover:underline">callkaidsroofing@outlook.com</a></p>
                  <p>ABN: 39475055075</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                  with an updated effective date. We encourage you to review this policy periodically.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}