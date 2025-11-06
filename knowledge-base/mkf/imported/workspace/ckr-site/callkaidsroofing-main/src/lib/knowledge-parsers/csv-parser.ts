// CSV Parser for CKR Database Files
export interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export async function parseCSV(filePath: string): Promise<ParsedCSVData> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    const lines = text.trim().split('\n');
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, string>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      rows.push(row);
    }
    
    return { headers, rows };
  } catch (error) {
    console.error(`Error parsing CSV from ${filePath}:`, error);
    return { headers: [], rows: [] };
  }
}

export async function parseLeadsCSV(filePath: string) {
  const data = await parseCSV(filePath);
  return data.rows.map(row => ({
    uid: row.UID || '',
    name: row.Name || '',
    contactName: row.ContactName || '',
    contactPhone: row.ContactPhone || '',
    contactEmail: row.ContactEmail || '',
    suburbUID: row.SuburbUID || '',
    status: row.Status || 'New',
    source: row.Source || 'Unknown',
    created: row.Created || new Date().toISOString()
  }));
}

export async function parseJobsCSV(filePath: string) {
  const data = await parseCSV(filePath);
  return data.rows.map(row => ({
    uid: row.UID || '',
    name: row.Name || '',
    quoteUID: row.QuoteUID || '',
    status: row.Status || 'Scheduled',
    scheduledDate: row.ScheduledDate || '',
    completedDate: row.CompletedDate || '',
    crewAssigned: row.CrewAssigned || '',
    notes: row.Notes || ''
  }));
}

export async function parseQuotesCSV(filePath: string) {
  const data = await parseCSV(filePath);
  return data.rows.map(row => ({
    uid: row.UID || '',
    leadUID: row.LeadUID || '',
    totalAmount: parseFloat(row.TotalAmount || '0'),
    status: row.Status || 'Draft',
    createdDate: row.CreatedDate || '',
    expiryDate: row.ExpiryDate || '',
    services: row.Services || ''
  }));
}

export async function parseCaseStudiesCSV(filePath: string) {
  const data = await parseCSV(filePath);
  return data.rows.map(row => ({
    uid: row.UID || '',
    title: row.Title || '',
    jobUID: row.JobUID || '',
    suburb: row.Suburb || '',
    service: row.Service || '',
    beforeImage: row.BeforeImage || '',
    afterImage: row.AfterImage || '',
    testimonial: row.Testimonial || '',
    published: row.Published === 'true' || row.Published === '1'
  }));
}

export async function parseTestimonialsCSV(filePath: string) {
  const data = await parseCSV(filePath);
  return data.rows.map(row => ({
    uid: row.UID || '',
    clientName: row.ClientName || '',
    jobUID: row.JobUID || '',
    rating: parseInt(row.Rating || '5'),
    text: row.Text || '',
    date: row.Date || '',
    featured: row.Featured === 'true' || row.Featured === '1'
  }));
}