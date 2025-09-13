import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const InviteManager = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{ email: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: token, error } = await supabase.rpc('create_admin_invite', {
        p_email: email
      });

      if (error) {
        throw error;
      }

      setGeneratedInvite({ email, token });
      setEmail('');
      
      toast({
        title: "Invite Created",
        description: `Invitation created for ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = async () => {
    if (generatedInvite) {
      await navigator.clipboard.writeText(generatedInvite.token);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Invite code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Admin Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to invite"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Invite..." : "Create Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedInvite && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Invite Generated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="font-mono text-sm">{generatedInvite.email}</p>
            </div>
            
            <div>
              <Label>Invite Code (expires in 7 days)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={generatedInvite.token}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInviteCode}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Send this invite code to the user. They will need to enter it during sign-up to create their admin account.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};