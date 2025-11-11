import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Edit, Trash2, Eye, Search, Sparkles, Loader2, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/audit';
import { PremiumPageHeader } from '@/components/admin/PremiumPageHeader';
import { SmartContentSuggestions } from '@/components/admin/SmartContentSuggestions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Suburb = {
  id: string;
  name: string;
  slug: string;
  postcode?: string;
  region?: string;
  description?: string;
  local_seo_content?: string;
  meta_title?: string;
  meta_description?: string;
  services_available?: string[];
  created_at: string;
  updated_at: string;
}

export default function Suburbs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSuburb, setSelectedSuburb] = useState<Suburb | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [migrationPreview, setMigrationPreview] = useState<any>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    postcode: '',
    region: '',
    description: '',
    local_seo_content: '',
    meta_title: '',
    meta_description: '',
    services_available: '',
  });

  const { data: suburbs, isLoading } = useQuery({
    queryKey: ['admin-suburbs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_suburbs')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Suburb[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Suburb>) => {
      if (!data.name || !data.slug) {
        throw new Error('Name and slug are required');
      }

      const payload = {
        name: data.name,
        slug: data.slug,
        services_available: data.services_available || [],
        postcode: data.postcode,
        region: data.region,
        description: data.description,
        local_seo_content: data.local_seo_content,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        updated_at: new Date().toISOString(),
      };

      if (selectedSuburb) {
        const { error } = await supabase
          .from('content_suburbs')
          .update(payload)
          .eq('id', selectedSuburb.id);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_edit',
          action: 'update',
          resource_type: 'suburb',
          resource_id: selectedSuburb.id,
          details: { name: data.name },
        });
      } else {
        const { error } = await supabase
          .from('content_suburbs')
          .insert([payload]);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_create',
          action: 'create',
          resource_type: 'suburb',
          details: { name: data.name },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suburbs'] });
      toast({
        title: selectedSuburb ? 'Suburb updated' : 'Suburb created',
        description: `${formData.name} has been saved successfully.`,
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_suburbs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await logAudit({
        event_type: 'content_delete',
        action: 'delete',
        resource_type: 'suburb',
        resource_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suburbs'] });
      setSelectedSuburb(null);
      toast({
        title: 'Suburb deleted',
        description: 'The suburb has been removed.',
      });
    },
  });

  const handleSelectSuburb = (suburb: Suburb) => {
    setSelectedSuburb(suburb);
    setFormData({
      name: suburb.name,
      slug: suburb.slug,
      postcode: suburb.postcode || '',
      region: suburb.region || '',
      description: suburb.description || '',
      local_seo_content: suburb.local_seo_content || '',
      meta_title: suburb.meta_title || '',
      meta_description: suburb.meta_description || '',
      services_available: suburb.services_available?.join(', ') || '',
    });
    setIsEditing(false);
  };

  const handleMigrationPreview = async () => {
    setIsMigrating(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-suburb-pages', {
        body: { dryRun: true }
      });

      if (error) throw error;

      setMigrationPreview(data);
      setShowMigrationDialog(true);
    } catch (error: any) {
      toast({
        title: 'Preview Failed',
        description: error.message || 'Failed to preview migration',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrationExecute = async () => {
    setIsMigrating(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-suburb-pages', {
        body: { dryRun: false }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Migration Complete!',
          description: `Successfully migrated ${data.results.migrated} suburb pages. ${data.results.skipped} already existed.`,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-suburbs'] });
        setShowMigrationDialog(false);
        setMigrationPreview(null);
      } else {
        throw new Error('Migration failed');
      }
    } catch (error: any) {
      toast({
        title: 'Migration Failed',
        description: error.message || 'Failed to migrate suburb pages',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Suburb name is required to generate content',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const services = formData.services_available.split(',').map(s => s.trim()).filter(Boolean);
      
      const { data, error } = await supabase.functions.invoke('generate-suburb-content', {
        body: {
          suburbName: formData.name,
          postcode: formData.postcode,
          region: formData.region,
          services: services.length > 0 ? services : ['Roof Restoration', 'Roof Repairs', 'Roof Cleaning', 'Roof Painting']
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Update form with generated content
      setFormData({
        ...formData,
        meta_title: data.content.meta_title,
        meta_description: data.content.meta_description,
        description: data.content.description,
        local_seo_content: data.content.local_seo_content,
      });

      toast({
        title: 'Content Generated!',
        description: 'AI-powered SEO content has been created. Review and save when ready.',
      });
    } catch (error: any) {
      console.error('Content generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: 'Validation Error',
        description: 'Name and slug are required',
        variant: 'destructive',
      });
      return;
    }

    const services_available = formData.services_available.split(',').map(s => s.trim()).filter(Boolean);
    
    saveMutation.mutate({
      name: formData.name,
      slug: formData.slug,
      postcode: formData.postcode,
      region: formData.region,
      description: formData.description,
      local_seo_content: formData.local_seo_content,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      services_available,
    });
  };

  const filteredSuburbs = suburbs?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.postcode?.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Migration Dialog */}
      <AlertDialog open={showMigrationDialog} onOpenChange={setShowMigrationDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import Hardcoded Suburb Pages
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will import {migrationPreview?.results?.total || 0} high-quality suburb pages from your codebase into the CMS database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {migrationPreview && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-primary">{migrationPreview.results.migrated}</div>
                    <div className="text-sm text-muted-foreground">Will Import</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-muted-foreground">{migrationPreview.results.skipped}</div>
                    <div className="text-sm text-muted-foreground">Already Exist</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-destructive">{migrationPreview.results.errors.length}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Pages to Import:</h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {migrationPreview.results.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded text-sm">
                      <span className="font-medium">{detail.suburb}</span>
                      <Badge variant={detail.status === 'would_migrate' ? 'default' : 'secondary'}>
                        {detail.status === 'would_migrate' ? 'Ready to import' : 'Already exists'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {migrationPreview.results.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-destructive">Errors:</h4>
                  <div className="space-y-1">
                    {migrationPreview.results.errors.map((err: any, idx: number) => (
                      <div key={idx} className="p-2 border border-destructive/50 rounded text-sm">
                        <span className="font-medium">{err.suburb}:</span> {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMigrating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMigrationExecute}
              disabled={isMigrating || migrationPreview?.results?.migrated === 0}
              className="bg-primary"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                `Import ${migrationPreview?.results?.migrated || 0} Pages`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PremiumPageHeader
        icon={MapPin}
        title="Suburbs Management"
        description="Local SEO optimization and suburb-specific content"
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={handleMigrationPreview}
              disabled={isMigrating}
              variant="outline"
              className="gap-2"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Import Pages
                </>
              )}
            </Button>
            <Button 
              onClick={() => {
                setSelectedSuburb(null);
                setFormData({
                  name: '',
                  slug: '',
                  postcode: '',
                  region: '',
                  description: '',
                  local_seo_content: '',
                  meta_title: '',
                  meta_description: '',
                  services_available: '',
                });
                setIsEditing(true);
              }}
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
            >
              <Plus className="h-4 w-4" />
              New Suburb
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 glass-card border-primary/10 hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>All Suburbs ({filteredSuburbs.length})</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suburbs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredSuburbs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No suburbs found</div>
            ) : (
              filteredSuburbs.map((suburb) => (
                <div
                  key={suburb.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSuburb?.id === suburb.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelectSuburb(suburb)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{suburb.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suburb.postcode} • {suburb.region}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedSuburb || isEditing ? (
            <Tabs defaultValue="content">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {isEditing ? (selectedSuburb ? 'Edit' : 'New') : ''} {formData.name || 'Suburb Page'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedSuburb && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={`/suburbs/${selectedSuburb.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Live
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="content" className="space-y-4 mt-0">
                  {/* AI Content Generator */}
                  {isEditing && formData.name && (
                    <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold">AI Content Generator</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Generate SEO-optimized content for {formData.name} using RAG-powered AI. 
                              Includes meta tags, descriptions, and local SEO content aligned with CKR brand guidelines.
                            </p>
                            <Button 
                              onClick={handleGenerateContent} 
                              disabled={isGenerating}
                              className="gap-2"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Generating Content...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Generate Page Content
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Suburb Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="local_seo_content">Local SEO Content</Label>
                    <Textarea
                      id="local_seo_content"
                      value={formData.local_seo_content}
                      onChange={(e) => setFormData({ ...formData, local_seo_content: e.target.value })}
                      disabled={!isEditing}
                      rows={8}
                      placeholder="Enter suburb-specific content, including services, local landmarks, and relevant information..."
                    />
                  </div>

                  {/* AI Content Suggestions */}
                  {formData.name && isEditing && (
                    <SmartContentSuggestions
                      context={`${formData.name} ${formData.region} ${formData.description} roofing services`}
                      excludeTypes={['content_suburbs']}
                      title="Relevant Case Studies & Services"
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="services_available">Available Services (comma separated)</Label>
                    <Input
                      id="services_available"
                      value={formData.services_available}
                      onChange={(e) => setFormData({ ...formData, services_available: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Roof Restoration, Repairs, Cleaning"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      {selectedSuburb && (
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(selectedSuburb.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => {
                            setIsEditing(false);
                            if (selectedSuburb) {
                              handleSelectSuburb(selectedSuburb);
                            } else {
                              setSelectedSuburb(null);
                            }
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={saveMutation.isPending}>
                            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      disabled={!isEditing}
                      maxLength={60}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.meta_title.length}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.meta_description.length}/160 characters
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    {isEditing ? (
                      <>
                        <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Save SEO Settings</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit SEO
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No suburb selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a suburb from the list or create a new one
              </p>
              <Button onClick={() => {
                setSelectedSuburb(null);
                setFormData({
                  name: '',
                  slug: '',
                  postcode: '',
                  region: '',
                  description: '',
                  local_seo_content: '',
                  meta_title: '',
                  meta_description: '',
                  services_available: '',
                });
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Suburb Page
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
