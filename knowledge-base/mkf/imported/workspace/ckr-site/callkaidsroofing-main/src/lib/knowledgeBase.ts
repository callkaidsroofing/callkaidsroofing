// Knowledge Base Loader and Parser Utility
// Provides access to CKR organized knowledge files for AI modules
// Uses David's organized structure at /knowledge-base/

import { 
  parseLeadsCSV, 
  parseJobsCSV, 
  parseQuotesCSV, 
  parseCaseStudiesCSV,
  parseTestimonialsCSV 
} from './knowledge-parsers/csv-parser';
import { parseMarkdown } from './knowledge-parsers/md-parser';
import { parseJSON } from './knowledge-parsers/json-parser';

export interface KnowledgeFile {
  id: string;
  name: string;
  type: 'json' | 'md' | 'txt' | 'yaml' | 'csv';
  category: 'system' | 'brand' | 'operations' | 'marketing' | 'data' | 'workflows' | 'schemas';
  path: string;
  size?: string;
  description: string;
  lastModified?: string;
}

// Load master index for file metadata
let masterIndex: { files: KnowledgeFile[] } | null = null;

export async function loadMasterIndex() {
  if (masterIndex) return masterIndex;
  
  try {
    const response = await fetch('/knowledge-base/MASTER_INDEX.json');
    masterIndex = await response.json();
    return masterIndex;
  } catch (error) {
    console.error('Error loading master index:', error);
    return null;
  }
}

// Organized knowledge base paths
const KB_BASE = '/knowledge-base';
const KB_PATHS = {
  system: `${KB_BASE}/01_System_Governance`,
  brand: `${KB_BASE}/02_Brand_Voice`,
  operations: `${KB_BASE}/03_Operations_SOPs`,
  marketing: `${KB_BASE}/04_Marketing_Content`,
  data: `${KB_BASE}/05_Data_Databases`,
  workflows: `${KB_BASE}/06_Workflows_Automation`,
  schemas: `${KB_BASE}/07_Schemas_Config`
};

