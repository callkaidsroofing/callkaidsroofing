import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar,
  Check,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  User,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { LeadTaskDialog } from './LeadTaskDialog';
import { Textarea } from '@/components/ui/textarea';

interface LeadActivityTimelineProps {
  leadId: string;
  leadName: string;
}

interface Task {
  id: string;
  task_type: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

interface Note {
  id: string;
  note_type: string;
  content: string;
  created_at: string;
}

export const LeadActivityTimeline = ({ leadId, leadName }: LeadActivityTimelineProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, [leadId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const [tasksResponse, notesResponse] = await Promise.all([
        supabase
          .from('lead_tasks')
          .select('*')
          .eq('lead_id', leadId)
          .order('due_date', { ascending: true }),
        supabase
          .from('lead_notes')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false }),
      ]);

      if (tasksResponse.error) throw tasksResponse.error;
      if (notesResponse.error) throw notesResponse.error;

      setTasks(tasksResponse.data || []);
      setNotes(notesResponse.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase
        .from('lead_tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
              }
            : task
        )
      );

      toast({
        title: 'Success',
        description: 'Task updated',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase.from('lead_notes').insert({
        lead_id: leadId,
        note_type: 'note',
        content: newNote,
      });

      if (error) throw error;

      setNewNote('');
      fetchActivities();

      toast({
        title: 'Success',
        description: 'Note added',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'follow_up':
        return Phone;
      case 'send_quote':
        return Mail;
      case 'schedule_inspection':
        return Calendar;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tasks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tasks & Follow-ups</CardTitle>
          <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Create one to stay on top of this lead.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const TaskIcon = getTaskIcon(task.task_type);
                const isOverdue =
                  task.status !== 'completed' && new Date(task.due_date) < new Date();

                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      task.status === 'completed'
                        ? 'bg-muted/50 opacity-60'
                        : isOverdue
                        ? 'border-destructive/50 bg-destructive/5'
                        : ''
                    }`}
                  >
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTaskComplete(task.id, task.status)}
                      className="mt-1"
                    />
                    <TaskIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              task.status === 'completed' ? 'line-through' : ''
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                          {isOverdue && (
                            <AlertCircle className="h-3 w-3 text-destructive ml-1" />
                          )}
                        </div>
                        {task.completed_at && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" />
                            Completed {format(new Date(task.completed_at), 'MMM d')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note about this lead..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
              />
              <Button onClick={addNote} disabled={!newNote.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Notes Timeline */}
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Add one to track your interactions.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <LeadTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        leadId={leadId}
        leadName={leadName}
        onTaskCreated={fetchActivities}
      />
    </div>
  );
};