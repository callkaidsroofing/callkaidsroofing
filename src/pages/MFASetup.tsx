import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MFASetup() {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect') || '/admin';

  const handleEnrollPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnrolling(true);

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'phone',
        phone: phone,
      });

      if (error) throw error;

      setEnrollmentId(data.id);
      toast({
        title: 'Verification Code Sent',
        description: `A verification code has been sent to ${phone}`,
      });
    } catch (error: any) {
      toast({
        title: 'Enrollment Failed',
        description: error.message || 'Failed to enroll phone number',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentId) return;

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: enrollmentId,
      });

      if (error) throw error;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollmentId,
        challengeId: data.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      toast({
        title: 'MFA Enabled Successfully',
        description: 'Your phone number has been verified for multi-factor authentication.',
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
          <CardTitle className="text-2xl text-center">Enable Multi-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Add an extra layer of security to your admin account using SMS verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              MFA is required for all admin accounts to protect sensitive customer data and system access.
            </AlertDescription>
          </Alert>

          {!enrollmentId ? (
            <form onSubmit={handleEnrollPhone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+61435900709"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isEnrolling}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your phone number in international format (e.g., +61435900709)
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isEnrolling}
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
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
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to {phone}
                </p>
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
                  'Verify and Enable MFA'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setEnrollmentId(null);
                  setVerificationCode('');
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Phone Entry
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Skip for Now
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Note: MFA will be required for admin access soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
