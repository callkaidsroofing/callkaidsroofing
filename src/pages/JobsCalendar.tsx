import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  job_number: string;
  client_name: string;
  site_address: string;
  scheduled_date: string;
  scheduled_time?: string;
  status: string;
  scope_items: any[];
  weather_risk?: string;
}

export default function JobsCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchJobs();
  }, [currentDate]);

  const fetchJobs = async () => {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from('jobs' as any)
        .select('*')
        .gte('scheduled_date', format(start, 'yyyy-MM-dd'))
        .lte('scheduled_date', format(end, 'yyyy-MM-dd'))
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setJobs((data || []) as unknown as Job[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => 
      job.scheduled_date && format(new Date(job.scheduled_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs Calendar</h1>
            <p className="text-muted-foreground">
              Schedule and manage your roofing jobs
            </p>
          </div>
          <Button onClick={() => navigate('/internal/v2/jobs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>

        {/* Calendar Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayJobs = getJobsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[120px] p-2 rounded-lg border transition-colors",
                    !isCurrentMonth && "bg-muted/30",
                    isCurrentDay && "border-primary border-2",
                    "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "text-sm font-semibold mb-2",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-1">
                    {dayJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => navigate(`/internal/v2/jobs/${job.id}`)}
                        className="text-xs p-1 rounded bg-card border cursor-pointer hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-1">
                          <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusColor(job.status))} />
                          <span className="font-medium truncate">{job.client_name}</span>
                        </div>
                        {job.scheduled_time && (
                          <div className="text-muted-foreground mt-0.5">
                            {job.scheduled_time}
                          </div>
                        )}
                        {job.weather_risk === 'high' && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Weather Risk
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-sm font-semibold">Status:</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
