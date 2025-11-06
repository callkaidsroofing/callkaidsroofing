import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, User, DollarSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  onTaskCreated?: () => void;
}

export const LeadTaskDialog = ({
  open,
  onOpenChange,
  leadId,
  leadName,
  onTaskCreated,
}: LeadTaskDialogProps) => {
  const [saving, setSaving] = useState(false);
  const [taskType, setTaskType] = useState('follow_up');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title || !dueDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.from('lead_tasks').insert({
        lead_id: leadId,
        task_type: taskType,
        title,
        description,
        due_date: dueDate,
        priority,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      onTaskCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task for {leadName}</DialogTitle>
          <DialogDescription>
            Schedule a follow-up or reminder for this lead
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="taskType">Task Type *</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger id="taskType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow_up">Follow-up Call</SelectItem>
                <SelectItem value="send_quote">Send Quote</SelectItem>
                <SelectItem value="schedule_inspection">Schedule Inspection</SelectItem>
                <SelectItem value="send_reminder">Send Reminder</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow up on quote"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Additional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Calendar className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};