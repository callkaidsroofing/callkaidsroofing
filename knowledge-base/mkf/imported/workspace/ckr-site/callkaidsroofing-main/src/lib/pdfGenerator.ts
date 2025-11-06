import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFOptions {
  title: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
}

const BRAND_COLORS = {
  primary: '#007ACC',
  dark: '#0B3B69',
  gray: '#6B7280',
};

const BRAND_INFO = {
  name: 'Call Kaids Roofing',
  abn: 'ABN 39475055075',
  phone: '0435 900 709',
  email: 'callkaidsroofing@outlook.com',
  slogan: 'No Leaks. No Lifting. Just Quality.',
};

export const generateBrandedPDF = async (
  contentElement: HTMLElement,
  options: PDFOptions
): Promise<void> => {
  try {
    // Create canvas from content
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add branded header
    pdf.setFillColor(BRAND_COLORS.primary);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    // Company name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(BRAND_INFO.name, 15, 12);
    
    // Slogan
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(BRAND_INFO.slogan, 15, 20);
    
    // Contact info (right aligned)
    pdf.setFontSize(9);
    const contactInfo = [
      BRAND_INFO.abn,
      BRAND_INFO.phone,
      BRAND_INFO.email,
    ];
    
    contactInfo.forEach((info, index) => {
      const textWidth = pdf.getTextWidth(info);
      pdf.text(info, pageWidth - textWidth - 15, 10 + (index * 5));
    });

    // Add title
    pdf.setTextColor(BRAND_COLORS.dark);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(options.title, 15, 40);

    // Add content image
    const imgWidth = pageWidth - 30;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let position = 50;
    
    if (imgHeight > pageHeight - 80) {
      // Content spans multiple pages
      const pageCount = Math.ceil(imgHeight / (pageHeight - 80));
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
          // Add header to subsequent pages
          pdf.setFillColor(BRAND_COLORS.primary);
          pdf.rect(0, 0, pageWidth, 20, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.text(BRAND_INFO.name, 15, 12);
          position = 25;
        }
        
        const sourceY = i * (pageHeight - 80) * (canvas.height / imgHeight);
        const sourceHeight = (pageHeight - 80) * (canvas.height / imgHeight);
        
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 15, position, imgWidth, pageHeight - 80);
        }
      }
    } else {
      pdf.addImage(imgData, 'PNG', 15, position, imgWidth, imgHeight);
    }

    // Add footer to all pages
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(BRAND_COLORS.gray);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - 15,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    // Save the PDF
    pdf.save(options.filename);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const printBrandedDocument = (contentElement: HTMLElement): void => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window');
  }

  const styles = `
    <style>
      @media print {
        @page {
          margin: 0;
          size: A4;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Helvetica', 'Arial', sans-serif;
        }
        .print-header {
          background: ${BRAND_COLORS.primary};
          color: white;
          padding: 20px 30px;
          margin-bottom: 20px;
        }
        .print-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .print-header .slogan {
          margin: 5px 0 0 0;
          font-size: 12px;
        }
        .print-header .contact {
          float: right;
          text-align: right;
          font-size: 10px;
        }
        .print-content {
          padding: 0 30px 30px 30px;
        }
        .print-footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 8px;
          color: ${BRAND_COLORS.gray};
          padding: 10px;
          border-top: 1px solid #e5e7eb;
        }
      }
    </style>
  `;

  const headerHTML = `
    <div class="print-header">
      <div class="contact">
        <div>${BRAND_INFO.abn}</div>
        <div>${BRAND_INFO.phone}</div>
        <div>${BRAND_INFO.email}</div>
      </div>
      <h1>${BRAND_INFO.name}</h1>
      <p class="slogan">${BRAND_INFO.slogan}</p>
    </div>
  `;

  const footerHTML = `
    <div class="print-footer">
      Generated: ${new Date().toLocaleDateString()} | ${BRAND_INFO.name}
    </div>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${BRAND_INFO.name} - Document</title>
        ${styles}
      </head>
      <body>
        ${headerHTML}
        <div class="print-content">
          ${contentElement.innerHTML}
        </div>
        ${footerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
};
