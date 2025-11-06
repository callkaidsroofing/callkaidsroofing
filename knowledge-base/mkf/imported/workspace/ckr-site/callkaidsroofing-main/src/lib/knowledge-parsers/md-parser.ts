// Markdown Parser for MKF Files
export interface ParsedMarkdown {
  title: string;
  content: string;
  sections: {
    heading: string;
    content: string;
    level: number;
  }[];
  metadata: Record<string, string>;
}

export async function parseMarkdown(filePath: string): Promise<ParsedMarkdown> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    // Extract title (first # heading)
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    
    // Extract metadata (lines starting with - **key:** value)
    const metadata: Record<string, string> = {};
    const metadataRegex = /-\s+\*\*(.+?):\*\*\s+(.+)/g;
    let match;
    while ((match = metadataRegex.exec(text)) !== null) {
      metadata[match[1]] = match[2];
    }
    
    // Extract sections
    const sections: { heading: string; content: string; level: number }[] = [];
    const sectionRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...text.matchAll(sectionRegex)];
    
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];
      
      const level = currentMatch[1].length;
      const heading = currentMatch[2];
      const startIndex = currentMatch.index! + currentMatch[0].length;
      const endIndex = nextMatch ? nextMatch.index! : text.length;
      const content = text.slice(startIndex, endIndex).trim();
      
      sections.push({ heading, content, level });
    }
    
    return {
      title,
      content: text,
      sections,
      metadata
    };
  } catch (error) {
    console.error(`Error parsing markdown from ${filePath}:`, error);
    return {
      title: 'Error',
      content: '',
      sections: [],
      metadata: {}
    };
  }
}

export async function parseMKFFile(fileNumber: number): Promise<ParsedMarkdown> {
  const categoryMap: Record<number, string> = {
    0: 'system',
    1: 'brand',
    2: 'operations',
    3: 'operations',
    4: 'operations',
    5: 'operations',
    6: 'marketing',
    7: 'marketing',
    8: 'marketing',
    9: 'workflows',
    10: 'workflows',
    11: 'workflows',
    12: 'workflows',
    13: 'workflows',
    14: 'workflows'
  };
  
  const category = categoryMap[fileNumber] || 'system';
  const paddedNumber = fileNumber.toString().padStart(2, '0');
  return parseMarkdown(`/knowledge-base/${category}/MKF_${paddedNumber}.md`);
}

export async function parseSystemRules(): Promise<ParsedMarkdown> {
  return parseMarkdown('/knowledge-base/system/CKR_System_Rules.md');
}

export async function parseGEMPersona(): Promise<ParsedMarkdown> {
  return parseMarkdown('/knowledge-base/system/CKR_GEM_Persona_Extract.md');
}