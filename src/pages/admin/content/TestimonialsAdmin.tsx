import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Plus, Edit, Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logAudit } from '@/lib/audit';

interface Testimonial {
  id: string;
  client_name: string;
  testimonial_text: string;
  rating: number;
  service_type: string | null;
  suburb: string | null;
  job_date: string | null;
  verified: boolean;
  featured: boolean;
  case_study_id: string | null;
  created_at: string;
}

export default function TestimonialsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const { handleError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Testimonial>) => {
      const { error } = await supabase
        .from('content_testimonials')
        .insert([data as any]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      showSuccess('Testimonial created successfully');
      setIsDialogOpen(false);
      logAudit({
        event_type: 'content_management',
        action: 'create_testimonial',
        resource_type: 'content_testimonials'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to create testimonial')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Testimonial> }) => {
      const { error } = await supabase
        .from('content_testimonials')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      showSuccess('Testimonial updated successfully');
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      logAudit({
        event_type: 'content_management',
        action: 'update_testimonial',
        resource_type: 'content_testimonials'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to update testimonial')
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('content_testimonials')
        .update({ featured: !featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      showSuccess('Featured status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update featured status')
  });

  const toggleVerifiedMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from('content_testimonials')
        .update({ verified: !verified })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      showSuccess('Verified status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update verified status')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      client_name: formData.get('client_name') as string,
      testimonial_text: formData.get('testimonial_text') as string,
      rating: parseInt(formData.get('rating') as string),
      service_type: formData.get('service_type') as string || null,
      suburb: formData.get('suburb') as string || null,
      job_date: formData.get('job_date') as string || null,
    };

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.suburb?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit' : 'Create'} Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Client Name</label>
                <Input name="client_name" defaultValue={editingTestimonial?.client_name} required />
              </div>
              <div>
                <label className="text-sm font-medium">Testimonial</label>
                <Textarea name="testimonial_text" defaultValue={editingTestimonial?.testimonial_text} required rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium">Rating (1-5)</label>
                <Input name="rating" type="number" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} required />
              </div>
              <div>
                <label className="text-sm font-medium">Service Type</label>
                <Input name="service_type" defaultValue={editingTestimonial?.service_type || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Suburb</label>
                <Input name="suburb" defaultValue={editingTestimonial?.suburb || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Job Date</label>
                <Input name="job_date" type="date" defaultValue={editingTestimonial?.job_date || ''} />
              </div>
              <Button type="submit" className="w-full">
                {editingTestimonial ? 'Update' : 'Create'} Testimonial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by client name, service, or suburb..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {isLoading ? (
        <p>Loading testimonials...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.client_name}</TableCell>
                <TableCell>{testimonial.service_type || 'General'}</TableCell>
                <TableCell>{'⭐'.repeat(testimonial.rating)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {testimonial.verified && (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {testimonial.featured && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVerifiedMutation.mutate({ id: testimonial.id, verified: testimonial.verified })}
                    >
                      <CheckCircle className={`h-4 w-4 ${testimonial.verified ? 'fill-green-400' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeaturedMutation.mutate({ id: testimonial.id, featured: testimonial.featured })}
                    >
                      <Star className={`h-4 w-4 ${testimonial.featured ? 'fill-yellow-400' : ''}`} />
                    </Button>
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
