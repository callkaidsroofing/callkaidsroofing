import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(8, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  suburb: z.string().min(1, 'Suburb is required'),
  service: z.string().min(1, 'Service is required'),
  source: z.string().min(1, 'Source is required'),
  message: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const services = [
  'Roof Restoration',
  'Roof Painting',
  'Roof Repairs',
  'Gutter Cleaning',
  'Leak Detection',
  'Valley Iron Replacement',
  'Tile Replacement',
  'Roof Repointing',
];

const sources = [
  'Website',
  'Phone Call',
  'Referral',
  'Google',
  'Facebook',
  'Door Knock',
  'Other',
];

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated: () => void;
}

export function CreateLeadDialog({ open, onOpenChange, onLeadCreated }: CreateLeadDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      suburb: '',
      service: '',
      source: 'Website',
      message: '',
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: values.name,
        phone: values.phone,
        email: values.email || null,
        suburb: values.suburb,
        service: values.service,
        source: values.source,
        message: values.message || null,
        status: 'new',
      });

      if (error) throw error;

      toast({
        title: 'Lead Created',
        description: `${values.name} has been added to the pipeline.`,
      });

      form.reset();
      onOpenChange(false);
      onLeadCreated();
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create lead',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="0412 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suburb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suburb *</FormLabel>
                  <FormControl>
                    <Input placeholder="Berwick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional details about this lead..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Lead
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
