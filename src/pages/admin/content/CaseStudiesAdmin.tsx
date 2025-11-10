import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Plus, Edit, ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logAudit } from '@/lib/audit';

interface CaseStudy {
  id: string;
  study_id: string;
  job_type: string;
  suburb: string;
  client_problem: string;
  solution_provided: string;
  key_outcome: string;
  before_image: string | null;
  after_image: string | null;
  testimonial: string | null;
  featured: boolean;
  slug: string | null;
  created_at: string;
}

export default function CaseStudiesAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const { handleError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CaseStudy[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<CaseStudy>) => {
      const { error } = await supabase
        .from('content_case_studies')
        .insert([data as any]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      showSuccess('Case study created successfully');
      setIsDialogOpen(false);
      logAudit({
        event_type: 'content_management',
        action: 'create_case_study',
        resource_type: 'content_case_studies'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to create case study')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CaseStudy> }) => {
      const { error } = await supabase
        .from('content_case_studies')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      showSuccess('Case study updated successfully');
      setIsDialogOpen(false);
      setEditingStudy(null);
      logAudit({
        event_type: 'content_management',
        action: 'update_case_study',
        resource_type: 'content_case_studies'
      });
    },
    onError: (error) => handleError(error as Error, 'Failed to update case study')
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('content_case_studies')
        .update({ featured: !featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      showSuccess('Featured status updated');
    },
    onError: (error) => handleError(error as Error, 'Failed to update featured status')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      study_id: formData.get('study_id') as string,
      job_type: formData.get('job_type') as string,
      suburb: formData.get('suburb') as string,
      client_problem: formData.get('client_problem') as string,
      solution_provided: formData.get('solution_provided') as string,
      key_outcome: formData.get('key_outcome') as string,
      before_image: formData.get('before_image') as string || null,
      after_image: formData.get('after_image') as string || null,
      testimonial: formData.get('testimonial') as string || null,
      slug: formData.get('slug') as string || null,
    };

    if (editingStudy) {
      updateMutation.mutate({ id: editingStudy.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredStudies = caseStudies.filter(study =>
    study.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.study_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Case Studies Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStudy(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Case Study
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudy ? 'Edit' : 'Create'} Case Study</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Study ID</label>
                <Input name="study_id" defaultValue={editingStudy?.study_id} required />
              </div>
              <div>
                <label className="text-sm font-medium">Job Type</label>
                <Input name="job_type" defaultValue={editingStudy?.job_type} required />
              </div>
              <div>
                <label className="text-sm font-medium">Suburb</label>
                <Input name="suburb" defaultValue={editingStudy?.suburb} required />
              </div>
              <div>
                <label className="text-sm font-medium">Client Problem</label>
                <Textarea name="client_problem" defaultValue={editingStudy?.client_problem} required />
              </div>
              <div>
                <label className="text-sm font-medium">Solution Provided</label>
                <Textarea name="solution_provided" defaultValue={editingStudy?.solution_provided} required />
              </div>
              <div>
                <label className="text-sm font-medium">Key Outcome</label>
                <Textarea name="key_outcome" defaultValue={editingStudy?.key_outcome} required />
              </div>
              <div>
                <label className="text-sm font-medium">Before Image URL</label>
                <Input name="before_image" defaultValue={editingStudy?.before_image || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">After Image URL</label>
                <Input name="after_image" defaultValue={editingStudy?.after_image || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Testimonial</label>
                <Textarea name="testimonial" defaultValue={editingStudy?.testimonial || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (URL)</label>
                <Input name="slug" defaultValue={editingStudy?.slug || ''} />
              </div>
              <Button type="submit" className="w-full">
                {editingStudy ? 'Update' : 'Create'} Case Study
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by job type, suburb, or study ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {isLoading ? (
        <p>Loading case studies...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Study ID</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Suburb</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudies.map((study) => (
              <TableRow key={study.id}>
                <TableCell className="font-medium">{study.study_id}</TableCell>
                <TableCell>{study.job_type}</TableCell>
                <TableCell>{study.suburb}</TableCell>
                <TableCell>
                  {study.featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStudy(study);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeaturedMutation.mutate({ id: study.id, featured: study.featured })}
                    >
                      <Star className={`h-4 w-4 ${study.featured ? 'fill-yellow-400' : ''}`} />
                    </Button>
                    {study.slug && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/case-studies/${study.slug}`} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
}