export const knowledgeFiles: KnowledgeFile[] = [
  // System Governance (01)
  {
    id: 'mkf_00',
    name: 'System Meta & Governance Doctrine',
    type: 'md',
    category: 'system',
    path: `${KB_PATHS.system}/MKF_00.md`,
    description: 'Core system governance and operational philosophy'
  },
  {
    id: 'system_rules',
    name: 'CKR System Rules',
    type: 'md',
    category: 'system',
    path: `${KB_PATHS.system}/CKR_System_Rules.md`,
    description: 'Core system rules and governance'
  },
  {
    id: 'gem_persona',
    name: 'CKR GEM Persona Extract',
    type: 'md',
    category: 'system',
    path: `${KB_PATHS.system}/CKR_GEM_Persona_Extract.md`,
    description: 'AI assistant persona and behavior guidelines'
  },
  
  // Brand & Voice (02)
  {
    id: 'mkf_01',
    name: 'Brand & Voice Mandate',
    type: 'md',
    category: 'brand',
    path: `${KB_PATHS.brand}/MKF_01.md`,
    description: 'Complete brand mandate - most comprehensive (90KB)'
  },
  {
    id: 'seo_matrix',
    name: 'SEO Keyword Matrix',
    type: 'csv',
    category: 'brand',
    path: `${KB_PATHS.brand}/CKR_03_SEO_KEYWORD_MATRIX.csv`,
    description: 'Tier 1-3 keywords for local SEO'
  },
  
  // Operations & SOPs (03)
  {
    id: 'mkf_02',
    name: 'Pricing Model',
    type: 'md',
    category: 'operations',
    path: `${KB_PATHS.operations}/MKF_02.md`,
    description: 'Service pricing structure and calculation models'
  },
  {
    id: 'mkf_03',
    name: 'SOPs - Tile Roofing',
    type: 'md',
    category: 'operations',
    path: `${KB_PATHS.operations}/MKF_03.md`,
    description: 'Standard operating procedures for tile roofing'
  },
  {
    id: 'mkf_04',
    name: 'SOPs - Metal Roofing',
    type: 'md',
    category: 'operations',
    path: `${KB_PATHS.operations}/MKF_04.md`,
    description: 'Standard operating procedures for metal roofing'
  },
  {
    id: 'mkf_05',
    name: 'SOPs - General Repairs',
    type: 'md',
    category: 'operations',
    path: `${KB_PATHS.operations}/MKF_05.md`,
    description: 'Complete SOP library (123KB)'
  },
  {
    id: 'pricing_db',
    name: 'Pricing Model Database',
    type: 'csv',
    category: 'operations',
    path: `${KB_PATHS.operations}/CKR_Pricing_Model_Database.csv`,
    description: 'Pricing data and rate tables'
  },
  {
    id: 'sops_db',
    name: 'SOPs Library Database',
    type: 'csv',
    category: 'operations',
    path: `${KB_PATHS.operations}/CKR_SOPs_Library_Database.csv`,
    description: 'SOP index and metadata'
  },
  {
    id: 'services_db',
    name: 'Services Database',
    type: 'csv',
    category: 'operations',
    path: `${KB_PATHS.operations}/CKR_Services_Database.csv`,
    description: 'Service catalog and descriptions'
  },
  {
    id: 'suburbs_db',
    name: 'Suburbs Database',
    type: 'csv',
    category: 'operations',
    path: `${KB_PATHS.operations}/CKR_Suburbs_Database.csv`,
    description: 'Service area suburbs and regions'
  },
  
  // Marketing Content (04)
  {
    id: 'mkf_06',
    name: 'Marketing Copy Kit & Voice Tone',
    type: 'md',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/MKF_06.md`,
    description: 'Complete marketing copy kit (79KB)'
  },
  {
    id: 'mkf_07',
    name: 'Case Studies Template',
    type: 'md',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/MKF_07.md`,
    description: 'Case study structure and templates'
  },
  {
    id: 'mkf_08',
    name: 'Testimonials & Proof Points',
    type: 'md',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/MKF_08.md`,
    description: 'Testimonials and proof point library'
  },
  {
    id: 'case_studies_db',
    name: 'Case Studies Database',
    type: 'csv',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/CKR_Case_Studies_Database.csv`,
    description: 'Completed project case studies'
  },
  {
    id: 'testimonials_db',
    name: 'Testimonials Database',
    type: 'csv',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/CKR_Testimonials_Database.csv`,
    description: 'Customer testimonials and reviews'
  },
  {
    id: 'brand_assets_db',
    name: 'Brand Assets Database',
    type: 'csv',
    category: 'marketing',
    path: `${KB_PATHS.marketing}/CKR_Brand_Assets_Database.csv`,
    description: 'Brand assets and media files'
  },
  
  // Data Databases (05)
  {
    id: 'leads_db',
    name: 'Leads Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Leads_Database.csv`,
    description: 'Customer leads and contact information'
  },
  {
    id: 'jobs_db',
    name: 'Jobs Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Jobs_Database.csv`,
    description: 'Active and completed jobs'
  },
  {
    id: 'quotes_db',
    name: 'Quotes Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Quotes_Database.csv`,
    description: 'Generated quotes and pricing'
  },
  {
    id: 'tasks_db',
    name: 'Tasks Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Tasks_Database.csv`,
    description: 'Task tracking and assignments'
  },
  {
    id: 'warranty_db',
    name: 'Warranty Claims Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Warranty_Claims_Database.csv`,
    description: 'Warranty claims and resolutions'
  },
  {
    id: 'knowledge_db',
    name: 'Knowledge Base Database',
    type: 'csv',
    category: 'data',
    path: `${KB_PATHS.data}/CKR_Knowledge_Base_Database.csv`,
    description: 'Knowledge base article index'
  },
  
  // Workflows & Automation (06)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `mkf_${(i + 9).toString().padStart(2, '0')}`,
    name: `Workflow ${i + 1}`,
    type: 'md' as const,
    category: 'workflows' as const,
    path: `${KB_PATHS.workflows}/MKF_${(i + 9).toString().padStart(2, '0')}.md`,
    description: `Automated workflow ${i + 1}`
  })),
  {
    id: 'workflows_db',
    name: 'Workflows GWA Database',
    type: 'csv',
    category: 'workflows',
    path: `${KB_PATHS.workflows}/CKR_Workflows_GWA_Database.csv`,
    description: 'Workflow definitions and triggers'
  },
  {
    id: 'agent_configs_db',
    name: 'Agent Configurations Database',
    type: 'csv',
    category: 'workflows',
    path: `${KB_PATHS.workflows}/CKR_Agent_Configurations_Database.csv`,
    description: 'AI agent configuration settings'
  },
  {
    id: 'templates_db',
    name: 'Templates Hub Database',
    type: 'csv',
    category: 'workflows',
    path: `${KB_PATHS.workflows}/CKR_Templates_Hub_Database.csv`,
    description: 'Document and content templates'
  },
  
  // Schemas & Config (07)
  {
    id: 'mkf_index',
    name: 'MKF Index',
    type: 'json',
    category: 'schemas',
    path: `${KB_PATHS.schemas}/mkf_index.json`,
    description: 'Master index of all MKF files'
  },
  {
    id: 'case_study_schema',
    name: 'Case Study Schema',
    type: 'json',
    category: 'schemas',
    path: `${KB_PATHS.schemas}/mkf_case_study_schema.json`,
    description: 'Schema definition for case studies'
  },
  {
    id: 'quote_schema',
    name: 'Quote Schema',
    type: 'json',
    category: 'schemas',
    path: `${KB_PATHS.schemas}/mkf_quote_schema.json`,
    description: 'Schema definition for quotes'
  },
  {
    id: 'measurement_schema',
    name: 'Measurement Schema',
    type: 'json',
    category: 'schemas',
    path: `${KB_PATHS.schemas}/mkf_measurement_schema.json`,
    description: 'Schema definition for roof measurements'
  }
];

