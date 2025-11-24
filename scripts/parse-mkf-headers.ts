import fs from 'fs'
import path from 'path'

export interface DocumentSection {
  doc_id: string
  doc_title: string
  domain: string
  section_level: number
  section_path: string
  heading: string
  content: string
  keywords: string[]
  related_sections: string[]
}

export interface DocumentMetadata {
  doc_id: string
  title: string
  domain: string
  file_path: string
  version: string
  supersedes: string[]
}

function extractDocId(filePath: string): string {
  const filename = path.basename(filePath, '.md')
  const match = filename.match(/(MKF|KF|CH)_\d+/)
  return match ? match[0] : filename
}

function extractDomain(filePath: string): string {
  const parts = filePath.split(path.sep)
  const domainMatch = parts.find(p => p.match(/^\d{2}_/))
  return domainMatch || 'Unknown'
}

function extractKeywords(text: string): string[] {
  const keywords = new Set<string>()
  
  // Pricing terms
  const prices = text.match(/\$[\d,]+(?:\.\d{2})?/g) || []
  prices.forEach(p => keywords.add(p))
  
  // Technical terms
  const technical = text.match(/\b(?:Colorbond|ridge|gutter|flashing|warranty|ABN|bedding|pointing|restoration|inspection|quotation)\b/gi) || []
  technical.forEach(t => keywords.add(t.toLowerCase()))
  
  // Document references
  const refs = text.match(/\b(?:KF|MKF|CH)_\d+\b/g) || []
  refs.forEach(r => keywords.add(r))
  
  return Array.from(keywords)
}

function extractReferences(text: string): string[] {
  const refs = text.match(/\[(?:MKF|KF|CH)_\d+(?:\s*§\s*[^\]]+)?\]/g) || []
  return [...new Set(refs)]
}

export function parseMKFDocument(filePath: string): { sections: DocumentSection[], metadata: DocumentMetadata } {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  const sections: DocumentSection[] = []
  let currentSection: Partial<DocumentSection> = {}
  let currentContent: string[] = []
  let headerStack: string[] = []
  let firstHeading = ''
  
  const doc_id = extractDocId(filePath)
  const domain = extractDomain(filePath)
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    
    if (headingMatch) {
      // Save previous section
      if (currentSection.heading) {
        const sectionContent = currentContent.join('\n').trim()
        sections.push({
          ...currentSection,
          content: sectionContent,
          keywords: extractKeywords(sectionContent),
          related_sections: extractReferences(sectionContent)
        } as DocumentSection)
      }
      
      // Start new section
      const level = headingMatch[1].length
      const heading = headingMatch[2].trim()
      
      if (!firstHeading) {
        firstHeading = heading
      }
      
      // Update header stack (breadcrumb path)
      headerStack = headerStack.slice(0, level - 1)
      headerStack[level - 1] = heading
      
      currentSection = {
        doc_id,
        doc_title: firstHeading,
        domain,
        section_level: level,
        section_path: headerStack.join(' > '),
        heading: heading
      }
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }
  
  // Save last section
  if (currentSection.heading) {
    const sectionContent = currentContent.join('\n').trim()
    sections.push({
      ...currentSection,
      content: sectionContent,
      keywords: extractKeywords(sectionContent),
      related_sections: extractReferences(sectionContent)
    } as DocumentSection)
  }
  
  // Extract metadata
  const versionMatch = content.match(/Version:\s*(\S+)/i)
  const supersedesMatch = content.match(/Supersedes:\s*\[([^\]]+)\]/i)
  
  const metadata: DocumentMetadata = {
    doc_id,
    title: firstHeading || doc_id,
    domain,
    file_path: filePath,
    version: versionMatch ? versionMatch[1] : '1.0',
    supersedes: supersedesMatch ? supersedesMatch[1].split(',').map(s => s.trim()) : []
  }
  
  return { sections, metadata }
}

export function parseAllMKFDocuments(rootDir: string): { sections: DocumentSection[], documents: DocumentMetadata[] } {
  const allSections: DocumentSection[] = []
  const allDocuments: DocumentMetadata[] = []
  
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        walkDir(fullPath)
      } else if (file.endsWith('.md')) {
        try {
          const { sections, metadata } = parseMKFDocument(fullPath)
          allSections.push(...sections)
          allDocuments.push(metadata)
          console.log(`✅ Parsed ${metadata.doc_id}: ${sections.length} sections`)
        } catch (error: any) {
          console.error(`❌ Failed to parse ${fullPath}:`, error.message)
        }
      }
    }
  }
  
  walkDir(rootDir)
  return { sections: allSections, documents: allDocuments }
}
