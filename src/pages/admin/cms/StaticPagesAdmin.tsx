import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Plus, Edit, ExternalLink, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { logAudit } from '@/lib/audit';

interface ContentPage {
  id: string;
  page_slug: string;
  page_title: string;
  content_blocks: any[];
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function StaticPagesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const { handleError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-static-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('page_slug', { ascending: true });
      
      if (error) throw error;
      return data as ContentPage[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<ContentPage>) => {
      const { error } = await supabase
        .from('content_pages')
        .insert([data as any]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-static-pages'] });
      showSuccess('Page created successfully');
      setIsDialogOpen(false);
      logAudit({
        event_type: 'content_management',
        action: 'create_page',
        resource_type: 'content_pages'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to create page')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentPage> }) => {
      const { error } = await supabase
        .from('content_pages')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-static-pages'] });
      showSuccess('Page updated successfully');
      setIsDialogOpen(false);
      setEditingPage(null);
      logAudit({
        event_type: 'content_management',
        action: 'update_page',
        resource_type: 'content_pages'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to update page')
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('content_pages')
        .update({ published: !published })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-static-pages'] });
      showSuccess('Published status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update published status')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contentBlocksRaw = formData.get('content_blocks') as string;
    let contentBlocks = [];
    try {
      contentBlocks = JSON.parse(contentBlocksRaw || '[]');
    } catch {
      contentBlocks = [];
    }

    const data = {
      page_slug: formData.get('page_slug') as string,
      page_title: formData.get('page_title') as string,
      content_blocks: contentBlocks,
      meta_title: formData.get('meta_title') as string || null,
      meta_description: formData.get('meta_description') as string || null,
    };

    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data });
    } else {
      createMutation.mutate({ ...data, published: false });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Static Pages Editor</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit' : 'Create'} Page</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Page Slug (URL)</label>
                <Input 
                  name="page_slug" 
                  defaultValue={editingPage?.page_slug} 
                  placeholder="about-us" 
                  required 
                  disabled={!!editingPage}
                />
                <p className="text-xs text-muted-foreground mt-1">This will be the URL path (e.g., /about-us)</p>
              </div>
              <div>
                <label className="text-sm font-medium">Page Title</label>
                <Input name="page_title" defaultValue={editingPage?.page_title} required />
              </div>
              <div>
                <label className="text-sm font-medium">Content Blocks (JSON)</label>
                <Textarea 
                  name="content_blocks" 
                  defaultValue={JSON.stringify(editingPage?.content_blocks || [], null, 2)} 
                  rows={10}
                  placeholder='[{"type": "hero", "title": "Welcome", "content": "..."}]'
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Array of content blocks. Each block should have a "type" field.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Meta Title (SEO)</label>
                <Input name="meta_title" defaultValue={editingPage?.meta_title || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Meta Description (SEO)</label>
                <Textarea name="meta_description" defaultValue={editingPage?.meta_description || ''} rows={3} />
              </div>
              <Button type="submit" className="w-full">
                {editingPage ? 'Update' : 'Create'} Page
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading pages...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-mono text-sm">/{page.page_slug}</TableCell>
                <TableCell className="font-medium">{page.page_title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={page.published}
                      onCheckedChange={() => togglePublishedMutation.mutate({ id: page.id, published: page.published })}
                    />
                    <Badge variant={page.published ? 'default' : 'secondary'}>
                      {page.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPage(page);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {page.published && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/${page.page_slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h3 className="font-semibold mb-2">Content Block Types</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Supported block types for flexible page building:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          <li><code>hero</code> - Hero section with title, subtitle, CTA</li>
          <li><code>text</code> - Rich text content</li>
          <li><code>cards</code> - Grid of cards with icon/image/title/description</li>
          <li><code>cta</code> - Call-to-action section</li>
          <li><code>image</code> - Full-width image with caption</li>
          <li><code>gallery</code> - Image gallery grid</li>
        </ul>
      </div>
    </div>
  );
}