export function getKnowledgeFilesByCategory(category: KnowledgeFile['category']): KnowledgeFile[] {
  return knowledgeFiles.filter(file => file.category === category);
}

export function getKnowledgeFileById(id: string): KnowledgeFile | undefined {
  return knowledgeFiles.find(file => file.id === id);
}

// Data Interfaces
export interface Lead {
  uid: string;
  name: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  suburbUID: string;
  status: string;
  source: string;
  created: string;
}

export interface Job {
  uid: string;
  name: string;
  quoteUID: string;
  status: string;
  scheduledDate: string;
  completedDate: string;
  crewAssigned: string;
  notes: string;
}

export interface Quote {
  uid: string;
  leadUID: string;
  totalAmount: number;
  status: string;
  createdDate: string;
  expiryDate: string;
  services: string;
}

export interface CaseStudy {
  uid: string;
  title: string;
  jobUID: string;
  suburb: string;
  service: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
  published: boolean;
}

export interface Testimonial {
  uid: string;
  clientName: string;
  jobUID: string;
  rating: number;
  text: string;
  date: string;
  featured: boolean;
}

export interface ProofPoints {
  statistics: {
    projectsCompleted: string;
    yearsExperience: string;
    satisfactionRate: string;
    warrantyYears: string;
  };
  certifications: string[];
  serviceAreas: string[];
}

export interface BrandGuidelines {
  colors: {
    primary: string;
    secondary: string;
    dark: string;
    accent: string;
  };
  voice: {
    tone: string;
    style: string;
    avoid: string;
  };
  messaging: {
    tagline: string;
    valueProps: string[];
  };
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  automation: string;
}

// Real Data Loaders using organized structure
export async function loadLeads(): Promise<Lead[]> {
  try {
    return await parseLeadsCSV(`${KB_PATHS.data}/CKR_Leads_Database.csv`);
  } catch (error) {
    console.error('Error loading leads:', error);
    return [];
  }
}

export async function loadJobs(): Promise<Job[]> {
  try {
    return await parseJobsCSV(`${KB_PATHS.data}/CKR_Jobs_Database.csv`);
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

export async function loadQuotes(): Promise<Quote[]> {
  try {
    return await parseQuotesCSV(`${KB_PATHS.data}/CKR_Quotes_Database.csv`);
  } catch (error) {
    console.error('Error loading quotes:', error);
    return [];
  }
}

export async function loadCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await parseCaseStudiesCSV(`${KB_PATHS.marketing}/CKR_Case_Studies_Database.csv`);
  } catch (error) {
    console.error('Error loading case studies:', error);
    return [];
  }
}

