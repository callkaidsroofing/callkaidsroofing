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
}

interface QuoteDocumentTemplateProps {
  data: QuoteDocumentData;
  onPrint?: () => void;
}

export const QuoteDocumentTemplate = ({ data, onPrint }: QuoteDocumentTemplateProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 10;

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
    <header className="flex justify-between items-center pb-3 border-b-2 border-primary mb-5 gap-3 flex-wrap">
      <div className="w-[120px] h-14 bg-primary rounded-lg text-white font-semibold text-sm flex items-center justify-center">
        CKR LOGO
      </div>
      <div className="text-navy font-semibold">Quote Document</div>
    </header>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <footer className="absolute bottom-[15mm] left-[20mm] right-[20mm] border-t border-muted pt-2 flex justify-between items-center text-xs text-muted gap-2 flex-wrap">
      <div>ABN 39475055075</div>
      <div>0435 900 709 · callkaidsroofing@outlook.com</div>
      <div>Page {pageNum} of {totalPages}</div>
    </footer>
  );

  const pages = [
    // Page 1 - Cover
    <section key="page1" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h1 className="text-4xl text-navy font-semibold mb-2">{data.company_name} — Quote Document</h1>
      <div className="text-primary text-lg font-semibold mb-4">{data.slogan}</div>
      
      <p className="text-base mt-4">Dear {data.client_name},</p>
      <p>Thank you for considering Call Kaids Roofing. This document outlines our recommended scope and clear pricing options for your property.</p>

      <div className="bg-bg p-4 rounded-lg my-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-muted uppercase tracking-wide">ABN</div>
          <div className="font-semibold text-navy mt-1">39475055075</div>
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wide">Phone</div>
          <div className="font-semibold text-navy mt-1">0435 900 709</div>
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wide">Email</div>
          <div className="font-semibold text-navy mt-1">callkaidsroofing@outlook.com</div>
        </div>
      </div>

      <div className="w-full h-40 bg-gradient-to-br from-bg to-white border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted italic my-4">
        Optional hero image — replace with jobsite photo
      </div>

      <PageFooter pageNum={1} />
    </section>,

    // Page 2 - Job Details
    <section key="page2" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">1. Job Details</h2>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex justify-between py-3 border-b border-bg gap-3">
          <div className="font-semibold text-navy min-w-[120px]">Client:</div>
          <div className="text-right">{data.client_name}</div>
        </div>
        <div className="flex justify-between py-3 border-b border-bg gap-3">
          <div className="font-semibold text-navy min-w-[120px]">Property:</div>
          <div className="text-right">{data.property_address}</div>
        </div>
        <div className="flex justify-between py-3 border-b border-bg gap-3">
          <div className="font-semibold text-navy min-w-[120px]">Roof Type:</div>
          <div className="text-right">{data.roof_type}</div>
        </div>
        <div className="flex justify-between py-3 border-b border-bg gap-3">
          <div className="font-semibold text-navy min-w-[120px]">Measured Area:</div>
          <div className="text-right">{data.measured_area}</div>
        </div>
        <div className="flex justify-between py-3 border-b border-bg gap-3">
          <div className="font-semibold text-navy min-w-[120px]">Key Lengths:</div>
          <div className="text-right">{data.key_lengths}</div>
        </div>
      </div>

      <div className="bg-bg p-4 rounded-lg my-4">
        <h3 className="text-lg font-semibold text-navy mt-0 mb-2">Project Assumptions</h3>
        <ul className="list-disc pl-5 text-muted space-y-1">
          <li>Standard hours 7:00–17:00, Mon–Fri</li>
          <li>Weather suitable for works</li>
          <li>Clear, safe roof access</li>
          <li>No structural repairs outside scope</li>
          <li>Street delivery access available</li>
          <li>Water and power available onsite</li>
        </ul>
        <p className="mt-3 font-semibold text-navy">Note: Variations billed or credited at agreed unit rates.</p>
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
          <div className="w-full h-36 bg-gradient-to-br from-bg to-white border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted italic mb-2">
            Before — replace
          </div>
          <div className="font-semibold text-navy">Current Condition</div>
        </div>
        <div className="text-center">
          <div className="w-full h-36 bg-gradient-to-br from-bg to-white border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted italic mb-2">
            After — replace
          </div>
          <div className="font-semibold text-navy">Expected Result</div>
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

    // Page 5 - Quote Options
    <section key="page5" className="min-h-[297mm] p-[20mm] relative bg-white">
      <PageHeader />
      <h2 className="text-2xl text-navy font-semibold mb-4">4. Quote Options</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div className="border-2 border-bg rounded-xl p-4 text-center shadow-md hover:border-primary transition-colors">
          <div className="font-semibold text-navy mb-2">Option 1<br />Repairs + Wash</div>
          <div className="text-2xl font-semibold text-primary my-2">${formatMoney(o1.incGST)}</div>
          <div className="text-sm text-muted mb-2">Re-bed & re-point · Valley clean + Stormseal · Pressure wash + biocide</div>
          <div className="bg-bg p-2 rounded text-xs text-navy font-semibold">Workmanship 7–10 years</div>
        </div>

        <div className="border-2 border-primary rounded-xl p-4 text-center shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="font-semibold text-navy mb-2">Option 2<br />Full Restoration</div>
          <div className="text-2xl font-semibold text-primary my-2">${formatMoney(o2.incGST)}</div>
          <div className="text-sm text-muted mb-2">Option 1 + Primer + 2-coat membrane</div>
          <div className="bg-bg p-2 rounded text-xs text-navy font-semibold">Coating 15 years · Work 7–10 years</div>
        </div>

        <div className="border-2 border-bg rounded-xl p-4 text-center shadow-md hover:border-primary transition-colors">
          <div className="font-semibold text-navy mb-2">Option 3<br />Premium Package</div>
          <div className="text-2xl font-semibold text-primary my-2">${formatMoney(o3.incGST)}</div>
          <div className="text-sm text-muted mb-2">Option 2 + High-build or Heat-reflective</div>
          <div className="bg-bg p-2 rounded text-xs text-navy font-semibold">Coating 15–20 years · Work 7–10 years</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-4 rounded-lg my-4">
        <div className="font-semibold text-navy mb-2">Recommendation</div>
        <p><strong>Option 2</strong> balances coverage, durability, and cost.</p>
      </div>

      <PageFooter pageNum={5} />
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
      <div className="fixed top-3 right-3 bg-white rounded-lg shadow-lg p-2 z-50 print:hidden">
        <div className="flex gap-2 mb-2">
          <Button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            size="sm"
          >
            ← Prev
          </Button>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            size="sm"
          >
            Next →
          </Button>
        </div>
        <div className="text-center text-sm text-muted">
          Page {currentPage + 1} of {totalPages}
        </div>
        {onPrint && (
          <Button onClick={onPrint} className="w-full mt-2" size="sm">
            Print / Export PDF
          </Button>
        )}
      </div>

      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none">
        {pages[currentPage]}
      </div>
    </div>
  );
};
