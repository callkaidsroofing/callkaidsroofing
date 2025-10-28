import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface QuoteDocumentData {
  company_name: string;
  slogan: string;
  client_name: string;
  property_address: string;
  roof_type: string;
  measured_area: string;
  key_lengths: string;
  option1_total: string;
  option2_total: string;
  option3_total: string;
  photos?: {
    before?: string[];
    during?: string[];
    after?: string[];
  };
}

interface QuoteDocumentTemplateProps {
  data: QuoteDocumentData;
  onPrint?: () => void;
}

export const QuoteDocumentTemplate = ({ data, onPrint }: QuoteDocumentTemplateProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6; // Reduced from 10 to 6 pages

  const calcGST = (totalInc: number) => {
    const exGST = totalInc / 1.1;
    const gst = totalInc - exGST;
    return { exGST, gst, incGST: totalInc };
  };

  const parseMoney = (val: string) => {
    return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const o1 = calcGST(parseMoney(data.option1_total));
  const o2 = calcGST(parseMoney(data.option2_total));
  const o3 = calcGST(parseMoney(data.option3_total));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentPage(p => Math.max(0, p - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentPage(p => Math.min(totalPages - 1, p + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const PageHeader = () => (
    <header className="flex justify-between items-center pb-4 border-b-2 border-primary mb-6 gap-3 flex-wrap">
      <div className="w-[140px] h-16 bg-primary rounded-lg text-white font-bold text-base flex items-center justify-center shadow-sm">
        CKR LOGO
      </div>
      <div className="text-navy font-bold text-lg">Quote Document</div>
    </header>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <footer className="absolute bottom-[15mm] left-[20mm] right-[20mm] border-t-2 border-muted pt-3 flex justify-between items-center text-sm font-medium text-muted gap-2 flex-wrap">
      <div>ABN 39475055075</div>
      <div className="font-semibold">0435 900 709 · callkaidsroofing@outlook.com</div>
      <div>Page {pageNum} of {totalPages}</div>
    </footer>
  );

  const pages = [
    // Page 1 - Cover & Details Combined
    <section key="page1" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h1 className="text-4xl text-navy font-bold mb-3 leading-tight">{data.company_name}</h1>
      <div className="text-primary text-xl font-bold mb-6">{data.slogan}</div>
      
      <p className="text-lg mt-4 mb-2">Dear <span className="font-bold">{data.client_name}</span>,</p>
      <p className="text-base leading-relaxed mb-6">Thank you for considering Call Kaids Roofing. This document outlines our recommended scope and clear pricing options for your property.</p>

      <div className="bg-gradient-to-br from-bg to-white p-5 rounded-xl my-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-2 border-primary/20">
        <div>
          <div className="text-xs text-foreground/70 uppercase tracking-wide font-bold">ABN</div>
          <div className="font-bold text-foreground mt-1 text-base">39475055075</div>
        </div>
        <div>
          <div className="text-xs text-foreground/70 uppercase tracking-wide font-bold">Phone</div>
          <div className="font-bold text-foreground mt-1 text-base">0435 900 709</div>
        </div>
        <div>
          <div className="text-xs text-foreground/70 uppercase tracking-wide font-bold">Email</div>
          <div className="font-bold text-foreground mt-1 text-base">callkaidsroofing@outlook.com</div>
        </div>
      </div>

      {/* Property Details on Page 1 */}
      <h2 className="text-2xl text-navy font-bold mb-4 mt-8">Property Details</h2>
      <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-primary/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="py-3 border-b border-bg">
            <div className="text-sm font-bold text-foreground/70 mb-1">Client</div>
            <div className="font-bold text-foreground text-base">{data.client_name}</div>
          </div>
          <div className="py-3 border-b border-bg">
            <div className="text-sm font-bold text-foreground/70 mb-1">Roof Type</div>
            <div className="font-bold text-foreground text-base">{data.roof_type}</div>
          </div>
          <div className="py-3 border-b border-bg col-span-2">
            <div className="text-sm font-bold text-foreground/70 mb-1">Property Address</div>
            <div className="font-bold text-foreground text-base">{data.property_address}</div>
          </div>
          <div className="py-3">
            <div className="text-sm font-bold text-foreground/70 mb-1">Measured Area</div>
            <div className="font-bold text-foreground text-base">{data.measured_area}</div>
          </div>
          <div className="py-3">
            <div className="text-sm font-bold text-foreground/70 mb-1">Key Lengths</div>
            <div className="font-bold text-foreground text-base">{data.key_lengths}</div>
          </div>
        </div>
      </div>

      {data.photos?.before && data.photos.before.length > 0 && (
        <div className="grid grid-cols-2 gap-4 my-6">
          {data.photos.before.slice(0, 2).map((photo, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
              <img src={photo} alt={`Inspection ${idx + 1}`} className="w-full h-40 object-cover" />
            </div>
          ))}
        </div>
      )}

      <PageFooter pageNum={1} />
    </section>,

    // Page 2 - Findings & Scope Combined
    <section key="page2" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-bold mb-5">Inspection Findings & Recommendations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { title: "Ridge Caps", desc: "Mortar cracking. Re-bedding required.", icon: "1" },
          { title: "Pointing", desc: "Deteriorated joints along ridge/junctions.", icon: "2" },
          { title: "Valleys", desc: "Clean required; apply Stormseal for flow.", icon: "3" },
          { title: "Surface", desc: "Organic growth; wash + biocide before coating.", icon: "4" }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-3 p-4 bg-gradient-to-br from-bg to-white rounded-xl border-l-4 border-primary shadow-sm">
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {item.icon}
            </span>
            <div>
              <strong className="text-base text-foreground block mb-1">{item.title}</strong>
              <span className="text-sm text-foreground/80">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {data.photos?.during && data.photos.during.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {data.photos.during.slice(0, 4).map((photo, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
              <img src={photo} alt={`Finding ${idx + 1}`} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-5 rounded-xl my-6">
        <div className="font-bold text-navy mb-2 text-lg">Recommended Scope</div>
        <p className="text-base leading-relaxed mb-4">Full Re-Bed & Re-Point + Valley Stormseal + Pressure Clean + Prime + 2-Coat Membrane</p>
        
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            "Site prep & edge protection",
            "Remove old mortar; polymer re-bed",
            "Flexible pointing - ridges & junctions",
            "Valley clean + Stormseal both sides",
            "Pressure clean + biocide entire roof",
            "Bonding primer application",
            "2-coat UV-stable membrane system",
            "Progress photos & final inspection"
          ].map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-navy text-white p-5 rounded-xl text-center">
        <p className="font-bold text-lg mb-2">Warranty Coverage</p>
        <p className="text-base"><strong>15-year coating warranty</strong> + <strong>7-10 year workmanship guarantee</strong></p>
      </div>

      <PageFooter pageNum={2} />
    </section>,

    // Page 3 - Findings
    <section key="page3" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">2. Findings (From Site Photos)</h2>

      <ol className="list-none pl-0 space-y-3">
        {[
          { title: "Ridge caps", desc: "Mortar cracking. Some re-bedding required." },
          { title: "Pointing", desc: "Deteriorated joints along ridge/junctions." },
          { title: "Valleys", desc: "Clean required; apply Stormseal for flow." },
          { title: "Surface", desc: "Organic growth; wash + biocide before coating." }
        ].map((item, idx) => (
          <li key={idx} className="relative pl-8">
            <span className="absolute left-0 top-0 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
              {idx + 1}
            </span>
            <strong>{item.title}:</strong> {item.desc}
          </li>
        ))}
      </ol>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-4 rounded-lg my-4">
        <div className="font-semibold text-navy mb-2">Summary</div>
        <p>Structure sound. Restoration addresses risks and improves durability. Photos available for reference.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="text-center">
          {data.photos?.before && data.photos.before.length > 0 ? (
            <img src={data.photos.before[0]} alt="Before" className="w-full h-36 object-cover rounded-lg border" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-bg to-white border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-foreground/60 font-semibold italic mb-2">
              Before — replace
            </div>
          )}
          <div className="font-semibold text-foreground">Current Condition</div>
        </div>
        <div className="text-center">
          {data.photos?.after && data.photos.after.length > 0 ? (
            <img src={data.photos.after[0]} alt="Projected Result" className="w-full h-36 object-cover rounded-lg border" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-bg to-white border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-foreground/60 font-semibold italic mb-2">
              After — replace
            </div>
          )}
          <div className="font-semibold text-foreground">Expected Result</div>
        </div>
      </div>

      <PageFooter pageNum={3} />
    </section>,

    // Page 4 - Scope
    <section key="page4" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">3. Recommended Scope of Works</h2>
      <h3 className="text-lg text-primary mb-3">Full Re-Bed & Re-Point + Valley Stormseal + Pressure Clean + Paint (Prime + 2-Coat)</h3>

      <ol className="list-none pl-0 space-y-3">
        {[
          { task: "Site prep", desc: "Edge protection and protection of work areas." },
          { task: "Re-bedding", desc: "Remove old mortar; re-bed with polymer-modified bedding." },
          { task: "Re-pointing", desc: "Flexible pointing to all ridges and junctions." },
          { task: "Valleys", desc: "Clean; fit Stormseal both sides for flow." },
          { task: "Wash", desc: "Pressure clean entire roof with biocide." },
          { task: "Dry/inspect", desc: "Confirm adhesion conditions." },
          { task: "Prime", desc: "Apply bonding primer across roof." },
          { task: "Membrane", desc: "Two full coats UV-stable roof membrane." }
        ].map((item, idx) => (
          <li key={idx} className="relative pl-8">
            <span className="absolute left-0 top-0 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
              {idx + 1}
            </span>
            <strong>{item.task}:</strong> {item.desc}
          </li>
        ))}
      </ol>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-4 rounded-lg my-4">
        <div className="font-semibold text-navy mb-2">Warranty</div>
        <p><strong>15-year coating</strong> and <strong>7–10-year workmanship</strong> coverage.</p>
      </div>

      <PageFooter pageNum={4} />
    </section>,

    // Page 3 - Quote Options & Breakdown
    <section key="page3" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-bold mb-5">Investment Options</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="border-2 border-bg rounded-xl p-5 text-center shadow-lg hover:border-primary transition-all hover:shadow-xl">
          <div className="font-bold text-navy mb-3 text-lg">Option 1<br />Repairs + Wash</div>
          <div className="text-3xl font-bold text-primary my-3">${formatMoney(o1.incGST)}</div>
          <div className="text-sm text-muted mb-4 min-h-[60px] leading-relaxed">Re-bed & re-point · Valley clean + Stormseal · Pressure wash + biocide</div>
          <div className="bg-bg p-3 rounded-lg text-sm text-navy font-bold">7-10 year workmanship</div>
        </div>

        <div className="border-4 border-primary rounded-xl p-5 text-center shadow-xl bg-gradient-to-br from-primary/15 to-primary/5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">
            RECOMMENDED
          </div>
          <div className="font-bold text-navy mb-3 text-lg">Option 2<br />Full Restoration</div>
          <div className="text-3xl font-bold text-primary my-3">${formatMoney(o2.incGST)}</div>
          <div className="text-sm text-muted mb-4 min-h-[60px] leading-relaxed">All Option 1 services + Bonding primer + 2-coat UV membrane</div>
          <div className="bg-primary text-white p-3 rounded-lg text-sm font-bold">15 year coating · 7-10 year work</div>
        </div>

        <div className="border-2 border-bg rounded-xl p-5 text-center shadow-lg hover:border-primary transition-all hover:shadow-xl">
          <div className="font-bold text-navy mb-3 text-lg">Option 3<br />Premium Package</div>
          <div className="text-3xl font-bold text-primary my-3">${formatMoney(o3.incGST)}</div>
          <div className="text-sm text-muted mb-4 min-h-[60px] leading-relaxed">All Option 2 + High-build or Heat-reflective coating</div>
          <div className="bg-bg p-3 rounded-lg text-sm text-navy font-bold">15-20 year coating · 7-10 year work</div>
        </div>
      </div>

      {/* GST Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Option 1", data: o1 },
          { title: "Option 2", data: o2, featured: true },
          { title: "Option 3", data: o3 }
        ].map((opt, idx) => (
          <div key={idx} className={`rounded-xl p-4 text-sm ${opt.featured ? 'bg-primary/10 border-2 border-primary' : 'bg-bg border border-muted'}`}>
            <div className="font-bold text-navy mb-3">{opt.title}</div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Ex GST:</span><span className="font-semibold">${formatMoney(opt.data.exGST)}</span></div>
              <div className="flex justify-between"><span className="text-muted">GST:</span><span className="font-semibold">${formatMoney(opt.data.gst)}</span></div>
              <div className="flex justify-between font-bold border-t-2 border-primary pt-2"><span>Inc GST:</span><span className="text-primary">${formatMoney(opt.data.incGST)}</span></div>
            </div>
          </div>
        ))}
      </div>

      <PageFooter pageNum={3} />
    </section>,

    // Remaining pages follow same pattern...
    <section key="page6" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">5. Inclusions / Exclusions / Allowances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <h3 className="text-lg text-primary mb-2">✓ Inclusions</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Materials per scope</li>
            <li>Professional workmanship</li>
            <li>Site prep & protection</li>
            <li>Clean-up & waste removal</li>
            <li>Warranty documentation</li>
            <li>Progress photos</li>
            <li>Final quality inspection</li>
            <li>Edge protection as required</li>
            <li>Public liability cover</li>
            <li>WorkSafe compliance</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg text-muted mb-2">✗ Exclusions</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Structural repairs outside scope</li>
            <li>Extra tile replacement</li>
            <li>Gutter works</li>
            <li>Electrical works</li>
            <li>Permits/council fees</li>
            <li>Extreme weather works</li>
            <li>Special access equipment</li>
            <li>Landscaping repair</li>
            <li>Internal damage remediation</li>
            <li>Extra coats beyond system</li>
          </ul>
        </div>
      </div>
      <PageFooter pageNum={6} />
    </section>,

    <section key="page7" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">6. Unit Rates & Calculations</h2>
      <div className="overflow-x-auto rounded-lg shadow-md my-4">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-navy text-white">
              <th className="p-3 text-left font-semibold">Item</th>
              <th className="p-3 text-left font-semibold">Length (lm)</th>
              <th className="p-3 text-left font-semibold">Rate ($/lm)</th>
              <th className="p-3 text-left font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-bg">
              <td className="p-3 border-b border-bg">Re-pointing</td>
              <td className="p-3 border-b border-bg">45.0</td>
              <td className="p-3 border-b border-bg">$28.00</td>
              <td className="p-3 border-b border-bg">$1,260.00</td>
            </tr>
            <tr className="bg-primary text-white font-semibold">
              <td colSpan={3} className="p-3">Linear Works Total</td>
              <td className="p-3">$3,375.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <PageFooter pageNum={7} />
    </section>,

    <section key="page8" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">7. Investment Summary & Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {[
          { title: "Option 1 Total", data: o1 },
          { title: "Option 2 Total", data: o2, featured: true },
          { title: "Option 3 Total", data: o3 }
        ].map((opt, idx) => (
          <div key={idx} className={`border-2 rounded-xl p-4 ${opt.featured ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5' : 'border-bg'}`}>
            <div className="font-semibold text-navy mb-3">{opt.title}</div>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Ex GST:</span><span>${formatMoney(opt.data.exGST)}</span></div>
              <div className="flex justify-between"><span>GST:</span><span>${formatMoney(opt.data.gst)}</span></div>
              <div className="flex justify-between font-semibold border-t border-bg pt-2"><span>Inc GST:</span><span>${formatMoney(opt.data.incGST)}</span></div>
            </div>
          </div>
        ))}
      </div>
      <PageFooter pageNum={8} />
    </section>,

    <section key="page9" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">8. Acceptance & Next Steps</h2>
      <div className="bg-gradient-to-r from-primary to-navy text-white p-5 rounded-xl text-center my-4">
        <div className="text-xl font-semibold mb-2">Ready to proceed?</div>
        <p>Approve your chosen option and we'll schedule your works.</p>
      </div>
      <PageFooter pageNum={9} />
    </section>,

    <section key="page10" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">9. Why Choose Call Kaids Roofing?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { icon: "🏆", title: "Proof in Every Roof", desc: "Before/after documentation and quality workmanship on every job." },
          { icon: "🛡️", title: "Fully Insured & Licensed", desc: "Public liability cover and full compliance from start to finish." },
          { icon: "📍", title: "SE Melbourne Specialists", desc: "Local knowledge of weather and building requirements." },
          { icon: "⭐", title: "Premium Materials & Warranty", desc: "15-year coating systems and 7–10-year workmanship coverage." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-primary mt-0 mb-2">{item.icon} {item.title}</h3>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
      <PageFooter pageNum={10} />
    </section>
  ];

  return (
    <div className="bg-bg min-h-screen">
      {/* Page Navigation - Mobile Optimized */}
      <div className="fixed top-3 right-3 bg-white rounded-lg shadow-lg p-2 z-50 print:hidden">
        <div className="flex gap-1 mb-2">
          <Button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            size="sm"
            variant="outline"
            className="h-8 px-2 md:px-3"
          >
            <span className="hidden sm:inline">← Prev</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            size="sm"
            variant="outline"
            className="h-8 px-2 md:px-3"
          >
            <span className="hidden sm:inline">Next →</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
        <div className="text-center text-xs md:text-sm text-muted-foreground">
          Page {currentPage + 1}/{totalPages}
        </div>
        {onPrint && (
          <Button onClick={onPrint} className="w-full mt-2 text-xs" size="sm">
            <span className="hidden sm:inline">Print / Export PDF</span>
            <span className="sm:hidden">Print</span>
          </Button>
        )}
      </div>

      {/* Document Container - Responsive */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none px-2 md:px-0">
        {pages[currentPage]}
      </div>
    </div>
  );
};
