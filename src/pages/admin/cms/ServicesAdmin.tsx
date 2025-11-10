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
import { Wrench, Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/audit';
import { PremiumPageHeader } from '@/components/admin/PremiumPageHeader';

type Service = {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  icon?: string;
  service_category?: string;
  service_tags?: string[];
  features?: string[];
  display_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export default function ServicesAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    meta_title: '',
    meta_description: '',
    image_url: '',
    icon: '',
    service_category: '',
    service_tags: '',
    features: '',
    display_order: 0,
    featured: false,
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_services')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as Service[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Service>) => {
      if (!data.name || !data.slug) {
        throw new Error('Name and slug are required');
      }

      const payload = {
        name: data.name,
        slug: data.slug,
        service_tags: data.service_tags || [],
        features: data.features || [],
        short_description: data.short_description,
        full_description: data.full_description,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        image_url: data.image_url,
        icon: data.icon,
        service_category: data.service_category,
        display_order: data.display_order || 0,
        featured: data.featured || false,
        updated_at: new Date().toISOString(),
      };

      if (selectedService) {
        const { error } = await supabase
          .from('content_services')
          .update(payload)
          .eq('id', selectedService.id);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_edit',
          action: 'update',
          resource_type: 'service',
          resource_id: selectedService.id,
          details: { name: data.name },
        });
      } else {
        const { error } = await supabase
          .from('content_services')
          .insert([payload]);
        
        if (error) throw error;
        
        await logAudit({
          event_type: 'content_create',
          action: 'create',
          resource_type: 'service',
          details: { name: data.name },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({
        title: selectedService ? 'Service updated' : 'Service created',
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
        .from('content_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await logAudit({
        event_type: 'content_delete',
        action: 'delete',
        resource_type: 'service',
        resource_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setSelectedService(null);
      toast({
        title: 'Service deleted',
        description: 'The service has been removed.',
      });
    },
  });

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      image_url: service.image_url || '',
      icon: service.icon || '',
      service_category: service.service_category || '',
      service_tags: service.service_tags?.join(', ') || '',
      features: service.features?.join('\n') || '',
      display_order: service.display_order,
      featured: service.featured,
    });
    setIsEditing(false);
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

    const service_tags = formData.service_tags.split(',').map(t => t.trim()).filter(Boolean);
    const features = formData.features.split('\n').map(f => f.trim()).filter(Boolean);
    
    saveMutation.mutate({
      name: formData.name,
      slug: formData.slug,
      short_description: formData.short_description,
      full_description: formData.full_description,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      image_url: formData.image_url,
      icon: formData.icon,
      service_category: formData.service_category,
      service_tags,
      features,
      display_order: formData.display_order,
      featured: formData.featured,
    });
  };

  const filteredServices = services?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service_category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PremiumPageHeader
        icon={Wrench}
        title="Services Management"
        description="Manage service offerings, descriptions, and SEO metadata"
        actions={
          <Button 
            onClick={() => {
              setSelectedService(null);
              setFormData({
                name: '',
                slug: '',
                short_description: '',
                full_description: '',
                meta_title: '',
                meta_description: '',
                image_url: '',
                icon: '',
                service_category: '',
                service_tags: '',
                features: '',
                display_order: (services?.length || 0) + 1,
                featured: false,
              });
              setIsEditing(true);
            }}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New Service
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 glass-card border-primary/10 hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>All Services ({filteredServices.length})</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No services found</div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedService?.id === service.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{service.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {service.service_category || 'Uncategorized'}
                      </div>
                    </div>
                    {service.featured && (
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0" variant="secondary">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedService || isEditing ? (
            <Tabs defaultValue="content">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {isEditing ? (selectedService ? 'Edit' : 'New') : ''} {formData.name || 'Service'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedService && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={`/services/${selectedService.slug}`} target="_blank" rel="noopener noreferrer">
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name</Label>
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
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="service_category">Category</Label>
                      <Input
                        id="service_category"
                        value={formData.service_category}
                        onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        disabled={!isEditing}
                        placeholder="lucide-icon-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_description">Full Description</Label>
                    <Textarea
                      id="full_description"
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      disabled={!isEditing}
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      disabled={!isEditing}
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service_tags">Tags (comma separated)</Label>
                    <Input
                      id="service_tags"
                      value={formData.service_tags}
                      onChange={(e) => setFormData({ ...formData, service_tags: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      {selectedService && (
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(selectedService.id)}
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
                            if (selectedService) {
                              handleSelectService(selectedService);
                            } else {
                              setSelectedService(null);
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

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      disabled={!isEditing}
                    />
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
              <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No service selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a service from the list or create a new one
              </p>
              <Button onClick={() => {
                setSelectedService(null);
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Service
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
