import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Plus, Edit, Star, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logAudit } from '@/lib/audit';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: 'before' | 'after' | 'progress' | 'general';
  pair_id: string | null;
  job_type: string | null;
  suburb: string | null;
  featured: boolean;
  display_order: number;
  case_study_id: string | null;
  created_at: string;
}

export default function GalleryAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { handleError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_gallery')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryImage[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<GalleryImage>) => {
      const { error } = await supabase
        .from('content_gallery')
        .insert([data as any]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      showSuccess('Image added successfully');
      setIsDialogOpen(false);
      logAudit({
        event_type: 'content_management',
        action: 'create_gallery_image',
        resource_type: 'content_gallery'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to add image')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GalleryImage> }) => {
      const { error } = await supabase
        .from('content_gallery')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      showSuccess('Image updated successfully');
      setIsDialogOpen(false);
      setEditingImage(null);
      logAudit({
        event_type: 'content_management',
        action: 'update_gallery_image',
        resource_type: 'content_gallery'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to update image')
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('content_gallery')
        .update({ featured: !featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      showSuccess('Featured status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update featured status')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      image_url: formData.get('image_url') as string,
      category: formData.get('category') as 'before' | 'after' | 'progress' | 'general',
      pair_id: formData.get('pair_id') as string || null,
      job_type: formData.get('job_type') as string || null,
      suburb: formData.get('suburb') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.job_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.suburb?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingImage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Edit' : 'Add'} Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input name="title" defaultValue={editingImage?.title} required />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" defaultValue={editingImage?.description || ''} rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input name="image_url" defaultValue={editingImage?.image_url} required />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select name="category" defaultValue={editingImage?.category || 'general'} className="w-full border rounded p-2">
                  <option value="before">Before</option>
                  <option value="after">After</option>
                  <option value="progress">Progress</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Pair ID (for before/after linking)</label>
                <Input name="pair_id" defaultValue={editingImage?.pair_id || ''} placeholder="e.g., roof-123" />
              </div>
              <div>
                <label className="text-sm font-medium">Job Type</label>
                <Input name="job_type" defaultValue={editingImage?.job_type || ''} placeholder="e.g., Roof Restoration" />
              </div>
              <div>
                <label className="text-sm font-medium">Suburb</label>
                <Input name="suburb" defaultValue={editingImage?.suburb || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input name="display_order" type="number" defaultValue={editingImage?.display_order || 0} />
              </div>
              <Button type="submit" className="w-full">
                {editingImage ? 'Update' : 'Add'} Image
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by title, job type, or suburb..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Tabs defaultValue="all" className="mb-4" onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="before">Before</TabsTrigger>
          <TabsTrigger value="after">After</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <p>Loading gallery...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{image.title}</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge>{image.category}</Badge>
                  {image.featured && <Badge variant="default"><Star className="h-3 w-3" /></Badge>}
                  {image.pair_id && <Badge variant="secondary"><Link2 className="h-3 w-3" /></Badge>}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingImage(image);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeaturedMutation.mutate({ id: image.id, featured: image.featured })}
                  >
                    <Star className={`h-4 w-4 ${image.featured ? 'fill-yellow-400' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
