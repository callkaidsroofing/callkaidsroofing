import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, Eye, Sparkles, Tag, Shield } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MediaVerification = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['verification-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .in('verification_status', ['pending', 'needs_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('content_case_studies')
        .update({
          verification_status: status,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null,
          published_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: status === 'verified' ? "Project Verified" : "Project Rejected",
        description: `Case study ${status === 'verified' ? 'approved and published' : 'rejected'}`,
      });

      queryClient.invalidateQueries({ queryKey: ['verification-queue'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analyzed-projects'] });
      
      setSelectedProject(null);
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update verification status',
        variant: "destructive"
      });
    }
  };

  const getScoreBadge = (score: number, label: string) => {
    const percentage = Math.round(score * 100);
    const variant = percentage >= 85 ? 'default' : percentage >= 70 ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant} className="gap-1">
        {label}: {percentage}%
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Verification Center</h1>
          <p className="text-muted-foreground mt-1">
            Review AI-analyzed projects for authenticity and pairing accuracy
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {projects?.length || 0} Pending Review
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading verification queue...
                </div>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProject?.id === project.id ? 'ring-2 ring-conversion-cyan' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="grid grid-cols-2 gap-1 flex-shrink-0">
                          <img
                            src={project.before_image}
                            alt="Before"
                            className="w-24 h-24 object-cover rounded"
                          />
                          <img
                            src={project.after_image}
                            alt="After"
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="font-mono text-xs text-muted-foreground">
                              {project.study_id}
                            </span>
                            <Badge variant={project.verification_status === 'needs_review' ? 'destructive' : 'secondary'}>
                              {project.verification_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{project.suburb}</p>
                          <div className="flex flex-wrap gap-1">
                            {getScoreBadge(project.authenticity_score || 0, 'Auth')}
                            {getScoreBadge(project.pairing_confidence || 0, 'Pair')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-muted-foreground">All projects verified!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="space-y-4">
          {selectedProject ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-conversion-cyan" />
                    Review: {selectedProject.study_id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Before/After Images */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-destructive">BEFORE</span>
                      <img
                        src={selectedProject.before_image}
                        alt="Before"
                        className="w-full aspect-square object-cover rounded-lg border-2 border-destructive/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-conversion-cyan">AFTER</span>
                      <img
                        src={selectedProject.after_image}
                        alt="After"
                        className="w-full aspect-square object-cover rounded-lg border-2 border-conversion-cyan/30"
                      />
                    </div>
                  </div>

                  {/* AI Scores */}
                  <div className="flex gap-2">
                    {getScoreBadge(selectedProject.authenticity_score || 0, 'Authenticity')}
                    {getScoreBadge(selectedProject.pairing_confidence || 0, 'Pairing')}
                  </div>

                  {/* Tags */}
                  {selectedProject.tags && Array.isArray(selectedProject.tags) && selectedProject.tags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Tag className="h-4 w-4" />
                        AI Tags
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis Details */}
                  {selectedProject.ai_analysis && (
                    <div className="space-y-2 p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-conversion-cyan" />
                        AI Analysis
                      </div>
                      
                      {selectedProject.ai_analysis.fact_check && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            <span className="font-medium">Fact Check:</span>
                          </div>
                          <div className="ml-5 space-y-0.5 text-muted-foreground">
                            <p>• Roof Type Match: {selectedProject.ai_analysis.fact_check.roof_type_match ? '✓' : '✗'}</p>
                            <p>• Angle Match: {selectedProject.ai_analysis.fact_check.angle_match ? '✓' : '✗'}</p>
                            <p>• Logical Progression: {selectedProject.ai_analysis.fact_check.logical_progression ? '✓' : '✗'}</p>
                            {selectedProject.ai_analysis.fact_check.verification_notes && (
                              <p className="mt-2 italic">"{selectedProject.ai_analysis.fact_check.verification_notes}"</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Work Description */}
                  <div className="space-y-2">
                    <span className="text-sm font-semibold">Work Performed</span>
                    <p className="text-sm text-muted-foreground">{selectedProject.testimonial}</p>
                  </div>

                  {/* Review Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Review Notes (Optional)</label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add any notes about this verification..."
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleVerify(selectedProject.id, 'verified')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify & Publish
                    </Button>
                    <Button
                      onClick={() => handleVerify(selectedProject.id, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Select a project from the queue to begin review
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaVerification;
