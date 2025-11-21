import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface SendStepProps {
  clientEmail: string;
  onSend: (data: { email: string; cc: string; subject: string; message: string; sendSMS: boolean }) => Promise<void>;
}

export function SendStep({ clientEmail, onSend }: SendStepProps) {
  const [email, setEmail] = useState(clientEmail || '');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('Your Roofing Quote from Call Kaids Roofing');
  const [message, setMessage] = useState(
    `Hi there,\n\nThank you for considering Call Kaids Roofing for your roofing needs.\n\nPlease find attached your comprehensive quote. We've tailored this quote based on our inspection and your specific requirements.\n\nIf you have any questions or would like to discuss any aspect of the quote, please don't hesitate to reach out.\n\nWe look forward to working with you!\n\nBest regards,\nKaidyn Brownlie\nCall Kaids Roofing\n0435 900 709`
  );
  const [sendSMS, setSendSMS] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setError('Email address is required');
      return;
    }

    setSending(true);
    setError('');

    try {
      await onSend({ email, cc, subject, message, sendSMS });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send quote');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <h3 className="text-2xl font-bold">Quote Sent Successfully!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The quote has been sent to {email}. A follow-up reminder has been scheduled
            for 3 days from now.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => window.location.href = '/internal/v2/data'}>
              View All Quotes
            </Button>
            <Button onClick={() => window.location.href = '/internal/v2/quotes/new'}>
              Create New Quote
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Recipient Email *</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cc">CC (optional)</Label>
            <Input
              id="cc"
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="additional@example.com"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Send a copy to another email address
            </p>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="mt-2 font-mono text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendSMS"
              checked={sendSMS}
              onCheckedChange={(checked) => setSendSMS(checked as boolean)}
            />
            <Label htmlFor="sendSMS" className="text-sm font-normal">
              Also send SMS notification to client
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1 text-sm space-y-2">
            <p className="font-medium">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Quote will be sent immediately via email</li>
              <li>PDF attachment will be included</li>
              <li>Activity will be logged in CRM</li>
              <li>Lead status will update to "Quoted"</li>
              <li>Automatic follow-up reminder in 3 days</li>
            </ul>
          </div>
        </div>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSend}
        disabled={sending || !email}
      >
        {sending ? (
          <>Sending...</>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Quote to Client
          </>
        )}
      </Button>
    </div>
  );
}
