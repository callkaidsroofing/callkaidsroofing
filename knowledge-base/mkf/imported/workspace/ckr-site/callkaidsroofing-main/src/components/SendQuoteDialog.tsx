import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Copy, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
}

export const SendQuoteDialog = ({
  open,
  onOpenChange,
  quoteId,
  clientEmail,
  clientName,
  quoteNumber,
}: SendQuoteDialogProps) => {
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(clientEmail || '');
  const [subject, setSubject] = useState(`Quote ${quoteNumber} - Call Kaids Roofing`);
  const [message, setMessage] = useState(
    `Dear ${clientName},\n\nThank you for your interest in our roofing services. Please find your quote attached.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nKaidyn Brownlie\nCall Kaids Roofing\n0435 900 709`
  );
  const [reminderDays, setReminderDays] = useState('7');
  const { toast } = useToast();

  const handleSend = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSending(true);

      // Call edge function to send email
      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          quoteId,
          recipientEmail: email,
          subject,
          message,
          reminderDays: parseInt(reminderDays),
        },
      });

      if (error) throw error;

      // Update quote status to 'sent'
      await supabase
        .from('quotes')
        .update({ status: 'sent' })
        .eq('id', quoteId);

      toast({
        title: 'Success',
        description: 'Quote sent successfully',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error sending quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to send quote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Quote via Email</DialogTitle>
          <DialogDescription>
            Send quote {quoteNumber} to your client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Recipient Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="reminder">Follow-up Reminder</Label>
            <Select value={reminderDays} onValueChange={setReminderDays}>
              <SelectTrigger id="reminder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No reminder</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In 7 days</SelectItem>
                <SelectItem value="14">In 14 days</SelectItem>
                <SelectItem value="30">In 30 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              You'll be reminded to follow up if no response
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Send className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};