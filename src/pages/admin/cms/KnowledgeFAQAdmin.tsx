import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Plus, Edit, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logAudit } from '@/lib/audit';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  related_services: string[];
  featured: boolean;
  display_order: number;
  created_at: string;
}

export default function KnowledgeFAQAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const { handleError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_knowledge_base')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as FAQ[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<FAQ>) => {
      const { error } = await supabase
        .from('content_knowledge_base')
        .insert([data as any]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      showSuccess('FAQ created successfully');
      setIsDialogOpen(false);
      logAudit({
        event_type: 'content_management',
        action: 'create_faq',
        resource_type: 'content_knowledge_base'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to create FAQ')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FAQ> }) => {
      const { error } = await supabase
        .from('content_knowledge_base')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      showSuccess('FAQ updated successfully');
      setIsDialogOpen(false);
      setEditingFAQ(null);
      logAudit({
        event_type: 'content_management',
        action: 'update_faq',
        resource_type: 'content_knowledge_base'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to update FAQ')
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('content_knowledge_base')
        .update({ featured: !featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      showSuccess('Featured status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update featured status')
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('content_knowledge_base')
        .update({ display_order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (error) => handleError(error as Error, 'Failed to reorder FAQ')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const relatedServices = (formData.get('related_services') as string)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const data = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      category: formData.get('category') as string || null,
      related_services: relatedServices,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingFAQ) {
      updateMutation.mutate({ id: editingFAQ.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base / FAQ Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFAQ(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFAQ ? 'Edit' : 'Create'} FAQ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input name="question" defaultValue={editingFAQ?.question} required />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <Textarea name="answer" defaultValue={editingFAQ?.answer} required rows={6} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input name="category" defaultValue={editingFAQ?.category || ''} placeholder="e.g., Roofing, Pricing, Services" />
              </div>
              <div>
                <label className="text-sm font-medium">Related Services (comma-separated)</label>
                <Input name="related_services" defaultValue={editingFAQ?.related_services.join(', ')} placeholder="roof-restoration, gutter-cleaning" />
              </div>
              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input name="display_order" type="number" defaultValue={editingFAQ?.display_order || 0} />
              </div>
              <Button type="submit" className="w-full">
                {editingFAQ ? 'Update' : 'Create'} FAQ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {isLoading ? (
        <p>Loading FAQs...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFAQs.map((faq, index) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.question}</TableCell>
                <TableCell>{faq.category || 'General'}</TableCell>
                <TableCell>{faq.display_order}</TableCell>
                <TableCell>
                  {faq.featured && (
                    <Badge variant="default">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingFAQ(faq);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeaturedMutation.mutate({ id: faq.id, featured: faq.featured })}
                    >
                      <Star className={`h-4 w-4 ${faq.featured ? 'fill-yellow-400' : ''}`} />
                    </Button>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reorderMutation.mutate({ id: faq.id, newOrder: faq.display_order - 1 })}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < filteredFAQs.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reorderMutation.mutate({ id: faq.id, newOrder: faq.display_order + 1 })}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
