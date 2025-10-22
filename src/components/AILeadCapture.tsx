import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, UserPlus } from 'lucide-react';
import { useNexusAI } from '@/hooks/useNexusAI';
import { toast } from 'sonner';

interface AILeadCaptureProps {
  onLeadCreated?: () => void;
}

/**
 * AI-Powered Lead Capture Component
 * Allows creating leads via:
 * 1. Natural language (AI interprets and fills fields)
 * 2. Quick form with basic fields
 */
export function AILeadCapture({ onLeadCreated }: AILeadCaptureProps) {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    suburb: '',
    service: 'Roof Painting'
  });

  const { commands, isProcessing } = useNexusAI({
    onComplete: () => {
      toast.success('Lead created successfully!');
      setNaturalLanguage('');
      setQuickForm({ name: '', phone: '', suburb: '', service: 'Roof Painting' });
      onLeadCreated?.();
    }
  });

  const handleNaturalLanguageCreate = async () => {
    if (!naturalLanguage.trim() || isProcessing) return;
    
    // AI will parse the natural language and create the lead
    await commands.createLead({
      name: extractName(naturalLanguage),
      phone: extractPhone(naturalLanguage),
      suburb: extractSuburb(naturalLanguage),
      service: extractService(naturalLanguage)
    });
  };

  const handleQuickCreate = async () => {
    if (!quickForm.name || !quickForm.phone || isProcessing) {
      toast.error('Name and phone are required');
      return;
    }
    
    await commands.createLead(quickForm);
  };

  // Simple extraction functions (AI will handle this better on backend)
  const extractName = (text: string) => {
    const nameMatch = text.match(/(?:called?|named?|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    return nameMatch ? nameMatch[1] : 'Customer';
  };

  const extractPhone = (text: string) => {
    const phoneMatch = text.match(/\d{10}|\d{4}\s?\d{3}\s?\d{3}/);
    return phoneMatch ? phoneMatch[0] : '';
  };

  const extractSuburb = (text: string) => {
    const suburbMatch = text.match(/(?:in|from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    return suburbMatch ? suburbMatch[1] : '';
  };

  const extractService = (text: string) => {
    if (/painting/i.test(text)) return 'Roof Painting';
    if (/resto/i.test(text)) return 'Roof Restoration';
    if (/leak/i.test(text)) return 'Leak Detection';
    if (/clean/i.test(text)) return 'Gutter Cleaning';
    return 'Roof Restoration';
  };

  return (
    <div className="space-y-6">
      {/* Natural Language Input */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Lead Capture (Natural Language)
          </CardTitle>
          <CardDescription>
            Describe the lead in plain English - AI will extract all details automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="Example: 'John from Berwick called about roof painting at 0412345678, urgent leak'"
            rows={3}
            disabled={isProcessing}
          />
          <Button
            onClick={handleNaturalLanguageCreate}
            disabled={isProcessing || !naturalLanguage.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Lead with AI
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Try these examples:</strong></p>
            <p>• "Sarah at 0435900709 needs roof restoration in Cranbourne"</p>
            <p>• "Mike from Pakenham - leak repair - 0412345678 - urgent"</p>
            <p>• "Call from John Smith in Berwick about roof painting"</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Quick Lead Form
          </CardTitle>
          <CardDescription>
            Fast manual entry with basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Name *"
              value={quickForm.name}
              onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
              disabled={isProcessing}
            />
            <Input
              placeholder="Phone *"
              value={quickForm.phone}
              onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
              disabled={isProcessing}
            />
            <Input
              placeholder="Suburb"
              value={quickForm.suburb}
              onChange={(e) => setQuickForm({ ...quickForm, suburb: e.target.value })}
              disabled={isProcessing}
            />
            <Input
              placeholder="Service"
              value={quickForm.service}
              onChange={(e) => setQuickForm({ ...quickForm, service: e.target.value })}
              disabled={isProcessing}
            />
          </div>
          <Button
            onClick={handleQuickCreate}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Lead
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
