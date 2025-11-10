import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, CheckCircle, AlertTriangle, Loader2, ArrowRight, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormPolishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formName: string;
  formDescription: string;
  formSchema: any;
  onPublish: () => void;
  onApplyOptimization: (optimizedSchema: any) => void;
}

interface Analysis {
  score: number;
  issues: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  workflowSuggestions: string;
  hasOptimizedSchema: boolean;
  optimizedSchema?: any;
}

export function FormPolishDialog({
  open,
  onOpenChange,
  formId,
  formName,
  formDescription,
  formSchema,
  onPublish,
  onApplyOptimization
}: FormPolishDialogProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('polish-form', {
        body: {
          formSchema,
          formName,
          formDescription
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
        toast.success('Form analysis complete!');
      }
    } catch (err: any) {
      console.error('Error analyzing form:', err);
      toast.error(err.message || 'Failed to analyze form');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAndPublish = () => {
    if (analysis?.hasOptimizedSchema && analysis.optimizedSchema) {
      onApplyOptimization(analysis.optimizedSchema);
      toast.success('Optimizations applied! Review and save before publishing.');
    } else {
      onPublish();
    }
    onOpenChange(false);
  };

  const handlePublishAsIs = () => {
    onPublish();
    onOpenChange(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>AI Form Polisher</DialogTitle>
          </div>
          <DialogDescription>
            Optimize your form for workflow-style completion before publishing
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {!analysis ? (
            <div className="space-y-4 py-6">
              <Alert>
                <AlertDescription>
                  The AI will analyze your form structure, field order, validation rules, and user experience to provide recommendations for optimal workflow-style completion.
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="font-medium mb-2">{formName}</p>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(formSchema.properties || {}).length} fields
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Form...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Form with AI
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handlePublishAsIs}
                  className="w-full"
                >
                  Skip Analysis & Publish Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Score */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold">{analysis.score}</span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
                <p className={`text-lg font-medium ${getScoreColor(analysis.score)}`}>
                  {analysis.score >= 8 ? 'Excellent Form Design' : 
                   analysis.score >= 6 ? 'Good with Room for Improvement' : 
                   'Needs Optimization'}
                </p>
              </div>

              {/* Issues */}
              {analysis.issues.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Issues Found ({analysis.issues.length})
                  </h3>
                  <div className="space-y-2">
                    {analysis.issues.map((issue, idx) => (
                      <Alert key={idx} variant="destructive">
                        <AlertDescription className="text-sm">{issue}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  Recommendations ({analysis.recommendations.length})
                </h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Suggestions */}
              <div className="space-y-2">
                <h3 className="font-semibold">Workflow Guidance</h3>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-line">{analysis.workflowSuggestions}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {analysis.hasOptimizedSchema && analysis.optimizedSchema ? (
                  <Button onClick={handleApplyAndPublish} className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply Optimizations & Return to Edit
                  </Button>
                ) : (
                  <Button onClick={handlePublishAsIs} className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish Form
                  </Button>
                )}
                <Button variant="outline" onClick={() => setAnalysis(null)}>
                  Re-analyze
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
