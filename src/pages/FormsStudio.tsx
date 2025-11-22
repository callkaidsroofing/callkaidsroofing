import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FormInput, Eye, Save, CheckCircle, Sparkles, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistantPanel } from '@/components/shared/AIAssistantPanel';
import { FormPolishDialog } from '@/components/FormPolishDialog';

interface FormDefinition {
  id: string;
  name: string;
  description: string;
  version: number;
  schema: any;
  ui_schema: any;
  outputs: string[];
  roles: string[];
  is_published: boolean;
  created_at: string;
}

export default function FormsStudio() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSchema, setFormSchema] = useState('');
  const [showPolishDialog, setShowPolishDialog] = useState(false);
  const [formToPublish, setFormToPublish] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const { data, error } = await supabase
        .from('form_definitions' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setForms((data || []) as any as FormDefinition[]);
    } catch (error) {
      console.error('Error loading forms:', error);
      toast.error('Failed to load forms');
    }
  };

  const handleCreateForm = () => {
    setIsEditing(true);
    setSelectedForm(null);
    setFormName('');
    setFormDescription('');
    setFormSchema(JSON.stringify({
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        email: { type: 'string', format: 'email', title: 'Email' }
      },
      required: ['name', 'email']
    }, null, 2));
  };

  const handleSaveForm = async () => {
    try {
      if (!formName.trim()) {
        toast.error('Form name is required');
        return;
      }

      let parsedSchema;
      try {
        parsedSchema = JSON.parse(formSchema);
      } catch {
        toast.error('Invalid JSON schema');
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to save forms');
        return;
      }

      const formData = {
        name: formName,
        description: formDescription,
        schema: parsedSchema,
        ui_schema: {},
        outputs: ['html', 'crm'],
        roles: ['admin', 'inspector'],
        is_published: false,
        version: selectedForm ? selectedForm.version + 1 : 1,
        ...(!selectedForm && { created_by: user.id }) // Only include created_by for new forms
      };

      let result;

      if (selectedForm) {
        const { data, error } = await supabase
          .from('form_definitions' as any)
          .update(formData)
          .eq('id', selectedForm.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        result = data;
      } else {
        const { data, error } = await supabase
          .from('form_definitions' as any)
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        result = data;
      }

      toast.success(selectedForm ? 'Form updated' : 'Form created');
      setIsEditing(false);
      setSelectedForm(result);
      loadForms();
    } catch (error: any) {
      console.error('Error saving form:', error);
      toast.error(`Failed to save form: ${error.message || 'Unknown error'}`);
    }
  };

  const handleInitiatePublish = (formId: string) => {
    setFormToPublish(formId);
    setShowPolishDialog(true);
  };

  const handlePublishForm = async () => {
    if (!formToPublish) return;
    
    try {
      const { error } = await supabase
        .from('form_definitions' as any)
        .update({ is_published: true } as any)
        .eq('id', formToPublish);

      if (error) throw error;

      toast.success('Form published successfully');
      loadForms();
      if (selectedForm?.id === formToPublish) {
        setSelectedForm({ ...selectedForm, is_published: true });
      }
      setFormToPublish(null);
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Failed to publish form');
    }
  };

  const handleApplyOptimization = (optimizedSchema: any) => {
    setFormSchema(JSON.stringify(optimizedSchema, null, 2));
    setIsEditing(true);
    toast.info('Optimized schema applied. Review and save when ready.');
  };

  const handleSelectForm = (form: FormDefinition) => {
    setSelectedForm(form);
    setIsEditing(false);
    setFormName(form.name);
    setFormDescription(form.description || '');
    setFormSchema(JSON.stringify(form.schema, null, 2));
  };

  const handleAIGenerate = (generatedData: any) => {
    if (generatedData.name) setFormName(generatedData.name);
    if (generatedData.description) setFormDescription(generatedData.description);
    if (generatedData.schema) {
      setFormSchema(JSON.stringify(generatedData.schema, null, 2));
    }
    toast.success('AI-generated form applied! Review and save when ready.');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Forms Studio</h1>
          <p className="text-muted-foreground">Build and manage custom forms</p>
        </div>
        <Button onClick={handleCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <Card className="lg:col-span-1 h-fit max-h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="text-base">Forms</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => handleSelectForm(form)}
                    className={`p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      selectedForm?.id === form.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FormInput className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{form.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">v{form.version}</Badge>
                          {form.is_published && (
                            <Badge className="text-xs bg-green-600">Published</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Form Builder/Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isEditing ? (selectedForm ? 'Edit Form' : 'New Form') : selectedForm?.name || 'Select a form'}
                </CardTitle>
                {selectedForm && !isEditing && (
                  <CardDescription>
                    Version {selectedForm.version} • {selectedForm.is_published ? 'Published' : 'Draft'}
                  </CardDescription>
                )}
              </div>
              {selectedForm && !isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {selectedForm.is_published && (
                    <Button variant="outline" size="sm" onClick={() => window.open(`/forms/${selectedForm.id}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/settings/forms/${selectedForm.id}/submissions`)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Submissions
                  </Button>
                  {!selectedForm.is_published && (
                    <Button size="sm" onClick={() => handleInitiatePublish(selectedForm.id)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Polish & Publish
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="editor">Form Editor</TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Builder
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
            {isEditing ? (
              <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                <div>
                  <label className="text-sm font-medium">Form Name</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Contact Form, Inspection Request..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of this form..."
                  />
                </div>
                 <div>
                   <label className="text-sm font-medium">JSON Schema</label>
                   <Textarea
                     value={formSchema}
                     onChange={(e) => setFormSchema(e.target.value)}
                     placeholder='{"type": "object", "properties": {...}}'
                     rows={15}
                     className="font-mono text-sm"
                   />
                   <p className="text-xs text-muted-foreground mt-1">
                     Define form fields using JSON Schema format
                   </p>
                 </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveForm}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Form
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    if (!selectedForm) setSelectedForm(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selectedForm ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedForm.description || 'No description provided'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Schema</h3>
                    <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                      {JSON.stringify(selectedForm.schema, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Output Formats</h3>
                    <div className="flex gap-2">
                      {selectedForm.outputs.map((output, idx) => (
                        <Badge key={idx} variant="secondary">{output}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Access Roles</h3>
                    <div className="flex gap-2">
                      {selectedForm.roles.map((role, idx) => (
                        <Badge key={idx} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FormInput className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a form to view or create a new one</p>
              </div>
            )}
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                <div className="h-[calc(100vh-400px)]">
                  <AIAssistantPanel
                    functionName="forms-builder-assistant"
                    onGenerate={handleAIGenerate}
                    placeholder="Describe the form you want to create..."
                    title="Form Builder AI"
                    examples={[
                      "Create a warranty claim form with customer details and photo upload",
                      "Build a customer satisfaction survey with rating scales",
                      "Generate a job completion checklist form",
                    ]}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedForm && (
        <FormPolishDialog
          open={showPolishDialog}
          onOpenChange={setShowPolishDialog}
          formId={selectedForm.id}
          formName={selectedForm.name}
          formDescription={selectedForm.description || ''}
          formSchema={selectedForm.schema}
          onPublish={handlePublishForm}
          onApplyOptimization={handleApplyOptimization}
        />
      )}
    </div>
  );
}
