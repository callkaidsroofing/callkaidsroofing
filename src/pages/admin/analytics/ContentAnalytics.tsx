import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp, FileText, Image, MessageSquare } from 'lucide-react';

interface AnalyticsSummary {
  content_type: string;
  content_id: string;
  view_count: number;
  last_viewed: string;
}

export default function ContentAnalytics() {
  const { data: analytics = [], isLoading } = useQuery({
    queryKey: ['content-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;

      // Aggregate by content type and ID
      const aggregated = data.reduce((acc: any[], item) => {
        const key = `${item.content_type}-${item.content_id}`;
        const existing = acc.find(a => `${a.content_type}-${a.content_id}` === key);
        
        if (existing) {
          existing.view_count++;
          if (new Date(item.created_at) > new Date(existing.last_viewed)) {
            existing.last_viewed = item.created_at;
          }
        } else {
          acc.push({
            content_type: item.content_type,
            content_id: item.content_id,
            view_count: 1,
            last_viewed: item.created_at
          });
        }
        
        return acc;
      }, []);

      return aggregated.sort((a, b) => b.view_count - a.view_count);
    }
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'service': return <TrendingUp className="h-4 w-4" />;
      case 'case_study': return <Image className="h-4 w-4" />;
      case 'testimonial': return <MessageSquare className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + item.view_count, 0);
  const uniqueContent = analytics.length;

  const blogViews = analytics.filter(a => a.content_type === 'blog').reduce((sum, item) => sum + item.view_count, 0);
  const serviceViews = analytics.filter(a => a.content_type === 'service').reduce((sum, item) => sum + item.view_count, 0);
  const caseStudyViews = analytics.filter(a => a.content_type === 'case_study').reduce((sum, item) => sum + item.view_count, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseStudyViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="service">Services</TabsTrigger>
              <TabsTrigger value="case_study">Case Studies</TabsTrigger>
            </TabsList>

            {['all', 'blog', 'service', 'case_study'].map(tab => (
              <TabsContent key={tab} value={tab}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content ID</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Last Viewed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics
                      .filter(item => tab === 'all' || item.content_type === tab)
                      .slice(0, 20)
                      .map((item, index) => (
                        <TableRow key={`${item.content_type}-${item.content_id}-${index}`}>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              {getContentIcon(item.content_type)}
                              {item.content_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.content_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{item.view_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(item.last_viewed).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
