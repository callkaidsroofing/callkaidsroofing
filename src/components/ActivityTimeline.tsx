import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Mail, Upload, UserPlus, CheckCircle, 
  MessageSquare, Filter, Plus 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  activity_type: string;
  data: any;
  created_at: string;
  user_id?: string;
}

interface ActivityTimelineProps {
  entityType: 'lead' | 'quote' | 'job' | 'invoice' | 'inspection_report';
  entityId: string;
}

const activityIcons: Record<string, any> = {
  created: Plus,
  updated: FileText,
  status_changed: CheckCircle,
  note_added: MessageSquare,
  email_sent: Mail,
  file_uploaded: Upload,
  assigned: UserPlus,
  completed: CheckCircle,
};

const activityColors: Record<string, string> = {
  created: 'text-green-500',
  updated: 'text-blue-500',
  status_changed: 'text-purple-500',
  note_added: 'text-orange-500',
  email_sent: 'text-indigo-500',
  file_uploaded: 'text-pink-500',
  assigned: 'text-cyan-500',
  completed: 'text-emerald-500',
};

export function ActivityTimeline({ entityType, entityId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [newNote, setNewNote] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchActivities = async () => {
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to new activities
    const channel = supabase
      .channel(`activities:${entityType}:${entityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `entity_type=eq.${entityType},entity_id=eq.${entityId}`,
        },
        (payload) => {
          setActivities((current) => [payload.new as Activity, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityType, entityId, filter]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setAdding(true);
    try {
      const { error } = await supabase.from('activities').insert({
        entity_type: entityType,
        entity_id: entityId,
        activity_type: 'note_added',
        data: { note: newNote },
      });

      if (error) throw error;

      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setAdding(false);
    }
  };

  const getActivityDescription = (activity: Activity) => {
    const { activity_type, data } = activity;

    switch (activity_type) {
      case 'created':
        return `Created ${entityType}`;
      case 'updated':
        return `Updated ${data.field || 'details'}`;
      case 'status_changed':
        return `Changed status to ${data.new_status}`;
      case 'note_added':
        return data.note;
      case 'email_sent':
        return `Sent email: ${data.subject}`;
      case 'file_uploaded':
        return `Uploaded ${data.filename}`;
      case 'assigned':
        return `Assigned to ${data.assignee}`;
      case 'completed':
        return `Marked as complete`;
      default:
        return activity_type.replace(/_/g, ' ');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'note_added', label: 'Notes' },
    { value: 'file_uploaded', label: 'Files' },
    { value: 'status_changed', label: 'Status' },
    { value: 'email_sent', label: 'Emails' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Filter Chips */}
      <div className="p-4 border-b flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filter === option.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* Quick Add Note */}
      <div className="p-4 border-b space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[60px]"
        />
        <Button
          size="sm"
          onClick={handleAddNote}
          disabled={!newNote.trim() || adding}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No activities yet
            </div>
          ) : (
            activities.map((activity, index) => {
              const Icon = activityIcons[activity.activity_type] || FileText;
              const color = activityColors[activity.activity_type] || 'text-gray-500';

              return (
                <div key={activity.id} className="flex gap-3">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={cn("rounded-full p-1.5 bg-muted", color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                    {activity.data.files && (
                      <div className="mt-2 space-y-1">
                        {activity.data.files.map((file: string, i: number) => (
                          <div key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <Upload className="h-3 w-3" />
                            {file}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
