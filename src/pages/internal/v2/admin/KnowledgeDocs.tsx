import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { RefreshCw, Database, FileText, Package } from 'lucide-react';
import { format } from 'date-fns';

interface KnowledgeDoc {
  id: string;
  source_table: string;
  source_id: string;
  title: string;
  embedding: any;
  metadata: {
    category?: string;
    roles?: string[];
    parent_doc?: string;
    chunk_index?: number;
    total_chunks?: number;
  };
  created_at: string;
  updated_at: string;
}

interface EmbeddingStats {
  source_table: string;
  total: number;
  embedded: number;
  percentage: number;
}

export default function KnowledgeDocs() {
  const queryClient = useQueryClient();
  const [reEmbedding, setReEmbedding] = useState<string | null>(null);

  // Fetch all knowledge documents using RPC
  const { data: knowledgeDocs, isLoading: docsLoading } = useQuery({
    queryKey: ['knowledge-docs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_knowledge_docs' as any);
      if (error) throw error;
      return data as KnowledgeDoc[];
    },
  });

  // Fetch embedding statistics using RPC
  const { data: embeddingStats, isLoading: statsLoading } = useQuery({
    queryKey: ['embedding-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_embedding_stats' as any);
      if (error) throw error;
      return data as EmbeddingStats[];
    },
  });

  // Re-embed mutation
  const reEmbedMutation = useMutation({
    mutationFn: async (table: string) => {
      const { data, error } = await supabase.functions.invoke('rag-indexer', {
        body: { tables: [table] },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, table) => {
      toast.success(`Re-embedded ${table} successfully`);
      queryClient.invalidateQueries({ queryKey: ['embedding-stats'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-docs'] });
      setReEmbedding(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to re-embed: ${error.message}`);
      setReEmbedding(null);
    },
  });

  // Group knowledge docs by parent_doc
  const groupedDocs = knowledgeDocs?.reduce((acc: Record<string, KnowledgeDoc[]>, doc) => {
    const parent = doc.metadata.parent_doc || doc.source_id;
    if (!acc[parent]) acc[parent] = [];
    acc[parent].push(doc);
    return acc;
  }, {});

  const handleReEmbed = (table: string) => {
    setReEmbedding(table);
    reEmbedMutation.mutate(table);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage knowledge documents and monitor RAG embedding status
          </p>
        </div>
      </div>

      {/* Knowledge Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Knowledge Documents</CardTitle>
          </div>
          <CardDescription>
            Core operational knowledge: Brand guides, workflows, policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {docsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
          ) : !groupedDocs || Object.keys(groupedDocs).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No knowledge documents found. Use the embed-knowledge-docs function to add documents.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedDocs).map(([parentId, docs]) => {
                const mainDoc = docs[0];
                return (
                  <div key={parentId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{mainDoc.title.replace(/ \(part \d+\/\d+\)/, '')}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{mainDoc.metadata.category}</Badge>
                          {docs.length > 1 && (
                            <Badge variant="outline">{docs.length} chunks</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated {format(new Date(mainDoc.updated_at), 'dd MMM yyyy')}
                      </div>
                    </div>
                    {mainDoc.metadata.roles && (
                      <div className="flex gap-1 mt-2">
                        {mainDoc.metadata.roles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embedding Status Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Embedding Status Dashboard</CardTitle>
          </div>
          <CardDescription>
            Monitor RAG embedding coverage across all content tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading stats...</div>
          ) : !embeddingStats || embeddingStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No embedding data found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content Type</TableHead>
                  <TableHead className="text-center">Total Records</TableHead>
                  <TableHead className="text-center">Embedded</TableHead>
                  <TableHead className="w-[200px]">Coverage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {embeddingStats.map((stat) => (
                  <TableRow key={stat.source_table}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {stat.source_table.replace(/_/g, ' ')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{stat.total}</TableCell>
                    <TableCell className="text-center">
                      {stat.embedded === stat.total ? (
                        <span className="text-green-600">✓ {stat.embedded}</span>
                      ) : (
                        <span className="text-orange-600">{stat.embedded}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={stat.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          {stat.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reEmbedding === stat.source_table}
                        onClick={() => handleReEmbed(stat.source_table)}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${reEmbedding === stat.source_table ? 'animate-spin' : ''}`} />
                        Re-Embed
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
