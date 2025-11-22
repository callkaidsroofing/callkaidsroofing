import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

export default function MFAVerify() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect') || '/admin';

  useEffect(() => {
    const initiateChallenge = async () => {
      try {
        // Get enrolled factors
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        
        if (factorsError) throw factorsError;

        const phoneFactor = factors?.totp?.find(f => f.factor_type === 'phone');
        
        if (!phoneFactor) {
          toast({
            title: 'MFA Not Configured',
            description: 'Please set up MFA first',
            variant: 'destructive',
          });
          navigate(`/mfa-setup?redirect=${encodeURIComponent(redirectTo)}`);
          return;
        }

        setFactorId(phoneFactor.id);

        // Create challenge
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: phoneFactor.id,
        });

        if (challengeError) throw challengeError;

        setChallengeId(challenge.id);
        
        toast({
          title: 'Verification Code Sent',
          description: 'Check your phone for the verification code',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to initiate MFA challenge',
          variant: 'destructive',
        });
      }
    };

    initiateChallenge();
  }, [navigate, toast]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !challengeId) return;

    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verificationCode,
      });

      if (error) throw error;

      toast({
        title: 'Verified Successfully',
        description: 'Redirecting to dashboard...',
      });

      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Identity</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={isVerifying}
                maxLength={6}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
