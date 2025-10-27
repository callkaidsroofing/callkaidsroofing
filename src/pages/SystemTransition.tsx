import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SystemTransition() {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediate redirect - old system is archived
    navigate('/internal/v2/home', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">🎉 Redirecting to New System</CardTitle>
          <CardDescription className="text-lg mt-2">
            The legacy internal system has been archived. Unified v2 interface loading...
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

          <p className="text-sm text-center text-muted-foreground">
            If not redirected automatically, <button onClick={() => navigate('/internal/v2/home')} className="text-primary underline">click here</button>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
