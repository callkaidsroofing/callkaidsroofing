import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SystemTransition() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/internal/v2/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">🎉 New Internal System Available!</CardTitle>
          <CardDescription className="text-lg mt-2">
            We've completely rebuilt the internal dashboard with improved performance and new features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium mb-1">Unified Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Single sidebar with persistent "Home" anchor. 6 focused pages instead of 8.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium mb-1">Consolidated Functions</h4>
                <p className="text-sm text-muted-foreground">
                  20 edge functions reduced to 9. Faster responses, simpler architecture.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <h4 className="font-medium mb-1">New Features</h4>
                <p className="text-sm text-muted-foreground">
                  Docs Hub with RAG search, Forms Studio, Media Library, Marketing Studio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={() => navigate('/internal/v2/home')}
            >
              Go to New System
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/internal/home')}
            >
              Stay on Legacy
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Redirecting automatically in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
