import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Facebook, Instagram, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  status: string;
  scheduled_for: string;
  image_url?: string;
  variant?: string;
}

const OPTIMAL_POST_TIMES = {
  facebook: ['07:00', '12:30', '18:00'],
  instagram: ['08:00', '13:00', '19:00'],
  google_business_profile: ['09:00'],
};

const PLATFORM_COLORS = {
  facebook: 'bg-blue-500',
  instagram: 'bg-pink-500',
  google_business_profile: 'bg-red-500',
};

const PLATFORM_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  google_business_profile: MapPin,
};

export function ContentCalendar() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const { toast } = useToast();

  useEffect(() => {
    fetchScheduledPosts();
  }, [weekStart]);

  const fetchScheduledPosts = async () => {
    const weekEnd = addDays(weekStart, 7);

    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .in('status', ['scheduled', 'draft'])
      .gte('scheduled_for', weekStart.toISOString())
      .lt('scheduled_for', weekEnd.toISOString())
      .order('scheduled_for', { ascending: true });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load scheduled posts',
      });
      return;
    }

    setPosts(data || []);
  };

  const getDayPosts = (dayOffset: number) => {
    const targetDay = addDays(weekStart, dayOffset);
    return posts.filter((post) => 
      post.scheduled_for && isSameDay(new Date(post.scheduled_for), targetDay)
    );
  };

  const getOptimalSlots = (platform: string) => {
    return OPTIMAL_POST_TIMES[platform] || [];
  };

  const renderPlatformIcon = (platform: string) => {
    const Icon = PLATFORM_ICONS[platform];
    return Icon ? <Icon className="h-3 w-3" /> : null;
  };

  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const prevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const thisWeek = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Content Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={thisWeek}>
              This Week
            </Button>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              Next
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
            const day = addDays(weekStart, dayOffset);
            const dayPosts = getDayPosts(dayOffset);

            return (
              <div key={dayOffset} className="border rounded-lg p-2 min-h-[200px]">
                <div className="font-semibold text-sm mb-2 text-center">
                  {format(day, 'EEE')}
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'MMM d')}
                  </div>
                </div>

                <div className="space-y-1">
                  {dayPosts.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center mt-4">
                      No posts scheduled
                    </div>
                  ) : (
                    dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-1.5 rounded text-xs ${
                          PLATFORM_COLORS[post.platform]
                        } text-white cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {renderPlatformIcon(post.platform)}
                          <span className="font-medium">
                            {format(new Date(post.scheduled_for), 'HH:mm')}
                          </span>
                        </div>
                        <div className="line-clamp-2 text-[10px]">
                          {post.content.substring(0, 50)}...
                        </div>
                        {post.variant && (
                          <Badge variant="secondary" className="mt-1 text-[9px] h-4">
                            {post.variant}
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Show optimal posting times */}
                <div className="mt-2 pt-2 border-t">
                  <div className="text-[10px] text-muted-foreground mb-1">Optimal times:</div>
                  {Object.entries(OPTIMAL_POST_TIMES).map(([platform, times]) =>
                    times.map((time) => (
                      <div key={`${platform}-${time}`} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <Clock className="h-2 w-2" />
                        {time} {platform === 'facebook' ? 'FB' : platform === 'instagram' ? 'IG' : 'GBP'}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${PLATFORM_COLORS.facebook}`} />
            <span>Facebook</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${PLATFORM_COLORS.instagram}`} />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${PLATFORM_COLORS.google_business_profile}`} />
            <span>Google Business</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