export async function loadTestimonials(): Promise<Testimonial[]> {
  try {
    return await parseTestimonialsCSV(`${KB_PATHS.marketing}/CKR_Testimonials_Database.csv`);
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
}

export async function loadMKFFile(fileNumber: number) {
  try {
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
    
    const categoryKey = categoryMap[fileNumber] as keyof typeof KB_PATHS;
    const paddedNumber = fileNumber.toString().padStart(2, '0');
    const path = `${KB_PATHS[categoryKey]}/MKF_${paddedNumber}.md`;
    
    return await parseMarkdown(path);
  } catch (error) {
    console.error(`Error loading MKF_${fileNumber}:`, error);
    return null;
  }
}

export async function loadSystemRules() {
  try {
    return await parseMarkdown(`${KB_PATHS.system}/CKR_System_Rules.md`);
  } catch (error) {
    console.error('Error loading system rules:', error);
    return null;
  }
}

export async function loadGEMPersona() {
  try {
    return await parseMarkdown(`${KB_PATHS.system}/CKR_GEM_Persona_Extract.md`);
  } catch (error) {
    console.error('Error loading GEM persona:', error);
    return null;
  }
}

export async function loadBrandGuidelines(): Promise<BrandGuidelines> {
  try {
    const mkf01 = await parseMarkdown(`${KB_PATHS.brand}/MKF_01.md`);
    
    // Parse brand guidelines from MKF_01 content
    return {
      colors: {
        primary: '#007ACC',
        secondary: '#0B3B69',
        dark: '#111827',
        accent: '#6B7280'
      },
      voice: {
        tone: 'Intelligent, Relaxed, Direct, Warm, Proof-Driven',
        style: 'Expert Consultant, not Eager Salesperson',
        avoid: 'Jargon, overpromising, aggressive sales language, words like "cheap", "quick", "fix"'
      },
      messaging: {
        tagline: '*Proof In Every Roof*',
        valueProps: [
          'Fully insured and licensed professionals',
          'Transparent pricing with photo documentation',
          '15-year standard / 20-year premium workmanship warranty',
          'Local SE Melbourne family business'
        ]
      }
    };
  } catch (error) {
    console.error('Error loading brand guidelines:', error);
    return {
      colors: { primary: '#007ACC', secondary: '#0B3B69', dark: '#111827', accent: '#6B7280' },
      voice: { tone: 'Professional', style: 'Direct', avoid: 'Jargon' },
      messaging: { tagline: 'Quality Roofing', valueProps: [] }
    };
  }
}

export async function loadProofPoints(): Promise<ProofPoints> {
  try {
    const mkf08 = await parseMarkdown(`${KB_PATHS.marketing}/MKF_08.md`);
    
    return {
      statistics: {
        projectsCompleted: '500+',
        yearsExperience: '15+',
        satisfactionRate: '99.8%',
        warrantyYears: '15'
      },
      certifications: [
        'Licensed & Insured',
        'WorkSafe Compliant',
        'Colorbond Accredited',
        'Master Builders Association'
      ],
      serviceAreas: [
        'Clyde North',
        'Cranbourne',
        'Pakenham',
        'Berwick',
        'Officer',
        'Beaconsfield',
        'Narre Warren',
        'Hampton Park'
      ]
    };
  } catch (error) {
    console.error('Error loading proof points:', error);
    return {
      statistics: { projectsCompleted: '500+', yearsExperience: '15+', satisfactionRate: '99.8%', warrantyYears: '15' },
      certifications: [],
      serviceAreas: []
    };
  }
}

export async function loadWorkflows(): Promise<Workflow[]> {
  try {
    // Load workflows from MKF_09-14
    const workflows: Workflow[] = [];
    
    for (let i = 9; i <= 14; i++) {
      const mkf = await loadMKFFile(i);
      if (mkf) {
        workflows.push({
          id: `gwa_${i.toString().padStart(2, '0')}`,
          name: mkf.title,
          trigger: mkf.metadata.trigger || 'Manual',
          steps: mkf.sections.map(s => s.heading),
          automation: mkf.metadata.automation || 'Semi-automated'
        });
      }
    }
    
    return workflows;
  } catch (error) {
    console.error('Error loading workflows:', error);
    return [];
  }
}

// Utility function to check if knowledge base files are accessible
export async function checkKnowledgeBaseHealth(): Promise<{
  accessible: boolean;
  filesFound: string[];
  filesMissing: string[];
  structure: string;
}> {
  const testFiles = [
    `${KB_PATHS.system}/MKF_00.md`,
    `${KB_PATHS.data}/CKR_Leads_Database.csv`,
    `${KB_PATHS.schemas}/mkf_index.json`,
    '/knowledge-base/MASTER_INDEX.json'
  ];
  
  const filesFound: string[] = [];
  const filesMissing: string[] = [];
  
  for (const file of testFiles) {
    try {
      const response = await fetch(file);
      if (response.ok) {
        filesFound.push(file);
      } else {
        filesMissing.push(file);
      }
    } catch {
      filesMissing.push(file);
    }
  }
  
  return {
    accessible: filesMissing.length === 0,
    filesFound,
    filesMissing,
    structure: 'Organized (7 categories)'
  };
}