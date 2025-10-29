import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AIAssistantPanel } from '@/components/shared/AIAssistantPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AILeadCaptureProps {
  onLeadCreated?: () => void;
}

export function AILeadCapture({ onLeadCreated }: AILeadCaptureProps) {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleAIGenerate = async (generatedData: any) => {
    try {
      if (!generatedData.name || !generatedData.phone) {
        toast.error('Name and phone are required');
        return;
      }

      const leadData = {
        name: generatedData.name,
        phone: generatedData.phone,
        email: generatedData.email || null,
        suburb: generatedData.suburb || 'Not specified',
        service: generatedData.service || 'Roof Restoration',
        message: generatedData.message || '',
        urgency: generatedData.urgency || 'medium',
        source: generatedData.source || 'manual_ai_capture',
      };

      const { error } = await supabase.from('leads').insert([leadData]);

      if (error) throw error;

      toast.success('Lead created successfully!');
      setShowAIAssistant(false);
      onLeadCreated?.();
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast.error(error.message || 'Failed to create lead');
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Lead Capture
        </CardTitle>
        <CardDescription>
          Create leads from natural language descriptions - AI extracts all details automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet open={showAIAssistant} onOpenChange={setShowAIAssistant}>
          <SheetTrigger asChild>
            <Button className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Open AI Lead Assistant
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>AI Lead Capture Assistant</SheetTitle>
            </SheetHeader>
            <div className="mt-6 h-[calc(100vh-8rem)]">
              <AIAssistantPanel
                functionName="lead-capture-assistant"
                onGenerate={handleAIGenerate}
                placeholder="Describe the lead in natural language..."
                title="Lead AI"
                examples={[
                  "Sarah called about roof painting in Cranbourne, 0412 345 678",
                  "John from Berwick - leak repair - 0435900709 - urgent",
                  "Mike needs roof restoration in Pakenham, contact 0411222333",
                ]}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p><strong>Example prompts:</strong></p>
          <p>• "Sarah at 0435900709 needs roof restoration in Cranbourne"</p>
          <p>• "Mike from Pakenham - leak repair - 0412345678 - urgent"</p>
          <p>• "Call from John Smith in Berwick about roof painting"</p>
        </div>
      </CardContent>
    </Card>
  );
}
