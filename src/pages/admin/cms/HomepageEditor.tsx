import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, Eye, MoveUp, MoveDown } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const HomepageEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['homepage-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('content_case_studies')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: !currentFeatured ? "Added to Homepage" : "Removed from Homepage",
        description: !currentFeatured ? "Project now displays on homepage" : "Project hidden from homepage"
      });

      queryClient.invalidateQueries({ queryKey: ['homepage-projects'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analyzed-projects'] });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update',
        variant: "destructive"
      });
    }
  };

  const featuredProjects = projects?.filter(p => p.featured) || [];
  const availableProjects = projects?.filter(p => !p.featured) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homepage Content Editor</h1>
        <p className="text-muted-foreground mt-1">
          Manage which verified projects display on the homepage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured on Homepage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Featured on Homepage ({featuredProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="grid grid-cols-2 gap-1 flex-shrink-0">
                        <img
                          src={project.before_image}
                          alt="Before"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <img
                          src={project.after_image}
                          alt="After"
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{project.suburb}</p>
                            <p className="text-xs text-muted-foreground">{project.study_id}</p>
                          </div>
                          <Switch
                            checked={project.featured}
                            onCheckedChange={() => toggleFeatured(project.id, project.featured)}
                          />
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            Auth: {Math.round((project.authenticity_score || 0) * 100)}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Pair: {Math.round((project.pairing_confidence || 0) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects featured on homepage</p>
                <p className="text-sm mt-2">Toggle switch on available projects to add</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Available Projects ({availableProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {availableProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="grid grid-cols-2 gap-1 flex-shrink-0">
                      <img
                        src={project.before_image}
                        alt="Before"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <img
                        src={project.after_image}
                        alt="After"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{project.suburb}</p>
                          <p className="text-xs text-muted-foreground">{project.study_id}</p>
                        </div>
                        <Switch
                          checked={project.featured}
                          onCheckedChange={() => toggleFeatured(project.id, project.featured)}
                        />
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          Auth: {Math.round((project.authenticity_score || 0) * 100)}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Pair: {Math.round((project.pairing_confidence || 0) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomepageEditor;
