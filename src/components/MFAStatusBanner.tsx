import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';

export const MFAStatusBanner = () => {
  const [hasMFA, setHasMFA] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const { isAdmin, isInspector } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (!isAdmin && !isInspector) return;

      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        setHasMFA(factors?.totp && factors.totp.length > 0);
      } catch (error) {
        console.error('Error checking MFA status:', error);
      }
    };

    checkMFAStatus();
  }, [isAdmin, isInspector]);

  if (!isAdmin && !isInspector) return null;
  if (hasMFA === null || hasMFA === true) return null;
  if (dismissed) return null;

  return (
    <Alert className="mb-4 bg-destructive/10 border-destructive">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Security Alert:</strong> Multi-factor authentication is not enabled for your account. 
          This is required for all admin and inspector accounts to protect sensitive data.
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => navigate('/mfa-setup')}
          >
            Enable MFA
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
