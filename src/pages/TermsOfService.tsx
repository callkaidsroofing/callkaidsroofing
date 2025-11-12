import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <>
      <SEOHead
        title="Terms of Service | Call Kaids Roofing Southeast Melbourne"
        description="Terms and conditions for roofing services provided by Call Kaids Roofing. Understanding your rights and responsibilities when engaging our professional roofing services in Southeast Melbourne. ABN 39475055075."
        keywords="terms of service, roofing terms, Call Kaids Roofing, service conditions, roofing contract, Australian Consumer Law"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-lg">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-AU')}
              </p>
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
                <p>
                  By requesting a quote, booking an inspection, or engaging Call Kaids Roofing for any roofing services, 
                  you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not 
                  use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Services Provided</h2>
                <p>
                  Call Kaids Roofing (ABN: 39475055075) provides professional roofing services throughout Southeast Melbourne, 
                  including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Roof restoration and coating</li>
                  <li>Roof painting and repointing</li>
                  <li>Roof repairs, leak detection and emergency repairs</li>
                  <li>Tile and metal roof replacement</li>
                  <li>Valley iron replacement and flashing repairs</li>
                  <li>Gutter cleaning and maintenance</li>
                </ul>
                <p className="mt-3">
                  <strong>Service Area:</strong> Primary coverage includes Berwick, Cranbourne, Officer, Pakenham, Narre Warren, 
                  Beaconsfield, Hallam, Clyde North, Rowville, Glen Waverley, and Hampton Park.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Quotes & Pricing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quote Validity:</strong> All quotes are valid for 30 days from the date of issue. Material costs are subject to change after this period.</li>
                  <li><strong>Site Inspection Required:</strong> Final pricing is confirmed following a physical site inspection to assess roof condition, access, and specific requirements.</li>
                  <li><strong>Variations:</strong> Additional work discovered during the project will be quoted separately and requires your approval before proceeding.</li>
                  <li><strong>Price Adjustments:</strong> Premiums may apply for high-pitch roofs, multi-story buildings, heritage properties, difficult access, or outer suburbs.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Payment Terms</h2>
                <p><strong>Standard Payment Schedule:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>30% deposit upon acceptance of quote</li>
                  <li>40% mid-job payment when work is 50% complete</li>
                  <li>30% final payment upon satisfactory completion</li>
                </ul>
                <p className="mt-3"><strong>Modified Terms:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Small jobs under $1,500: 50% deposit, 50% on completion</li>
                  <li>Large projects over $10,000: Custom payment schedule provided in quote</li>
                </ul>
                <p className="mt-3">
                  Accepted payment methods include bank transfer, credit card, and cash. Payment is due within 7 days of invoice date unless otherwise specified.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Scheduling & Weather Dependencies</h2>
                <p>
                  Roofing work is weather-dependent and may be delayed due to rain, extreme heat, high winds, or other adverse conditions. 
                  We will provide reasonable notice of any delays and reschedule work as soon as weather permits. Completion timeframes 
                  are estimates and subject to weather conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Warranties</h2>
                <p>
                  Call Kaids Roofing provides comprehensive warranty coverage. For full details, please refer to our{' '}
                  <Link to="/warranty" className="text-primary hover:underline">Warranty Policy page</Link>.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Standard Workmanship Warranty:</strong> 10 years on all major roofing work</li>
                  <li><strong>Premium Coating Warranty:</strong> 15-year or 20-year options for industrial roof coating systems</li>
                  <li><strong>Manufacturer Warranties:</strong> Materials carry manufacturer warranties as specified in your quote</li>
                </ul>
                <p className="mt-3">
                  Warranty coverage requires compliance with recommended maintenance schedules and excludes damage from third parties, 
                  structural issues, neglect, or non-compliant modifications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Customer Responsibilities</h2>
                <p>You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide clear and safe access to the work site, including driveway parking for vehicles</li>
                  <li>Ensure work areas are clear of obstructions, personal items, and valuables</li>
                  <li>Inform us of any known hazards, asbestos, or structural concerns</li>
                  <li>Obtain necessary council permits or building approvals where required (we can assist with this process)</li>
                  <li>Secure pets and notify us of any site-specific safety concerns</li>
                  <li>Allow reasonable working hours (typically 7:00 AM to 6:00 PM weekdays)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Liability & Insurance</h2>
                <p>
                  Call Kaids Roofing maintains comprehensive public liability insurance and WorkCover insurance for all employees. 
                  We are committed to safe work practices compliant with WorkSafe Victoria regulations.
                </p>
                <p className="mt-3"><strong>Liability Limitations:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We are not liable for pre-existing structural damage, hidden defects, or issues not identified during inspection</li>
                  <li>Force majeure events (extreme weather, natural disasters, pandemics) may delay or suspend work without liability</li>
                  <li>Our liability is limited to the value of work performed and does not extend to consequential damages</li>
                </ul>
                <p className="mt-3">
                  Nothing in these terms excludes, restricts, or modifies your rights under the Australian Consumer Law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
                <p>
                  Call Kaids Roofing retains ownership of all before/after project photos, documentation, and marketing materials 
                  created during the course of work. We may use these images for promotional purposes, portfolio display, and social media. 
                  If you prefer your property not be featured in our marketing, please notify us in writing at the time of booking.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation & Termination</h2>
                <p><strong>Customer Cancellation:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellation more than 7 days before scheduled start: Full deposit refund minus 10% administration fee</li>
                  <li>Cancellation within 7 days of scheduled start: 50% of deposit retained to cover scheduling costs</li>
                  <li>Cancellation after work has commenced: Payment due for all work completed to date plus materials ordered</li>
                </ul>
                <p className="mt-3"><strong>Termination by Call Kaids Roofing:</strong></p>
                <p>
                  We reserve the right to terminate the contract if site conditions are unsafe, access is denied, payment terms are not met, 
                  or if there is abusive or threatening behavior toward our staff.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Dispute Resolution</h2>
                <p>
                  If a dispute arises, we commit to resolving it through good faith negotiation. If negotiation is unsuccessful, 
                  both parties agree to attempt mediation before pursuing legal action. Any legal disputes will be governed by the 
                  laws of Victoria, Australia, and subject to the exclusive jurisdiction of Victorian courts.
                </p>
                <p className="mt-3">
                  For complaints or concerns, please contact us at the details provided below. We aim to respond within 48 hours.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy & Data Protection</h2>
                <p>
                  Your personal information is collected, stored, and used in accordance with our{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>{' '}
                  and the Australian Privacy Act 1988. We do not sell or share your information with third parties 
                  except as necessary to provide our services or comply with legal obligations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Consumer Rights & Australian Consumer Law</h2>
                <p>
                  Your statutory rights under the Australian Consumer Law (ACL) are not excluded or limited by these terms. 
                  You are entitled to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Services provided with due care and skill</li>
                  <li>Services fit for the purpose specified</li>
                  <li>Services completed within a reasonable time</li>
                  <li>Consumer guarantees that cannot be excluded</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
                <p>
                  Call Kaids Roofing reserves the right to update these Terms of Service at any time. Updated terms will be 
                  posted on this page with a revised effective date. Continued use of our services after changes constitutes 
                  acceptance of the new terms. For existing contracts, the terms in effect at the time of contract signing apply.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p>
                  For questions about these Terms of Service, quotes, bookings, or to discuss your roofing needs, 
                  please contact us:
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p><strong>Call Kaids Roofing</strong></p>
                  <p>Phone: <a href="tel:+61435900709" className="text-primary hover:underline">0435 900 709</a></p>
                  <p>Email: <a href="mailto:info@callkaidsroofing.com.au" className="text-primary hover:underline">info@callkaidsroofing.com.au</a></p>
                  <p>ABN: 39475055075</p>
                  <p className="mt-2 text-sm italic">*Proof In Every Roof*</p>
                </div>
              </section>

              <section>
                <p className="text-sm italic">
                  These terms are designed to protect both parties and ensure clarity in our business relationship. 
                  We're committed to transparent, professional service and building long-term trust with every customer 
                  in Southeast Melbourne.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}