import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Phase {
  number: number;
  name: string;
  description: string;
  status: 'complete' | 'in-progress' | 'pending';
  tasks: string[];
}

const PHASES: Phase[] = [
  {
    number: 1,
    name: 'Database Schema & RLS',
    description: 'Set up knowledge_chunks table with pgvector and Row-Level Security',
    status: 'complete',
    tasks: [
      'Created knowledge_chunks table with vector(768) column',
      'Added indexes for vector similarity search',
      'Configured RLS policies for admin access',
      'Set up created_at/updated_at triggers',
    ],
  },
  {
    number: 2,
    name: 'Edge Functions',
    description: 'Deploy embedding and RAG search functions',
    status: 'complete',
    tasks: [
      'embed-knowledge-base: Chunk & embed documents via Lovable AI',
      'rag-search: Semantic search with configurable threshold',
      'chat-with-rag: Context-aware AI responses',
    ],
  },
  {
    number: 3,
    name: 'Master Knowledge Framework (MKF)',
    description: 'Organize source documents and create index manifest',
    status: 'complete',
    tasks: [
      'Created knowledge-base/mkf/source/ directory structure',
      'Built MASTER_INDEX.json with 26 documents',
      'Organized files by category (System, Brand, Ops, Workflows, etc.)',
    ],
  },
  {
    number: 4,
    name: 'Knowledge Base Population',
    description: 'Load and embed all MKF documents into vector database',
    status: 'in-progress',
    tasks: [
      'Extract 43 .md files from CKR_MKF_v1_0-2.zip',
      'Run embedding script to create ~150-300 chunks',
      'Verify vector search returns relevant results',
    ],
  },
  {
    number: 5,
    name: 'Application Integration',
    description: 'Build AI assistant UI with RAG-powered responses',
    status: 'pending',
    tasks: [
      'Create chat interface component',
      'Implement streaming responses',
      'Add context display for retrieved chunks',
      'Deploy to production',
    ],
  },
];

export function PhaseTracker() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Implementation Progress</h3>
      <div className="space-y-6">
        {PHASES.map((phase) => (
          <div key={phase.number} className="flex gap-4">
            <div className="flex flex-col items-center">
              {phase.status === 'complete' ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              ) : phase.status === 'in-progress' ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                  <Circle className="h-5 w-5 text-muted-foreground/30" />
                </div>
              )}
              {phase.number < PHASES.length && (
                <div className="h-full w-px bg-border my-2" />
              )}
            </div>
            
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">
                  Phase {phase.number}: {phase.name}
                </h4>
                <Badge 
                  variant={
                    phase.status === 'complete' 
                      ? 'default' 
                      : phase.status === 'in-progress' 
                      ? 'secondary' 
                      : 'outline'
                  }
                >
                  {phase.status === 'complete' 
                    ? 'Complete' 
                    : phase.status === 'in-progress' 
                    ? 'In Progress' 
                    : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {phase.description}
              </p>
              <ul className="space-y-1 text-sm">
                {phase.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
