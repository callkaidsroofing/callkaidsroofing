import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logoMain from '@/assets/call-kaids-logo-main.png';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        // Check if MFA is required
        if (error.message?.includes('MFA') || error.message?.includes('factor')) {
          navigate('/mfa-verify');
          return;
        }
        
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Check if user needs MFA setup
        const { data: factors } = await supabase.auth.mfa.listFactors();
        
        if (!factors?.totp || factors.totp.length === 0) {
          toast({
            title: 'MFA Setup Required',
            description: 'Please set up multi-factor authentication',
          });
          navigate('/mfa-setup');
        } else {
          toast({
            title: 'Welcome back!',
            description: 'Redirecting to dashboard...',
          });
          navigate('/admin');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src={logoMain} 
              alt="Call Kaids Roofing" 
              className="h-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl">Internal Access</CardTitle>
          <CardDescription>
            Sign in to access the inspection form system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>ABN 39475055075</p>
            <p>Call Kaids Roofing Internal System</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
