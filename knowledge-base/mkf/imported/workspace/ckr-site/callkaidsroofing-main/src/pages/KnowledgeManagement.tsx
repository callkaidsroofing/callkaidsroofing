import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Save, History, Database } from 'lucide-react';
import { toast } from 'sonner';
import { logKnowledgeAccess } from '@/lib/audit';

export default function KnowledgeManagement() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch all knowledge files
  const { data: knowledgeFiles, isLoading } = useQuery({
    queryKey: ['knowledge-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_files' as any)
        .select('*')
        .order('priority', { ascending: false });
      if (error) throw error;
      return data as any;
    }
  });

  // Fetch assignments
  const { data: assignments } = useQuery({
    queryKey: ['knowledge-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_assignments' as any)
        .select(`
          *,
          knowledge_files (file_key, file_name)
        `)
        .order('function_name');
      if (error) throw error;
      return data as any;
    }
  });

  // Update file mutation
  const updateFile = useMutation({
    mutationFn: async ({ id, content }: any) => {
      const { error } = await supabase
        .from('knowledge_files' as any)
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      
      // Log the update
      await logKnowledgeAccess(selectedFile?.file_key, 'edit');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-files'] });
      toast.success('Knowledge file updated successfully');
      setSelectedFile(null);
      setEditedContent('');
    },
    onError: (error: any) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const handleSelectFile = (file: any) => {
    setSelectedFile(file);
    setEditedContent(file.content);
    logKnowledgeAccess(file.file_key, 'view');
  };

  const groupedAssignments = assignments?.reduce((acc: any, a: any) => {
    if (!acc[a.function_name]) acc[a.function_name] = [];
    acc[a.function_name].push(a);
    return acc;
  }, {}) || {};

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">MKF Knowledge Management</h1>
        <p className="text-muted-foreground mt-2">
          Master Knowledge Framework - Single source of truth for all AI systems
        </p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6">
          <TabsTrigger value="files">Knowledge Files</TabsTrigger>
          <TabsTrigger value="assignments">Function Assignments</TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* File List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">MKF Files ({knowledgeFiles?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  knowledgeFiles?.map((file) => (
                    <Button
                      key={file.id}
                      variant={selectedFile?.id === file.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => handleSelectFile(file)}
                    >
                      <FileText className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{file.file_key}</span>
                      <Badge variant="secondary" className="ml-auto shrink-0">
                        v{file.version}
                      </Badge>
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* File Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  {selectedFile ? (
                    <>
                      <span className="truncate">{selectedFile.file_key}: {selectedFile.file_name}</span>
                      <Badge>{selectedFile.file_type}</Badge>
                      <Badge variant="outline">{selectedFile.category}</Badge>
                    </>
                  ) : (
                    'Select a file to edit'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedFile.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="mt-2 font-mono text-xs min-h-[400px]"
                        placeholder="MKF content..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => updateFile.mutate({
                          id: selectedFile.id,
                          content: editedContent
                        })}
                        disabled={updateFile.isPending || editedContent === selectedFile.content}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateFile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          setEditedContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground pt-4 border-t">
                      <p>Priority: {selectedFile.priority} | Version: {selectedFile.version}</p>
                      <p>Updated: {new Date(selectedFile.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a knowledge file from the list to view and edit
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Function → Knowledge File Assignments</CardTitle>
              <p className="text-sm text-muted-foreground">
                Shows which AI functions use which MKF files
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(groupedAssignments).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No assignments configured yet
                  </p>
                ) : (
                  Object.entries(groupedAssignments).map(([functionName, assigns]: [string, any]) => (
                    <div key={functionName} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-sm">{functionName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {assigns
                          .sort((a: any, b: any) => a.load_order - b.load_order)
                          .map((a: any) => (
                            <Badge key={a.id} variant="secondary">
                              {a.knowledge_files.file_key}
                              <span className="ml-1 text-xs opacity-70">#{a.load_order}</span>
                            </Badge>
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
